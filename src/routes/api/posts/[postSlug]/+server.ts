import { error } from "@sveltejs/kit";
import dotenv from 'dotenv';
import { json } from "@sveltejs/kit";
import sanitizeHtml from 'sanitize-html';
import { getExcerpt, getImageSrc, getSanitizeOptions } from "$lib";
dotenv.config();

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
    error(getResponse.status, `Failed to reach the API: ${getResponse.statusText}`);
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
  const published = formData.get('published');

  const body: { title?: string, content?: string, id?: string, published?: boolean } = { title: 'publishing', content: 'publishing', id };

  if (title && typeof title == 'string') {
    body.title = title.trim().substring(0, 151);
  }

  if (content && typeof content === 'string') {
    body.content = sanitizeHtml(content.trim(), getSanitizeOptions());
  }

  if (published && ['true', 'false'].includes(published)) {
    body.published = published === 'true' ? true : false;
  }

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
    body: JSON.stringify(body)
  });

  if (!putResponse.ok) {
    error(putResponse.status, `${putResponse.statusText + ': Failed to reach the API'}`);
  }

  const putData = await putResponse.json();
  const { post, success, message } = putData;

  if (!success) {
    error(401, `${putData.errors[0].msg}`);
  }

  return json({ success, message, status: putResponse.status, post });
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