'use server';

import { readDB, writeDB } from '@/lib/db';
import { Headquarters } from '@/lib/types';
import { adminAction, slaveAction } from '@/lib/safe-action';
import * as v from 'valibot';

const createHeadquartersSchema = v.object({
  name: v.string(),
  description: v.optional(v.string()),
  userId: v.string(),
});

export const createHeadquarters = slaveAction
    .inputSchema(createHeadquartersSchema)
    .action(async ({ parsedInput: { name, description, userId } }) => {
        const db = await readDB();
        const newHeadquarters: Headquarters = {
            id: Date.now().toString(),
            name,
            description,
            createdAt: new Date(),
        };
        
        db.headquarters.push(newHeadquarters);
        
        // Add creator as admin
        db.userHeadquarters.push({
            userId,
            headquartersId: newHeadquarters.id,
            role: 'master'
        });
        
        await writeDB(db);
        // Return with relation
        return {
            ...newHeadquarters,
            userHeadquarters: [{ userId, headquartersId: newHeadquarters.id, role: 'master' }]
        };
    });

const updateHeadquartersSchema = v.object({
  id: v.string(),
  name: v.string(),
  description: v.optional(v.string()),
  userId: v.string(),
  headquartersId: v.string(), // We will pass headquartersId explicitly for the check
});

export const updateHeadquarters = adminAction
    .inputSchema(updateHeadquartersSchema)
    .action(async ({ parsedInput: { id, name, description } }) => {
        // Role check already done by middleware
        const db = await readDB();
        const index = db.headquarters.findIndex((h) => h.id === id);
        if (index !== -1) {
            db.headquarters[index] = { ...db.headquarters[index], name, description: description || db.headquarters[index].description };
            await writeDB(db);
            return db.headquarters[index];
        }
        throw new Error('Headquarters not found');
    });
