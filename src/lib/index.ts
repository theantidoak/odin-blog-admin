import * as cheerio from 'cheerio';
import he from 'he';
import sanitizeHtml from 'sanitize-html';

export function getExcerpt(postContent: string) {
  if (!postContent) return '';
  const decodedContent = he.decode(postContent).replace(/(<([^>]+)>)/ig, '');
  return decodedContent.length >= 200 ? decodedContent.slice(0, 200) + '...' : decodedContent;
}

export function getImageSrc(postContent: string) {
  const $ = cheerio.load(postContent);
  const img = $('img').attr('src');
  return img ?? '';
}

export function getSanitizeOptions() {
  const allowedTags = sanitizeHtml.defaults.allowedTags.concat(['img']);
  const allowedAttributes =  {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: [ 'src', 'srcset', 'alt', 'title', 'width', 'height', 'loading' ]
  };
  allowedTags.forEach((tag) => {
    if ((allowedAttributes as any)[tag]) {
      (allowedAttributes as any)[tag].push('style');
    } else {
      (allowedAttributes as any)[tag] = ['style'];
    }
  });

  return { allowedTags, allowedAttributes }
}