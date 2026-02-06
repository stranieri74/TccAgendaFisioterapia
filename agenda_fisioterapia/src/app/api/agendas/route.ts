import { NextResponse } from 'next/server';
import { AgendaService } from '@/services/AgendaService';
import { getAuthPayload } from '@/middlewares/auth.middleware';
const service = new AgendaService();

// POST — criar agenda
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const agenda = await service.criarAgenda(body);
    return NextResponse.json(agenda);

  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 400 }
    );
  }
}

// GET — listar
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const profissionalIdParam = searchParams.get("profissionalId");

    const dataParam = searchParams.get("dataInicio");

    const idParam = searchParams.get("id");

    const avaliacaoHojeParam = searchParams.get("avaliacaoHoje");

    // BUSCAR POR ID (EDIÇÃO)
    if (idParam) {

      const id = Number(idParam);

      if (isNaN(id)) {
        throw new Error("ID inválido");
      }

      const agenda = await service.buscarPorId(id);

      if (!agenda) {
        return NextResponse.json(
          { message: "Agenda não encontrada" },
          { status: 404 }
        );
      }

      return NextResponse.json(agenda, { status: 200 });
    }

    // LISTAR TODAS
    if (!profissionalIdParam) {
      const dados = await service.listarTodas();
      return NextResponse.json(dados, { status: 200 });
    }

    const profissionalId = Number(profissionalIdParam);

    if (isNaN(profissionalId)) {
      throw new Error("profissionalId inválido");
    }

    // LISTAR avaliações profissionais, data e avaliação
    if (profissionalIdParam && avaliacaoHojeParam === 'true') {
      const dados = await service.buscaAvaliacoesPendentesHoje(profissionalId);
      return NextResponse.json(dados, { status: 200 });
    }

    // PROFISSIONAL + DATA
    if (dataParam && dataParam.trim() !== "") {
      const dataInicio = new Date(dataParam);

      if (isNaN(dataInicio.getTime())) {
        throw new Error("dataInicio inválida");
      }

      const dados = await service.agendaSemanal(
        profissionalId,
        dataInicio
      );

      return NextResponse.json(dados, { status: 200 });
    }

    // SOMENTE PROFISSIONAL
    const dados =
      await service.agendaPorProfissional(profissionalId);

    return NextResponse.json(dados, { status: 200 });

  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Erro interno";

    return NextResponse.json(
      { message },
      { status: 400 }
    );
  }
}

// PUT — atualizar agenda
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    if (!body.id) {
      throw new Error("ID da agenda é obrigatório");
    }

    const agenda = await service.atualizarAgenda(body);

    return NextResponse.json(agenda, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 400 }
    );
  }
}

// DELETE — excluir agenda
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const id = Number(searchParams.get("id"));

    if (!id) {
      throw new Error("ID da agenda é obrigatório");
    }

    await service.deletarAgenda(id);

    return NextResponse.json(
      { message: "Agenda excluída com sucesso" },
      { status: 200 }
    );

  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 400 }
    );
  }
}