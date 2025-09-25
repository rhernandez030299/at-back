-- Create enum types for accident management
CREATE TYPE tipo_severidad AS ENUM ('Leve', 'Severo', 'Grave', 'Mortal');
CREATE TYPE tipo_accidente AS ENUM ('Propios del trabajo', 'Violencia', 'Tránsito', 'Deportivo', 'Recreativo o cultural');

CREATE TYPE tipo_turno AS ENUM ('Diurno', 'Nocturno');

-- Create areas table
CREATE TABLE areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default areas
INSERT INTO areas (nombre, descripcion) VALUES
    ('Producción', 'Área de producción y manufactura'),
    ('Administración', 'Área administrativa y oficinas'),
    ('Mantenimiento', 'Área de mantenimiento y reparaciones'),
    ('Almacén', 'Área de almacenamiento y logística'),
    ('Seguridad', 'Área de seguridad y vigilancia'),
    ('Calidad', 'Área de control de calidad'),
    ('Recursos Humanos', 'Área de gestión de recursos humanos'),
    ('Sistemas', 'Área de sistemas y tecnología'),
    ('Ventas', 'Área comercial y de ventas'),
    ('Operaciones', 'Área de operaciones generales');

-- Create cargos table
CREATE TABLE cargos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL UNIQUE,
    descripcion TEXT,
    area_id UUID REFERENCES areas(id),
    nivel VARCHAR(50), -- OPERATIVO, TECNICO, PROFESIONAL, DIRECTIVO
    requiere_capacitacion_especial BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default cargos
INSERT INTO cargos (nombre, descripcion, nivel) VALUES
    ('Operario de Producción', 'Operario encargado de tareas de producción', 'OPERATIVO'),
    ('Supervisor de Producción', 'Supervisor del área de producción', 'TECNICO'),
    ('Técnico de Mantenimiento', 'Técnico especializado en mantenimiento', 'TECNICO'),
    ('Almacenista', 'Encargado del manejo de almacén', 'OPERATIVO'),
    ('Conductor', 'Conductor de vehículos de la empresa', 'OPERATIVO'),
    ('Soldador', 'Especialista en soldadura', 'TECNICO'),
    ('Electricista', 'Técnico electricista', 'TECNICO'),
    ('Mecánico', 'Técnico mecánico', 'TECNICO'),
    ('Operador de Máquina', 'Operador de maquinaria industrial', 'OPERATIVO'),
    ('Asistente Administrativo', 'Personal de apoyo administrativo', 'PROFESIONAL'),
    ('Coordinador de Seguridad', 'Encargado de seguridad industrial', 'PROFESIONAL'),
    ('Analista de Calidad', 'Especialista en control de calidad', 'PROFESIONAL'),
    ('Jefe de Área', 'Jefe de área operativa', 'DIRECTIVO'),
    ('Gerente', 'Gerente de división', 'DIRECTIVO'),
    ('Auxiliar de Servicios', 'Personal de servicios generales', 'OPERATIVO');

-- Create factores_riesgo table
CREATE TABLE factores_riesgo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL UNIQUE,
    descripcion TEXT,
    nivel_peligrosidad VARCHAR(20) DEFAULT 'MEDIO', -- BAJO, MEDIO, ALTO, CRITICO
    requiere_epp BOOLEAN DEFAULT FALSE,
    requiere_capacitacion BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default factores de riesgo
