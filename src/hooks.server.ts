import type { Handle } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const { request, url, cookies } = event;
  const needsVerification = url.pathname.startsWith('/api/comments') || (url.pathname.startsWith('/api/posts') && request.method === 'GET') ? true : false;
  if (needsVerification) {
    try {
      const jwtCookie = cookies.get('ob_secure_auth');
      const authResponse = await fetch(`${process.env.APIENDPOINT}/api/auth`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'APIToken': `Token ${process.env.APITOKEN}`,
          'Authorization': `Bearer ${jwtCookie}`
        }
      });

      if (!authResponse.ok) {
        console.error(`Authentication service failure: ${authResponse.status} ${authResponse.statusText}`);
        error(authResponse.status, `Authentication service failure: ${authResponse.statusText}`);
      }

      const authData = await authResponse.json();
      if (!authData.success) {
        error(authResponse.status, `Unauthorized: ${authResponse.statusText}`);
      }
    } catch (error) {
      const err = error as any;
      console.error(error);
      return new Response(JSON.stringify(`${err.body?.message || 'Authentication error'}`), { status: err.status || 500 });
    }
  }

  const response = await resolve(event);
	return response;
};