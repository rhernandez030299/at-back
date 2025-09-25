const {
    VALID_SEVERITIES,
    VALID_ACCIDENT_TYPES,
    VALID_BODY_PARTS,
    VALID_INJURY_TYPES,
    VALID_RISK_FACTORS,
    VALID_TURNOS,
    VALID_ESTADOS
} = require('../../application/validations/accidentValidation');

// Accident route schemas for validation
const accidentSchemas = {
    createAccident: {
        body: {
            type: 'object',
            required: [
                'employeeId', 'fechaAccidente', 'lugarAccidente', 'severidad',
                'tipoAccidente', 'area', 'cargo', 'turno', 'servicioAPrestar',
                'factorRiesgo', 'descripcionAccidente', 'tipoLesion',
                'agenteDelAccidente', 'mecanismoDelAccidente', 'parteCuerpoAfectada',
                'situacionDelAccidente'
            ],
            properties: {
                employeeId: { type: 'string', format: 'uuid' },
                fechaAccidente: { type: 'string', format: 'date-time' },
                lugarAccidente: { type: 'string', minLength: 1, maxLength: 255 },
                severidad: { type: 'string', enum: VALID_SEVERITIES },
                tipoAccidente: { type: 'string', enum: VALID_ACCIDENT_TYPES },
                area: { type: 'string', minLength: 1, maxLength: 255 },
                cargo: { type: 'string', minLength: 1, maxLength: 255 },
                turno: { type: 'string', enum: VALID_TURNOS },
                servicioAPrestar: { type: 'string', minLength: 1, maxLength: 255 },
                factorRiesgo: { type: 'string', enum: VALID_RISK_FACTORS },
                descripcionAccidente: { type: 'string', minLength: 10, maxLength: 5000 },
                tipoLesion: { type: 'string', enum: VALID_INJURY_TYPES },
                agenteDelAccidente: { type: 'string', minLength: 1, maxLength: 255 },
                mecanismoDelAccidente: { type: 'string', minLength: 1, maxLength: 255 },
                parteCuerpoAfectada: { type: 'string', enum: VALID_BODY_PARTS },
                situacionDelAccidente: { type: 'string', minLength: 10, maxLength: 5000 },
                tieneIncapacidad: { type: 'boolean' },
                fechaInicioIncapacidad: { type: 'string', format: 'date', nullable: true },
                fechaFinIncapacidad: { type: 'string', format: 'date', nullable: true },
                diasIncapacidad: { type: 'integer', minimum: 0 },
                fechaInvestigacion: { type: 'string', format: 'date', nullable: true },
                descripcionInvestigacion: { type: 'string', maxLength: 5000, nullable: true },
                fechaEjecucionAcciones: { type: 'string', format: 'date', nullable: true },
                fechaVerificacionAcciones: { type: 'string', format: 'date', nullable: true },
                estado: { type: 'string', enum: VALID_ESTADOS },
                requiereSeguimiento: { type: 'boolean' }
            }
        }
    },

    updateAccident: {
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
                employeeId: { type: 'string', format: 'uuid' },
                fechaAccidente: { type: 'string', format: 'date-time' },
                lugarAccidente: { type: 'string', minLength: 1, maxLength: 255 },
                severidad: { type: 'string', enum: VALID_SEVERITIES },
                tipoAccidente: { type: 'string', enum: VALID_ACCIDENT_TYPES },
                area: { type: 'string', minLength: 1, maxLength: 255 },
                cargo: { type: 'string', minLength: 1, maxLength: 255 },
                turno: { type: 'string', enum: VALID_TURNOS },
                servicioAPrestar: { type: 'string', minLength: 1, maxLength: 255 },
                factorRiesgo: { type: 'string', enum: VALID_RISK_FACTORS },
                descripcionAccidente: { type: 'string', minLength: 10, maxLength: 5000 },
                tipoLesion: { type: 'string', enum: VALID_INJURY_TYPES },
                agenteDelAccidente: { type: 'string', minLength: 1, maxLength: 255 },
                mecanismoDelAccidente: { type: 'string', minLength: 1, maxLength: 255 },
                parteCuerpoAfectada: { type: 'string', enum: VALID_BODY_PARTS },
                situacionDelAccidente: { type: 'string', minLength: 10, maxLength: 5000 },
                tieneIncapacidad: { type: 'boolean' },
                fechaInicioIncapacidad: { type: 'string', format: 'date', nullable: true },
                fechaFinIncapacidad: { type: 'string', format: 'date', nullable: true },
                diasIncapacidad: { type: 'integer', minimum: 0 },
                fechaInvestigacion: { type: 'string', format: 'date', nullable: true },
                descripcionInvestigacion: { type: 'string', maxLength: 5000, nullable: true },
                fechaEjecucionAcciones: { type: 'string', format: 'date', nullable: true },
                fechaVerificacionAcciones: { type: 'string', format: 'date', nullable: true },
                estado: { type: 'string', enum: VALID_ESTADOS },
                requiereSeguimiento: { type: 'boolean' }
            }
        }
    },

    getAccident: {
        params: {
            type: 'object',
            required: ['id'],
            properties: {
                id: { type: 'string', format: 'uuid' }
            }
        }
    },

    deleteAccident: {
        params: {
            type: 'object',
            required: ['id'],
            properties: {
                id: { type: 'string', format: 'uuid' }
            }
        }
    },

    getAccidentsByEmployee: {
        params: {
            type: 'object',
            required: ['employeeId'],
            properties: {
                employeeId: { type: 'string', format: 'uuid' }
            }
        }
    },

    getAllAccidents: {
        querystring: {
            type: 'object',
            properties: {
                employeeId: { type: 'string', format: 'uuid' },
                severidad: { type: 'string', enum: VALID_SEVERITIES },
                tipoAccidente: { type: 'string', enum: VALID_ACCIDENT_TYPES },
                factorRiesgo: { type: 'string', enum: VALID_RISK_FACTORS },
                tipoLesion: { type: 'string', enum: VALID_INJURY_TYPES },
                parteCuerpoAfectada: { type: 'string', enum: VALID_BODY_PARTS },
                turno: { type: 'string', enum: VALID_TURNOS },
                area: { type: 'string' },
                cargo: { type: 'string' },
                tieneIncapacidad: { type: 'boolean' },
                estado: { type: 'string', enum: VALID_ESTADOS },
                fechaDesde: { type: 'string', format: 'date' },
                fechaHasta: { type: 'string', format: 'date' },
                limit: { type: 'integer', minimum: 1, maximum: 100 },
                offset: { type: 'integer', minimum: 0 }
            }
        }
    }
};

