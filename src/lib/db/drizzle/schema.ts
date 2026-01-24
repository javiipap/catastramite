import {
  pgTable,
  text,
  integer,
  primaryKey,
  boolean,
  timestamp,
  json,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  userId: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  role: text("role", { enum: ["master", "slave"] }).notNull(),
  age: integer("age"),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.userId),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.userId),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const headquarters = pgTable("headquarters", {
  headquartersId: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull(),
});

export const userHeadquarters = pgTable(
  "user_headquarters",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.userId),
    headquartersId: text("headquarters_id").notNull(),
    role: text("role", { enum: ["master", "slave"] }).notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.headquartersId] }),
    };
  },
);

export const procedures = pgTable("procedures", {
  id: text("id").primaryKey(),
  headquartersId: text("headquarters_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  fields: json("fields").notNull(), // Storing FormField[] as JSON
  createdAt: timestamp("created_at").notNull(),
  createdBy: text("created_by")
    .notNull()
    .references(() => user.userId),
});

export const requests = pgTable("requests", {
  id: text("id").primaryKey(),
  headquartersId: text("headquarters_id").notNull(),
  procedureId: text("procedure_id").notNull(),
  procedureName: text("procedure_name").notNull(),
  applicantId: text("applicant_id")
    .notNull()
    .references(() => user.userId),
  applicantName: text("applicant_name").notNull(),
  status: text("status").notNull(), // 'pending' | 'in_review' | 'approved' | 'rejected'
  data: json("data").notNull(), // Record<string, unknown>
  feedback: text("feedback"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  headquartersId: text("headquarters_id").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  priority: text("priority").notNull(), // 'low' | 'medium' | 'high'
  createdAt: timestamp("created_at").notNull(),
  createdBy: text("created_by")
    .notNull()
    .references(() => user.userId),
});
