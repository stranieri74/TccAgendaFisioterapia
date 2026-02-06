export function agoraBrasil(): Date {
  return new Date(
    new Date().toLocaleString('sv-SE', {
      timeZone: 'America/Sao_Paulo'
    }) + '-03:00'
  );
}