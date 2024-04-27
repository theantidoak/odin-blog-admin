import { error } from "@sveltejs/kit";
import dotenv from 'dotenv';
import { json } from "@sveltejs/kit";
dotenv.config();

export async function GET(event:any) {
  const { searchParams } = new URL(event.request.url);
  const postId = searchParams.get('postId');

  const getResponse = await fetch(`${process.env.APIENDPOINT}/api/comments/${postId}`, {
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
  const { comments, success } = postData;

  if (!success) {
    error(401, 'Failed to get post comments from backend');
  }

  return json({ success, status: getResponse.status, comments });
} 