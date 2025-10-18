-- Crear el ENUM para tipos de documento
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_employees_document_type') THEN
    CREATE TYPE enum_employees_document_type AS ENUM ('dni', 'pasaporte');
  END IF;
END$$;

-- Tabla tabla employees
CREATE TABLE IF NOT EXISTS employees (
  "id"             UUID PRIMARY KEY,
  "firstName"      VARCHAR(100) NOT NULL,
  "lastName"       VARCHAR(100) NOT NULL,
  "documentNumber" VARCHAR(100) NOT NULL,
  "documentType"   enum_employees_document_type NOT NULL DEFAULT 'dni',
  "salary"         NUMERIC(12,2),
  "isActive"       BOOLEAN NOT NULL DEFAULT TRUE,
  "hiredAt"        TIMESTAMPTZ,
  "createdAt"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "deletedAt"      TIMESTAMPTZ
);
