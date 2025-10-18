-- Elimina tabla
DROP TABLE IF EXISTS employees CASCADE;

-- Elimina tipo ENUM
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_employees_document_type') THEN
    DROP TYPE enum_employees_document_type;
  END IF;
END$$;
