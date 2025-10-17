-- Crear el ENUM para tipos de documento
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_employees_document_type') THEN
    CREATE TYPE enum_employees_document_type AS ENUM ('dni', 'pasaporte');
  END IF;
END$$;

-- Tabla tabla employees
CREATE TABLE IF NOT EXISTS employees (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name      VARCHAR(100) NOT NULL,
  last_name       VARCHAR(100) NOT NULL,
  document_number VARCHAR(100) NOT NULL,
  document_type   enum_employees_document_type NOT NULL DEFAULT 'dni',
  salary          NUMERIC(12,2),
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  hired_at        TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);
