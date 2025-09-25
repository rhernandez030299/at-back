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
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

-- Create trigger for automatic actualizado_en
CREATE TRIGGER actualizar_centros_trabajo_actualizado_en 
    BEFORE UPDATE ON centros_trabajo 
    FOR EACH ROW 
    EXECUTE FUNCTION actualizar_columna_actualizado_en();
