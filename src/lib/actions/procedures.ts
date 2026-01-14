"use server";

import { useCases } from "@/use-cases";
import type { Procedure } from "@/lib/schemas/procedures";
import { mutateMasterAction, slaveAction } from "@/lib/safe-action";
import {
  createProcedureSchema,
  getProceduresSchema,
} from "@/lib/schemas/procedures";

export const addProcedure = mutateMasterAction(
  createProcedureSchema,
  async ({ headquartersId, name, description, fields }, { user }) => {
    const newProcedure: Procedure = {
      procedureId: Date.now().toString(),
      headquartersId,
      name,
      description,
      fields: fields,
      createdAt: new Date(),
      createdBy: user.id,
    };

    return useCases.procedures.createProcedure(newProcedure, user);
  }
);

export const getProceduresAction = slaveAction
  .inputSchema(getProceduresSchema)
  .action(async ({ parsedInput: { headquartersId }, ctx: { user } }) => {
    return useCases.procedures.getProcedures({ headquartersId }, user);
  });
