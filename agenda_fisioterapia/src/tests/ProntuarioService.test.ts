import { ProntuarioService } from '@/services/ProntuarioService';
import { ProntuarioRepository } from '@/repositories/ProntuarioRepository';
import { FuncionarioRepository } from '@/repositories/FuncionarioRepository';
import { PacienteRepository } from '@/repositories/PacienteRepository';

jest.mock('@/repositories/ProntuarioRepository', () => {
  return {
    ProntuarioRepository: jest.fn().mockImplementation(() => ({
      buscarAtivoPorPacienteEProfissional: jest.fn(),
    })),
  };
});

jest.mock('@/repositories/PacienteRepository', () => {
  return {
    PacienteRepository: jest.fn().mockImplementation(() => ({
      buscarPorCpf: jest.fn(),
    })),
  };
});

jest.mock('@/repositories/FuncionarioRepository', () => {
  return {
    FuncionarioRepository: jest.fn().mockImplementation(() => ({
      buscarPorCpf: jest.fn(),
    })),
  };
});

describe('ProntuarioService', () => {

  let service: ProntuarioService;
  let prontuarioRepo: jest.Mocked<ProntuarioRepository>;
  let pacienteRepo: jest.Mocked<PacienteRepository>;
  let funcionarioRepo: jest.Mocked<FuncionarioRepository>;

  beforeEach(() => {
    prontuarioRepo = new (ProntuarioRepository as any)();
    pacienteRepo = new (PacienteRepository as any)();
    funcionarioRepo = new (FuncionarioRepository as any)();

    service = new ProntuarioService(
      prontuarioRepo,
      pacienteRepo,
      funcionarioRepo
    );
  });

  it('deve lançar erro se prontuário não existir', async () => {
    prontuarioRepo.buscarAtivoPorPacienteEProfissional.mockResolvedValue(null);

    await expect(
      service.obterProntuarioPorCpf('000')
    ).rejects.toThrow();
  });

});