INSERT INTO factores_riesgo (nombre, descripcion, nivel_peligrosidad, requiere_epp, requiere_capacitacion) VALUES
    -- Biomecánicos
    ('Posturas prolongadas', 'Mantenimiento de posturas por tiempo prolongado', 'MEDIO', true, true),
    ('Movimientos repetitivos', 'Movimientos repetitivos de extremidades', 'MEDIO', true, true),
    ('Manipulación manual de cargas', 'Levantamiento y transporte manual de objetos pesados', 'ALTO', true, true),
    ('Sobreesfuerzo físico', 'Esfuerzo físico excesivo en las tareas', 'ALTO', true, true),
    
    -- Físicos
    ('Ruido', 'Exposición a niveles altos de ruido',  'MEDIO', true, false),
    ('Vibraciones', 'Exposición a vibraciones de herramientas o máquinas',  'MEDIO', true, false),
    ('Temperaturas extremas', 'Exposición a altas o bajas temperaturas',  'ALTO', true, true),
    ('Radiaciones ionizantes', 'Exposición a radiaciones peligrosas',  'CRITICO', true, true),
    ('Iluminación deficiente', 'Falta de iluminación adecuada', 'BAJO', false, false),
    
    -- Químicos
    ('Gases tóxicos', 'Exposición a gases peligrosos',  'CRITICO', true, true),
    ('Vapores químicos', 'Inhalación de vapores de sustancias químicas',  'ALTO', true, true),
    ('Polvos y partículas', 'Inhalación de polvos industriales',  'MEDIO', true, false),
    ('Líquidos corrosivos', 'Contacto con sustancias corrosivas',  'ALTO', true, true),
    
    -- Biológicos
    ('Virus y bacterias', 'Exposición a microorganismos patógenos',  'ALTO', true, true),
    ('Hongos', 'Exposición a esporas y hongos',  'MEDIO', true, false),
    ('Parásitos', 'Contacto con parásitos',  'MEDIO', true, true),
    
    -- Psicosociales
        ('Estrés laboral', 'Presión y tensión en el trabajo',  'MEDIO', false, true),
    ('Carga mental excesiva', 'Sobrecarga de tareas mentales',  'MEDIO', false, true),
    ('Trabajo nocturno', 'Alteración del ritmo circadiano',  'MEDIO', false, false),
    ('Violencia laboral', 'Agresiones físicas o verbales',  'ALTO', false, true),
    
    -- Condiciones de seguridad
    ('Superficies resbaladizas', 'Pisos húmedos o con sustancias',  'MEDIO', true, false),
    ('Trabajo en alturas', 'Actividades a más de 1.5 metros de altura',  'CRITICO', true, true),
    ('Espacios confinados', 'Trabajo en espacios cerrados',  'CRITICO', true, true),
    ('Maquinaria sin protección', 'Equipos sin guardas de seguridad',  'ALTO', true, true),
    ('Instalaciones eléctricas defectuosas', 'Riesgo de electrocución',  'CRITICO', true, true),
    
    -- Fenómenos naturales
    ('Sismos', 'Movimientos telúricos',  'ALTO', false, true),
    ('Inundaciones', 'Desbordamiento de aguas',  'ALTO', false, true),
    ('Vendavales', 'Vientos fuertes', 'MEDIO', false, true);

-- Create tipos_lesion table
CREATE TABLE tipos_lesion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL UNIQUE,
    descripcion TEXT,
    gravedad VARCHAR(20) DEFAULT 'MODERADA', -- LEVE, MODERADA, SEVERA, CRITICA
    requiere_atencion_inmediata BOOLEAN DEFAULT FALSE,
    requiere_hospitalizacion BOOLEAN DEFAULT FALSE,
    tiempo_recuperacion_estimado INTEGER, -- días estimados de recuperación
    requiere_cirugia BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default tipos de lesión
