import { error } from '@sveltejs/kit';

import dotenv from 'dotenv';

dotenv.config();

export const load = async (event) => {
  try {
    const {params, fetch} = event;
    const isMap = /\.js\.map$/.test(params.postSlug);
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
    const authData = JSON.parse(postResponse.headers.get('x-auth-data') || '');

    return { status: 200, postSuccess, body: { post, comments, mceKey: process.env.TINYMCEKEY }, authData };   
  } catch (err) {
    console.error('Caught Error: ', err);
    throw err;
  }
}