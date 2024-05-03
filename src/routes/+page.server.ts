import { error } from '@sveltejs/kit';

import dotenv from 'dotenv';

dotenv.config();

export const load = async (event) => {
  try {
    const response = await event.fetch('/api/posts');

    if (!response.ok) {
      error(response.status, `Failed to get posts from server. Please sign in.`);
    }
    const postsData = await response.json()
    const { recentPosts: posts, success } = postsData;

    return { status: 200, success, body: { posts }, isAuthorized: response.headers.get('x-auth-data') };   
  } catch (err) {
    console.error(err);
    throw err;
  }
}