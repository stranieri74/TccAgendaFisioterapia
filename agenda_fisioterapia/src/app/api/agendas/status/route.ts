import { NextResponse } from "next/server";
import { AgendaDiaRepository } from "@/repositories/AgendaDiaRepository";

const repo = new AgendaDiaRepository();

// ===================================================
// PATCH — atualizar status da sessão
// ===================================================
export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const id = Number(searchParams.get("id"));

    if (!id || isNaN(id)) {
      return NextResponse.json(
        { message: "ID da sessão inválido" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { message: "Status é obrigatório" },
        { status: 400 }
      );
    }

    const atualizado = await repo.updateStatus(id, status);

    return NextResponse.json(atualizado, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { message: error.message ?? "Erro interno" },
      { status: 400 }
    );
  }
}