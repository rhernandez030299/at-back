-- Create enum types for accident management
CREATE TYPE severity_type AS ENUM ('LEVE', 'GRAVE', 'MORTAL');
CREATE TYPE accident_type AS ENUM ('TRABAJO', 'TRAYECTO', 'ENFERMEDAD_LABORAL');
CREATE TYPE body_part_type AS ENUM (
    'CABEZA', 'CUELLO', 'TORSO', 'ESPALDA', 'BRAZO_DERECHO', 'BRAZO_IZQUIERDO',
    'MANO_DERECHA', 'MANO_IZQUIERDA', 'PIERNA_DERECHA', 'PIERNA_IZQUIERDA',
    'PIE_DERECHO', 'PIE_IZQUIERDO', 'MULTIPLE', 'OTRO'
);
CREATE TYPE injury_type AS ENUM (
    'CORTE', 'GOLPE', 'FRACTURA', 'QUEMADURA', 'CONTUSION', 'ESGUINCE',
    'LUXACION', 'HERIDA', 'AMPUTACION', 'INTOXICACION', 'ASFIXIA',
    'ELECTROCUCION', 'OTRO'
);
CREATE TYPE risk_factor_type AS ENUM (
    'MECANICO', 'FISICO', 'QUIMICO', 'BIOLOGICO', 'PSICOSOCIAL',
    'ERGONOMICO', 'AMBIENTAL', 'COMPORTAMENTAL', 'ORGANIZACIONAL'
);
CREATE TYPE incapacity_type AS ENUM ('TEMPORAL', 'PERMANENTE_PARCIAL', 'PERMANENTE_TOTAL', 'SIN_INCAPACIDAD');

create type turno_type as enum ('DIURNO', 'NOCTURNO');

-- Create accidents table
CREATE TABLE accidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    
    -- Basic accident information
    fecha_accidente TIMESTAMP NOT NULL,
    lugar_accidente VARCHAR(255) NOT NULL,
    severidad severity_type NOT NULL,
    tipo_accidente accident_type NOT NULL,
    area VARCHAR(255) NOT NULL,
    cargo VARCHAR(255) NOT NULL,
    turno turno_type NOT NULL,
    servicio_a_prestar VARCHAR(255) NOT NULL,
    factor_riesgo risk_factor_type NOT NULL,
    descripcion_accidente TEXT NOT NULL,
    tipo_lesion injury_type NOT NULL,
    agente_del_accidente VARCHAR(255) NOT NULL,
    mecanismo_del_accidente VARCHAR(255) NOT NULL,
    parte_cuerpo_afectada body_part_type NOT NULL,
    situacion_del_accidente TEXT NOT NULL,
    tiene_incapacidad BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_inicio_incapacidad DATE,
    fecha_fin_incapacidad DATE,
    dias_incapacidad INTEGER DEFAULT 0,

    -- Investigation
    fecha_investigacion DATE,
    descripcion_investigacion TEXT,
    fecha_ejecucion_acciones DATE,
    fecha_verificacion_acciones DATE,    

    -- Status and follow-up
    estado VARCHAR(50) DEFAULT 'ABIERTO', -- ABIERTO, EN_INVESTIGACION, CERRADO
    requiere_seguimiento BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create accident follow-up table
CREATE TABLE accident_followups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    accident_id UUID NOT NULL REFERENCES accidents(id) ON DELETE CASCADE,
    
    -- Follow-up details
    fecha_seguimiento DATE NOT NULL,
    tipo_seguimiento VARCHAR(100) NOT NULL, -- MEDICO, ADMINISTRATIVO, LEGAL, PREVENTIVO
    descripcion TEXT NOT NULL,
    responsable VARCHAR(255) NOT NULL,
    
    -- Medical follow-up specific
    estado_salud VARCHAR(100), -- MEJORANDO, ESTABLE, EMPEORANDO, RECUPERADO
    porcentaje_recuperacion INTEGER CHECK (porcentaje_recuperacion >= 0 AND porcentaje_recuperacion <= 100),
    restricciones_laborales TEXT,
    fecha_probable_reintegro DATE,
    
    -- Administrative follow-up
    documentos_pendientes TEXT,
    gestiones_realizadas TEXT,
    proxima_accion TEXT,
    fecha_proxima_accion DATE,
    
    -- Status
    seguimiento_completado BOOLEAN DEFAULT FALSE,
    observaciones TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create accident evidence table
CREATE TABLE accident_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    accident_id UUID NOT NULL REFERENCES accidents(id) ON DELETE CASCADE,
    tipo_evidencia VARCHAR(50) NOT NULL, -- FOTO, VIDEO, DOCUMENTO, OTRO
    nombre_archivo VARCHAR(255),
    ruta_archivo VARCHAR(500),
    descripcion TEXT,
    fecha_captura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    capturado_por VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_accidents_employee_id ON accidents(employee_id);
CREATE INDEX idx_accidents_fecha ON accidents(fecha_accidente);
CREATE INDEX idx_accidents_tipo ON accidents(tipo_accidente);
CREATE INDEX idx_accidents_severidad ON accidents(severidad);
CREATE INDEX idx_accidents_factor_riesgo ON accidents(factor_riesgo);
CREATE INDEX idx_accidents_tiene_incapacidad ON accidents(tiene_incapacidad);
CREATE INDEX idx_accidents_estado ON accidents(estado);
CREATE INDEX idx_accidents_cpt ON accidents(employee_id); -- For joining with employees table

CREATE INDEX idx_followups_accident_id ON accident_followups(accident_id);
CREATE INDEX idx_followups_fecha ON accident_followups(fecha_seguimiento);
CREATE INDEX idx_followups_tipo ON accident_followups(tipo_seguimiento);

CREATE INDEX idx_evidence_accident_id ON accident_evidence(accident_id);

-- Create triggers for automatic updated_at
CREATE TRIGGER update_accidents_updated_at 
    BEFORE UPDATE ON accidents 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accident_followups_updated_at 
    BEFORE UPDATE ON accident_followups 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
