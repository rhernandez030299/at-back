-- Create centros_trabajo table
CREATE TABLE centros_trabajo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(10) NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    direccion VARCHAR(500),
    telefono VARCHAR(20),
    email VARCHAR(100),
    responsable VARCHAR(255),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial data based on existing CPT enum values
INSERT INTO centros_trabajo (codigo, nombre, descripcion) VALUES 
('FGN', 'FISCALIA_GENERAL_DE_LA_NACION', 'Fiscalía General de la Nación'),
('DMI', 'DISPENSARIO_MEDICO_DE_IBAGUE', 'Dispensario Médico de Ibagué'),
('EMAB', 'EMAB_ADMINISTRATIVO', 'EMAB Administrativo'),
('HPSC', 'HOSPITAL_PSIQUIATRICO_SAN_CAMILO', 'Hospital Psiquiátrico San Camilo');

-- Create indexes
CREATE INDEX idx_centros_trabajo_codigo ON centros_trabajo(codigo);
CREATE INDEX idx_centros_trabajo_activo ON centros_trabajo(activo);

-- Create trigger for automatic updated_at
CREATE TRIGGER update_centros_trabajo_updated_at 
    BEFORE UPDATE ON centros_trabajo 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create view for active centers
CREATE VIEW centros_trabajo_activos AS
SELECT 
    id,
    codigo,
    nombre,
    descripcion,
    direccion,
    telefono,
    email,
    responsable,
    created_at,
    updated_at
FROM centros_trabajo 
WHERE activo = TRUE
ORDER BY nombre;