INSERT INTO tipos_lesion (nombre, descripcion, gravedad, requiere_atencion_inmediata, requiere_hospitalizacion, tiempo_recuperacion_estimado, requiere_cirugia) VALUES
    -- Cortes
    ('Corte superficial', 'Corte que no compromete estructuras profundas', 'LEVE', false, false, 3, false),
    ('Corte profundo', 'Corte que compromete músculos, tendones o nervios', 'SEVERA', true, true, 21, true),
    ('Laceración múltiple', 'Múltiples cortes en la misma zona', 'MODERADA', true, false, 14, false),
    
    -- Golpes
        ('Contusión simple', 'Golpe sin herida abierta, solo hematoma', 'LEVE', false, false, 7, false),
    ('Contusión severa', 'Golpe con daño muscular significativo', 'MODERADA', false, false, 14, false),
    ('Traumatismo craneal', 'Golpe en la cabeza con posible conmoción', 'CRITICA', true, true, 30, false),
    
    -- Fracturas
    ('Fractura simple', 'Fractura sin desplazamiento', 'MODERADA', true, false, 45, false),
    ('Fractura compleja', 'Fractura con desplazamiento o múltiple', 'SEVERA', true, true, 90, true),
    ('Fractura expuesta', 'Fractura con herida abierta', 'CRITICA', true, true, 120, true),
    
    -- Quemaduras
    ('Quemadura primer grado', 'Quemadura superficial, solo epidermis', 'LEVE', false, false, 5, false),
    ('Quemadura segundo grado', 'Quemadura de epidermis y dermis', 'MODERADA', true, false, 21, false),
    ('Quemadura tercer grado', 'Quemadura de todo el espesor de la piel', 'CRITICA', true, true, 60, true),
    ('Quemadura química', 'Quemadura por sustancias químicas', 'SEVERA', true, true, 30, false),
    
    -- Contusiones
    ('Hematoma localizado', 'Acumulación de sangre en tejidos blandos', 'LEVE', false, false, 10, false),
    ('Contusión pulmonar', 'Daño en el tejido pulmonar por trauma', 'CRITICA', true, true, 21, false),
    ('Contusión cerebral', 'Daño en el tejido cerebral', 'CRITICA', true, true, 60, false),
    
    -- Esguinces
            ('Esguince grado I', 'Distensión ligamentaria leve', 'LEVE', false, false, 14, false),
    ('Esguince grado II', 'Ruptura parcial de ligamentos', 'MODERADA', false, false, 30, false),
    ('Esguince grado III', 'Ruptura completa de ligamentos', 'SEVERA', true, false, 60, true),
    
    -- Luxaciones
    ('Luxación simple', 'Desplazamiento articular sin fractura', 'MODERADA', true, false, 21, false),
    ('Luxación compleja', 'Desplazamiento con lesión de tejidos blandos', 'SEVERA', true, true, 45, true),
    
    -- Heridas
    ('Herida punzante', 'Herida profunda y estrecha', 'MODERADA', true, false, 10, false),
    ('Herida por desgarro', 'Herida irregular con bordes desgarrados', 'MODERADA', true, false, 14, false),
    ('Herida infectada', 'Herida con proceso infeccioso', 'SEVERA', true, true, 21, false),
    
    -- Amputaciones
    ('Amputación parcial', 'Pérdida parcial de extremidad', 'CRITICA', true, true, 90, true),
    ('Amputación completa', 'Pérdida total de extremidad', 'CRITICA', true, true, 120, true),
    
    -- Intoxicaciones
    ('Intoxicación leve', 'Exposición menor a tóxicos', 'LEVE', false, false, 3, false),
    ('Intoxicación severa', 'Exposición significativa con síntomas sistémicos', 'CRITICA', true, true, 14, false),
    
    -- Asfixia
    ('Asfixia parcial', 'Dificultad respiratoria temporal', 'MODERADA', true, false, 7, false),
    ('Asfixia completa', 'Paro respiratorio con pérdida de conciencia', 'CRITICA', true, true, 30, false),
    
    -- Electrocución
    ('Shock eléctrico leve', 'Contacto eléctrico sin pérdida de conciencia', 'LEVE', false, false, 3, false),
    ('Electrocución severa', 'Contacto eléctrico con quemaduras y arritmias', 'CRITICA', true, true, 21, false),
    
    -- Otros
    ('Lesión ocular', 'Daño en estructuras del ojo', 'SEVERA', true, false, 30, false),
    ('Lesión auditiva', 'Pérdida temporal o permanente de audición', 'MODERADA', false, false, 21, false),
    ('Lesión de columna', 'Daño en estructuras vertebrales', 'CRITICA', true, true, 90, true);

