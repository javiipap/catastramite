import { object, string, optional, array, number } from "valibot";
import { createSubjects } from "@openauthjs/openauth/subject";

export const subjects = createSubjects({
  user: object({
    userId: string(),
    email: string(),
    name: optional(string()),
    picture: optional(string()),
    age: optional(number()),
  }),
});
