import { Avaliacao } from '@/domain/entities/Avaliacao';
import { TipoEvolucao } from '@/domain/entities/Prontuario';
import { prisma } from '@/prisma/infra/database/prisma';

export class AvaliacaoRepository {

  async salvar(avaliacao: Avaliacao): Promise<Avaliacao> {

    const registro = await prisma.avaliacao.create({
      data: {
        agendaId: avaliacao.getAgendaId(),
        prontuarioId: avaliacao.getProntuarioId(),
        tipo: avaliacao.getTipo(),

        queixa: avaliacao.getQueixa(),
        historia: avaliacao.getHistoria(),
        doencas: avaliacao.getDoencas(),
        medicamentos: avaliacao.getMedicamentos(),
        cirurgias: avaliacao.getCirurgias(),

        dor: avaliacao.getDor(),
        inspecao: avaliacao.getInspecao(),
        palpacao: avaliacao.getPalpacao(),
        adm: avaliacao.getAdm(),
        forca: avaliacao.getForca(),
        testes: avaliacao.getTestes(),

        diagnostico: avaliacao.getDiagnostico(),
        objetivos: avaliacao.getObjetivos(),
        plano: avaliacao.getPlano(),
        observacoes: avaliacao.getObservacoes()
      }
    });

    return new Avaliacao(
      registro.id,
      registro.agendaId,
      registro.prontuarioId,
      registro.tipo as TipoEvolucao,
      registro.queixa,
      registro.historia,
      registro.doencas,
      registro.medicamentos,
      registro.cirurgias,
      registro.dor,
      registro.inspecao,
      registro.palpacao,
      registro.adm,
      registro.forca,
      registro.testes,
      registro.diagnostico,
      registro.objetivos,
      registro.plano,
      registro.observacoes
    );
  }

  async buscarPorAgendaId(agendaId: number): Promise<Avaliacao | null> {
    const registro = await prisma.avaliacao.findFirst({
      where: { agendaId }
    });

    if (!registro) return null;

    return new Avaliacao(
      registro.id,
      registro.agendaId,
      registro.prontuarioId,
      registro.tipo as TipoEvolucao,
      registro.queixa,
      registro.historia,
      registro.doencas,
      registro.medicamentos,
      registro.cirurgias,
      registro.dor,
      registro.inspecao,
      registro.palpacao,
      registro.adm,
      registro.forca,
      registro.testes,
      registro.diagnostico,
      registro.objetivos,
      registro.plano,
      registro.observacoes
    );
  }

  async atualizar(avaliacao: Avaliacao): Promise<Avaliacao> {

  const registro = await prisma.avaliacao.update({
    where: { id: avaliacao.getId() },
    data: {

      queixa: avaliacao.getQueixa(),
      historia: avaliacao.getHistoria(),
      doencas: avaliacao.getDoencas(),
      medicamentos: avaliacao.getMedicamentos(),
      cirurgias: avaliacao.getCirurgias(),

      dor: avaliacao.getDor(),
      inspecao: avaliacao.getInspecao(),
      palpacao: avaliacao.getPalpacao(),
      adm: avaliacao.getAdm(),
      forca: avaliacao.getForca(),
      testes: avaliacao.getTestes(),

      diagnostico: avaliacao.getDiagnostico(),
      objetivos: avaliacao.getObjetivos(),
      plano: avaliacao.getPlano(),
      observacoes: avaliacao.getObservacoes()
    }
  });

  return new Avaliacao(
    registro.id,
    registro.agendaId,
    registro.prontuarioId,
    registro.tipo,
    registro.queixa,
    registro.historia,
    registro.doencas,
    registro.medicamentos,
    registro.cirurgias,

    registro.dor,
    registro.inspecao,
    registro.palpacao,
    registro.adm,
    registro.forca,
    registro.testes,

    registro.diagnostico,
    registro.objetivos,
    registro.plano,
    registro.observacoes
  );
}
}