-- Create functions for calculating safety indicators

-- Function to calculate Frequency Index (Índice de Frecuencia)
-- Formula: (Number of accidents with incapacity * 1,000,000) / Total hours worked
CREATE OR REPLACE FUNCTION calculate_frequency_index(
    start_date DATE,
    end_date DATE,
    total_hours_worked INTEGER DEFAULT NULL
) RETURNS DECIMAL(10,2) AS $$
DECLARE
    accidents_with_incapacity INTEGER;
    estimated_hours INTEGER;
    total_employees INTEGER;
    working_days INTEGER;
BEGIN
    -- Count accidents with incapacity in the period
    SELECT COUNT(*)
    INTO accidents_with_incapacity
    FROM accidents
    WHERE fecha_accidente::date BETWEEN start_date AND end_date
    AND tiene_incapacidad = true;
    
    -- If total_hours_worked is not provided, estimate it
    IF total_hours_worked IS NULL THEN
        -- Get total active employees (assuming 8 hours/day, 5 days/week)
        SELECT COUNT(*) INTO total_employees FROM employees;
        
        -- Calculate working days between dates (excluding weekends)
        SELECT COUNT(*)
        INTO working_days
        FROM generate_series(start_date, end_date, '1 day'::interval) AS date_series
        WHERE EXTRACT(dow FROM date_series) BETWEEN 1 AND 5;
        
        estimated_hours := total_employees * working_days * 8;
    ELSE
        estimated_hours := total_hours_worked;
    END IF;
    
    -- Calculate frequency index
    IF estimated_hours > 0 THEN
        RETURN ROUND((accidents_with_incapacity * 1000000.0) / estimated_hours, 2);
    ELSE
        RETURN 0;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate Severity Index (Índice de Severidad)
-- Formula: (Total days lost * 1,000,000) / Total hours worked
CREATE OR REPLACE FUNCTION calculate_severity_index(
    start_date DATE,
    end_date DATE,
    total_hours_worked INTEGER DEFAULT NULL
) RETURNS DECIMAL(10,2) AS $$
DECLARE
    total_days_lost INTEGER;
    estimated_hours INTEGER;
    total_employees INTEGER;
    working_days INTEGER;
BEGIN
    -- Sum total days lost in the period
    SELECT COALESCE(SUM(dias_incapacidad), 0)
    INTO total_days_lost
    FROM accidents
    WHERE fecha_accidente::date BETWEEN start_date AND end_date;
    
    -- If total_hours_worked is not provided, estimate it
    IF total_hours_worked IS NULL THEN
        SELECT COUNT(*) INTO total_employees FROM employees;
        
        SELECT COUNT(*)
        INTO working_days
        FROM generate_series(start_date, end_date, '1 day'::interval) AS date_series
        WHERE EXTRACT(dow FROM date_series) BETWEEN 1 AND 5;
        
        estimated_hours := total_employees * working_days * 8;
    ELSE
        estimated_hours := total_hours_worked;
    END IF;
    
    -- Calculate severity index
    IF estimated_hours > 0 THEN
        RETURN ROUND((total_days_lost * 1000000.0) / estimated_hours, 2);
    ELSE
        RETURN 0;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate Accident Rate (Tasa de Accidentalidad)
-- Formula: (Total accidents * 100) / Total employees
CREATE OR REPLACE FUNCTION calculate_accident_rate(
    start_date DATE,
    end_date DATE
) RETURNS DECIMAL(10,2) AS $$
DECLARE
    total_accidents INTEGER;
    total_employees INTEGER;
BEGIN
    -- Count total accidents in the period
    SELECT COUNT(*)
    INTO total_accidents
    FROM accidents
    WHERE fecha_accidente::date BETWEEN start_date AND end_date;
    
    -- Get total employees
    SELECT COUNT(*) INTO total_employees FROM employees;
    
    -- Calculate accident rate
    IF total_employees > 0 THEN
        RETURN ROUND((total_accidents * 100.0) / total_employees, 2);
    ELSE
        RETURN 0;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create views for common reporting queries
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
    e.cpt,
    e.municipio,
    e.sexo,
    -- Calculate age at time of accident
    EXTRACT(YEAR FROM AGE(a.fecha_accidente, e.fecha_de_nacimiento)) as edad_al_accidente,
    -- Calculate days since accident
    (CURRENT_DATE - a.fecha_accidente::date) as dias_desde_accidente
FROM accidents a
JOIN employees e ON a.employee_id = e.id;

-- Create view for monthly accident statistics
CREATE VIEW monthly_accident_stats AS
SELECT 
    EXTRACT(YEAR FROM fecha_accidente) as año,
    EXTRACT(MONTH FROM fecha_accidente) as mes,
    COUNT(*) as total_accidentes,
    COUNT(CASE WHEN tiene_incapacidad = true THEN 1 END) as accidentes_con_incapacidad,
    COUNT(CASE WHEN severidad = 'LEVE' THEN 1 END) as accidentes_leves,
    COUNT(CASE WHEN severidad = 'GRAVE' THEN 1 END) as accidentes_graves,
    COUNT(CASE WHEN severidad = 'MORTAL' THEN 1 END) as accidentes_mortales,
    SUM(dias_incapacidad) as total_dias_incapacidad,
    AVG(dias_incapacidad) as promedio_dias_incapacidad
FROM accidents
GROUP BY EXTRACT(YEAR FROM fecha_accidente), EXTRACT(MONTH FROM fecha_accidente)
ORDER BY año DESC, mes DESC;

-- Create view for risk factor analysis
CREATE VIEW risk_factor_analysis AS
SELECT 
    factor_riesgo,
    COUNT(*) as total_accidentes,
    COUNT(CASE WHEN tiene_incapacidad = true THEN 1 END) as con_incapacidad,
    ROUND(COUNT(CASE WHEN tiene_incapacidad = true THEN 1 END) * 100.0 / COUNT(*), 2) as porcentaje_incapacidad,
    SUM(dias_incapacidad) as total_dias_incapacidad,
    AVG(dias_incapacidad) as promedio_dias_incapacidad,
    COUNT(CASE WHEN severidad = 'GRAVE' OR severidad = 'MORTAL' THEN 1 END) as accidentes_severos
FROM accidents
GROUP BY factor_riesgo
ORDER BY total_accidentes DESC;
