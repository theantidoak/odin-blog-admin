import { error } from '@sveltejs/kit';

import dotenv from 'dotenv';

dotenv.config();

export const load = async ({fetch, cookies}) => {
  try {
    const jwtCookieName = 'ob_secure_auth';
    const jwtCookie = cookies.get(jwtCookieName);
    const response = await fetch(`${process.env.APIENDPOINT}/api/auth`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'APIToken': `Token ${process.env.APITOKEN}`,
        'Authorization': `Bearer ${jwtCookie}`
      }
    });

    const postsData = await response.json();
    const { recentPosts: posts, success, user } = postsData;

    if (!success) {
      error(401, 'Failed to authorize user on server');
    }

    return { status: 200, success, body: { posts, user } };   
  } catch (err) {
    console.error(err);
    const errResponse: any = err;
    if ((errResponse)?.status === 401) {
      return { status: errResponse.status, success: false, body: { message: errResponse.body.message } };
    }

    throw err;
  }
}