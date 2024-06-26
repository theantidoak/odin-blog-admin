import type { Handle } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const { url, cookies } = event;
  const apiSlugs = [ '/post', '/api/posts', '/api/comments', '/api/logout' ];
  const needsVerification = apiSlugs.find((slug) => url.pathname.startsWith(slug));

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
      const response = await resolve(event);
      response.headers.set('X-Auth-Data', JSON.stringify(authData));
      return response;
    } catch (error) {
      const err = error as any;
      console.error(error);
      return new Response(JSON.stringify(`${err.body?.message || 'Authentication error'}`), { status: err.status || 500 });
    }
  }

  const response = await resolve(event);
  return response;
};
