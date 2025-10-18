-- Crear tabla requests
CREATE TABLE IF NOT EXISTS requests (
  "id"            UUID PRIMARY KEY,
  "employeeId"    UUID NOT NULL,
  "description"   VARCHAR(500) NOT NULL,
  "summary"       VARCHAR(200) NOT NULL,
  "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "deletedAt"     TIMESTAMPTZ,

  CONSTRAINT fk_requests_employee_employeeId
    FOREIGN KEY ("employeeId")
    REFERENCES employees(id)
    ON DELETE CASCADE
);
