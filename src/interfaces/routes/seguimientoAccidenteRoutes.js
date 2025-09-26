const { TIPOS_SEGUIMIENTO, ESTADOS_SALUD } = require('../../application/validations/seguimientoAccidenteValidation');

const seguimientoAccidenteSchemas = {
    // Schema para crear seguimiento
    createSeguimiento: {
        body: {
            type: 'object',
            required: ['accidenteId', 'fechaSeguimiento', 'tipoSeguimiento', 'descripcion', 'responsable'],
            properties: {
                accidenteId: { type: 'string', format: 'uuid' },
                fechaSeguimiento: { type: 'string', format: 'date-time' },
                tipoSeguimiento: { type: 'string', enum: TIPOS_SEGUIMIENTO },
                descripcion: { type: 'string', minLength: 10, maxLength: 2000 },
                responsable: { type: 'string', minLength: 2, maxLength: 255 },
                estadoSalud: { 
                    anyOf: [
                        { type: 'string', enum: ESTADOS_SALUD },
                        { type: 'null' }
                    ]
                },
                porcentajeRecuperacion: { type: 'integer', minimum: 0, maximum: 100, nullable: true },
                restriccionesLaborales: { type: 'string', maxLength: 1000, nullable: true },
                fechaProbableReintegro: { type: 'string', format: 'date-time', nullable: true },
                documentosPendientes: { type: 'string', maxLength: 1000, nullable: true },
                gestionesRealizadas: { type: 'string', maxLength: 1000, nullable: true },
                proximaAccion: { type: 'string', maxLength: 500, nullable: true },
                fechaProximaAccion: { type: 'string', format: 'date-time', nullable: true },
                seguimientoCompletado: { type: 'boolean', default: false },
                observaciones: { type: 'string', maxLength: 1000, nullable: true }
            },
            additionalProperties: false
        },
        response: {
            201: {
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    data: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', format: 'uuid' },
                            accidenteId: { type: 'string', format: 'uuid' },
                            fechaSeguimiento: { type: 'string', format: 'date-time' },
                            tipoSeguimiento: { type: 'string' },
                            descripcion: { type: 'string' },
                            responsable: { type: 'string' },
                            estadoSalud: { 
                                anyOf: [
                                    { type: 'string' },
                                    { type: 'null' }
                                ]
                            },
                            porcentajeRecuperacion: { type: 'integer', nullable: true },
                            restriccionesLaborales: { type: 'string', nullable: true },
                            fechaProbableReintegro: { type: 'string', format: 'date-time', nullable: true },
                            documentosPendientes: { type: 'string', nullable: true },
                            gestionesRealizadas: { type: 'string', nullable: true },
                            proximaAccion: { type: 'string', nullable: true },
                            fechaProximaAccion: { type: 'string', format: 'date-time', nullable: true },
                            seguimientoCompletado: { type: 'boolean' },
                            observaciones: { type: 'string', nullable: true },
                            creadoEn: { type: 'string', format: 'date-time' },
                            actualizadoEn: { type: 'string', format: 'date-time' }
                        }
                    },
                    message: { type: 'string' }
                }
            }
        }
    },

    // Schema para obtener seguimiento por ID
    getSeguimiento: {
        params: {
            type: 'object',
            required: ['id'],
            properties: {
                id: { type: 'string', format: 'uuid' }
            }
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    data: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', format: 'uuid' },
                            accidenteId: { type: 'string', format: 'uuid' },
                            fechaSeguimiento: { type: 'string', format: 'date-time' },
                            tipoSeguimiento: { type: 'string' },
                            descripcion: { type: 'string' },
                            responsable: { type: 'string' },
                            estadoSalud: { 
                                anyOf: [
                                    { type: 'string' },
                                    { type: 'null' }
                                ]
                            },
                            porcentajeRecuperacion: { type: 'integer', nullable: true },
                            restriccionesLaborales: { type: 'string', nullable: true },
                            fechaProbableReintegro: { type: 'string', format: 'date-time', nullable: true },
                            documentosPendientes: { type: 'string', nullable: true },
                            gestionesRealizadas: { type: 'string', nullable: true },
                            proximaAccion: { type: 'string', nullable: true },
                            fechaProximaAccion: { type: 'string', format: 'date-time', nullable: true },
                            seguimientoCompletado: { type: 'boolean' },
                            observaciones: { type: 'string', nullable: true },
                            creadoEn: { type: 'string', format: 'date-time' },
                            actualizadoEn: { type: 'string', format: 'date-time' },
                            accidente: {
                                type: 'object',
                                properties: {
                                    fechaAccidente: { type: 'string', format: 'date-time' },
                                    descripcionAccidente: { type: 'string' }
                                }
                            },
                            empleado: {
                                type: 'object',
                                properties: {
                                    nombres: { type: 'string' },
                                    apellidos: { type: 'string' },
                                    numeroDocumento: { type: 'string' },
                                    nombreCompleto: { type: 'string' }
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    // Schema para obtener todos los seguimientos
    getAllSeguimientos: {
        querystring: {
            type: 'object',
            properties: {
                tipoSeguimiento: { type: 'string', enum: TIPOS_SEGUIMIENTO },
                responsable: { type: 'string', minLength: 2 },
                estadoSalud: { type: 'string', enum: ESTADOS_SALUD },
                seguimientoCompletado: { type: 'boolean' },
                fechaDesde: { type: 'string', format: 'date-time' },
                fechaHasta: { type: 'string', format: 'date-time' },
                limit: { type: 'integer', minimum: 1, maximum: 100 },
                offset: { type: 'integer', minimum: 0 },
                orderBy: { 
                    type: 'string', 
                    enum: ['fecha_seguimiento', 'tipo_seguimiento', 'responsable', 'seguimiento_completado', 'creado_en'] 
                },
                orderDirection: { type: 'string', enum: ['ASC', 'DESC'] }
            }
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    data: {
                        type: 'object',
                        properties: {
                            seguimientos: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'string', format: 'uuid' },
                                        accidenteId: { type: 'string', format: 'uuid' },
                                        fechaSeguimiento: { type: 'string', format: 'date-time' },
                                        tipoSeguimiento: { type: 'string' },
                                        descripcion: { type: 'string' },
                                        responsable: { type: 'string' },
                                        estadoSalud: { 
                                anyOf: [
                                    { type: 'string' },
                                    { type: 'null' }
                                ]
                            },
                                        seguimientoCompletado: { type: 'boolean' },
                                        accidente: { type: 'object' },
                                        empleado: { type: 'object' }
                                    }
                                }
                            },
                            total: { type: 'integer' },
                            page: { type: 'integer' },
                            limit: { type: 'integer' },
                            totalPages: { type: 'integer' }
                        }
                    }
                }
            }
        }
    },

    // Schema para obtener seguimientos por accidente
    getSeguimientosByAccidente: {
        params: {
            type: 'object',
            required: ['accidenteId'],
            properties: {
                accidenteId: { type: 'string', format: 'uuid' }
            }
        },
        querystring: {
            type: 'object',
            properties: {
                limit: { type: 'integer', minimum: 1, maximum: 100 },
                offset: { type: 'integer', minimum: 0 },
                orderBy: { 
                    type: 'string', 
                    enum: ['fecha_seguimiento', 'tipo_seguimiento', 'responsable', 'seguimiento_completado', 'creado_en'] 
                },
                orderDirection: { type: 'string', enum: ['ASC', 'DESC'] }
            }
        }
    },

    // Schema para actualizar seguimiento
    updateSeguimiento: {
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
                fechaSeguimiento: { type: 'string', format: 'date-time' },
                tipoSeguimiento: { type: 'string', enum: TIPOS_SEGUIMIENTO },
                descripcion: { type: 'string', minLength: 10, maxLength: 2000 },
                responsable: { type: 'string', minLength: 2, maxLength: 255 },
                estadoSalud: { 
                    anyOf: [
                        { type: 'string', enum: ESTADOS_SALUD },
                        { type: 'null' }
                    ]
                },
                porcentajeRecuperacion: { type: 'integer', minimum: 0, maximum: 100, nullable: true },
                restriccionesLaborales: { type: 'string', maxLength: 1000, nullable: true },
                fechaProbableReintegro: { type: 'string', format: 'date-time', nullable: true },
                documentosPendientes: { type: 'string', maxLength: 1000, nullable: true },
                gestionesRealizadas: { type: 'string', maxLength: 1000, nullable: true },
                proximaAccion: { type: 'string', maxLength: 500, nullable: true },
                fechaProximaAccion: { type: 'string', format: 'date-time', nullable: true },
                seguimientoCompletado: { type: 'boolean' },
                observaciones: { type: 'string', maxLength: 1000, nullable: true }
            },
            additionalProperties: false
        }
    },

    // Schema para eliminar seguimiento
    deleteSeguimiento: {
        params: {
            type: 'object',
            required: ['id'],
            properties: {
                id: { type: 'string', format: 'uuid' }
            }
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' }
                }
            }
        }
    },

    // Schema para obtener seguimientos vencidos
    getSeguimientosVencidos: {
        querystring: {
            type: 'object',
            properties: {
                limit: { type: 'integer', minimum: 1, maximum: 100 },
                offset: { type: 'integer', minimum: 0 }
            }
        }
    }
};