-- Create partes_cuerpo table
CREATE TABLE partes_cuerpo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL UNIQUE,
    descripcion TEXT,
    region_anatomica VARCHAR(50), -- SUPERIOR, INFERIOR, CENTRAL, EXTREMIDADES
    lateralidad VARCHAR(20), -- DERECHA, IZQUIERDA, BILATERAL, NO_APLICA
    criticidad VARCHAR(20) DEFAULT 'MEDIA', -- BAJA, MEDIA, ALTA, CRITICA
    requiere_inmovilizacion BOOLEAN DEFAULT FALSE,
    tiempo_curacion_promedio INTEGER, -- días promedio de curación
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default partes del cuerpo
INSERT INTO partes_cuerpo (nombre, descripcion, region_anatomica, lateralidad, criticidad, requiere_inmovilizacion, tiempo_curacion_promedio) VALUES
    -- Cabeza
    ('Cráneo', 'Huesos que protegen el cerebro', 'SUPERIOR', 'NO_APLICA', 'CRITICA', true, 45),
    ('Cara', 'Región facial incluyendo ojos, nariz, boca', 'SUPERIOR', 'NO_APLICA', 'ALTA', false, 21),
    ('Cuero cabelludo', 'Piel que cubre el cráneo', 'SUPERIOR', 'NO_APLICA', 'MEDIA', false, 14),
    ('Frente', 'Región frontal de la cabeza', 'SUPERIOR', 'NO_APLICA', 'MEDIA', false, 10),
    ('Ojos', 'Órganos de la visión', 'SUPERIOR', 'BILATERAL', 'CRITICA', false, 30),
    ('Nariz', 'Órgano del olfato y respiración', 'SUPERIOR', 'NO_APLICA', 'MEDIA', false, 21),
    ('Boca', 'Cavidad oral incluyendo labios y dientes', 'SUPERIOR', 'NO_APLICA', 'MEDIA', false, 14),
    ('Oídos', 'Órganos de la audición', 'SUPERIOR', 'BILATERAL', 'ALTA', false, 21),
    ('Mandíbula', 'Hueso inferior de la cara', 'SUPERIOR', 'NO_APLICA', 'ALTA', true, 35),
    
    -- Cuello
    ('Cuello anterior', 'Parte frontal del cuello', 'SUPERIOR', 'NO_APLICA', 'CRITICA', true, 21),
    ('Cuello posterior', 'Nuca y parte posterior del cuello', 'SUPERIOR', 'NO_APLICA', 'ALTA', true, 21),
    ('Garganta', 'Región de la laringe y faringe', 'SUPERIOR', 'NO_APLICA', 'CRITICA', false, 14),
    
    -- Torso
    ('Pecho', 'Región anterior del tórax', 'CENTRAL', 'NO_APLICA', 'ALTA', false, 21),
    ('Abdomen', 'Región abdominal', 'CENTRAL', 'NO_APLICA', 'ALTA', false, 21),
    ('Costillas', 'Huesos que protegen los órganos torácicos', 'CENTRAL', 'BILATERAL', 'ALTA', true, 42),
    ('Pelvis', 'Huesos de la cadera', 'CENTRAL', 'NO_APLICA', 'ALTA', true, 60),
    
    -- Espalda
    ('Espalda alta', 'Región dorsal superior', 'CENTRAL', 'NO_APLICA', 'ALTA', false, 21),
    ('Espalda baja', 'Región lumbar', 'CENTRAL', 'NO_APLICA', 'ALTA', false, 28),
    ('Columna vertebral', 'Estructura ósea central de la espalda', 'CENTRAL', 'NO_APLICA', 'CRITICA', true, 90),
    
    -- Brazos
    ('Hombro derecho', 'Articulación del hombro derecho', 'SUPERIOR', 'DERECHA', 'ALTA', true, 35),
    ('Brazo derecho', 'Húmero y músculos del brazo derecho', 'SUPERIOR', 'DERECHA', 'MEDIA', true, 28),
    ('Codo derecho', 'Articulación del codo derecho', 'SUPERIOR', 'DERECHA', 'MEDIA', true, 21),
    ('Antebrazo derecho', 'Radio y cúbito del brazo derecho', 'SUPERIOR', 'DERECHA', 'MEDIA', true, 28),
    ('Hombro izquierdo', 'Articulación del hombro izquierdo', 'SUPERIOR', 'IZQUIERDA', 'ALTA', true, 35),
    ('Brazo izquierdo', 'Húmero y músculos del brazo izquierdo', 'SUPERIOR', 'IZQUIERDA', 'MEDIA', true, 28),
    ('Codo izquierdo', 'Articulación del codo izquierdo', 'SUPERIOR', 'IZQUIERDA', 'MEDIA', true, 21),
    ('Antebrazo izquierdo', 'Radio y cúbito del brazo izquierdo', 'SUPERIOR', 'IZQUIERDA', 'MEDIA', true, 28),
    
    -- Manos
    ('Muñeca derecha', 'Articulación de la muñeca derecha', 'EXTREMIDADES', 'DERECHA', 'MEDIA', true, 21),
    ('Palma derecha', 'Palma de la mano derecha', 'EXTREMIDADES', 'DERECHA', 'MEDIA', false, 14),
    ('Dorso mano derecha', 'Parte posterior de la mano derecha', 'EXTREMIDADES', 'DERECHA', 'MEDIA', false, 14),
    ('Dedos mano derecha', 'Dedos de la mano derecha', 'EXTREMIDADES', 'DERECHA', 'MEDIA', false, 21),
    ('Pulgar derecho', 'Dedo pulgar de la mano derecha', 'EXTREMIDADES', 'DERECHA', 'ALTA', false, 21),
    ('Muñeca izquierda', 'Articulación de la muñeca izquierda', 'EXTREMIDADES', 'IZQUIERDA', 'MEDIA', true, 21),
    ('Palma izquierda', 'Palma de la mano izquierda', 'EXTREMIDADES', 'IZQUIERDA', 'MEDIA', false, 14),
    ('Dorso mano izquierda', 'Parte posterior de la mano izquierda', 'EXTREMIDADES', 'IZQUIERDA', 'MEDIA', false, 14),
    ('Dedos mano izquierda', 'Dedos de la mano izquierda', 'EXTREMIDADES', 'IZQUIERDA', 'MEDIA', false, 21),
    ('Pulgar izquierdo', 'Dedo pulgar de la mano izquierda', 'EXTREMIDADES', 'IZQUIERDA', 'ALTA', false, 21),
    
    -- Piernas
    ('Cadera derecha', 'Articulación de la cadera derecha', 'INFERIOR', 'DERECHA', 'ALTA', true, 60),
    ('Muslo derecho', 'Fémur y músculos del muslo derecho', 'INFERIOR', 'DERECHA', 'MEDIA', true, 35),
    ('Rodilla derecha', 'Articulación de la rodilla derecha', 'INFERIOR', 'DERECHA', 'ALTA', true, 42),
    ('Pantorrilla derecha', 'Músculos posteriores de la pierna derecha', 'INFERIOR', 'DERECHA', 'MEDIA', false, 21),
    ('Espinilla derecha', 'Tibia de la pierna derecha', 'INFERIOR', 'DERECHA', 'MEDIA', true, 35),
    ('Cadera izquierda', 'Articulación de la cadera izquierda', 'INFERIOR', 'IZQUIERDA', 'ALTA', true, 60),
    ('Muslo izquierdo', 'Fémur y músculos del muslo izquierdo', 'INFERIOR', 'IZQUIERDA', 'MEDIA', true, 35),
    ('Rodilla izquierda', 'Articulación de la rodilla izquierda', 'INFERIOR', 'IZQUIERDA', 'ALTA', true, 42),
    ('Pantorrilla izquierda', 'Músculos posteriores de la pierna izquierda', 'INFERIOR', 'IZQUIERDA', 'MEDIA', false, 21),
    ('Espinilla izquierda', 'Tibia de la pierna izquierda', 'INFERIOR', 'IZQUIERDA', 'MEDIA', true, 35),
    
    -- Pies
    ('Tobillo derecho', 'Articulación del tobillo derecho', 'EXTREMIDADES', 'DERECHA', 'MEDIA', true, 28),
    ('Pie derecho', 'Estructura completa del pie derecho', 'EXTREMIDADES', 'DERECHA', 'MEDIA', true, 21),
    ('Dedos pie derecho', 'Dedos del pie derecho', 'EXTREMIDADES', 'DERECHA', 'MEDIA', false, 14),
    ('Talón derecho', 'Región posterior del pie derecho', 'EXTREMIDADES', 'DERECHA', 'MEDIA', false, 21),
    ('Tobillo izquierdo', 'Articulación del tobillo izquierdo', 'EXTREMIDADES', 'IZQUIERDA', 'MEDIA', true, 28),
    ('Pie izquierdo', 'Estructura completa del pie izquierdo', 'EXTREMIDADES', 'IZQUIERDA', 'MEDIA', true, 21),
    ('Dedos pie izquierdo', 'Dedos del pie izquierdo', 'EXTREMIDADES', 'IZQUIERDA', 'MEDIA', false, 14),
    ('Talón izquierdo', 'Región posterior del pie izquierdo', 'EXTREMIDADES', 'IZQUIERDA', 'MEDIA', false, 21),
    
    -- Múltiple y Otro
    ('Múltiples regiones', 'Afectación de múltiples partes del cuerpo', 'NO_APLICA', 'BILATERAL', 'CRITICA', true, 60),
    ('Órganos internos', 'Afectación de órganos internos no especificados', 'CENTRAL', 'NO_APLICA', 'CRITICA', false, 45),
    ('Sistema nervioso', 'Afectación del sistema nervioso', 'CENTRAL', 'NO_APLICA', 'CRITICA', false, 90),
    ('Sistema circulatorio', 'Afectación del sistema cardiovascular', 'CENTRAL', 'NO_APLICA', 'CRITICA', false, 30);

