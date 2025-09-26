-- Migration 007: Add seguimientos de accidentes for testing (FIXED VERSION)
-- Author: System
-- Date: 2024-09-25

-- Insert 10 seguimientos de accidentes realistas usando accidentes existentes
WITH accidentes_disponibles AS (
    SELECT id, empleado_id, fecha_accidente,
           ROW_NUMBER() OVER (ORDER BY fecha_accidente ASC) as rn
    FROM accidentes 
    LIMIT 10
)
INSERT INTO seguimientos_accidente (
    accidente_id, fecha_seguimiento, tipo_seguimiento, descripcion, responsable,
    estado_salud, porcentaje_recuperacion, restricciones_laborales, fecha_probable_reintegro,
    documentos_pendientes, gestiones_realizadas, proxima_accion, fecha_proxima_accion,
    seguimiento_completado, observaciones
) 
SELECT 
    ad.id as accidente_id,
    CASE ad.rn
        WHEN 1 THEN '2024-01-25 10:00:00'::timestamp
        WHEN 2 THEN '2024-02-15 14:30:00'::timestamp
        WHEN 3 THEN '2024-02-25 09:15:00'::timestamp
        WHEN 4 THEN '2024-03-20 11:45:00'::timestamp
        WHEN 5 THEN '2024-04-01 08:30:00'::timestamp
        WHEN 6 THEN '2024-04-05 16:00:00'::timestamp
        WHEN 7 THEN '2024-05-10 13:20:00'::timestamp
        WHEN 8 THEN '2024-08-05 15:45:00'::timestamp
        WHEN 9 THEN '2024-08-15 12:00:00'::timestamp
        WHEN 10 THEN '2024-09-26 10:30:00'::timestamp
    END as fecha_seguimiento,
    CASE ad.rn
        WHEN 1 THEN 'MEDICO'
        WHEN 2 THEN 'ADMINISTRATIVO'
        WHEN 3 THEN 'LEGAL'
        WHEN 4 THEN 'PREVENTIVO'
        WHEN 5 THEN 'MEDICO'
        WHEN 6 THEN 'ADMINISTRATIVO'
        WHEN 7 THEN 'MEDICO'
        WHEN 8 THEN 'PREVENTIVO'
        WHEN 9 THEN 'MEDICO'
        WHEN 10 THEN 'LEGAL'
    END as tipo_seguimiento,
    CASE ad.rn
        WHEN 1 THEN 'Control médico post lesión. Paciente presenta mejoría gradual con tratamiento fisioterapéutico y medicación antiinflamatoria.'
        WHEN 2 THEN 'Gestión de documentación para reporte ante ARL. Solicitud de investigación técnica del accidente eléctrico.'
        WHEN 3 THEN 'Seguimiento legal del accidente. Evaluación de responsabilidades y medidas preventivas implementadas.'
        WHEN 4 THEN 'Implementación de medidas preventivas post accidente. Refuerzo en protocolos de EPP y capacitación.'
        WHEN 5 THEN 'Seguimiento médico especializado. Evaluación de evolución y plan de rehabilitación integral.'
        WHEN 6 THEN 'Gestión administrativa post accidente grave. Coordinación con EPS y ARL para atención integral.'
        WHEN 7 THEN 'Seguimiento post exposición ocupacional. Protocolo de seguimiento serológico y médico implementado.'
        WHEN 8 THEN 'Implementación de sistema de control mejorado. Evaluación de efectividad de medidas implementadas.'
        WHEN 9 THEN 'Seguimiento psicológico especializado. Evaluación de factores de riesgo psicosocial y plan de intervención.'
        WHEN 10 THEN 'Evaluación legal inicial del caso. Análisis de cumplimiento normativo y responsabilidades.'
    END as descripcion,
    CASE ad.rn
        WHEN 1 THEN 'Dr. María González - Medicina Laboral'
        WHEN 2 THEN 'Ana Lucía Herrera - Coordinadora SST'
        WHEN 3 THEN 'Dr. Carlos Mendoza - Asesor Legal'
        WHEN 4 THEN 'Ing. Roberto Silva - Coordinador Técnico'
        WHEN 5 THEN 'Dr. Patricia Ramírez - Medicina Especializada'
        WHEN 6 THEN 'Claudia Torres - Gestión Humana'
        WHEN 7 THEN 'Dr. Luis Morales - Medicina Ocupacional'
        WHEN 8 THEN 'Ing. Sandra Jiménez - Higiene Industrial'
        WHEN 9 THEN 'Psic. Andrea Vásquez - Salud Mental'
        WHEN 10 THEN 'Abg. Fernando Castro - Asesoría Jurídica'
    END as responsable,
    CASE ad.rn
        WHEN 1 THEN 'MEJORANDO'
        WHEN 5 THEN 'ESTABLE'
        WHEN 7 THEN 'ESTABLE'
        WHEN 9 THEN 'MEJORANDO'
        ELSE NULL
    END as estado_salud,
    CASE ad.rn
        WHEN 1 THEN 85
        WHEN 5 THEN 60
        WHEN 7 THEN 95
        WHEN 9 THEN 70
        ELSE NULL
    END as porcentaje_recuperacion,
    CASE ad.rn
        WHEN 1 THEN 'Evitar levantamiento de cargas superiores a 10kg. Realizar pausas activas cada 2 horas.'
        WHEN 5 THEN 'Restricciones de movilidad. Fisioterapia programada 3 veces por semana.'
        WHEN 7 THEN 'Uso obligatorio de EPP reforzado. Evitar procedimientos de alto riesgo por 30 días.'
        WHEN 9 THEN 'Reducción de carga laboral en 30%. Horarios flexibles. Técnicas de manejo del estrés.'
        ELSE NULL
    END as restricciones_laborales,
    CASE ad.rn
        WHEN 1 THEN '2024-02-10'::date
        WHEN 5 THEN '2024-05-15'::date
        WHEN 7 THEN '2024-05-25'::date
        WHEN 9 THEN '2024-09-01'::date
        ELSE NULL
    END as fecha_probable_reintegro,
    CASE ad.rn
        WHEN 2 THEN 'Formato de reporte ARL, Declaración de testigos, Registro fotográfico del sitio'
        WHEN 3 THEN 'Concepto jurídico sobre responsabilidades, Evaluación de cumplimiento normativo'
        WHEN 6 THEN 'Autorización de procedimientos médicos, Gestión de incapacidades, Coordinación con familia'
        WHEN 10 THEN 'Revisión de protocolos, Análisis de responsabilidades, Evaluación normativa'
        ELSE NULL
    END as documentos_pendientes,
    CASE ad.rn
        WHEN 2 THEN 'Envío de documentación completa a ARL. Programación de visita técnica.'
        WHEN 3 THEN 'Reunión con directivos para implementar medidas correctivas. Revisión de protocolos.'
        WHEN 4 THEN 'Capacitación a personal. Inspección de equipos de protección. Señalización mejorada.'
        WHEN 6 THEN 'Seguimiento diario con EPS. Gestión de pagos de incapacidad. Apoyo psicológico.'
        WHEN 8 THEN 'Instalación de sistema mejorado. Mediciones de calidad. Capacitación en uso.'
        WHEN 10 THEN 'Solicitud de peritaje técnico independiente. Revisión de licencias y permisos.'
        ELSE NULL
    END as gestiones_realizadas,
    CASE ad.rn
        WHEN 1 THEN 'Control médico de seguimiento'
        WHEN 2 THEN 'Seguimiento respuesta ARL sobre investigación técnica'
        WHEN 3 THEN 'Verificación implementación medidas correctivas'
        WHEN 4 THEN 'Auditoría de cumplimiento de nuevos protocolos'
        WHEN 5 THEN 'Control especializado y evaluación fisioterapéutica'
        WHEN 6 THEN 'Reunión con familia para actualización estado'
        WHEN 7 THEN 'Exámenes de control a los 3 meses'
        WHEN 8 THEN 'Mediciones de seguimiento calidad'
        WHEN 9 THEN 'Sesión de seguimiento psicológico'
        WHEN 10 THEN 'Recepción de peritaje técnico y definición de acciones'
    END as proxima_accion,
    CASE ad.rn
        WHEN 1 THEN '2024-02-05'::date
        WHEN 2 THEN '2024-03-01'::date
        WHEN 3 THEN '2024-03-15'::date
        WHEN 4 THEN '2024-04-15'::date
        WHEN 5 THEN '2024-04-20'::date
        WHEN 6 THEN '2024-04-12'::date
        WHEN 7 THEN '2024-08-10'::date
        WHEN 8 THEN '2024-09-01'::date
        WHEN 9 THEN '2024-09-15'::date
        WHEN 10 THEN '2024-10-15'::date
    END as fecha_proxima_accion,
    CASE ad.rn
        WHEN 1 THEN true
        WHEN 2 THEN true
        WHEN 3 THEN true
        WHEN 4 THEN true
        WHEN 5 THEN false
        WHEN 6 THEN false
        WHEN 7 THEN false
        WHEN 8 THEN true
        WHEN 9 THEN false
        WHEN 10 THEN false
    END as seguimiento_completado,
    CASE ad.rn
        WHEN 1 THEN 'Paciente cumpliendo adecuadamente con las recomendaciones médicas.'
        WHEN 2 THEN 'Documentación enviada exitosamente. ARL confirmó recepción.'
        WHEN 3 THEN 'Se establecieron responsabilidades claras y plan de mejora implementado.'
        WHEN 4 THEN 'Personal capacitado exitosamente. Equipos de protección renovados al 100%.'
        WHEN 5 THEN 'Paciente en proceso de recuperación. Requiere seguimiento continuo.'
        WHEN 6 THEN 'Gestiones en curso. Familia informada y apoyada institucionalmente.'
        WHEN 7 THEN 'Exámenes iniciales negativos. Continuar protocolo de seguimiento establecido.'
        WHEN 8 THEN 'Sistema funcionando correctamente. Niveles de exposición dentro de límites.'
        WHEN 9 THEN 'Empleada respondiendo bien al tratamiento. Mejora gradual en indicadores.'
        WHEN 10 THEN 'Caso en investigación inicial. Se requiere peritaje técnico especializado.'
    END as observaciones
FROM accidentes_disponibles ad;

-- Update statistics
ANALYZE seguimientos_accidente;
