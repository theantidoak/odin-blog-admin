import { error } from '@sveltejs/kit';

import dotenv from 'dotenv';

dotenv.config();

export const load = async ({params, fetch}) => {
  try {
    const postResponse = await fetch(`/api/posts/${params.postSlug}`);

    if (!postResponse.ok) {
      error(postResponse.status, `post Error: ${postResponse.statusText}`);
    }

    const postData = await postResponse.json();
    const { targetPost: post, success: postSuccess, message: postMessage } = postData;

    const commentsResponse = await fetch(`/api/posts/${params.postSlug}/comments?postId=${post._id}`);
    if (!commentsResponse.ok) {
      error(commentsResponse.status, `comments Error: ${postResponse.statusText}`);
    }

    const commentsData = await commentsResponse.json();
    const { comments, success: commentsSuccess, message: commentsMessage } = commentsData;

    return { status: 200, postSuccess, body: { post, comments } };   
  } catch (err) {
    console.error('Caught Error: ', err);
    throw err;
  }
}