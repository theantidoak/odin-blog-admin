import { error } from "@sveltejs/kit";
import dotenv from 'dotenv';
import { json } from "@sveltejs/kit";
dotenv.config();

export async function POST(event: any) {
  const jwtCookieName = 'ob_secure_auth';
  const jwtCookie = event.cookies.get(jwtCookieName);

  const postResponse = await fetch(`${process.env.APIENDPOINT}/api/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'APIToken': `Token ${process.env.APITOKEN}`,
      'Authorization': `Bearer ${jwtCookie}`
    },
  });

  if (!postResponse.ok) {
    error(postResponse.status, `${postResponse.statusText}. Failed to reach the Logout API.`);
  }

  const postData = await postResponse.json();
  const { success } = postData;

  if (success) {
    const expire = new Date(Date.now() - 60 * 60 * 1000);
    event.cookies.set(jwtCookieName, '', { path: '/', httpOnly: true, secure: true, sameSite: 'none', maxAge: 7200000, expires: expire });
  }

  return json({ success, status: 201 });
}