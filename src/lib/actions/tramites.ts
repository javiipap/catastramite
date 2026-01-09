'use server';

import { readDB, writeDB } from '@/lib/db';
import { TramiteType } from '@/lib/types';

import { adminAction } from '@/lib/safe-action';
import * as v from 'valibot';

// Definition for CampoFormulario schema
const CampoFormularioSchema = v.object({
  id: v.string(),
  nombre: v.string(),
  tipo: v.picklist(["texto", "numero", "fecha", "email", "textarea", "select"]),
  requerido: v.boolean(),
  opciones: v.optional(v.array(v.string())),
});

const addTramiteTypeSchema = v.object({
  sedeId: v.string(),
  nombre: v.string(),
  descripcion: v.string(),
  campos: v.array(CampoFormularioSchema),
  userId: v.string() // Explicit userId for admin check and creation
});

export const addTramiteType = adminAction
    .inputSchema(addTramiteTypeSchema)
    .action(async ({ parsedInput: { sedeId, nombre, descripcion, campos, userId } }) => {
        // Role check already done by middleware via userId/sedeId
        const db = await readDB();
        const newTramite: TramiteType = {
            id: Date.now().toString(),
            sedeId,
            nombre,
            descripcion,
            campos,
            createdAt: new Date(),
            createdBy: userId, // Use userId as createdBy
        };
        
        db.tramiteTypes.push(newTramite);
        await writeDB(db);
        return newTramite;
    });

