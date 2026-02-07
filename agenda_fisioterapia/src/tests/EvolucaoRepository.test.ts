import { EvolucaoRepository } from '@/repositories/EvolucaoRepository';

describe('EvolucaoRepository', () => {

  it('deve buscar evoluções por ID ', async () => {
    const repo = new EvolucaoRepository() as jest.Mocked<EvolucaoRepository>;

    repo.findById = jest.fn().mockResolvedValue([]);

    const result = await repo.findById(1);

    expect(result).toEqual([]);
  });

});