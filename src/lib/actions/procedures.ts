'use server';

import { readDB, writeDB } from '@/lib/db';
import { Procedure } from '@/lib/types';

import { adminAction } from '@/lib/safe-action';
import * as v from 'valibot';

// Definition for FormField schema
const FormFieldSchema = v.object({
  id: v.string(),
  name: v.string(),
  type: v.picklist(["text", "number", "date", "email", "textarea", "select"]),
  required: v.boolean(),
  options: v.optional(v.array(v.string())),
});

const addProcedureSchema = v.object({
  headquartersId: v.string(),
  name: v.string(),
  description: v.string(),
  fields: v.array(FormFieldSchema),
  userId: v.string() // Explicit userId for admin check and creation
});

export const addProcedure = adminAction
    .inputSchema(addProcedureSchema)
    .action(async ({ parsedInput: { headquartersId, name, description, fields, userId } }) => {
        // Role check already done by middleware via userId/headquartersId
        const db = await readDB();
        const newProcedure: Procedure = {
            id: Date.now().toString(),
            headquartersId,
            name,
            description,
            fields,
            createdAt: new Date(),
            createdBy: userId, // Use userId as createdBy
        };
        
        db.procedures.push(newProcedure);
        await writeDB(db);
        return newProcedure;
    });

