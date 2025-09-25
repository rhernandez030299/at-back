-- Migration to update employees table to use foreign key to centros_trabajo instead of enum

-- First, add the new column
ALTER TABLE employees ADD COLUMN centro_trabajo_id UUID;

-- Update existing records to match with centros_trabajo table
UPDATE employees SET centro_trabajo_id = (
    SELECT id FROM centros_trabajo 
    WHERE centros_trabajo.nombre = employees.cpt::text
);

-- Make the new column NOT NULL after data migration
ALTER TABLE employees ALTER COLUMN centro_trabajo_id SET NOT NULL;

-- Add foreign key constraint
ALTER TABLE employees ADD CONSTRAINT fk_employees_centro_trabajo 
    FOREIGN KEY (centro_trabajo_id) REFERENCES centros_trabajo(id);

-- Create index for better performance
CREATE INDEX idx_employees_centro_trabajo_id ON employees(centro_trabajo_id);

-- First drop dependent views
DROP VIEW IF EXISTS accident_summary_view CASCADE;

-- Drop the old cpt column and enum type
ALTER TABLE employees DROP COLUMN cpt;
DROP TYPE workplace_type;

-- Update existing indexes that referenced cpt
DROP INDEX IF EXISTS idx_employees_cpt;

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
    e.municipio,
    e.sexo,
    -- Calculate age at time of accident
    EXTRACT(YEAR FROM AGE(a.fecha_accidente, e.fecha_de_nacimiento)) as edad_al_accidente,
    -- Calculate days since accident
    (CURRENT_DATE - a.fecha_accidente::date) as dias_desde_accidente
FROM accidents a
JOIN employees e ON a.employee_id = e.id
JOIN centros_trabajo ct ON e.centro_trabajo_id = ct.id;
