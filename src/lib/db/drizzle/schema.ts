import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';

export const headquarters = sqliteTable('headquarters', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const userHeadquarters = sqliteTable('user_headquarters', {
  userId: text('user_id').notNull(),
  headquartersId: text('headquarters_id').notNull(), // Foreign key references could be added if we enforce strict relational integrity
  role: text('role').notNull(), // 'master' | 'slave'
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.userId, table.headquartersId] }),
  };
});

export const procedures = sqliteTable('procedures', {
  id: text('id').primaryKey(),
  headquartersId: text('headquarters_id').notNull(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  fields: text('fields', { mode: 'json' }).notNull(), // Storing FormField[] as JSON
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  createdBy: text('created_by').notNull(),
});

export const requests = sqliteTable('requests', {
  id: text('id').primaryKey(),
  headquartersId: text('headquarters_id').notNull(),
  procedureId: text('procedure_id').notNull(),
  procedureName: text('procedure_name').notNull(),
  applicantId: text('applicant_id').notNull(),
  applicantName: text('applicant_name').notNull(),
  status: text('status').notNull(), // 'pending' | 'in_review' | 'approved' | 'rejected'
  data: text('data', { mode: 'json' }).notNull(), // Record<string, unknown>
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  headquartersId: text('headquarters_id').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  priority: text('priority').notNull(), // 'low' | 'medium' | 'high'
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  createdBy: text('created_by').notNull(),
});
