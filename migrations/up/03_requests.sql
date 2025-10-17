-- Crear tabla requests
CREATE TABLE IF NOT EXISTS requests (
  id           UUID PRIMARY KEY,
  employee_id  UUID NOT NULL,
  description  VARCHAR(500) NOT NULL,
  summary      VARCHAR(200) NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at   TIMESTAMPTZ,

  CONSTRAINT fk_requests_employee
    FOREIGN KEY (employee_id)
    REFERENCES employees(id)
    ON DELETE CASCADE
);
