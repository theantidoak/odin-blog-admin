import { error } from "@sveltejs/kit";
import dotenv from 'dotenv';
import { json } from "@sveltejs/kit";
dotenv.config();

export async function POST(event: any) {
  const reqBody = await event.request.json();
  const body = typeof reqBody === 'string' ? reqBody : JSON.stringify(reqBody);

  const postResponse = await fetch(`${process.env.APIENDPOINT}/api/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'APIToken': `Token ${process.env.APITOKEN}`
    },
    body
  });

  if (!postResponse.ok) {
    error(postResponse.status, `${postResponse.statusText}. Failed to reach the API.`);
  }

  const postData = await postResponse.json();
  const { success, cookie: jwtCookieOptions } = postData;
  const cookies = event.cookies;
  const jwtCookieName = 'ob_secure_auth';
  jwtCookieOptions.expires = new Date(jwtCookieOptions.expires);
  cookies.set(jwtCookieName, jwtCookieOptions[jwtCookieName], jwtCookieOptions);

  return json({ success, status: 201 });
}