async function seguimientoAccidenteRoutes(fastify, options) {
    const { seguimientoAccidenteController } = options;

    // Crear seguimiento
    fastify.post('/seguimientos-accidente', {
        schema: seguimientoAccidenteSchemas.createSeguimiento
    }, async (request, reply) => {
        return seguimientoAccidenteController.crearSeguimiento(request, reply);
    });

    // Obtener seguimiento por ID
    fastify.get('/seguimientos-accidente/:id', {
        schema: seguimientoAccidenteSchemas.getSeguimiento
    }, async (request, reply) => {
        return seguimientoAccidenteController.obtenerSeguimiento(request, reply);
    });

    // Obtener todos los seguimientos con filtros
    fastify.get('/seguimientos-accidente', {
        schema: seguimientoAccidenteSchemas.getAllSeguimientos
    }, async (request, reply) => {
        return seguimientoAccidenteController.obtenerSeguimientos(request, reply);
    });

    // Obtener seguimientos por accidente
    fastify.get('/accidentes/:accidenteId/seguimientos', {
        schema: seguimientoAccidenteSchemas.getSeguimientosByAccidente
    }, async (request, reply) => {
        return seguimientoAccidenteController.obtenerSeguimientosPorAccidente(request, reply);
    });

    // Obtener seguimientos vencidos
    fastify.get('/seguimientos-accidente/vencidos', {
        schema: seguimientoAccidenteSchemas.getSeguimientosVencidos
    }, async (request, reply) => {
        return seguimientoAccidenteController.obtenerSeguimientosVencidos(request, reply);
    });

    // Actualizar seguimiento
    fastify.put('/seguimientos-accidente/:id', {
        schema: seguimientoAccidenteSchemas.updateSeguimiento
    }, async (request, reply) => {
        return seguimientoAccidenteController.actualizarSeguimiento(request, reply);
    });

    // Eliminar seguimiento
    fastify.delete('/seguimientos-accidente/:id', {
        schema: seguimientoAccidenteSchemas.deleteSeguimiento
    }, async (request, reply) => {
        return seguimientoAccidenteController.eliminarSeguimiento(request, reply);
    });
}

module.exports = seguimientoAccidenteRoutes;
