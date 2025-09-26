-- Migration 006: Add more employees and accidents for testing (CORRECTED VERSION)
-- Author: System
-- Date: 2024-09-25

-- Insert 10 additional employees
INSERT INTO empleados (nombres, apellidos, numero_documento, fecha_nacimiento, ciudad_id, centro_trabajo_id, sexo, salario) VALUES
    ('María Elena', 'Gutiérrez López', '11223344', '1992-03-15', 
     (SELECT id FROM ciudades WHERE codigo = '73001'), -- IBAGUÉ
     (SELECT id FROM centros_trabajo WHERE codigo = 'DMI'), -- DISPENSARIO_MEDICO_DE_IBAGUE
     'F', 2600000.00),
    
    ('Fernando José', 'Castillo Herrera', '22334455', '1985-06-20', 
     (SELECT id FROM ciudades WHERE codigo = '73268'), -- ESPINAL
     (SELECT id FROM centros_trabajo WHERE codigo = 'EMAB'), -- EMAB_ADMINISTRATIVO
     'M', 3400000.00),
    
    ('Patricia Isabel', 'Molina Restrepo', '33445566', '1990-09-08', 
     (SELECT id FROM ciudades WHERE codigo = '73449'), -- MELGAR
     (SELECT id FROM centros_trabajo WHERE codigo = 'HPSC'), -- HOSPITAL_PSIQUIATRICO_SAN_CAMILO
     'F', 2800000.00),
    
    ('Andrés Felipe', 'Sánchez Mejía', '44556677', '1988-12-12', 
     (SELECT id FROM ciudades WHERE codigo = '73275'), -- FLANDES
     (SELECT id FROM centros_trabajo WHERE codigo = 'FGN'), -- FISCALIA_GENERAL_DE_LA_NACION
     'M', 4100000.00),
    
    ('Liliana', 'Parra Quintero', '55667788', '1993-02-28', 
     (SELECT id FROM ciudades WHERE codigo = '73349'), -- HONDA
     (SELECT id FROM centros_trabajo WHERE codigo = 'DMI'), -- DISPENSARIO_MEDICO_DE_IBAGUE
     'F', 2500000.00),
    
    ('Gustavo Adolfo', 'Rincón Acosta', '66778899', '1987-07-05', 
     (SELECT id FROM ciudades WHERE codigo = '73411'), -- LÍBANO
     (SELECT id FROM centros_trabajo WHERE codigo = 'EMAB'), -- EMAB_ADMINISTRATIVO
     'M', 3600000.00),
    
    ('Yolanda', 'Ospina Cardona', '77889900', '1991-10-18', 
     (SELECT id FROM ciudades WHERE codigo = '73443'), -- MARIQUITA
     (SELECT id FROM centros_trabajo WHERE codigo = 'HPSC'), -- HOSPITAL_PSIQUIATRICO_SAN_CAMILO
     'F', 2700000.00),
    
    ('Ricardo Enrique', 'Agudelo Marín', '88990011', '1984-04-22', 
     (SELECT id FROM ciudades WHERE codigo = '73671'), -- SALDAÑA
     (SELECT id FROM centros_trabajo WHERE codigo = 'FGN'), -- FISCALIA_GENERAL_DE_LA_NACION
     'M', 3900000.00),
    
    ('Mónica Andrea', 'Bedoya Zapata', '99001122', '1989-08-14', 
     (SELECT id FROM ciudades WHERE codigo = '73861'), -- VENADILLO
     (SELECT id FROM centros_trabajo WHERE codigo = 'DMI'), -- DISPENSARIO_MEDICO_DE_IBAGUE
     'F', 2900000.00),
    
    ('Jairo Alberto', 'Vargas Salazar', '00112233', '1986-11-30', 
     (SELECT id FROM ciudades WHERE codigo = '73001'), -- IBAGUÉ
     (SELECT id FROM centros_trabajo WHERE codigo = 'EMAB'), -- EMAB_ADMINISTRATIVO
     'M', 3300000.00);

