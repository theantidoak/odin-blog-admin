import { error } from "@sveltejs/kit";
import dotenv from 'dotenv';
import { json } from "@sveltejs/kit";
import * as cheerio from 'cheerio';
import sanitizeHtml from 'sanitize-html';
dotenv.config();

function getExcerpt(postContent: string) {
  if (!postContent) return '';
  return postContent.replace(/(<([^>]+)>)/ig, '').slice(0, 40);
}

function getImageSrc(postContent: string) {
  const $ = cheerio.load(postContent);
  const img = $('img').attr('src');
  return img ?? '';
}

function getSanitizeOptions() {
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

export async function GET(event:any) {
  const { postSlug } = event.params;

  const getResponse = await fetch(`${process.env.APIENDPOINT}/api/posts/${postSlug}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'APIToken': `Token ${process.env.APITOKEN}`
    },
  });

  if (!getResponse.ok) {
    error(getResponse.status, `${getResponse.statusText} Failed to reach the API`);
  }

  const postData = await getResponse.json()
  const { post, success } = postData;

  if (!success) {
    error(401, 'Failed to get post from backend');
  }

  const targetPost = post ? {
    ...post,
    image: getImageSrc(post.content),
    excerpt: getExcerpt(post.content),
  } : {};

  return json({ success, status: getResponse.status, targetPost });
}


export async function PUT(event:any) {
  const { postSlug } = event.params;

  const formData = await event.request.formData();
  const title = formData.get('title');
  const content = formData.get('content');
  const id = formData.get('id');

  if (!title || !content) {
    error(400, 'Title and content are both required.');
  }

  const sanitizedTitle = typeof title === 'string' ? title.trim().substring(0, 151) : '';
  const sanitizedContent = typeof content === 'string' ? sanitizeHtml(content.trim(), getSanitizeOptions()) : '';

  const jwtCookieName = 'ob_secure_auth';
  const jwtCookie = event.cookies.get(jwtCookieName);

  const putResponse = await fetch(`${process.env.APIENDPOINT}/api/posts/${postSlug}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'APIToken': `Token ${process.env.APITOKEN}`,
      'Authorization': `Bearer ${jwtCookie}`
    },
    body: JSON.stringify({ title: sanitizedTitle, content: sanitizedContent, id })
  });

  const putData = await putResponse.json();

  if (!putResponse.ok) {
    error(putResponse.status, `${putData.message || putResponse.statusText + 'Failed to reach the API'}`);
  }
  
  const { post, success, message } = putData;

  if (!success) {
    error(401, 'Failed to update post from backend');
  }

  return json({ success, message, status: putResponse.status });
}


export async function DELETE(event:any) {
  const { postSlug } = event.params;
  const jwtCookieName = 'ob_secure_auth';
  const jwtCookie = event.cookies.get(jwtCookieName);

  const deleteResponse = await fetch(`${process.env.APIENDPOINT}/api/posts/${postSlug}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'APIToken': `Token ${process.env.APITOKEN}`,
      'Authorization': `Bearer ${jwtCookie}`
    }
  });

  if (!deleteResponse.ok) {
    error(deleteResponse.status, `${deleteResponse.statusText} Failed to reach the API`);
  }

  const postData = await deleteResponse.json()
  const { post, success } = postData;

  if (!success) {
    error(401, 'Failed to delete post from backend');
  }

  return json({ success, status: deleteResponse.status });
}