import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {

  const response = NextResponse.next();

  // 🔓 CORS (Angular)
  response.headers.set('Access-Control-Allow-Origin', 'http://localhost:4200');
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,PATCH,DELETE, OPTIONS'
  );
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );

    response.headers.set(
    'Access-Control-Allow-Credentials',
    'true'
  );

  // ⚠️ Preflight (CORS)
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: response.headers
    });
  }

  // 🔓 Rotas públicas
  const publicRoutes = ['/api/auth/login'];

  if (publicRoutes.includes(request.nextUrl.pathname)) {
    return response;
  }

  // 🔐 Validação de token
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return NextResponse.json(
      { message: 'Token não informado' },
      { status: 401, headers: response.headers }
    );
  }

  return response;
}

export const config = {
  matcher: '/api/:path*'
};