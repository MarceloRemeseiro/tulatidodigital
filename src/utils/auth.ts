export function verifyApiAuth(request: Request): boolean {
  console.log('=== Auth Verification ===');
  const authHeader = request.headers.get('Authorization');
  console.log('Auth header:', authHeader);
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    console.log('No valid auth header');
    return false;
  }

  const base64Credentials = authHeader.slice(6); // Remove 'Basic '
  console.log('Base64 credentials:', base64Credentials);
  
  const credentials = atob(base64Credentials);
  const [username, password] = credentials.split(':');
  console.log('Parsed username:', username);
  console.log('Password length:', password?.length);

  const secretUser = import.meta.env.USUARIO;
  const secretPass = import.meta.env.PASS;
  console.log('Expected username:', secretUser);
  console.log('Expected password length:', secretPass?.length);
  console.log('Env vars available:', {
    hasUSUARIO: !!secretUser,
    hasPASS: !!secretPass,
    NODE_ENV: process.env.NODE_ENV,
    isProd: import.meta.env.PROD
  });

  const isValid = username === secretUser && password === secretPass;
  console.log('Auth result:', isValid);
  
  return isValid;
}

export function createAuthResponse() {
  return new Response(JSON.stringify({ 
    message: 'Autenticación requerida. Incluye las credenciales en el header Authorization.' 
  }), {
    status: 401,
    headers: { 
      'Content-Type': 'application/json',
      'WWW-Authenticate': 'Basic realm="API"'
    },
  });
} 