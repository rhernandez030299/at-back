-- Migration to update employees table to use foreign key to ciudades instead of text for municipio

-- First, add the new column
ALTER TABLE employees ADD COLUMN municipio_id UUID;

-- Update existing records to match with ciudades table
-- This will try to match by name, but some might not match exactly
UPDATE employees SET municipio_id = (
    SELECT c.id 
    FROM ciudades c 
    WHERE UPPER(c.nombre) = UPPER(employees.municipio)
    LIMIT 1
);

-- For records that didn't match, let's try a more flexible approach
UPDATE employees SET municipio_id = (
    SELECT c.id 
    FROM ciudades c 
    WHERE UPPER(c.nombre) LIKE UPPER('%' || employees.municipio || '%')
    LIMIT 1
) WHERE municipio_id IS NULL;

-- If there are still unmatched records, set them to a default city (Ibagué)
UPDATE employees SET municipio_id = (
    SELECT id FROM ciudades WHERE codigo = '73001' LIMIT 1
) WHERE municipio_id IS NULL;

-- Make the new column NOT NULL after data migration
ALTER TABLE employees ALTER COLUMN municipio_id SET NOT NULL;

-- Add foreign key constraint
ALTER TABLE employees ADD CONSTRAINT fk_employees_municipio 
    FOREIGN KEY (municipio_id) REFERENCES ciudades(id);

-- Create index for better performance
CREATE INDEX idx_employees_municipio_id ON employees(municipio_id);

-- First drop dependent views
DROP VIEW IF EXISTS accident_summary_view CASCADE;

-- Drop the old municipio column
ALTER TABLE employees DROP COLUMN municipio;

-- Recreate the accident_summary_view with updated structure
CREATE VIEW accident_summary_view AS
SELECT 
    a.id,
    a.fecha_accidente,
    a.tipo_accidente,
    a.severidad,
    a.factor_riesgo,
    a.tipo_lesion,
    a.parte_cuerpo_afectada,
    a.tiene_incapacidad,
    a.dias_incapacidad,
    a.estado,
    a.area,
    a.cargo,
    a.turno,
    a.servicio_a_prestar,
    a.agente_del_accidente,
    a.mecanismo_del_accidente,
    a.situacion_del_accidente,
    CONCAT(e.nombres, ' ', e.apellido) as nombre_completo,
    e.documento_no,
    e.centro_trabajo_id,
    ct.codigo as cpt_codigo,
    ct.nombre as cpt_nombre,
    ct.descripcion as cpt_descripcion,
    e.municipio_id,
    c.codigo as municipio_codigo,
    c.nombre as municipio_nombre,
    d.codigo as departamento_codigo,
    d.nombre as departamento_nombre,
    e.sexo,
    -- Calculate age at time of accident
    EXTRACT(YEAR FROM AGE(a.fecha_accidente, e.fecha_de_nacimiento)) as edad_al_accidente,
    -- Calculate days since accident
    (CURRENT_DATE - a.fecha_accidente::date) as dias_desde_accidente
FROM accidents a
JOIN employees e ON a.employee_id = e.id
JOIN centros_trabajo ct ON e.centro_trabajo_id = ct.id
LEFT JOIN ciudades c ON e.municipio_id = c.id
LEFT JOIN departamentos d ON c.departamento_id = d.id;
