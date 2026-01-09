'use server';

import { readDB, writeDB } from '@/lib/db';
import { Solicitud } from '@/lib/types';
import { adminAction, citizenAction } from '@/lib/safe-action';
import * as v from 'valibot';
import { getUserRole } from '@/lib/db/users';

const addSolicitudSchema = v.object({
  sedeId: v.string(),
  tramiteTypeId: v.string(),
  tramiteTypeNombre: v.string(),
  solicitanteId: v.string(),
  solicitanteNombre: v.string(),
  estado: v.picklist(["pendiente", "en_revision", "aprobada", "rechazada"]),
  datos: v.record(v.string(), v.unknown()),
  userId: v.string(), 
});

export const addSolicitud = citizenAction
    .inputSchema(addSolicitudSchema)
    .action(async ({ parsedInput: solicitud }) => {
        const { userId } = solicitud;

        // Additional check: Ensure user creating is the solicitante (implicit in safeAction context?)
        // If we trust client input blindly, a user could create solicitud for another.
        // We really should use `userId` from context as source of truth for `solicitanteId` OR verify it matches.
        
        if (solicitud.solicitanteId !== userId) {
            throw new Error('Unauthorized: Cannot create solicitud for another user');
        }

        const role = await getUserRole(userId, solicitud.sedeId);
        if (!role) {
            throw new Error('Unauthorized: User not associated with sede');
        }

        const db = await readDB();
        const newSolicitud: Solicitud = {
            id: Date.now().toString(),
            sedeId: solicitud.sedeId,
            tramiteTypeId: solicitud.tramiteTypeId,
            tramiteTypeNombre: solicitud.tramiteTypeNombre,
            solicitanteId: solicitud.solicitanteId,
            solicitanteNombre: solicitud.solicitanteNombre,
            estado: solicitud.estado,
            datos: solicitud.datos,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        
        db.solicitudes.push(newSolicitud);
        await writeDB(db);
        return newSolicitud;
    });

const updateSolicitudEstadoSchema = v.object({
  id: v.string(), 
  estado: v.picklist(["pendiente", "en_revision", "aprobada", "rechazada"] as const),
  sedeId: v.string(),
});

export const updateSolicitudEstado = adminAction
    .inputSchema(updateSolicitudEstadoSchema)
    .action(async ({ parsedInput: { id, estado, sedeId } }) => {
        // Role checked by middleware using input.sedeId
        const db = await readDB();
        const index = db.solicitudes.findIndex((s) => s.id === id);
        if (index === -1) {
            throw new Error('Solicitud not found');
        }
        
        if (db.solicitudes[index].sedeId !== sedeId) {
             throw new Error('Mismatch: Solicitud does not belong to the provided Sede');
        }

        db.solicitudes[index] = { 
            ...db.solicitudes[index], 
            estado, 
            updatedAt: new Date() 
        };
        await writeDB(db);
        return db.solicitudes[index];
    });

