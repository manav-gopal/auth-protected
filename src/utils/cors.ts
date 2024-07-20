export const addCorsHeaders = (response: Response) => {
    return new Response(response.body, {
      ...response,
      headers: {
        ...response.headers,
        'Access-Control-Allow-Origin': 'https://auth-protected.vercel.app', 
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  };
  