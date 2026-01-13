import Database from 'better-sqlite3';

const db = new Database('sqlite.db');

const schema = [
  `CREATE TABLE IF NOT EXISTS user (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    email_verified INTEGER NOT NULL,
    image TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    role TEXT,
    age INTEGER
  )`,
  `CREATE TABLE IF NOT EXISTS session (
    id TEXT PRIMARY KEY,
    expires_at INTEGER NOT NULL,
    token TEXT NOT NULL UNIQUE,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    user_id TEXT NOT NULL REFERENCES user(id)
  )`,
  `CREATE TABLE IF NOT EXISTS account (
     id TEXT PRIMARY KEY,
     account_id TEXT NOT NULL,
     provider_id TEXT NOT NULL,
     user_id TEXT NOT NULL REFERENCES user(id),
     access_token TEXT,
     refresh_token TEXT,
     id_token TEXT,
     access_token_expires_at INTEGER,
     refresh_token_expires_at INTEGER,
     scope TEXT,
     password TEXT,
     created_at INTEGER NOT NULL,
     updated_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS verification (
    id TEXT PRIMARY KEY,
    identifier TEXT NOT NULL,
    value TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    created_at INTEGER,
    updated_at INTEGER
  )`,
  `CREATE TABLE IF NOT EXISTS headquarters (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS user_headquarters (
    user_id TEXT NOT NULL REFERENCES user(id),
    headquarters_id TEXT NOT NULL,
    role TEXT NOT NULL,
    PRIMARY KEY (user_id, headquarters_id)
  )`,
  `CREATE TABLE IF NOT EXISTS procedures (
    id TEXT PRIMARY KEY,
    headquarters_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    fields TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    created_by TEXT NOT NULL REFERENCES user(id)
  )`,
  `CREATE TABLE IF NOT EXISTS requests (
    id TEXT PRIMARY KEY,
    headquarters_id TEXT NOT NULL,
    procedure_id TEXT NOT NULL,
    procedure_name TEXT NOT NULL,
    applicant_id TEXT NOT NULL REFERENCES user(id),
    applicant_name TEXT NOT NULL,
    status TEXT NOT NULL,
    data TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    headquarters_id TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    priority TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    created_by TEXT NOT NULL REFERENCES user(id)
  )`,
];

console.log('Creating SQLite tables...');
try {
  for (const statement of schema) {
    db.prepare(statement).run();
  }
  console.log('Tables created successfully.');
} catch (error) {
  console.error('Error creating tables:', error);
} finally {
  db.close();
}
