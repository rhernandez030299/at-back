// ParteCuerpo route schemas for validation
const parteCuerpoSchemas = {
    getAllPartesCuerpo: {
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
                                regionAnatomica: { type: 'string' },
                                lateralidad: { type: 'string' },
                                criticidad: { type: 'string' },
                                tiempoRecuperacionPromedio: { type: 'integer' },
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

    getActivePartesCuerpo: {
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
                                regionAnatomica: { type: 'string' },
                                lateralidad: { type: 'string' },
                                criticidad: { type: 'string' },
                                tiempoRecuperacionPromedio: { type: 'integer' },
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

async function parteCuerpoRoutes(fastify, options) {
    const { parteCuerpoController } = options;

    // Get all partes del cuerpo
    fastify.get('/partes-cuerpo', {
        schema: parteCuerpoSchemas.getAllPartesCuerpo
    }, async (request, reply) => {
        return parteCuerpoController.getAllPartesCuerpo(request, reply);
    });

    // Get active partes del cuerpo only
    fastify.get('/partes-cuerpo/active', {
        schema: parteCuerpoSchemas.getActivePartesCuerpo
    }, async (request, reply) => {
        return parteCuerpoController.getActivePartesCuerpo(request, reply);
    });
}

module.exports = parteCuerpoRoutes;
