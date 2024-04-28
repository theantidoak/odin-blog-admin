import { error } from '@sveltejs/kit';

import dotenv from 'dotenv';

dotenv.config();

export const load = async ({fetch}) => {
  try {
    const response = await fetch('/api/posts');
    const postsData = await response.json()
    const { recentPosts: posts, success } = postsData;

    if (!success) {
      error(response.status || 401, `Failed to get posts from server. ${postsData}`);
    }

    return { status: 200, success, body: { posts } };   
  } catch (err) {
    console.error(err);
    throw err;
  }
}