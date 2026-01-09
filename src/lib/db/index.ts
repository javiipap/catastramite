import fs from 'fs/promises';
import path from 'path';
import type { Headquarters, UserHeadquarters, Notification, Procedure, Request } from '../types';

const DB_PATH = path.join(process.cwd(), 'data.json');

export interface DB {
  headquarters: Headquarters[];
  userHeadquarters: UserHeadquarters[];
  notifications: Notification[];
  procedures: Procedure[];
  requests: Request[];
}

const INITIAL_DB: DB = {
  headquarters: [
    {
      id: "1",
      name: "Ayuntamiento de Madrid",
      description: "Sede electrónica del Ayuntamiento de Madrid",
      createdAt: new Date("2025-01-01"),
    },
    {
      id: "2",
      name: "Comunidad Autónoma de Madrid",
      description: "Sede electrónica de la Comunidad de Madrid",
      createdAt: new Date("2025-01-01"),
    },
  ],
  userHeadquarters: [
    { userId: "1", headquartersId: "1", role: 'master' },
    { userId: "1", headquartersId: "2", role: 'master' },
    { userId: "2", headquartersId: "1", role: 'slave' },
    { userId: "2", headquartersId: "2", role: 'slave' },
  ],
  notifications: [],
  procedures: [],
  requests: [],
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
