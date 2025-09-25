class EmpleadoController {
    constructor({
        crearEmpleadoUseCase,
        obtenerEmpleadoUseCase,
        obtenerTodosEmpleadosUseCase,
        actualizarEmpleadoUseCase,
        eliminarEmpleadoUseCase
    }) {
        this.crearEmpleadoUseCase = crearEmpleadoUseCase;
        this.obtenerEmpleadoUseCase = obtenerEmpleadoUseCase;
        this.obtenerTodosEmpleadosUseCase = obtenerTodosEmpleadosUseCase;
        this.actualizarEmpleadoUseCase = actualizarEmpleadoUseCase;
        this.eliminarEmpleadoUseCase = eliminarEmpleadoUseCase;
    }

    async createEmpleado(request, reply) {
        try {
            const empleadoData = request.body;
            const result = await this.crearEmpleadoUseCase.execute(empleadoData);
            
            reply.code(201).send({
                success: true,
                data: result,
                message: 'Empleado created successfully'
            });
        } catch (error) {
            reply.code(400).send({
                success: false,
                error: error.message
            });
        }
    }

    async getEmpleado(request, reply) {
        try {
            const { id } = request.params;
            const result = await this.obtenerEmpleadoUseCase.execute(id);
            
            reply.code(200).send({
                success: true,
                data: result
            });
        } catch (error) {
            const statusCode = error.message === 'Empleado not found' ? 404 : 400;
            reply.code(statusCode).send({
                success: false,
                error: error.message
            });
        }
    }

    async getAllEmpleados(request, reply) {
        try {
            const filters = request.query;
            const result = await this.obtenerTodosEmpleadosUseCase.execute(filters);
            
            reply.code(200).send({
                success: true,
                ...result
            });
        } catch (error) {
            reply.code(400).send({
                success: false,
                error: error.message
            });
        }
    }

    async updateEmpleado(request, reply) {
        try {
            const { id } = request.params;
            const updateData = request.body;
            const result = await this.actualizarEmpleadoUseCase.execute(id, updateData);
            
            reply.code(200).send({
                success: true,
                data: result,
                message: 'Empleado updated successfully'
            });
        } catch (error) {
            const statusCode = error.message === 'Empleado not found' ? 404 : 400;
            reply.code(statusCode).send({
                success: false,
                error: error.message
            });
        }
    }

    async deleteEmpleado(request, reply) {
        try {
            const { id } = request.params;
            const result = await this.eliminarEmpleadoUseCase.execute(id);
            
            reply.code(200).send({
                success: true,
                ...result
            });
        } catch (error) {
            const statusCode = error.message === 'Empleado not found' ? 404 : 400;
            reply.code(statusCode).send({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = EmpleadoController;