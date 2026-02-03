export async function apiFetch(
    url: string,
    options: RequestInit = {},
  ) {
    const method = options.method ?? 'GET';
  
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('➡️ API REQUEST');
    console.log('URL:', url);
    console.log('METHOD:', method);
    console.log('HEADERS:', options.headers ?? {});
    console.log('BODY:', options.body ?? '—');
  
    const startTime = Date.now();
  
    try {
      const response = await fetch(url, options);
  
      const duration = Date.now() - startTime;
      const responseText = await response.text();
  
      console.log('⬅️ API RESPONSE');
      console.log('STATUS:', response.status);
      console.log('TIME:', `${duration}ms`);
      console.log('HEADERS:', Object.fromEntries(response.headers.entries()));
      console.log('BODY:', responseText);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
      // re-create response for JSON usage
      return {
        ok: response.ok,
        status: response.status,
        json: () => Promise.resolve(JSON.parse(responseText)),
      };
    } catch (error) {
      console.log('❌ API ERROR');
      console.log('URL:', url);
      console.log('ERROR:', error);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      throw error;
    }
  }
  