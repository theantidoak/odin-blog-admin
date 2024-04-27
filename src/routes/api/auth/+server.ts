import dotenv from 'dotenv';
import { json } from "@sveltejs/kit";
dotenv.config();

export async function GET(event: any) {
  const jwtCookieName = 'ob_secure_auth';
  const jwtCookie = event.cookies.get(jwtCookieName);
  const response = await fetch(`${process.env.APIENDPOINT}/api/auth`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'APIToken': `Token ${process.env.APITOKEN}`,
      'Authorization': `Bearer ${jwtCookie}`
    }
  });

  const responseData = await response.json();
  const { success, message } = responseData;

  return json({ success, status: 201, message });
}