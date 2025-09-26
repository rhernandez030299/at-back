// TipoLesion route schemas for validation
const tipoLesionSchemas = {
    getAllTiposLesion: {
        response: {
            200: {
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    data: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: { type: 'string', format: 'uuid' },
                                nombre: { type: 'string' },
                                descripcion: { type: 'string' },
                                gravedad: { type: 'string' },
                                requiereAtencionInmediata: { type: 'boolean' },
                                requiereHospitalizacion: { type: 'boolean' },
                                tiempoRecuperacionEstimado: { type: 'integer' },
                                requiereCirugia: { type: 'boolean' },
                                activo: { type: 'boolean' },
                                createdAt: { type: 'string', format: 'date-time' },
                                updatedAt: { type: 'string', format: 'date-time' }
                            }
                        }
                    }
                }
            }
        }
    },

    getActiveTiposLesion: {
        response: {
            200: {
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    data: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: { type: 'string', format: 'uuid' },
                                nombre: { type: 'string' },
                                descripcion: { type: 'string' },
                                gravedad: { type: 'string' },
                                requiereAtencionInmediata: { type: 'boolean' },
                                requiereHospitalizacion: { type: 'boolean' },
                                tiempoRecuperacionEstimado: { type: 'integer' },
                                requiereCirugia: { type: 'boolean' },
                                activo: { type: 'boolean' },
                                createdAt: { type: 'string', format: 'date-time' },
                                updatedAt: { type: 'string', format: 'date-time' }
                            }
                        }
                    }
                }
            }
        }
    }
};

async function tipoLesionRoutes(fastify, options) {
    const { tipoLesionController } = options;

    // Get all tipos de lesion
    fastify.get('/tipos-lesion', {
        schema: tipoLesionSchemas.getAllTiposLesion
    }, async (request, reply) => {
        return tipoLesionController.getAllTiposLesion(request, reply);
    });

    // Get active tipos de lesion only
    fastify.get('/tipos-lesion/active', {
        schema: tipoLesionSchemas.getActiveTiposLesion
    }, async (request, reply) => {
        return tipoLesionController.getActiveTiposLesion(request, reply);
    });
}

module.exports = tipoLesionRoutes;
