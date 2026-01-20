# Database Architectures

This document outlines the schema designs for both DynamoDB (Single Table Design) and SQL (Relational) implementations used in the Catastramite application.

---

## 1. DynamoDB Schema (Single Table Design)

**Table Name**: `Catastramite` (Defaut)
**Partition Key (PK)**: String
**Sort Key (SK)**: String
**GSI1**: `GSI1PK` (PK), `GSI1SK` (SK)

### Access Patterns & Entity Map

| Entity               | PK Pattern  | SK Pattern   | GSI1PK          | GSI1SK               | Attributes                                                                     |
| -------------------- | ----------- | ------------ | --------------- | -------------------- | ------------------------------------------------------------------------------ |
| **Headquarters**     | `HQ#{id}`   | `METADATA`   | `ALL_HQS`       | `HQ#{id}`            | `name`, `description`, `createdAt`                                             |
| **UserHeadquarters** | `USER#{id}` | `HQ#{hqId}`  | `HQ#{hqId}`     | `USER#{id}`          | `role`                                                                         |
| **Procedure**        | `HQ#{hqId}` | `PROC#{id}`  | -               | -                    | `name`, `description`, `fields` (Map/JSON), `createdAt`, `createdBy`           |
| **Request**          | `HQ#{hqId}` | `REQ#{id}`   | `USER#{userId}` | `HQ#{hqId}#REQ#{id}` | `procedureId`, `applicantId`, `status`, `data` (Map), `createdAt`, `updatedAt` |
| **Notification**     | `HQ#{hqId}` | `NOTIF#{id}` | -               | -                    | `title`, `message`, `priority`, `createdAt`, `createdBy`                       |

---

## 2. SQL Schema (Relational)

The SQL implementation uses normalized tables. The types below are generic (Text, Integer, Timestamp/ISO String).

### Tables

#### `headquarters`

| Column        | Type      | Constraints | Description              |
| ------------- | --------- | ----------- | ------------------------ |
| `id`          | TEXT      | PK          | Unique identifier        |
| `name`        | TEXT      | NOT NULL    | Name of the headquarters |
| `description` | TEXT      |             | Optional description     |
| `created_at`  | TIMESTAMP | NOT NULL    | Creation timestamp       |

#### `user_headquarters`

| Column            | Type | Constraints | Description                   |
| ----------------- | ---- | ----------- | ----------------------------- |
| `user_id`         | TEXT | PK, FK      | Reference to User ID          |
| `headquarters_id` | TEXT | PK, FK      | Reference to Headquarters ID  |
| `role`            | TEXT | NOT NULL    | User role ('master', 'slave') |

_Primary Key is Composite: (`user_id`, `headquarters_id`)_

#### `procedures`

| Column            | Type      | Constraints  | Description               |
| ----------------- | --------- | ------------ | ------------------------- |
| `id`              | TEXT      | PK           | Unique identifier         |
| `headquarters_id` | TEXT      | FK, NOT NULL | Reference to Headquarters |
| `name`            | TEXT      | NOT NULL     | Procedure name            |
| `description`     | TEXT      | NOT NULL     | Procedure description     |
| `fields`          | JSON/TEXT | NOT NULL     | Form fields definition    |
| `created_at`      | TIMESTAMP | NOT NULL     | Creation timestamp        |
| `created_by`      | TEXT      | NOT NULL     | ID of creator             |

#### `requests`

| Column            | Type      | Constraints  | Description                          |
| ----------------- | --------- | ------------ | ------------------------------------ |
| `id`              | TEXT      | PK           | Unique identifier                    |
| `headquarters_id` | TEXT      | FK, NOT NULL | Reference to Headquarters            |
| `procedure_id`    | TEXT      | FK, NOT NULL | Reference to Procedure               |
| `procedure_name`  | TEXT      | NOT NULL     | Cached procedure name                |
| `applicant_id`    | TEXT      | FK, NOT NULL | Reference to User (Applicant)        |
| `applicant_name`  | TEXT      | NOT NULL     | Cached applicant name                |
| `status`          | TEXT      | NOT NULL     | Status ('pending', 'approved', etc.) |
| `data`            | JSON/TEXT | NOT NULL     | Form submission data                 |
| `created_at`      | TIMESTAMP | NOT NULL     | Creation timestamp                   |
| `updated_at`      | TIMESTAMP | NOT NULL     | Last update timestamp                |

#### `notifications`

| Column            | Type      | Constraints  | Description                        |
| ----------------- | --------- | ------------ | ---------------------------------- |
| `id`              | TEXT      | PK           | Unique identifier                  |
| `headquarters_id` | TEXT      | FK, NOT NULL | Reference to Headquarters          |
| `title`           | TEXT      | NOT NULL     | Notification title                 |
| `message`         | TEXT      | NOT NULL     | Notification body                  |
| `priority`        | TEXT      | NOT NULL     | Priority ('low', 'medium', 'high') |
| `created_at`      | TIMESTAMP | NOT NULL     | Creation timestamp                 |
| `created_by`      | TEXT      | NOT NULL     | ID of creator                      |
