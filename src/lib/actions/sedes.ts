'use server';

import { readDB, writeDB } from '@/lib/db';
import { Sede } from '@/lib/types';
import { adminAction, citizenAction } from '@/lib/safe-action';
import * as v from 'valibot';

const createSedeSchema = v.object({
  nombre: v.string(),
  descripcion: v.optional(v.string()),
  userId: v.string(),
});

export const createSede = citizenAction
    .inputSchema(createSedeSchema)
    .action(async ({ parsedInput: { nombre, descripcion, userId } }) => {
        const db = await readDB();
        const newSede: Sede = {
            id: Date.now().toString(),
            nombre,
            descripcion,
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
    });

const updateSedeSchema = v.object({
  id: v.string(),
  nombre: v.string(),
  descripcion: v.optional(v.string()),
  userId: v.string(),
  sedeId: v.string(), // We will pass sedeId explicitly for the check
});

export const updateSede = adminAction
    .inputSchema(updateSedeSchema)
    .action(async ({ parsedInput: { id, nombre, descripcion } }) => {
        // Role check already done by middleware
        const db = await readDB();
        const index = db.sedes.findIndex((s) => s.id === id);
        if (index !== -1) {
            db.sedes[index] = { ...db.sedes[index], nombre, descripcion: descripcion || db.sedes[index].descripcion };
            await writeDB(db);
            return db.sedes[index];
        }
        throw new Error('Sede not found');
    });
