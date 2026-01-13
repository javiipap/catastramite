'use server';

import { useCases } from '@/use-cases';
import { Procedure } from '@/lib/types';
import { adminAction, slaveAction } from '@/lib/safe-action';
import * as v from 'valibot';

// Definition for FormField schema
const FormFieldSchema = v.object({
  id: v.string(),
  name: v.string(),
  type: v.picklist(['text', 'number', 'date', 'email', 'textarea', 'select']),
  required: v.boolean(),
  options: v.optional(v.array(v.string())),
});

const addProcedureSchema = v.object({
  headquartersId: v.string(),
  name: v.string(),
  description: v.string(),
  fields: v.array(FormFieldSchema),
});

export const addProcedure = adminAction
  .inputSchema(addProcedureSchema)
  .action(
    async ({
      parsedInput: { headquartersId, name, description, fields },
      ctx: { user },
    }) => {
      // Role check already done by middleware via userId/headquartersId
      const newProcedure: Procedure = {
        id: Date.now().toString(),
        headquartersId,
        name,
        description,
        fields,
        createdAt: new Date(),
        createdBy: user.id, // Use userId as createdBy
      };

      return useCases.procedures.createProcedure(newProcedure, user);
    }
  );

export const getProceduresAction = slaveAction
  .inputSchema(v.object({ headquartersId: v.string() }))
  .action(async ({ parsedInput: { headquartersId }, ctx: { user } }) => {
    return useCases.procedures.getProcedures({ headquartersId }, user);
  });
