import * as cheerio from 'cheerio';
import he from 'he';

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