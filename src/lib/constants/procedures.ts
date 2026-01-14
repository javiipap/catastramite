import { FormField } from "../schemas/procedures";

export const DEFAULT_PROCEDURE_TEMPLATE = {
  name: "Instancia General",
  description:
    "Trámite para presentación de escritos, solicitudes y comunicaciones generales.",
  fields: [
    {
      id: "expone",
      name: "Expone",
      type: "textarea",
      required: true,
    },
    {
      id: "solicita",
      name: "Solicita",
      type: "textarea",
      required: true,
    },
  ] as FormField[],
};
