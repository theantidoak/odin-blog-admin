import { error } from "@sveltejs/kit";
import dotenv from 'dotenv';
import { json } from "@sveltejs/kit";
import * as cheerio from 'cheerio';
import he from 'he';
import sanitizeHtml from 'sanitize-html';
dotenv.config();

function getExcerpt(postContent: string) {
  if (!postContent) return '';
  return he.decode(postContent).replace(/(<([^>]+)>)/ig, '').slice(0, 40);
}

function getImageSrc(postContent: string) {
  const $ = cheerio.load(postContent);
  const img = $('img').attr('src');
  return img ?? '';
}

export async function GET(event:any) {
  const getResponse = await fetch(`${process.env.APIENDPOINT}/api/posts`, {
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

  const postsData = await getResponse.json()
  const { posts, success } = postsData;

  if (!success) {
    error(401, 'Failed to get posts from backend');
  }

  const recentPosts = posts ? posts.map((post: any) => ({
    ...post,
    image: getImageSrc(post.content),
    excerpt: getExcerpt(post.content),
  })) : [];

  return json({ success, status: getResponse.status, recentPosts });
}


export async function POST(event:any) {
  const formData = await event.request.formData();
  const title = formData.get('title');
  const content = formData.get('content');

  if (!title || !content) {
    error(400, 'Title and content are both required.');
  }

  const jwtCookieName = 'ob_secure_auth';
  const jwtCookie = event.cookies.get(jwtCookieName);

  if (!jwtCookie) {
    error(400, 'Cookie does not exist.');
  }

  const sanitizedTitle = typeof title === 'string' ? title.trim().substring(0, 151) : '';
  const sanitizedContent = typeof content === 'string' ? sanitizeHtml(content.trim()) : '';

  const postResponse = await fetch(`${process.env.APIENDPOINT}/api/posts`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'APIToken': `Token ${process.env.APITOKEN}`,
      'Authorization': `Bearer ${jwtCookie}`
    },
    body: JSON.stringify({ title: sanitizedTitle, content: sanitizedContent })
  });

  if (!postResponse.ok) {
    error(postResponse.status, `Failed to reach the API: ${postResponse.statusText}`);
  }

  const postsData = await postResponse.json();
  
  const { success, message } = postsData;

  if (!success) {
    error(401, 'Failed to create posts from backend');
  }

  return json({ success, status: postResponse.status, message });
}