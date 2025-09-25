-- Create enum types
CREATE TYPE workplace_type AS ENUM (
    'FISCALIA_GENERAL_DE_LA_NACION',
    'DISPENSARIO_MEDICO_DE_IBAGUE',
    'EMAB_ADMINISTRATIVO',
    'HOSPITAL_PSIQUIATRICO_SAN_CAMILO'
);

CREATE TYPE gender_type AS ENUM ('M', 'F');

-- Create employees table
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombres VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    documento_no VARCHAR(50) NOT NULL UNIQUE,
    fecha_de_nacimiento DATE NOT NULL,
    municipio VARCHAR(100) NOT NULL,
    cpt workplace_type NOT NULL,
    sexo gender_type NOT NULL,
    salario DECIMAL(12, 2) NOT NULL,
    fecha_de_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better query performance
CREATE INDEX idx_employees_documento ON employees(documento_no);
CREATE INDEX idx_employees_cpt ON employees(cpt);
CREATE INDEX idx_employees_fecha_ingreso ON employees(fecha_de_ingreso);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_employees_updated_at 
    BEFORE UPDATE ON employees 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
