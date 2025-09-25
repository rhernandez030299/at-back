// Empleado route schemas for validation
const empleadoSchemas = {
    createEmpleado: {
        body: {
            type: 'object',
            required: ['nombres', 'apellidos', 'documentoNo', 'fechaDeNacimiento', 'ciudadId', 'centroTrabajoId', 'sexo', 'salario'],
            properties: {
                nombres: { type: 'string', minLength: 1, maxLength: 255 },
                apellidos: { type: 'string', minLength: 1, maxLength: 255 },
                documentoNo: { type: 'string', minLength: 1, maxLength: 50 },
                fechaDeNacimiento: { type: 'string', format: 'date' },
                ciudadId: { type: 'string', format: 'uuid' },
                centroTrabajoId: { type: 'string', format: 'uuid' },
                sexo: { type: 'string', enum: ['M', 'F'] },
                salario: { type: 'number', minimum: 0 },
                fechaDeIngreso: { type: 'string', format: 'date-time' }
            }
        }
    },

    updateEmpleado: {
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
                nombres: { type: 'string', minLength: 1, maxLength: 255 },
                apellidos: { type: 'string', minLength: 1, maxLength: 255 },
                documentoNo: { type: 'string', minLength: 1, maxLength: 50 },
                fechaDeNacimiento: { type: 'string', format: 'date' },
                ciudadId: { type: 'string', format: 'uuid' },
                centroTrabajoId: { type: 'string', format: 'uuid' },
                sexo: { type: 'string', enum: ['M', 'F'] },
                salario: { type: 'number', minimum: 0 },
                fechaDeIngreso: { type: 'string', format: 'date-time' }
            }
        }
    },

    getEmpleado: {
        params: {
            type: 'object',
            required: ['id'],
            properties: {
                id: { type: 'string', format: 'uuid' }
            }
        }
    },

    deleteEmpleado: {
        params: {
            type: 'object',
            required: ['id'],
            properties: {
                id: { type: 'string', format: 'uuid' }
            }
        }
    },

    getAllEmpleados: {
        querystring: {
            type: 'object',
            properties: {
                centroTrabajoId: { type: 'string', format: 'uuid' },
                sexo: { type: 'string', enum: ['M', 'F'] },
                ciudadId: { type: 'string', format: 'uuid' },
                departamentoId: { type: 'string', format: 'uuid' },
                minSalario: { type: 'number', minimum: 0 },
                maxSalario: { type: 'number', minimum: 0 },
                limit: { type: 'integer', minimum: 1, maximum: 100 },
                offset: { type: 'integer', minimum: 0 }
            }
        }
    }
};

async function empleadoRoutes(fastify, options) {
    const { empleadoController } = options;

    // Create empleado
    fastify.post('/empleados', {
        schema: empleadoSchemas.createEmpleado
    }, async (request, reply) => {
        return empleadoController.createEmpleado(request, reply);
    });

    // Get all empleados
    fastify.get('/empleados', {
        schema: empleadoSchemas.getAllEmpleados
    }, async (request, reply) => {
        return empleadoController.getAllEmpleados(request, reply);
    });

    // Get empleado by ID
    fastify.get('/empleados/:id', {
        schema: empleadoSchemas.getEmpleado
    }, async (request, reply) => {
        return empleadoController.getEmpleado(request, reply);
    });

    // Update empleado
    fastify.put('/empleados/:id', {
        schema: empleadoSchemas.updateEmpleado
    }, async (request, reply) => {
        return empleadoController.updateEmpleado(request, reply);
    });

    // Delete empleado
    fastify.delete('/empleados/:id', {
        schema: empleadoSchemas.deleteEmpleado
    }, async (request, reply) => {
        return empleadoController.deleteEmpleado(request, reply);
    });
}

module.exports = empleadoRoutes;