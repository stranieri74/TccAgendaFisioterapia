import { prisma } from "@/prisma/infra/database/prisma";
import { AgendaRepository } from "@/repositories/AgendaRepository";
import { AgendaDiaRepository } from "@/repositories/AgendaDiaRepository";
import { TipoAtendimento } from "@/domain/entities/Agenda";
import { FuncionarioRepository } from "@/repositories/FuncionarioRepository";

export class AgendaService {

  private agendaRepo = new AgendaRepository();
  private diaRepo = new AgendaDiaRepository();
  private funcionarioRepository = new FuncionarioRepository();

  // CRIAR AGENDA + GERAR SESSÕES
  async criarAgenda(data: any) {

    return prisma.$transaction(async (tx) => {

      const diasSemana = data.diasSemana;
      const hora = data.hora;
      const quantidade = data.quantidade;

      const [ano, mes, dia] = data.dataInicio.split('-').map(Number);

      const dataInicio = new Date(
        ano,
        mes - 1,
        dia,
        12, 0, 0
      );

      if (isNaN(dataInicio.getTime())) {
        throw new Error("Data de início inválida");
      }

      // VALIDA PROFISSIONAL
      const profissionalId = Number(data.profissionalId);

      if (isNaN(profissionalId)) {
        throw new Error("profissionalId inválido");
      }

      const profissional =
        await tx.funcionario.findUnique({
          where: { id: profissionalId }
        });

      if (!profissional) {
        throw new Error("Profissional não encontrado");
      }

      // VALIDA CONFLITO
      if (
        (data.tipo === TipoAtendimento.AVALIACAO ||
          data.tipo === TipoAtendimento.RETORNO) &&
        hora
      ) {

        const conflito =
          await tx.agendaDia.findFirst({
            where: {
              data: dataInicio,
              hora,
              status: { not: "CANCELADO" },
              agenda: {
                profissionalId
              }
            }
          });

        if (conflito) {
          throw new Error(
            "Este profissional já possui atendimento nesse horário"
          );
        }
      }

      // CRIA AGENDA
      const agenda = await tx.agenda.create({
        data: {
          pacienteId: data.pacienteId,
          profissionalId,
          usuarioId: data.usuarioId,
          tipo: data.tipo,
          dataInicio,
          dataFim: data.dataFim
            ? new Date(data.dataFim)
            : null,
          observacao: data.observacao ?? null,
          ativo: 1
        }
      });

      // FISIOTERAPIA
      if (
        agenda.tipo === TipoAtendimento.FISIOTERAPIA &&
        Array.isArray(diasSemana) &&
        diasSemana.length &&
        hora &&
        quantidade
      ) {

        let atual = new Date(dataInicio);
        let criadas = 0;

        while (criadas < quantidade) {

          if (diasSemana.includes(atual.getDay())) {

            await tx.agendaDia.create({
              data: {
                agendaId: agenda.id,
                data: new Date(atual),
                hora,
                status: "AGENDADO"
              }
            });

            criadas++;
          }

          atual.setDate(atual.getDate() + 1);
        }
      }

      // AVALIAÇÃO / RETORNO
      if (
        (agenda.tipo === TipoAtendimento.AVALIACAO ||
          agenda.tipo === TipoAtendimento.RETORNO) &&
        hora
      ) {

        await tx.agendaDia.create({
          data: {
            agendaId: agenda.id,
            data: dataInicio,
            hora,
            status: "AGENDADO"
          }
        });
      }
      return {
        id: agenda.id,
        pacienteId: agenda.pacienteId,
        profissionalId: agenda.profissionalId,
        usuarioId: agenda.usuarioId,
        tipo: agenda.tipo,
        dataInicio: agenda.dataInicio?.toISOString(),
        dataFim: agenda.dataFim?.toISOString(),
        observacao: agenda.observacao,
        ativo: agenda.ativo
      };
    });
  }

  // AGENDA SEMANAL
  async agendaSemanal(
    profissionalId: number,
    dataInicio: Date
  ) {

    // normaliza para evitar bug de fuso horário
    const inicio = new Date(
      dataInicio.getFullYear(),
      dataInicio.getMonth(),
      dataInicio.getDate(),
      12, 0, 0
    );

    const fim = new Date(inicio);
    fim.setDate(fim.getDate() + 6);

    const dados = await this.diaRepo.buscaSemanaAtual(
      profissionalId,
      inicio,
      fim
    );

    return dados.map(d => ({
      id: d.id,
      data: d.data,
      hora: d.hora,
      tipo: d.agenda.tipo,
      paciente: d.agenda.paciente.nome,
      status: d.status
    }));
  }

  // LISTAR TODAS
  async listarTodas() {
    return this.agendaRepo.findAll();
  }

  async agendaPorProfissional(profissionalId: number) {

    const profissional =
      await this.funcionarioRepository.buscarPorId(
        profissionalId
      );



    if (!profissional) {
      throw new Error("Profissional não encontrado");
    }

    return this.agendaRepo.findByProfissional(
      profissionalId
    );
  }

