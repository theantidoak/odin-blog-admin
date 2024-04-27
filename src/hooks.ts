import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const { request, url, cookies } = event;
  const needsVerification = url.pathname.startsWith('/api/comments') || (url.pathname.startsWith('/api/posts') && request.method === 'GET');
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
        return new Response('Authentication service failure', { status: authResponse.status });
      }

      const authData = await authResponse.json();
      if (!authData.success) {
        return new Response('Unauthorized', { status: 401 });
      }
    } catch (error) {
      console.error('Authentication error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }

  const response = await resolve(event);
  return response;
};