async function accidentRoutes(fastify, options) {
    const { accidentController } = options;

    // Create accident
    fastify.post('/accidents', {
        schema: accidentSchemas.createAccident
    }, async (request, reply) => {
        return accidentController.createAccident(request, reply);
    });

    // Get all accidents
    fastify.get('/accidents', {
        schema: accidentSchemas.getAllAccidents
    }, async (request, reply) => {
        return accidentController.getAllAccidents(request, reply);
    });

    // Get accident by ID
    fastify.get('/accidents/:id', {
        schema: accidentSchemas.getAccident
    }, async (request, reply) => {
        return accidentController.getAccident(request, reply);
    });

    // Get accidents by employee ID
    fastify.get('/employees/:employeeId/accidents', {
        schema: accidentSchemas.getAccidentsByEmployee
    }, async (request, reply) => {
        return accidentController.getAccidentsByEmployee(request, reply);
    });

    // Update accident
    fastify.put('/accidents/:id', {
        schema: accidentSchemas.updateAccident
    }, async (request, reply) => {
        return accidentController.updateAccident(request, reply);
    });

    // Delete accident
    fastify.delete('/accidents/:id', {
        schema: accidentSchemas.deleteAccident
    }, async (request, reply) => {
        return accidentController.deleteAccident(request, reply);
    });

    // Get accident statistics endpoint
    fastify.get('/accidents/statistics/summary', async (request, reply) => {
        try {
            // This could be implemented as a separate use case if needed
            reply.code(200).send({
                success: true,
                message: 'Statistics endpoint - to be implemented with specific use case'
            });
        } catch (error) {
            reply.code(500).send({
                success: false,
                error: error.message
            });
        }
    });
}

module.exports = accidentRoutes;

