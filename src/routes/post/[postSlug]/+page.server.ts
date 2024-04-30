import { error } from '@sveltejs/kit';

import dotenv from 'dotenv';

dotenv.config();

export const load = async ({params, fetch}) => {
  try {
    const postResponse = await fetch(`/api/posts/${params.postSlug}`);
    const postData = await postResponse.json();
    const { targetPost: post, success: postSuccess, message: postMessage } = postData;
    
    if (!postSuccess) {
      error(401, `post Error: ${postMessage}`);
    }

    const commentsResponse = await fetch(`/api/posts/${params.postSlug}/comments?postId=${post._id}`);
    const commentsData = await commentsResponse.json();
    const { comments, success: commentsSuccess, message: commentsMessage } = commentsData;

    if (!commentsSuccess) {
      error(401, `comment Error: ${commentsMessage}`);
    }

    return { status: 200, postSuccess, body: { post, comments } };   
  } catch (err) {
    console.error(err);
    throw err;
  }
}