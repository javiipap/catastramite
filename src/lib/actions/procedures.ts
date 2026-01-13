'use server';

import { useCases } from '@/use-cases';
import { useCases } from '@/use-cases';
import { Procedure, FormField } from '@/lib/schemas/procedures';
import { masterAction, slaveAction } from '@/lib/safe-action';
import {
  createProcedureSchema,
  getProceduresSchema,
} from '@/lib/schemas/procedures';

export const addProcedure = masterAction
  .inputSchema(createProcedureSchema)
  .action(
    async ({
      parsedInput: { headquartersId, name, description, fields },
      ctx: { user },
    }) => {
      // Role check already done by middleware via userId/headquartersId
      const newProcedure: Procedure = {
        procedureId: Date.now().toString(),
        headquartersId,
        name,
        description,
        fields: fields as FormField[], // Cast to verify structure matches core types
        createdAt: new Date(),
        createdBy: user.id, // Use userId as createdBy
      };

      return useCases.procedures.createProcedure(newProcedure, user);
    }
  );

export const getProceduresAction = slaveAction
  .inputSchema(getProceduresSchema)
  .action(async ({ parsedInput: { headquartersId }, ctx: { user } }) => {
    return useCases.procedures.getProcedures({ headquartersId }, user);
  });
