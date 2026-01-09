import fs from 'fs/promises';
import path from 'path';
import type { Sede, UserSede, Notification, TramiteType, Solicitud } from '../types';

const DB_PATH = path.join(process.cwd(), 'data.json');

export interface DB {
  sedes: Sede[];
  userSedes: UserSede[];
  notifications: Notification[];
  tramiteTypes: TramiteType[];
  solicitudes: Solicitud[];
}

const INITIAL_DB: DB = {
  sedes: [
    {
      id: "1",
      nombre: "Ayuntamiento de Madrid",
      descripcion: "Sede electrónica del Ayuntamiento de Madrid",
      createdAt: new Date("2025-01-01"),
    },
    {
      id: "2",
      nombre: "Comunidad Autónoma de Madrid",
      descripcion: "Sede electrónica de la Comunidad de Madrid",
      createdAt: new Date("2025-01-01"),
    },
  ],
  userSedes: [
    { userId: "1", sedeId: "1", role: "administrador" },
    { userId: "1", sedeId: "2", role: "administrador" },
    { userId: "2", sedeId: "1", role: "administrado" },
    { userId: "2", sedeId: "2", role: "administrado" },
  ],
  notifications: [],
  tramiteTypes: [],
  solicitudes: [],
};

// Helper to handle Date parsing from JSON
function reviver(key: string, value: any) {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
        return new Date(value);
    }
    return value;
}

export async function readDB(): Promise<DB> {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data, reviver);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      await writeDB(INITIAL_DB);
      return INITIAL_DB;
    }
    throw error;
  }
}

export async function writeDB(data: DB): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}
