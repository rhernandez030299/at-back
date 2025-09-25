class AccidenteController {
    constructor({
        crearAccidenteUseCase,
        obtenerAccidenteUseCase,
        obtenerTodosAccidentesUseCase,
        actualizarAccidenteUseCase,
        eliminarAccidenteUseCase,
        obtenerAccidentesPorEmpleadoUseCase,
        obtenerEstadisticasAccidentesUseCase
    }) {
        this.crearAccidenteUseCase = crearAccidenteUseCase;
        this.obtenerAccidenteUseCase = obtenerAccidenteUseCase;
        this.obtenerTodosAccidentesUseCase = obtenerTodosAccidentesUseCase;
        this.actualizarAccidenteUseCase = actualizarAccidenteUseCase;
        this.eliminarAccidenteUseCase = eliminarAccidenteUseCase;
        this.obtenerAccidentesPorEmpleadoUseCase = obtenerAccidentesPorEmpleadoUseCase;
        this.obtenerEstadisticasAccidentesUseCase = obtenerEstadisticasAccidentesUseCase;
    }

    async createAccidente(request, reply) {
        try {
            const accidenteData = request.body;
            const result = await this.crearAccidenteUseCase.execute(accidenteData);
            
            reply.code(201).send({
                success: true,
                data: result,
                message: 'Accidente created successfully'
            });
        } catch (error) {
            reply.code(400).send({
                success: false,
                error: error.message
            });
        }
    }

    async getAccidente(request, reply) {
        try {
            const { id } = request.params;
            const result = await this.obtenerAccidenteUseCase.execute(id);
            
            reply.code(200).send({
                success: true,
                data: result
            });
        } catch (error) {
            const statusCode = error.message === 'Accidente not found' ? 404 : 400;
            reply.code(statusCode).send({
                success: false,
                error: error.message
            });
        }
    }

    async getAllAccidentes(request, reply) {
        try {
            const filters = request.query;
            const result = await this.obtenerTodosAccidentesUseCase.execute(filters);
            
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

    async updateAccidente(request, reply) {
        try {
            const { id } = request.params;
            const updateData = request.body;
            const result = await this.actualizarAccidenteUseCase.execute(id, updateData);
            
            reply.code(200).send({
                success: true,
                data: result,
                message: 'Accidente updated successfully'
            });
        } catch (error) {
            const statusCode = error.message === 'Accidente not found' ? 404 : 400;
            reply.code(statusCode).send({
                success: false,
                error: error.message
            });
        }
    }

    async deleteAccidente(request, reply) {
        try {
            const { id } = request.params;
            const result = await this.eliminarAccidenteUseCase.execute(id);
            
            reply.code(200).send({
                success: true,
                ...result
            });
        } catch (error) {
            const statusCode = error.message === 'Accidente not found' ? 404 : 400;
            reply.code(statusCode).send({
                success: false,
                error: error.message
            });
        }
    }

    async getAccidentesByEmpleado(request, reply) {
        try {
            const { empleadoId } = request.params;
            const result = await this.obtenerAccidentesPorEmpleadoUseCase.execute(empleadoId);
            
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

    async getEstadisticasAccidentes(request, reply) {
        try {
            const { year } = request.query;
            const result = await this.obtenerEstadisticasAccidentesUseCase.execute(year);
            
            reply.code(200).send({
                success: true,
                data: result
            });
        } catch (error) {
            reply.code(400).send({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = AccidenteController;
