import { getAuthPayload } from '@/middlewares/auth.middleware';
import { JwtService } from '@/shared/security/JwtService';

describe('auth.middleware - getAuthPayload', () => {

  beforeAll(() => {
    process.env.JWT_SECRET = 'chave_de_teste';
  });

  it('deve extrair payload do header Authorization', () => {

    const token = JwtService.sign({
      sub: '10',
      perfil: 'PROFISSIONAL',
    });

    const req: any = {
      headers: {
        get: (key: string) =>
          key === 'authorization' ? `Bearer ${token}` : null,
      },
    };

    const payload = getAuthPayload(req);

    expect(payload.sub).toBe('10');
    expect(payload.perfil).toBe('PROFISSIONAL');
  });

  it('deve lançar erro se header Authorization não existir', () => {

    const req: any = {
      headers: {
        get: () => null,
      },
    };

    expect(() => {
      getAuthPayload(req);
    }).toThrow('Token não informado');
  });

  it('deve lançar erro se token estiver mal formatado', () => {

    const req: any = {
      headers: {
        get: () => 'Bearer',
      },
    };

    expect(() => {
      getAuthPayload(req);
    }).toThrow('Token mal formatado');
  });

});