-- Insert 50 accidents with realistic data and CORRECT factor names
INSERT INTO accidentes (
    empleado_id, fecha_accidente, lugar_accidente, severidad, tipo_accidente,
    turno, servicio_a_prestar, factor_riesgo_id, descripcion_accidente,
    tipo_lesion_id, agente_del_accidente, mecanismo_del_accidente, parte_cuerpo_afectada_id,
    situacion_del_accidente, tiene_incapacidad, fecha_inicio_incapacidad, fecha_fin_incapacidad,
    dias_incapacidad, fecha_investigacion, descripcion_investigacion, estado, requiere_seguimiento
) VALUES
    -- Accidente 1
    ((SELECT id FROM empleados WHERE numero_documento = '12345678'), '2024-01-15 08:30:00', 'Área de producción - Línea A', 'Leve', 'Propios del trabajo',
     'Diurno', 'Operación de maquinaria', (SELECT id FROM factores_riesgo WHERE nombre = 'Maquinaria sin protección'), 
     'Empleado sufrió corte en dedo índice al manipular pieza sin guantes',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Corte superficial'), 'Cuchilla de máquina cortadora', 'Contacto directo con superficie cortante',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Dedos mano derecha'),
     'Durante operación rutinaria, empleado no utilizó EPP adecuado', false, null, null, 0,
     '2024-01-16', 'Investigación inicial completada. Se reforzará capacitación en uso de EPP', 'CERRADO', false),

    -- Accidente 2
    ((SELECT id FROM empleados WHERE numero_documento = '23456789'), '2024-01-22 14:45:00', 'Almacén - Zona de carga', 'Severo', 'Propios del trabajo',
     'Diurno', 'Manipulación de cargas', (SELECT id FROM factores_riesgo WHERE nombre = 'Manipulación manual de cargas'), 
     'Lesión en espalda baja al levantar caja de 40kg sin técnica adecuada',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Contusión severa'), 'Caja de mercancía pesada', 'Sobreesfuerzo por levantamiento',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Espalda baja'),
     'Empleado levantó carga excediendo límite recomendado sin ayuda mecánica', true, '2024-01-23', '2024-02-05', 13,
     '2024-01-24', 'Se implementarán ayudas mecánicas y capacitación en técnicas de levantamiento', 'CERRADO', false),

    -- Accidente 3
    ((SELECT id FROM empleados WHERE numero_documento = '34567890'), '2024-02-03 09:15:00', 'Oficina administrativa - Piso 2', 'Leve', 'Propios del trabajo',
     'Diurno', 'Trabajo de oficina', (SELECT id FROM factores_riesgo WHERE nombre = 'Superficies resbaladizas'), 
     'Caída al mismo nivel por piso húmedo en área de descanso',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Contusión simple'), 'Piso húmedo', 'Caída al mismo nivel',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Rodilla derecha'),
     'Piso recién trapeado sin señalización de peligro', false, null, null, 0,
     '2024-02-04', 'Se mejorará señalización de áreas húmedas', 'CERRADO', false),

    -- Accidente 4
    ((SELECT id FROM empleados WHERE numero_documento = '45678901'), '2024-02-10 16:20:00', 'Taller de mantenimiento', 'Severo', 'Propios del trabajo',
     'Diurno', 'Mantenimiento preventivo', (SELECT id FROM factores_riesgo WHERE nombre = 'Instalaciones eléctricas defectuosas'), 
     'Descarga eléctrica durante mantenimiento de panel sin desenergizar',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Quemadura segundo grado'), 'Panel eléctrico', 'Contacto eléctrico directo',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Palma derecha'),
     'No se siguió protocolo de bloqueo y etiquetado de energías peligrosas', true, '2024-02-11', '2024-03-03', 21,
     '2024-02-12', 'Reforzar protocolos LOTO y capacitación en seguridad eléctrica', 'CERRADO', false),

    -- Accidente 5
    ((SELECT id FROM empleados WHERE numero_documento = '56789012'), '2024-02-18 11:30:00', 'Laboratorio - Área química', 'Grave', 'Propios del trabajo',
     'Diurno', 'Análisis químico', (SELECT id FROM factores_riesgo WHERE nombre = 'Líquidos corrosivos'), 
     'Salpicadura de ácido clorhídrico en rostro por rotura de recipiente',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Quemadura segundo grado'), 'Ácido clorhídrico', 'Salpicadura química',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Cara'),
     'Recipiente de vidrio se rompió durante manipulación, empleado no tenía protección facial', true, '2024-02-19', '2024-03-11', 21,
     '2024-02-20', 'Implementar uso obligatorio de protección facial en laboratorio', 'CERRADO', false),

    -- Accidente 6
    ((SELECT id FROM empleados WHERE numero_documento = '67890123'), '2024-02-25 07:45:00', 'Entrada principal', 'Leve', 'Tránsito',
     'Diurno', 'Desplazamiento al trabajo', (SELECT id FROM factores_riesgo WHERE nombre = 'Vendavales'), 
     'Caída de motocicleta en parqueadero por piso mojado',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Contusión simple'), 'Motocicleta', 'Caída de vehículo',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Rodilla izquierda'),
     'Empleado perdió control de motocicleta en piso húmedo del parqueadero', false, null, null, 0,
     '2024-02-26', 'Mejorar drenaje en parqueadero y señalización', 'CERRADO', false),

    -- Accidente 7
    ((SELECT id FROM empleados WHERE numero_documento = '78901234'), '2024-03-05 13:10:00', 'Cocina - Área de preparación', 'Leve', 'Propios del trabajo',
     'Diurno', 'Preparación de alimentos', (SELECT id FROM factores_riesgo WHERE nombre = 'Temperaturas extremas'), 
     'Quemadura leve en antebrazo al tocar superficie caliente de horno',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Quemadura primer grado'), 'Superficie de horno', 'Contacto con superficie caliente',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Antebrazo derecho'),
     'Empleado tocó superficie caliente al alcanzar utensilio', false, null, null, 0,
     '2024-03-06', 'Reforzar uso de guantes térmicos', 'CERRADO', false),

    -- Accidente 8
    ((SELECT id FROM empleados WHERE numero_documento = '89012345'), '2024-03-12 10:25:00', 'Área de soldadura', 'Severo', 'Propios del trabajo',
     'Diurno', 'Soldadura de estructuras', (SELECT id FROM factores_riesgo WHERE nombre = 'Radiaciones ionizantes'), 
     'Quemadura en rostro por arco de soldadura sin protección adecuada',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Quemadura segundo grado'), 'Arco de soldadura', 'Exposición a radiación',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Cara'),
     'Careta de soldadura defectuosa permitió paso de radiación', true, '2024-03-13', '2024-03-27', 14,
     '2024-03-14', 'Inspección y reemplazo de equipos de protección defectuosos', 'CERRADO', false),

    -- Accidente 9
    ((SELECT id FROM empleados WHERE numero_documento = '90123456'), '2024-03-19 15:40:00', 'Escaleras - Piso 3', 'Severo', 'Propios del trabajo',
     'Diurno', 'Desplazamiento interno', (SELECT id FROM factores_riesgo WHERE nombre = 'Trabajo en alturas'), 
     'Caída por escaleras al resbalar en escalón húmedo',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Fractura simple'), 'Escalones húmedos', 'Caída a diferente nivel',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Tobillo derecho'),
     'Escaleras húmedas por filtración de agua sin señalizar', true, '2024-03-20', '2024-05-03', 44,
     '2024-03-21', 'Reparar filtración y mejorar señalización de peligros', 'CERRADO', false),

    -- Accidente 10
    ((SELECT id FROM empleados WHERE numero_documento = '01234567'), '2024-03-26 12:15:00', 'Bodega - Zona alta', 'Grave', 'Propios del trabajo',
     'Diurno', 'Almacenamiento en altura', (SELECT id FROM factores_riesgo WHERE nombre = 'Trabajo en alturas'), 
     'Caída desde escalera de 3 metros durante almacenamiento',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Fractura compleja'), 'Escalera portátil', 'Caída desde altura',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Brazo izquierdo'),
     'Escalera no estaba asegurada y empleado perdió equilibrio', true, '2024-03-27', '2024-06-24', 89,
     '2024-03-28', 'Implementar sistema de trabajo seguro en alturas', 'CERRADO', false),

    -- Accidente 11
    ((SELECT id FROM empleados WHERE numero_documento = '11223344'), '2024-04-02 08:50:00', 'Área de recepción', 'Leve', 'Violencia',
     'Diurno', 'Atención al público', (SELECT id FROM factores_riesgo WHERE nombre = 'Violencia laboral'), 
     'Agresión verbal y empujón por parte de usuario molesto',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Contusión simple'), 'Usuario agresivo', 'Agresión física',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Hombro derecho'),
     'Usuario insatisfecho agredió físicamente a empleada de recepción', false, null, null, 0,
     '2024-04-03', 'Reforzar protocolos de seguridad para atención al público', 'CERRADO', true),

    -- Accidente 12
    ((SELECT id FROM empleados WHERE numero_documento = '22334455'), '2024-04-09 14:30:00', 'Taller mecánico', 'Severo', 'Propios del trabajo',
     'Nocturno', 'Mantenimiento de vehículos', (SELECT id FROM factores_riesgo WHERE nombre = 'Maquinaria sin protección'), 
     'Atrapamiento de dedo en mecanismo de elevador hidráulico',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Fractura simple'), 'Elevador hidráulico', 'Atrapamiento',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Dedos mano derecha'),
     'Empleado introdujo mano en mecanismo sin detener equipo', true, '2024-04-10', '2024-05-24', 44,
     '2024-04-11', 'Instalar guardas de seguridad en equipos', 'CERRADO', false),

    -- Accidente 13
    ((SELECT id FROM empleados WHERE numero_documento = '33445566'), '2024-04-16 09:20:00', 'Cafetería', 'Leve', 'Propios del trabajo',
     'Diurno', 'Servicio de alimentación', (SELECT id FROM factores_riesgo WHERE nombre = 'Superficies resbaladizas'), 
     'Caída por derrame de líquido en el piso',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Contusión simple'), 'Piso con derrame', 'Caída al mismo nivel',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Cadera izquierda'),
     'Derrame de bebida no fue limpiado inmediatamente', false, null, null, 0,
     '2024-04-17', 'Implementar protocolo de limpieza inmediata de derrames', 'CERRADO', false),

    -- Accidente 14
    ((SELECT id FROM empleados WHERE numero_documento = '44556677'), '2024-04-23 16:45:00', 'Archivo general', 'Leve', 'Propios del trabajo',
     'Diurno', 'Organización de archivos', (SELECT id FROM factores_riesgo WHERE nombre = 'Posturas prolongadas'), 
     'Dolor lumbar por postura inadecuada durante organización de archivos',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Contusión simple'), 'Postura inadecuada', 'Sobreesfuerzo postural',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Espalda baja'),
     'Empleado mantuvo posición inclinada por tiempo prolongado', false, null, null, 0,
     '2024-04-24', 'Capacitación en higiene postural y pausas activas', 'CERRADO', false),

    -- Accidente 15
    ((SELECT id FROM empleados WHERE numero_documento = '55667788'), '2024-04-30 11:05:00', 'Laboratorio clínico', 'Severo', 'Propios del trabajo',
     'Diurno', 'Análisis de muestras', (SELECT id FROM factores_riesgo WHERE nombre = 'Virus y bacterias'), 
     'Pinchazo con aguja contaminada durante toma de muestra',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Corte superficial'), 'Aguja hipodérmica', 'Pinchazo accidental',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Dedos mano izquierda'),
     'Aguja se deslizó durante procedimiento y pinchó dedo del empleado', true, '2024-05-01', '2024-05-08', 7,
     '2024-05-02', 'Reforzar protocolos de bioseguridad y uso de dispositivos seguros', 'CERRADO', true),

    -- Accidente 16
    ((SELECT id FROM empleados WHERE numero_documento = '66778899'), '2024-05-07 13:25:00', 'Área de cómputo', 'Leve', 'Propios del trabajo',
     'Diurno', 'Soporte técnico', (SELECT id FROM factores_riesgo WHERE nombre = 'Instalaciones eléctricas defectuosas'), 
     'Descarga eléctrica leve al conectar equipo',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Quemadura primer grado'), 'Toma corriente defectuosa', 'Contacto eléctrico',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Pulgar derecho'),
     'Toma corriente tenía conexión defectuosa', false, null, null, 0,
     '2024-05-08', 'Revisión y mantenimiento de instalaciones eléctricas', 'CERRADO', false),

    -- Accidente 17
    ((SELECT id FROM empleados WHERE numero_documento = '77889900'), '2024-05-14 07:30:00', 'Parqueadero', 'Leve', 'Tránsito',
     'Diurno', 'Llegada al trabajo', (SELECT id FROM factores_riesgo WHERE nombre = 'Vendavales'), 
     'Golpe en cabeza con rama de árbol durante ventarrón',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Contusión simple'), 'Rama de árbol', 'Golpe por objeto en movimiento',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Cráneo'),
     'Vientos fuertes derribaron rama que golpeó a empleada', false, null, null, 0,
     '2024-05-15', 'Poda preventiva de árboles en áreas de tránsito', 'CERRADO', false),

    -- Accidente 18
    ((SELECT id FROM empleados WHERE numero_documento = '88990011'), '2024-05-21 15:15:00', 'Sala de juntas', 'Leve', 'Propios del trabajo',
     'Diurno', 'Reunión de trabajo', (SELECT id FROM factores_riesgo WHERE nombre = 'Estrés laboral'), 
     'Golpe en pierna con esquina de mesa durante reunión',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Contusión simple'), 'Esquina de mesa', 'Golpe contra objeto fijo',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Muslo derecho'),
     'Mesa con esquinas pronunciadas en espacio reducido', false, null, null, 0,
     '2024-05-22', 'Instalar protectores en esquinas de mobiliario', 'CERRADO', false),

    -- Accidente 19
    ((SELECT id FROM empleados WHERE numero_documento = '99001122'), '2024-05-28 10:40:00', 'Área de esterilización', 'Severo', 'Propios del trabajo',
     'Diurno', 'Esterilización de equipos', (SELECT id FROM factores_riesgo WHERE nombre = 'Temperaturas extremas'), 
     'Quemadura en brazo por vapor de autoclave',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Quemadura segundo grado'), 'Vapor de autoclave', 'Contacto con vapor',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Brazo derecho'),
     'Válvula de vapor se abrió inesperadamente durante mantenimiento', true, '2024-05-29', '2024-06-19', 21,
     '2024-05-30', 'Revisar sistema de seguridad de autoclaves', 'CERRADO', false),

    -- Accidente 20
    ((SELECT id FROM empleados WHERE numero_documento = '00112233'), '2024-06-04 12:50:00', 'Oficina contable', 'Leve', 'Propios del trabajo',
     'Diurno', 'Trabajo administrativo', (SELECT id FROM factores_riesgo WHERE nombre = 'Posturas prolongadas'), 
     'Dolor cervical por postura inadecuada frente al computador',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Contusión simple'), 'Postura inadecuada', 'Sobreesfuerzo postural',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Cuello anterior'),
     'Empleado trabajó 6 horas continuas sin pausas ni ajuste postural', false, null, null, 0,
     '2024-06-05', 'Ajuste ergonómico de puesto de trabajo y pausas activas', 'CERRADO', false),

    -- Accidente 21
    ((SELECT id FROM empleados WHERE numero_documento = '12345678'), '2024-06-11 14:20:00', 'Almacén de químicos', 'Grave', 'Propios del trabajo',
     'Diurno', 'Manejo de químicos', (SELECT id FROM factores_riesgo WHERE nombre = 'Gases tóxicos'), 
     'Inhalación de vapores tóxicos por fuga en contenedor',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Intoxicación leve'), 'Vapores químicos', 'Inhalación de sustancias tóxicas',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Sistema nervioso'),
     'Contenedor de químicos presentó fisura liberando vapores tóxicos', true, '2024-06-12', '2024-06-19', 7,
     '2024-06-13', 'Mejorar ventilación y protocolos de inspección de contenedores', 'CERRADO', true),

    -- Accidente 22
    ((SELECT id FROM empleados WHERE numero_documento = '23456789'), '2024-06-18 09:35:00', 'Área de carga', 'Severo', 'Propios del trabajo',
     'Nocturno', 'Carga y descarga', (SELECT id FROM factores_riesgo WHERE nombre = 'Manipulación manual de cargas'), 
     'Hernia discal por levantamiento repetitivo de cargas pesadas',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Lesión de columna'), 'Cajas pesadas', 'Sobreesfuerzo por levantamiento repetitivo',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Espalda baja'),
     'Empleado levantó más de 50 cajas de 25kg sin ayuda mecánica', true, '2024-06-19', '2024-08-12', 54,
     '2024-06-20', 'Implementar equipos de ayuda mecánica y rotación de personal', 'CERRADO', false),

    -- Accidente 23
    ((SELECT id FROM empleados WHERE numero_documento = '34567890'), '2024-06-25 16:10:00', 'Escaleras de emergencia', 'Leve', 'Propios del trabajo',
     'Diurno', 'Simulacro de evacuación', (SELECT id FROM factores_riesgo WHERE nombre = 'Iluminación deficiente'), 
     'Tropiezo en escaleras durante simulacro por falta de iluminación',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Contusión simple'), 'Escalón', 'Tropiezo',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Rodilla derecha'),
     'Iluminación de emergencia insuficiente en escaleras', false, null, null, 0,
     '2024-06-26', 'Mejorar sistema de iluminación de emergencia', 'CERRADO', false),

    -- Accidente 24
    ((SELECT id FROM empleados WHERE numero_documento = '45678901'), '2024-07-02 11:45:00', 'Taller de carpintería', 'Severo', 'Propios del trabajo',
     'Diurno', 'Trabajo en madera', (SELECT id FROM factores_riesgo WHERE nombre = 'Maquinaria sin protección'), 
     'Corte profundo en mano con sierra circular',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Corte profundo'), 'Sierra circular', 'Contacto con herramienta cortante',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Palma izquierda'),
     'Guarda de protección de sierra estaba retirada para trabajo específico', true, '2024-07-03', '2024-07-24', 21,
     '2024-07-04', 'Prohibir remoción de guardas de seguridad', 'CERRADO', false),

    -- Accidente 25
    ((SELECT id FROM empleados WHERE numero_documento = '56789012'), '2024-07-09 13:55:00', 'Área de descanso', 'Leve', 'Recreativo o cultural',
     'Diurno', 'Pausa de descanso', (SELECT id FROM factores_riesgo WHERE nombre = 'Sobreesfuerzo físico'), 
     'Torcedura de tobillo jugando fútbol en hora de almuerzo',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Esguince grado I'), 'Terreno irregular', 'Movimiento brusco',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Tobillo izquierdo'),
     'Empleado pisó hueco en cancha improvisada durante juego', false, null, null, 0,
     '2024-07-10', 'Acondicionar área deportiva y establecer reglas de seguridad', 'CERRADO', false),

    -- Accidente 26
    ((SELECT id FROM empleados WHERE numero_documento = '67890123'), '2024-07-16 08:25:00', 'Área de mantenimiento', 'Leve', 'Propios del trabajo',
     'Diurno', 'Mantenimiento preventivo', (SELECT id FROM factores_riesgo WHERE nombre = 'Maquinaria sin protección'), 
     'Corte en palma con destornillador que se deslizó',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Corte superficial'), 'Destornillador', 'Deslizamiento de herramienta',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Palma izquierda'),
     'Mango de destornillador resbaladizo por grasa', false, null, null, 0,
     '2024-07-17', 'Revisar estado de herramientas y proveer mangos antideslizantes', 'CERRADO', false),

    -- Accidente 27
    ((SELECT id FROM empleados WHERE numero_documento = '78901234'), '2024-07-23 15:30:00', 'Área de lavandería', 'Leve', 'Propios del trabajo',
     'Diurno', 'Lavado de ropa', (SELECT id FROM factores_riesgo WHERE nombre = 'Superficies resbaladizas'), 
     'Caída por piso mojado en área de lavandería',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Contusión simple'), 'Piso mojado', 'Caída al mismo nivel',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Codo derecho'),
     'Piso permanentemente húmedo por salpicaduras de lavadoras', false, null, null, 0,
     '2024-07-24', 'Instalar superficie antideslizante y mejorar drenaje', 'CERRADO', false),

    -- Accidente 28
    ((SELECT id FROM empleados WHERE numero_documento = '89012345'), '2024-07-30 10:15:00', 'Área de soldadura', 'Severo', 'Propios del trabajo',
     'Diurno', 'Soldadura estructural', (SELECT id FROM factores_riesgo WHERE nombre = 'Vapores químicos'), 
     'Intoxicación por inhalación de humos de soldadura',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Intoxicación leve'), 'Humos de soldadura', 'Inhalación de vapores tóxicos',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Sistema nervioso'),
     'Sistema de extracción de humos fuera de servicio', true, '2024-07-31', '2024-08-07', 7,
     '2024-08-01', 'Reparar sistema de extracción y uso obligatorio de respiradores', 'CERRADO', false),

    -- Accidente 29
    ((SELECT id FROM empleados WHERE numero_documento = '90123456'), '2024-08-06 12:40:00', 'Oficina de recursos humanos', 'Leve', 'Propios del trabajo',
     'Diurno', 'Trabajo administrativo', (SELECT id FROM factores_riesgo WHERE nombre = 'Estrés laboral'), 
     'Crisis de ansiedad por sobrecarga de trabajo',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Contusión simple'), 'Sobrecarga laboral', 'Estrés psicológico',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Sistema nervioso'),
     'Empleada con múltiples tareas urgentes sin apoyo adicional', true, '2024-08-07', '2024-08-14', 7,
     '2024-08-08', 'Redistribuir carga laboral y apoyo psicológico', 'CERRADO', true),

    -- Accidente 30
    ((SELECT id FROM empleados WHERE numero_documento = '01234567'), '2024-08-13 14:50:00', 'Área de pintura', 'Severo', 'Propios del trabajo',
     'Diurno', 'Pintura industrial', (SELECT id FROM factores_riesgo WHERE nombre = 'Vapores químicos'), 
     'Dermatitis por contacto con solventes sin protección',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Quemadura química'), 'Solvente industrial', 'Contacto dérmico',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Dedos mano derecha'),
     'Empleado manipuló solventes sin guantes de protección química', true, '2024-08-14', '2024-08-28', 14,
     '2024-08-15', 'Uso obligatorio de EPP químico y capacitación', 'CERRADO', false),

    -- Accidente 31
    ((SELECT id FROM empleados WHERE numero_documento = '11223344'), '2024-08-20 09:10:00', 'Recepción principal', 'Leve', 'Violencia',
     'Diurno', 'Atención al público', (SELECT id FROM factores_riesgo WHERE nombre = 'Violencia laboral'), 
     'Amenazas verbales por parte de usuario insatisfecho',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Contusión simple'), 'Usuario agresivo', 'Violencia verbal',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Sistema nervioso'),
     'Usuario molesto profirió amenazas contra empleada', false, null, null, 0,
     '2024-08-21', 'Reforzar protocolos de seguridad y apoyo psicológico', 'CERRADO', true),

    -- Accidente 32
    ((SELECT id FROM empleados WHERE numero_documento = '22334455'), '2024-08-27 16:35:00', 'Área de empaque', 'Leve', 'Propios del trabajo',
     'Nocturno', 'Empaque de productos', (SELECT id FROM factores_riesgo WHERE nombre = 'Movimientos repetitivos'), 
     'Dolor en muñeca por movimientos repetitivos de empaque',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Contusión simple'), 'Movimientos repetitivos', 'Sobreesfuerzo repetitivo',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Muñeca derecha'),
     'Empleado realizó 8 horas de empaque sin pausas ni rotación', false, null, null, 0,
     '2024-08-28', 'Implementar pausas activas y rotación de tareas', 'CERRADO', false),

    -- Accidente 33
    ((SELECT id FROM empleados WHERE numero_documento = '33445566'), '2024-09-03 11:20:00', 'Área de refrigeración', 'Leve', 'Propios del trabajo',
     'Diurno', 'Mantenimiento de equipos', (SELECT id FROM factores_riesgo WHERE nombre = 'Temperaturas extremas'), 
     'Principio de hipotermia por exposición prolongada al frío',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Contusión simple'), 'Cámara de refrigeración', 'Exposición a frío extremo',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Múltiples regiones'),
     'Empleado estuvo 3 horas en cámara frigorífica sin ropa térmica adecuada', false, null, null, 0,
     '2024-09-04', 'Proveer ropa térmica y limitar tiempo de exposición', 'CERRADO', false),

    -- Accidente 34
    ((SELECT id FROM empleados WHERE numero_documento = '44556677'), '2024-09-10 13:45:00', 'Biblioteca', 'Leve', 'Propios del trabajo',
     'Diurno', 'Organización de libros', (SELECT id FROM factores_riesgo WHERE nombre = 'Trabajo en alturas'), 
     'Caída de escalera de biblioteca al alcanzar libro en estante alto',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Contusión simple'), 'Escalera de biblioteca', 'Caída desde altura menor',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Espalda alta'),
     'Escalera no tenía sistema de seguridad y empleado perdió equilibrio', false, null, null, 0,
     '2024-09-11', 'Instalar escaleras con sistema de seguridad', 'CERRADO', false),

    -- Accidente 35
    ((SELECT id FROM empleados WHERE numero_documento = '55667788'), '2024-09-17 07:55:00', 'Laboratorio de microbiología', 'Grave', 'Propios del trabajo',
     'Diurno', 'Análisis microbiológico', (SELECT id FROM factores_riesgo WHERE nombre = 'Virus y bacterias'), 
     'Exposición a bacteria patógena por rotura de cultivo',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Intoxicación leve'), 'Cultivo bacteriano', 'Exposición a agente biológico',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Sistema nervioso'),
     'Placa de cultivo se rompió liberando aerosoles con bacteria patógena', true, '2024-09-18', '2024-09-25', 7,
     '2024-09-19', 'Reforzar protocolos de bioseguridad nivel 3', 'EN_INVESTIGACION', true),

    -- Accidente 36
    ((SELECT id FROM empleados WHERE numero_documento = '66778899'), '2024-09-24 15:25:00', 'Sala de servidores', 'Leve', 'Propios del trabajo',
     'Diurno', 'Mantenimiento de equipos', (SELECT id FROM factores_riesgo WHERE nombre = 'Iluminación deficiente'), 
     'Golpe en cabeza con rack de servidores por poca iluminación',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Contusión simple'), 'Rack de servidores', 'Golpe contra objeto fijo',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Cráneo'),
     'Iluminación insuficiente en pasillo entre racks', false, null, null, 0,
     null, null, 'ABIERTO', true),

    -- Accidente 37
    ((SELECT id FROM empleados WHERE numero_documento = '77889900'), '2024-09-25 10:30:00', 'Área de radiología', 'Severo', 'Propios del trabajo',
     'Diurno', 'Toma de radiografías', (SELECT id FROM factores_riesgo WHERE nombre = 'Radiaciones ionizantes'), 
     'Sobreexposición a radiación por falla en blindaje',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Quemadura química'), 'Equipo de rayos X', 'Exposición a radiación ionizante',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Múltiples regiones'),
     'Blindaje de plomo presentó fisura permitiendo fuga de radiación', true, '2024-09-26', null, 0,
     null, null, 'EN_INVESTIGACION', true),

    -- Accidente 38
    ((SELECT id FROM empleados WHERE numero_documento = '88990011'), '2024-09-25 12:15:00', 'Oficina legal', 'Leve', 'Propios del trabajo',
     'Diurno', 'Trabajo jurídico', (SELECT id FROM factores_riesgo WHERE nombre = 'Estrés laboral'), 
     'Dolor de cabeza tensional por estrés de audiencia importante',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Contusión simple'), 'Estrés laboral', 'Tensión psicológica',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Cráneo'),
     'Empleado con alta presión por caso legal complejo', false, null, null, 0,
     null, null, 'ABIERTO', true),

    -- Accidente 39
    ((SELECT id FROM empleados WHERE numero_documento = '99001122'), '2024-09-25 14:40:00', 'Área de esterilización', 'Leve', 'Propios del trabajo',
     'Diurno', 'Esterilización de instrumental', (SELECT id FROM factores_riesgo WHERE nombre = 'Temperaturas extremas'), 
     'Quemadura menor en dedo al tocar instrumental caliente',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Quemadura primer grado'), 'Instrumental caliente', 'Contacto con superficie caliente',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Dedos mano derecha'),
     'Empleada tocó instrumental recién esterilizado sin esperar enfriamiento', false, null, null, 0,
     null, null, 'ABIERTO', true),

    -- Accidente 40
    ((SELECT id FROM empleados WHERE numero_documento = '00112233'), '2024-09-25 16:20:00', 'Área contable', 'Leve', 'Propios del trabajo',
     'Diurno', 'Trabajo con documentos', (SELECT id FROM factores_riesgo WHERE nombre = 'Posturas prolongadas'), 
     'Dolor cervical por postura inadecuada durante revisión de documentos',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Contusión simple'), 'Postura inadecuada', 'Sobreesfuerzo postural',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Cuello anterior'),
     'Empleado revisó documentos en escritorio bajo durante 4 horas', false, null, null, 0,
     null, null, 'ABIERTO', true),

    -- Accidente 41
    ((SELECT id FROM empleados WHERE numero_documento = '12345678'), '2024-09-25 08:45:00', 'Área de producción', 'Leve', 'Propios del trabajo',
     'Diurno', 'Operación de maquinaria', (SELECT id FROM factores_riesgo WHERE nombre = 'Ruido'), 
     'Molestia auditiva por exposición a ruido excesivo',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Lesión auditiva'), 'Maquinaria ruidosa', 'Exposición a ruido',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Oídos'),
     'Protectores auditivos defectuosos no proporcionaron protección adecuada', false, null, null, 0,
     null, null, 'ABIERTO', true),

    -- Accidente 42
    ((SELECT id FROM empleados WHERE numero_documento = '23456789'), '2024-09-25 11:30:00', 'Almacén general', 'Leve', 'Propios del trabajo',
     'Diurno', 'Inventario de productos', (SELECT id FROM factores_riesgo WHERE nombre = 'Iluminación deficiente'), 
     'Tropiezo con caja por falta de iluminación en pasillo',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Contusión simple'), 'Caja en el piso', 'Tropiezo',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Pie derecho'),
     'Luminaria fundida en pasillo de almacén no fue reemplazada', false, null, null, 0,
     null, null, 'ABIERTO', true),

    -- Accidente 43
    ((SELECT id FROM empleados WHERE numero_documento = '34567890'), '2024-09-25 13:50:00', 'Área de limpieza', 'Leve', 'Propios del trabajo',
     'Diurno', 'Limpieza de oficinas', (SELECT id FROM factores_riesgo WHERE nombre = 'Líquidos corrosivos'), 
     'Irritación en ojos por salpicadura de producto de limpieza',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Lesión ocular'), 'Producto de limpieza', 'Salpicadura química',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Ojos'),
     'Empleada no utilizó protección ocular al mezclar productos de limpieza', false, null, null, 0,
     null, null, 'ABIERTO', true),

    -- Accidente 44
    ((SELECT id FROM empleados WHERE numero_documento = '45678901'), '2024-09-25 09:25:00', 'Taller eléctrico', 'Severo', 'Propios del trabajo',
     'Diurno', 'Instalación eléctrica', (SELECT id FROM factores_riesgo WHERE nombre = 'Instalaciones eléctricas defectuosas'), 
     'Descarga eléctrica durante instalación de circuito',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Electrocución severa'), 'Circuito eléctrico', 'Contacto eléctrico directo',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Brazo derecho'),
     'Circuito no estaba desenergizado como se creía', true, null, null, 0,
     null, null, 'ABIERTO', true),

    -- Accidente 45
    ((SELECT id FROM empleados WHERE numero_documento = '56789012'), '2024-09-25 15:10:00', 'Laboratorio químico', 'Grave', 'Propios del trabajo',
     'Diurno', 'Síntesis química', (SELECT id FROM factores_riesgo WHERE nombre = 'Líquidos corrosivos'), 
     'Quemadura química por derrame de ácido sulfúrico',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Quemadura química'), 'Ácido sulfúrico', 'Derrame de sustancia corrosiva',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Muslo izquierdo'),
     'Recipiente de ácido se rompió durante traslado', true, null, null, 0,
     null, null, 'ABIERTO', true),

    -- Accidente 46
    ((SELECT id FROM empleados WHERE numero_documento = '67890123'), '2024-09-25 17:30:00', 'Área de mantenimiento', 'Leve', 'Propios del trabajo',
     'Nocturno', 'Reparación de equipos', (SELECT id FROM factores_riesgo WHERE nombre = 'Maquinaria sin protección'), 
     'Corte en mano con lima desgastada',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Corte superficial'), 'Lima desgastada', 'Corte con herramienta',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Palma derecha'),
     'Herramienta en mal estado se deslizó durante uso', false, null, null, 0,
     null, null, 'ABIERTO', true),

    -- Accidente 47
    ((SELECT id FROM empleados WHERE numero_documento = '78901234'), '2024-09-25 06:45:00', 'Cocina industrial', 'Leve', 'Propios del trabajo',
     'Nocturno', 'Preparación de alimentos', (SELECT id FROM factores_riesgo WHERE nombre = 'Superficies resbaladizas'), 
     'Resbalón por grasa derramada en piso de cocina',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Contusión simple'), 'Piso con grasa', 'Caída al mismo nivel',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Cadera derecha'),
     'Grasa derramada durante preparación nocturna no fue limpiada inmediatamente', false, null, null, 0,
     null, null, 'ABIERTO', true),

    -- Accidente 48
    ((SELECT id FROM empleados WHERE numero_documento = '89012345'), '2024-09-25 20:15:00', 'Área de soldadura', 'Severo', 'Propios del trabajo',
     'Nocturno', 'Soldadura de reparación', (SELECT id FROM factores_riesgo WHERE nombre = 'Radiaciones ionizantes'), 
     'Quemadura por arco eléctrico en soldadura nocturna',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Quemadura segundo grado'), 'Arco de soldadura', 'Exposición a arco eléctrico',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Antebrazo izquierdo'),
     'Manga de camisa no proporcionó protección suficiente contra chispas', true, null, null, 0,
     null, null, 'ABIERTO', true),

    -- Accidente 49
    ((SELECT id FROM empleados WHERE numero_documento = '90123456'), '2024-09-25 22:40:00', 'Área de vigilancia', 'Leve', 'Violencia',
     'Nocturno', 'Vigilancia y seguridad', (SELECT id FROM factores_riesgo WHERE nombre = 'Violencia laboral'), 
     'Agresión verbal por parte de persona en estado de embriaguez',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Contusión simple'), 'Persona embriagada', 'Violencia verbal',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Sistema nervioso'),
     'Persona ebria intentó ingresar a instalaciones y agredió verbalmente al vigilante', false, null, null, 0,
     null, null, 'ABIERTO', true),

    -- Accidente 50
    ((SELECT id FROM empleados WHERE numero_documento = '01234567'), '2024-09-25 23:55:00', 'Área de carga nocturna', 'Severo', 'Propios del trabajo',
     'Nocturno', 'Carga de camiones', (SELECT id FROM factores_riesgo WHERE nombre = 'Iluminación deficiente'), 
     'Caída desde plataforma de carga por falta de iluminación',
     (SELECT id FROM tipos_lesion WHERE nombre = 'Fractura simple'), 'Plataforma de carga', 'Caída desde altura',
     (SELECT id FROM partes_cuerpo WHERE nombre = 'Muñeca izquierda'),
     'Iluminación exterior insuficiente en área de carga nocturna', true, null, null, 0,
     null, null, 'ABIERTO', true);

-- Update statistics
ANALYZE empleados;
ANALYZE accidentes;
