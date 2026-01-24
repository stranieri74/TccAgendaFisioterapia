import { NextResponse } from "next/server";
import { AgendaService } from "@/services/AgendaService";

const service = new AgendaService();

export async function POST(req: Request) {
  const body = await req.json();

  const result = await service.gerarSessoes(body);

  return NextResponse.json(result);
}