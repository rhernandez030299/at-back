// Employee route schemas for validation
const employeeSchemas = {
    createEmployee: {
        body: {
            type: 'object',
            required: ['nombres', 'apellido', 'documentoNo', 'fechaDeNacimiento', 'municipio', 'centroTrabajoId', 'sexo', 'salario'],
            properties: {
                nombres: { type: 'string', minLength: 1, maxLength: 255 },
                apellido: { type: 'string', minLength: 1, maxLength: 255 },
                documentoNo: { type: 'string', minLength: 1, maxLength: 50 },
                fechaDeNacimiento: { type: 'string', format: 'date' },
                municipio: { type: 'string', minLength: 1, maxLength: 100 },
                centroTrabajoId: { type: 'string', format: 'uuid' },
                sexo: { type: 'string', enum: ['M', 'F'] },
                salario: { type: 'number', minimum: 0 },
                fechaDeIngreso: { type: 'string', format: 'date-time' }
            }
        }
    },

    updateEmployee: {
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
                apellido: { type: 'string', minLength: 1, maxLength: 255 },
                documentoNo: { type: 'string', minLength: 1, maxLength: 50 },
                fechaDeNacimiento: { type: 'string', format: 'date' },
                municipio: { type: 'string', minLength: 1, maxLength: 100 },
                centroTrabajoId: { type: 'string', format: 'uuid' },
                sexo: { type: 'string', enum: ['M', 'F'] },
                salario: { type: 'number', minimum: 0 },
                fechaDeIngreso: { type: 'string', format: 'date-time' }
            }
        }
    },

    getEmployee: {
        params: {
            type: 'object',
            required: ['id'],
            properties: {
                id: { type: 'string', format: 'uuid' }
            }
        }
    },

    deleteEmployee: {
        params: {
            type: 'object',
            required: ['id'],
            properties: {
                id: { type: 'string', format: 'uuid' }
            }
        }
    },

    getAllEmployees: {
        querystring: {
            type: 'object',
            properties: {
                centroTrabajoId: { type: 'string', format: 'uuid' },
                sexo: { type: 'string', enum: ['M', 'F'] },
                municipio: { type: 'string' },
                minSalario: { type: 'number', minimum: 0 },
                maxSalario: { type: 'number', minimum: 0 },
                limit: { type: 'integer', minimum: 1, maximum: 100 },
                offset: { type: 'integer', minimum: 0 }
            }
        }
    }
};

async function employeeRoutes(fastify, options) {
    const { employeeController } = options;

    // Create employee
    fastify.post('/employees', {
        schema: employeeSchemas.createEmployee
    }, async (request, reply) => {
        return employeeController.createEmployee(request, reply);
    });

    // Get all employees
    fastify.get('/employees', {
        schema: employeeSchemas.getAllEmployees
    }, async (request, reply) => {
        return employeeController.getAllEmployees(request, reply);
    });

    // Get employee by ID
    fastify.get('/employees/:id', {
        schema: employeeSchemas.getEmployee
    }, async (request, reply) => {
        return employeeController.getEmployee(request, reply);
    });

    // Update employee
    fastify.put('/employees/:id', {
        schema: employeeSchemas.updateEmployee
    }, async (request, reply) => {
        return employeeController.updateEmployee(request, reply);
    });

    // Delete employee
    fastify.delete('/employees/:id', {
        schema: employeeSchemas.deleteEmployee
    }, async (request, reply) => {
        return employeeController.deleteEmployee(request, reply);
    });
}

module.exports = employeeRoutes;

