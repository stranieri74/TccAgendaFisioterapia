import jwt, { SignOptions, JwtPayload as DefaultJwtPayload } from 'jsonwebtoken';

export type Perfil = 'ADMIN' | 'PROFISSIONAL' | 'RECEPCAO';

export interface AppJwtPayload {
  sub: string;      // id do usuário
  perfil: Perfil;
}

export class JwtService {
  private static readonly SECRET = process.env.JWT_SECRET;
  private static readonly EXPIRES_IN = '1d';

  private static getSecret(): string {
    if (!this.SECRET) {
      throw new Error('JWT_SECRET não configurado');
    }
    return this.SECRET;
  }

  // Gera um token JWT

  static sign(payload: AppJwtPayload): string {
    return jwt.sign(
      { perfil: payload.perfil },
      this.getSecret(),
      {
        subject: payload.sub,
        expiresIn: '1d',
      }
    );
  }

  // Valida e decodifica o token

  static validarToken(token: string): AppJwtPayload {
    const decoded = jwt.verify(token, this.getSecret());

    if (!this.isAppJwtPayload(decoded)) {
      throw new Error('Token inválido');
    }

    return decoded;
  }


  private static isAppJwtPayload(
    payload: string | DefaultJwtPayload
  ): payload is AppJwtPayload {
    return (
      typeof payload === 'object' &&
      payload !== null &&
      typeof payload.sub === 'string' &&
      typeof payload.perfil === 'string'
    );
  }
}