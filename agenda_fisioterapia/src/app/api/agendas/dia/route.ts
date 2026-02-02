import { NextResponse } from "next/server";
import { AgendaService } from "@/services/AgendaService";

const service = new AgendaService();

// 🔁 remarcar
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const result = await service.remarcarSessao({
      id: body.id,
      novaData: new Date(body.data),
      novaHora: body.hora
    });

    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message },
      { status: 400 }
    );
  }
}

// ❌ cancelar
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const result =
      await service.cancelarSessao(body.id);

    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message },
      { status: 400 }
    );
  }
}

// 🔄 alterar horário em massa
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result =
      await service.alterarHorarioEmMassa(body);

    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message },
      { status: 400 }
    );
  }
}

