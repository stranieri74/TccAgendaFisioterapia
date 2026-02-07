import { JwtService } from '@/shared/security/JwtService';

describe('JwtService', () => {

  it('deve gerar e validar um token válido', () => {
    const token = JwtService.sign({
      sub: '1',
      perfil: 'ADMIN',
    });

    const payload = JwtService.validarToken(token);

    expect(payload.sub).toBe('1');
    expect(payload.perfil).toBe('ADMIN');
  });

  it('deve lançar erro para token inválido', () => {
    expect(() => {
      JwtService.validarToken('token_invalido');
    }).toThrow();
  });

});