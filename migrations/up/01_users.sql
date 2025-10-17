-- Crear tipo ENUM para roles
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
    CREATE TYPE user_role_enum AS ENUM ('employee', 'admin');
  END IF;
END$$;

-- Crear tabla users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role user_role_enum NOT NULL DEFAULT 'employee',
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  deletedAt TIMESTAMP WITH TIME ZONE,

  CONSTRAINT chk_role_valid CHECK (role IN ('employee', 'admin'))
);
