import { NextResponse } from "next/server";
import { prisma } from "@/prisma/infra/database/prisma";

//  CORS HEADERS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

// PRE-FLIGHT (OBRIGATÓRIO)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// PATCH STATUS DA SESSÃO
export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { message: "id e status são obrigatórios" },
        { status: 400, headers: corsHeaders }
      );
    }

    const sessao = await prisma.agendaDia.findUnique({
      where: { id: Number(id) }
    });

    if (!sessao) {
      return NextResponse.json(
        { message: "Sessão não encontrada" },
        { status: 404, headers: corsHeaders }
      );
    }

    await prisma.agendaDia.update({
      where: { id: Number(id) },
      data: { status }
    });

    return NextResponse.json(
      { message: "Status atualizado com sucesso" },
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Erro ao atualizar status" },
      { status: 500, headers: corsHeaders }
    );
  }
}