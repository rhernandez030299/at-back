// Accidente route schemas for validation
const accidenteSchemas = {
    createAccidente: {
        body: {
            type: 'object',
            required: [
                'empleadoId', 'fechaAccidente', 'lugarAccidente', 'severidad', 'tipoAccidente',
                'turno', 'servicioAPrestar', 'factorRiesgoId',
                'descripcionAccidente', 'tipoLesionId', 'agenteDelAccidente', 
                'mecanismoDelAccidente', 'parteCuerpoAfectadaId', 'situacionDelAccidente'
            ],
            properties: {
                empleadoId: { type: 'string', format: 'uuid' },
                fechaAccidente: { type: 'string', format: 'date-time' },
                lugarAccidente: { type: 'string', minLength: 1, maxLength: 255 },
                severidad: { type: 'string', enum: ['Leve', 'Severo', 'Grave', 'Mortal'] },
                tipoAccidente: { 
                    type: 'string', 
                    enum: ['Propios del trabajo', 'Violencia', 'Tránsito', 'Deportivo', 'Recreativo o cultural'] 
                },
                turno: { type: 'string', enum: ['Diurno', 'Nocturno'] },
                servicioAPrestar: { type: 'string', minLength: 1, maxLength: 255 },
                factorRiesgoId: { type: 'string', format: 'uuid' },
                descripcionAccidente: { type: 'string', minLength: 10, maxLength: 2000 },
                tipoLesionId: { type: 'string', format: 'uuid' },
                agenteDelAccidente: { type: 'string', minLength: 1, maxLength: 255 },
                mecanismoDelAccidente: { type: 'string', minLength: 1, maxLength: 255 },
                parteCuerpoAfectadaId: { type: 'string', format: 'uuid' },
                situacionDelAccidente: { type: 'string', minLength: 10, maxLength: 2000 },
                tieneIncapacidad: { type: 'boolean' },
                fechaInicioIncapacidad: { type: 'string', format: 'date', nullable: true },
                fechaFinIncapacidad: { type: 'string', format: 'date', nullable: true },
                diasIncapacidad: { type: 'integer', minimum: 0, maximum: 365 },
                estado: { type: 'string', enum: ['ABIERTO', 'EN_INVESTIGACION', 'CERRADO'] },
                requiereSeguimiento: { type: 'boolean' }
            }
        }
    },

    updateAccidente: {
        params: {
            type: 'object',
            required: ['id'],
            properties: {
                id: { type: 'string', format: 'uuid' }
            }
        },
        body: {
            type: 'object',
            properties: {
                empleadoId: { type: 'string', format: 'uuid' },
                fechaAccidente: { type: 'string', format: 'date-time' },
                lugarAccidente: { type: 'string', minLength: 1, maxLength: 255 },
                severidad: { type: 'string', enum: ['Leve', 'Severo', 'Grave', 'Mortal'] },
                tipoAccidente: { 
                    type: 'string', 
                    enum: ['Propios del trabajo', 'Violencia', 'Tránsito', 'Deportivo', 'Recreativo o cultural'] 
                },
                turno: { type: 'string', enum: ['Diurno', 'Nocturno'] },
                servicioAPrestar: { type: 'string', minLength: 1, maxLength: 255 },
                factorRiesgoId: { type: 'string', format: 'uuid' },
                descripcionAccidente: { type: 'string', minLength: 10, maxLength: 2000 },
                tipoLesionId: { type: 'string', format: 'uuid' },
                agenteDelAccidente: { type: 'string', minLength: 1, maxLength: 255 },
                mecanismoDelAccidente: { type: 'string', minLength: 1, maxLength: 255 },
                parteCuerpoAfectadaId: { type: 'string', format: 'uuid' },
                situacionDelAccidente: { type: 'string', minLength: 10, maxLength: 2000 },
                tieneIncapacidad: { type: 'boolean' },
                fechaInicioIncapacidad: { type: 'string', format: 'date-time', nullable: true },
                fechaFinIncapacidad: { type: 'string', format: 'date-time', nullable: true },
                diasIncapacidad: { type: 'integer', minimum: 0, maximum: 365 },
                fechaInvestigacion: { type: 'string', format: 'date-time', nullable: true },
                descripcionInvestigacion: { type: 'string', maxLength: 2000, nullable: true },
                fechaEjecucionAcciones: { type: 'string', format: 'date-time', nullable: true },
                fechaVerificacionAcciones: { type: 'string', format: 'date-time', nullable: true },
                estado: { type: 'string', enum: ['ABIERTO', 'EN_INVESTIGACION', 'CERRADO'] },
                requiereSeguimiento: { type: 'boolean' }
            }
        }
    },

    getAccidente: {
        params: {
            type: 'object',
            required: ['id'],
            properties: {
                id: { type: 'string', format: 'uuid' }
            }
        }
    },

    deleteAccidente: {
        params: {
            type: 'object',
            required: ['id'],
            properties: {
                id: { type: 'string', format: 'uuid' }
            }
        }
    },

    getAllAccidentes: {
        querystring: {
            type: 'object',
            properties: {
                empleadoId: { type: 'string', format: 'uuid' },
                severidad: { type: 'string', enum: ['Leve', 'Severo', 'Grave', 'Mortal'] },
                tipoAccidente: { 
                    type: 'string', 
                    enum: ['Propios del trabajo', 'Violencia', 'Tránsito', 'Deportivo', 'Recreativo o cultural'] 
                },
                estado: { type: 'string', enum: ['ABIERTO', 'EN_INVESTIGACION', 'CERRADO'] },
                tieneIncapacidad: { type: 'boolean' },
                fechaDesde: { type: 'string', format: 'date-time' },
                fechaHasta: { type: 'string', format: 'date-time' },
                limit: { type: 'integer', minimum: 1, maximum: 100 },
                offset: { type: 'integer', minimum: 0 }
            }
        }
    },

    getAccidentesByEmpleado: {
        params: {
            type: 'object',
            required: ['empleadoId'],
            properties: {
                empleadoId: { type: 'string', format: 'uuid' }
            }
        }
    },

    getEstadisticasAccidentes: {
        querystring: {
            type: 'object',
            properties: {
                year: { type: 'integer', minimum: 2000, maximum: 2100 }
            }
        }
    }
};

