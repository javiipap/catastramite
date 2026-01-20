import { object, string, optional, array } from "valibot";
import { createSubjects } from "@openauthjs/openauth/subject";

export const subjects = createSubjects({
  user: object({
    email: string(),
    name: optional(string()),
    picture: optional(string()),
    headquarters: array(
      object({
        headquartersId: string(),
        role: string(),
      }),
    ),
  }),
});