  async buscaAvaliacoesPendentesHoje(profissionalId: number) {
    return this.agendaRepo
      .buscaAvaliacoesPendentesHoje(profissionalId);
  }

  async buscarPorId(agendaId: number) {

    return this.agendaRepo.findById(
      agendaId
    );
  }

  // REMARCAR SESSÃO
  async remarcarSessao(data: {
    id: number;
    novaData: Date;
    novaHora: string;
  }) {

    const sessao = await this.diaRepo.findById(data.id);

    if (!sessao) {
      throw new Error("Sessão não encontrada");
    }

    const tipo = sessao.agenda.tipo;

    if (
      tipo === TipoAtendimento.AVALIACAO ||
      tipo === TipoAtendimento.RETORNO
    ) {
      const conflito =
        await this.diaRepo.buscaConflito(
          sessao.agenda.profissionalId,
          data.novaData,
          data.novaHora,
          data.id
        );

      if (conflito) {
        throw new Error(
          "Horário já ocupado para este profissional"
        );
      }
    }

    return this.diaRepo.update(data.id, {
      data: data.novaData,
      hora: data.novaHora,
      status: "REMARCADO"
    });
  }

  // CANCELAR
  async cancelarSessao(id: number) {

    const sessao = await this.diaRepo.findById(id);

    if (!sessao) {
      throw new Error("Sessão não encontrada");
    }

    return this.diaRepo.AtualizaStatus(
      id,
      "CANCELADO"
    );
  }

  // ALTERAR HORÁRIO EM MASSA
  async alterarHorarioEmMassa(data: {
    agendaId: number;
    novaHora: string;
  }) {

    const sessoes =
      await this.diaRepo.findByAgenda(
        data.agendaId
      );

    if (!sessoes.length) {
      throw new Error("Nenhuma sessão encontrada");
    }

    for (const sessao of sessoes) {

      if (
        sessao.status === "REALIZADO" ||
        sessao.status === "CANCELADO"
      ) continue;

      await this.diaRepo.update(sessao.id, {
        hora: data.novaHora
      });
    }

    return {
      total: sessoes.length,
      novaHora: data.novaHora
    };
  }

  // ATUALIZAR AGENDA
  async atualizarAgenda(data: any) {

    if (!data.id) {
      throw new Error("ID da agenda é obrigatório");
    }

    const agenda = await this.agendaRepo.findById(data.id);

    if (!agenda) {
      throw new Error("Agenda não encontrada");
    }

    const [ano, mes, dia] = data.dataInicio.split('-').map(Number);

    const dataInicio = new Date(
      ano,
      mes - 1,
      dia,
      12, 0, 0
    );

    // atualiza cabeçalho
    await this.agendaRepo.update({
      id: data.id,
      pacienteId: data.pacienteId,
      profissionalId: data.profissionalId,
      tipo: data.tipo,
      dataInicio: dataInicio,
      dataFim: data.dataFim
        ? new Date(data.dataFim)
        : null,
      observacao: data.observacao,
      ativo: data.ativo
    });

    // remove sessões antigas
    await this.diaRepo.deleteByAgenda(data.id);

    // recria sessões
    if (
      data.tipo === TipoAtendimento.AVALIACAO ||
      data.tipo === TipoAtendimento.RETORNO
    ) {

      const conflito = await this.diaRepo.buscaConflito(
        data.profissionalId,
        dataInicio,
        data.hora
      );

      if (conflito) {
        throw new Error(
          "Este profissional já possui atendimento nesse horário"
        );
      }

      await this.diaRepo.create({
        agendaId: data.id,
        data: dataInicio,
        hora: data.hora,
        status: "AGENDADO"
      });
    }

    if (data.tipo === TipoAtendimento.FISIOTERAPIA) {

      if (
        !Array.isArray(data.diasSemana) ||
        !data.quantidade ||
        !data.hora
      ) {
        throw new Error(
          "Informe dias da semana, quantidade e horário"
        );
      }

      let dataAtual = new Date(dataInicio);
      let criadas = 0;

      await this.diaRepo.create({
        agendaId: data.id,
        data: new Date(dataAtual),
        hora: data.hora,
        status: "AGENDADO"
      });
      criadas++;

      dataAtual.setDate(dataAtual.getDate() + 1);

      while (criadas < data.quantidade) {

        if (data.diasSemana.includes(dataAtual.getDay())) {

          await this.diaRepo.create({
            agendaId: data.id,
            data: new Date(dataAtual),
            hora: data.hora,
            status: "AGENDADO"
          });

          criadas++;
        }

        dataAtual.setDate(dataAtual.getDate() + 1);
      }
    }

    return {
      message: "Agenda atualizada com sucesso"
    };
  }

  // DELETAR AGENDA
  async deletarAgenda(id: number) {

    const agendaExiste = await this.agendaRepo.findById(id);

    if (!agendaExiste) {
      throw new Error("Agenda não encontrada");
    }

    // remove sessões primeiro
    await this.diaRepo.deleteByAgenda(id);

    // remove agenda
    await this.agendaRepo.delete(id);
  }
}