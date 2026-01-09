'use server';

import { readDB, writeDB } from '@/lib/db';
import { Sede } from '@/lib/types';


export async function getSedes(): Promise<Sede[]> {
  const db = await readDB();
  return db.sedes.map(sede => ({
    ...sede,
    userSedes: db.userSedes.filter(us => us.sedeId === sede.id)
  }));
}

export async function getSede(id: string): Promise<Sede | undefined> {
  const db = await readDB();
  const sede = db.sedes.find((s) => s.id === id);
  if (sede) {
     return {
         ...sede,
         userSedes: db.userSedes.filter(us => us.sedeId === sede.id)
     }
  }
  return undefined;
}

export async function createSede(sedeData: Omit<Sede, 'id' | 'createdAt' | 'userSedes'>, userId: string): Promise<Sede> {
  const db = await readDB();
  const newSede: Sede = {
    ...sedeData,
    id: Date.now().toString(),
    createdAt: new Date(),
  };
  
  db.sedes.push(newSede);
  
  // Add creator as admin
  db.userSedes.push({
      userId,
      sedeId: newSede.id,
      role: 'administrador'
  });
  
  await writeDB(db);
  // Return with relation
  return {
      ...newSede,
      userSedes: [{ userId, sedeId: newSede.id, role: 'administrador' }]
  };
}


import { getUserRole } from './users';

export async function updateSede(sede: Sede, userId: string): Promise<Sede> {
  const role = await getUserRole(userId, sede.id);
  if (role !== 'administrador') {
      throw new Error('Unauthorized: Only administrators can update sedes');
  }

  const db = await readDB();
  const index = db.sedes.findIndex((s) => s.id === sede.id);
  if (index !== -1) {
    db.sedes[index] = { ...db.sedes[index], ...sede };
    await writeDB(db);
    return db.sedes[index];
  }
  throw new Error('Sede not found');
}

export async function getSedeByParams(params: { sedeId: string }): Promise<Sede | undefined> {
  return getSede(params.sedeId);
}
