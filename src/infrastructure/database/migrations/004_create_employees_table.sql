-- Create enum types
CREATE TYPE tipo_genero AS ENUM ('M', 'F');

-- Create empleados table
CREATE TABLE empleados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombres VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255) NOT NULL,
    numero_documento VARCHAR(50) NOT NULL UNIQUE,
    fecha_nacimiento DATE NOT NULL,
    ciudad_id UUID NOT NULL REFERENCES ciudades(id),
    centro_trabajo_id UUID NOT NULL REFERENCES centros_trabajo(id),
    sexo tipo_genero NOT NULL,
    salario DECIMAL(12, 2) NOT NULL,
    fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better query performance
CREATE INDEX idx_empleados_documento ON empleados(numero_documento);
CREATE INDEX idx_empleados_ciudad_id ON empleados(ciudad_id);
CREATE INDEX idx_empleados_centro_trabajo_id ON empleados(centro_trabajo_id);
CREATE INDEX idx_empleados_fecha_ingreso ON empleados(fecha_ingreso);



-- Create trigger to automatically update actualizado_en
CREATE TRIGGER actualizar_empleados_actualizado_en 
    BEFORE UPDATE ON empleados 
    FOR EACH ROW 
    EXECUTE FUNCTION actualizar_columna_actualizado_en();

-- Insert 10 sample empleados
INSERT INTO empleados (nombres, apellidos, numero_documento, fecha_nacimiento, ciudad_id, centro_trabajo_id, sexo, salario) VALUES
    ('María Elena', 'García López', '12345678', '1985-03-15', 
     (SELECT id FROM ciudades WHERE codigo = '73001'), -- IBAGUÉ
     (SELECT id FROM centros_trabajo WHERE codigo = 'FGN'), -- FISCALIA_GENERAL_DE_LA_NACION
     'F', 2500000.00),
    
    ('Carlos Andrés', 'Martínez Rodríguez', '23456789', '1990-07-22', 
     (SELECT id FROM ciudades WHERE codigo = '73001'), -- IBAGUÉ
     (SELECT id FROM centros_trabajo WHERE codigo = 'DMI'), -- DISPENSARIO_MEDICO_DE_IBAGUE
     'M', 3200000.00),
    
    ('Ana Lucía', 'Hernández Silva', '34567890', '1988-11-08', 
     (SELECT id FROM ciudades WHERE codigo = '73268'), -- ESPINAL
     (SELECT id FROM centros_trabajo WHERE codigo = 'EMAB'), -- EMAB_ADMINISTRATIVO
     'F', 2800000.00),
    
    ('José Miguel', 'Torres Vargas', '45678901', '1982-05-30', 
     (SELECT id FROM ciudades WHERE codigo = '73449'), -- MELGAR
     (SELECT id FROM centros_trabajo WHERE codigo = 'HPSC'), -- HOSPITAL_PSIQUIATRICO_SAN_CAMILO
     'M', 4500000.00),
    
    ('Laura Patricia', 'Ramírez Gómez', '56789012', '1993-09-12', 
     (SELECT id FROM ciudades WHERE codigo = '73275'), -- FLANDES
     (SELECT id FROM centros_trabajo WHERE codigo = 'FGN'), -- FISCALIA_GENERAL_DE_LA_NACION
     'F', 2700000.00),
    
    ('Diego Fernando', 'Morales Castro', '67890123', '1987-01-25', 
     (SELECT id FROM ciudades WHERE codigo = '73349'), -- HONDA
     (SELECT id FROM centros_trabajo WHERE codigo = 'DMI'), -- DISPENSARIO_MEDICO_DE_IBAGUE
     'M', 3500000.00),
    
    ('Sandra Milena', 'Jiménez Pérez', '78901234', '1991-12-03', 
     (SELECT id FROM ciudades WHERE codigo = '73411'), -- LÍBANO
     (SELECT id FROM centros_trabajo WHERE codigo = 'EMAB'), -- EMAB_ADMINISTRATIVO
     'F', 2900000.00),
    
    ('Alejandro', 'Ruiz Mendoza', '89012345', '1984-08-17', 
     (SELECT id FROM ciudades WHERE codigo = '73443'), -- MARIQUITA
     (SELECT id FROM centros_trabajo WHERE codigo = 'HPSC'), -- HOSPITAL_PSIQUIATRICO_SAN_CAMILO
     'M', 4200000.00),
    
    ('Claudia Esperanza', 'Vásquez Ortiz', '90123456', '1989-04-28', 
     (SELECT id FROM ciudades WHERE codigo = '73671'), -- SALDAÑA
     (SELECT id FROM centros_trabajo WHERE codigo = 'FGN'), -- FISCALIA_GENERAL_DE_LA_NACION
     'F', 3100000.00),
    
    ('Roberto Carlos', 'Delgado Rojas', '01234567', '1986-10-14', 
     (SELECT id FROM ciudades WHERE codigo = '73861'), -- VENADILLO
     (SELECT id FROM centros_trabajo WHERE codigo = 'DMI'), -- DISPENSARIO_MEDICO_DE_IBAGUE
     'M', 3800000.00);
