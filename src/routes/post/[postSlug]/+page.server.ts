import { error } from '@sveltejs/kit';

import dotenv from 'dotenv';

dotenv.config();

export const load = async ({params, fetch}) => {
  try {
    const postResponse = await fetch(`/api/posts/${params.postSlug}`);
    const postData = await postResponse.json();
    const { targetPost: post, success, message } = postData;

    if (!success) {
      error(401, message);
    }

    return { status: 200, success, body: { post } };   
  } catch (err) {
    console.error(err);
    throw err;
  }
}