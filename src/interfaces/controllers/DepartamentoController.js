class DepartamentoController {
    constructor(getAllDepartamentosUseCase, getDepartamentoUseCase) {
        this.getAllDepartamentosUseCase = getAllDepartamentosUseCase;
        this.getDepartamentoUseCase = getDepartamentoUseCase;
    }

    async getAllDepartamentos(request, reply) {
        try {
            const filters = {
                nombre: request.query.nombre,
                codigo: request.query.codigo,
                limit: request.query.limit ? parseInt(request.query.limit) : undefined,
                offset: request.query.offset ? parseInt(request.query.offset) : undefined
            };

            const result = await this.getAllDepartamentosUseCase.execute(filters);

            return reply.code(200).send({
                success: true,
                ...result
            });
        } catch (error) {
            console.error('Error in getAllDepartamentos:', error);
            return reply.code(500).send({
                success: false,
                error: error.message
            });
        }
    }

    async getDepartamento(request, reply) {
        try {
            const { id } = request.params;
            const departamento = await this.getDepartamentoUseCase.execute(id);

            return reply.code(200).send({
                success: true,
                data: departamento
            });
        } catch (error) {
            console.error('Error in getDepartamento:', error);
            
            if (error.message === 'Departamento not found' || error.message === 'Invalid departamento ID format') {
                return reply.code(404).send({
                    success: false,
                    error: error.message
                });
            }

            return reply.code(500).send({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = DepartamentoController;

