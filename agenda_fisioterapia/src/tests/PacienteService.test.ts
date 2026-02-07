import { PacienteService } from '@/services/PacienteService';
import { PacienteRepository } from '@/repositories/PacienteRepository';

jest.mock('@/repositories/PacienteRepository', () => ({
  PacienteRepository: jest.fn().mockImplementation(() => ({
    buscarPorCpf: jest.fn(),
  })),
}));

describe('PacienteService', () => {
  let service: PacienteService;
  let repo: jest.Mocked<PacienteRepository>;

  beforeEach(() => {
    repo = new (PacienteRepository as any)();
    service = new PacienteService(repo);
  });

  it('deve lançar erro se paciente não existir', async () => {
    repo.buscarPorCpf.mockResolvedValue(null);

    await expect(service.buscarPorCpf('000')).rejects.toThrow();
  });
});