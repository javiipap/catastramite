'use server';

import { readDB, writeDB } from '@/lib/db';
import { Solicitud } from '@/lib/types';

export async function getSolicitudes(sedeId: string): Promise<Solicitud[]> {
  const db = await readDB();
  return db.solicitudes.filter((s) => s.sedeId === sedeId);
}

import { getUserRole } from './users';

export async function addSolicitud(solicitud: Omit<Solicitud, 'id' | 'createdAt' | 'updatedAt'>, userId: string): Promise<Solicitud> {
  // Ensure the user creating it is the one in the solicitud or is an admin
  // Simplification: only allow creating for oneself, or verify against userId
  if (solicitud.solicitanteId !== userId) {
      throw new Error('Unauthorized: Cannot create solicitud for another user');
  }
  
  // Also verify association with Sede
  const role = await getUserRole(userId, solicitud.sedeId);
  if (!role) {
      throw new Error('Unauthorized: User not associated with sede');
  }

  const db = await readDB();
  const newSolicitud: Solicitud = {
    ...solicitud,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  db.solicitudes.push(newSolicitud);
  await writeDB(db);
  return newSolicitud;
}

export async function updateSolicitudEstado(id: string, estado: Solicitud['estado'], userId: string): Promise<Solicitud> {
  const db = await readDB();
  const index = db.solicitudes.findIndex((s) => s.id === id);
  if (index === -1) {
    throw new Error('Solicitud not found');
  }

  const solicitud = db.solicitudes[index];
  // Verify user is admin of the sede
  const role = await getUserRole(userId, solicitud.sedeId);
  if (role !== 'administrador') {
      throw new Error('Unauthorized: Only administrators can update status');
  }

  db.solicitudes[index] = { 
      ...db.solicitudes[index], 
      estado, 
      updatedAt: new Date() 
  };
  await writeDB(db);
  return db.solicitudes[index];
}

export async function getUserSolicitudes(sedeId: string, userId: string): Promise<Solicitud[]> {
  const db = await readDB();
  const userSolicitudes = db.solicitudes.filter(s => s.solicitanteId === userId && s.sedeId === sedeId);
  return userSolicitudes;
}

export async function getSolicitudesByParams(params: { sedeId: string }): Promise<Solicitud[]> {
  return getSolicitudes(params.sedeId);
}