-- Create accidentes table
CREATE TABLE accidentes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empleado_id UUID NOT NULL REFERENCES empleados(id) ON DELETE CASCADE,
    
    -- Basic accident information
    fecha_accidente TIMESTAMP NOT NULL,
    lugar_accidente VARCHAR(255) NOT NULL,
    severidad tipo_severidad NOT NULL,
    tipo_accidente tipo_accidente NOT NULL,
    area_id UUID NOT NULL REFERENCES areas(id),
    cargo_id UUID NOT NULL REFERENCES cargos(id),
    turno tipo_turno NOT NULL,
    servicio_a_prestar VARCHAR(255) NOT NULL,
    factor_riesgo_id UUID NOT NULL REFERENCES factores_riesgo(id),
    descripcion_accidente TEXT NOT NULL,
    tipo_lesion_id UUID NOT NULL REFERENCES tipos_lesion(id),
    agente_del_accidente VARCHAR(255) NOT NULL,
    mecanismo_del_accidente VARCHAR(255) NOT NULL,
    parte_cuerpo_afectada_id UUID NOT NULL REFERENCES partes_cuerpo(id),
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
    
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create accident follow-up table
CREATE TABLE seguimientos_accidente (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    accidente_id UUID NOT NULL REFERENCES accidentes(id) ON DELETE CASCADE,
    
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
    
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create accident evidence table
CREATE TABLE evidencias_accidente (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    accidente_id UUID NOT NULL REFERENCES accidentes(id) ON DELETE CASCADE,
    tipo_evidencia VARCHAR(50) NOT NULL, -- FOTO, VIDEO, DOCUMENTO, OTRO
    nombre_archivo VARCHAR(255),
    ruta_archivo VARCHAR(500),
    descripcion TEXT,
    fecha_captura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    capturado_por VARCHAR(255),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_accidentes_empleado_id ON accidentes(empleado_id);
CREATE INDEX idx_accidentes_fecha ON accidentes(fecha_accidente);
CREATE INDEX idx_accidentes_tipo ON accidentes(tipo_accidente);
CREATE INDEX idx_accidentes_tipo_lesion_id ON accidentes(tipo_lesion_id);
CREATE INDEX idx_accidentes_parte_cuerpo_afectada_id ON accidentes(parte_cuerpo_afectada_id);
CREATE INDEX idx_accidentes_severidad ON accidentes(severidad);
CREATE INDEX idx_accidentes_factor_riesgo_id ON accidentes(factor_riesgo_id);
CREATE INDEX idx_accidentes_tiene_incapacidad ON accidentes(tiene_incapacidad);
CREATE INDEX idx_accidentes_estado ON accidentes(estado);
CREATE INDEX idx_accidentes_empleado_ref ON accidentes(empleado_id); -- For joining with empleados table
CREATE INDEX idx_accidentes_area_id ON accidentes(area_id); -- For joining with areas table

CREATE INDEX idx_areas_nombre ON areas(nombre);
CREATE INDEX idx_areas_activo ON areas(activo);

CREATE INDEX idx_accidentes_cargo_id ON accidentes(cargo_id); -- For joining with cargos table

CREATE INDEX idx_cargos_nombre ON cargos(nombre);
CREATE INDEX idx_cargos_activo ON cargos(activo);
CREATE INDEX idx_cargos_nivel ON cargos(nivel);
CREATE INDEX idx_cargos_area_id ON cargos(area_id);

CREATE INDEX idx_factores_riesgo_nombre ON factores_riesgo(nombre);
-- Index removed as categoria field was removed from factores_riesgo
CREATE INDEX idx_factores_riesgo_nivel_peligrosidad ON factores_riesgo(nivel_peligrosidad);
CREATE INDEX idx_factores_riesgo_activo ON factores_riesgo(activo);
CREATE INDEX idx_factores_riesgo_requiere_epp ON factores_riesgo(requiere_epp);

CREATE INDEX idx_tipos_lesion_nombre ON tipos_lesion(nombre);
-- Index removed as categoria field was removed from tipos_lesion
CREATE INDEX idx_tipos_lesion_gravedad ON tipos_lesion(gravedad);
CREATE INDEX idx_tipos_lesion_activo ON tipos_lesion(activo);
CREATE INDEX idx_tipos_lesion_requiere_atencion_inmediata ON tipos_lesion(requiere_atencion_inmediata);
CREATE INDEX idx_tipos_lesion_requiere_hospitalizacion ON tipos_lesion(requiere_hospitalizacion);

CREATE INDEX idx_partes_cuerpo_nombre ON partes_cuerpo(nombre);
CREATE INDEX idx_partes_cuerpo_region_anatomica ON partes_cuerpo(region_anatomica);
CREATE INDEX idx_partes_cuerpo_lateralidad ON partes_cuerpo(lateralidad);
CREATE INDEX idx_partes_cuerpo_criticidad ON partes_cuerpo(criticidad);
CREATE INDEX idx_partes_cuerpo_activo ON partes_cuerpo(activo);
CREATE INDEX idx_partes_cuerpo_requiere_inmovilizacion ON partes_cuerpo(requiere_inmovilizacion);

CREATE INDEX idx_seguimientos_accidente_id ON seguimientos_accidente(accidente_id);
CREATE INDEX idx_seguimientos_fecha ON seguimientos_accidente(fecha_seguimiento);
CREATE INDEX idx_seguimientos_tipo ON seguimientos_accidente(tipo_seguimiento);

CREATE INDEX idx_evidencias_accidente_id ON evidencias_accidente(accidente_id);

-- Create triggers for automatic actualizado_en
CREATE TRIGGER actualizar_accidentes_actualizado_en 
    BEFORE UPDATE ON accidentes 
    FOR EACH ROW 
    EXECUTE FUNCTION actualizar_columna_actualizado_en();

CREATE TRIGGER actualizar_seguimientos_accidente_actualizado_en 
    BEFORE UPDATE ON seguimientos_accidente 
    FOR EACH ROW 
    EXECUTE FUNCTION actualizar_columna_actualizado_en();

CREATE TRIGGER actualizar_areas_actualizado_en 
    BEFORE UPDATE ON areas 
    FOR EACH ROW 
    EXECUTE FUNCTION actualizar_columna_actualizado_en();

CREATE TRIGGER actualizar_cargos_actualizado_en 
    BEFORE UPDATE ON cargos 
    FOR EACH ROW 
    EXECUTE FUNCTION actualizar_columna_actualizado_en();

CREATE TRIGGER actualizar_factores_riesgo_actualizado_en 
    BEFORE UPDATE ON factores_riesgo 
    FOR EACH ROW 
    EXECUTE FUNCTION actualizar_columna_actualizado_en();

CREATE TRIGGER actualizar_tipos_lesion_actualizado_en 
    BEFORE UPDATE ON tipos_lesion 
    FOR EACH ROW 
    EXECUTE FUNCTION actualizar_columna_actualizado_en();

CREATE TRIGGER actualizar_partes_cuerpo_actualizado_en 
    BEFORE UPDATE ON partes_cuerpo 
    FOR EACH ROW 
    EXECUTE FUNCTION actualizar_columna_actualizado_en();