async function accidenteRoutes(fastify, options) {
    const { accidenteController } = options;

    // Create accidente
    fastify.post('/accidentes', {
        schema: accidenteSchemas.createAccidente
    }, async (request, reply) => {
        return accidenteController.createAccidente(request, reply);
    });

    // Get all accidentes
    fastify.get('/accidentes', {
        schema: accidenteSchemas.getAllAccidentes
    }, async (request, reply) => {
        return accidenteController.getAllAccidentes(request, reply);
    });

    // Get accidente by ID
    fastify.get('/accidentes/:id', {
        schema: accidenteSchemas.getAccidente
    }, async (request, reply) => {
        return accidenteController.getAccidente(request, reply);
    });

    // Update accidente
    fastify.put('/accidentes/:id', {
        schema: accidenteSchemas.updateAccidente
    }, async (request, reply) => {
        return accidenteController.updateAccidente(request, reply);
    });

    // Delete accidente
    fastify.delete('/accidentes/:id', {
        schema: accidenteSchemas.deleteAccidente
    }, async (request, reply) => {
        return accidenteController.deleteAccidente(request, reply);
    });

    // Get accidentes by empleado
    fastify.get('/empleados/:empleadoId/accidentes', {
        schema: accidenteSchemas.getAccidentesByEmpleado
    }, async (request, reply) => {
        return accidenteController.getAccidentesByEmpleado(request, reply);
    });

    // Get estadísticas de accidentes
    fastify.get('/accidentes/estadisticas', {
        schema: accidenteSchemas.getEstadisticasAccidentes
    }, async (request, reply) => {
        return accidenteController.getEstadisticasAccidentes(request, reply);
    });
}

module.exports = accidenteRoutes;
