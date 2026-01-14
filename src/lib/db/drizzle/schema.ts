import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  role: text("role", { enum: ["master", "slave"] }).notNull(),
  age: integer("age"),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

export const headquarters = sqliteTable("headquarters", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const userHeadquarters = sqliteTable(
  "user_headquarters",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    headquartersId: text("headquarters_id").notNull(), // Foreign key references could be added if we enforce strict relational integrity
    role: text("role").notNull(), // 'master' | 'slave'
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.headquartersId] }),
    };
  }
);

export const procedures = sqliteTable("procedures", {
  id: text("id").primaryKey(),
  headquartersId: text("headquarters_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  fields: text("fields", { mode: "json" }).notNull(), // Storing FormField[] as JSON
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id),
});

export const requests = sqliteTable("requests", {
  id: text("id").primaryKey(),
  headquartersId: text("headquarters_id").notNull(),
  procedureId: text("procedure_id").notNull(),
  procedureName: text("procedure_name").notNull(),
  applicantId: text("applicant_id")
    .notNull()
    .references(() => user.id),
  applicantName: text("applicant_name").notNull(),
  status: text("status").notNull(), // 'pending' | 'in_review' | 'approved' | 'rejected'
  data: text("data", { mode: "json" }).notNull(), // Record<string, unknown>
  feedback: text("feedback"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey(),
  headquartersId: text("headquarters_id").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  priority: text("priority").notNull(), // 'low' | 'medium' | 'high'
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id),
});
