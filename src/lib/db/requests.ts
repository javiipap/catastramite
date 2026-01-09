'use server';

import { readDB } from './index';
import type { Solicitud } from '@/lib/types';

export async function getSolicitudes(sedeId: string): Promise<Solicitud[]> {
  const db = await readDB();
  return db.solicitudes.filter((s) => s.sedeId === sedeId);
}

export async function getUserSolicitudes(sedeId: string, userId: string): Promise<Solicitud[]> {
  const db = await readDB();
  const userSolicitudes = db.solicitudes.filter(s => s.solicitanteId === userId && s.sedeId === sedeId);
  return userSolicitudes;
}

export async function getSolicitudesByParams(params: { sedeId: string }): Promise<Solicitud[]> {
  return getSolicitudes(params.sedeId);
}
