import { JwtService } from '@/shared/security/JwtService';

export function getAuthPayload(request: Request) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) throw new Error('Token não informado');

  const [, token] = authHeader.split(' ');

  if (!token) throw new Error('Token mal formatado');

  return JwtService.validarToken(token);
}