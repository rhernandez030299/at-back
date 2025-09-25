class AccidentController {
    constructor({
        createAccidentUseCase,
        getAccidentUseCase,
        getAllAccidentsUseCase,
        updateAccidentUseCase,
        deleteAccidentUseCase,
        getAccidentsByEmployeeUseCase
    }) {
        this.createAccidentUseCase = createAccidentUseCase;
        this.getAccidentUseCase = getAccidentUseCase;
        this.getAllAccidentsUseCase = getAllAccidentsUseCase;
        this.updateAccidentUseCase = updateAccidentUseCase;
        this.deleteAccidentUseCase = deleteAccidentUseCase;
        this.getAccidentsByEmployeeUseCase = getAccidentsByEmployeeUseCase;
    }

    async createAccident(request, reply) {
        try {
            const accidentData = request.body;
            const result = await this.createAccidentUseCase.execute(accidentData);
            
            reply.code(201).send({
                success: true,
                data: result,
                message: 'Accident created successfully'
            });
        } catch (error) {
            const statusCode = error.message.includes('Employee not found') ? 404 : 400;
            reply.code(statusCode).send({
                success: false,
                error: error.message
            });
        }
    }

    async getAccident(request, reply) {
        try {
            const { id } = request.params;
            const result = await this.getAccidentUseCase.execute(id);
            
            reply.code(200).send({
                success: true,
                data: result
            });
        } catch (error) {
            const statusCode = error.message === 'Accident not found' ? 404 : 400;
            reply.code(statusCode).send({
                success: false,
                error: error.message
            });
        }
    }

    async getAllAccidents(request, reply) {
        try {
            const filters = request.query;
            const result = await this.getAllAccidentsUseCase.execute(filters);
            
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

    async updateAccident(request, reply) {
        try {
            const { id } = request.params;
            const updateData = request.body;
            const result = await this.updateAccidentUseCase.execute(id, updateData);
            
            reply.code(200).send({
                success: true,
                data: result,
                message: 'Accident updated successfully'
            });
        } catch (error) {
            let statusCode = 400;
            if (error.message === 'Accident not found' || error.message === 'Employee not found') {
                statusCode = 404;
            }
            reply.code(statusCode).send({
                success: false,
                error: error.message
            });
        }
    }

    async deleteAccident(request, reply) {
        try {
            const { id } = request.params;
            const result = await this.deleteAccidentUseCase.execute(id);
            
            reply.code(200).send({
                success: true,
                ...result
            });
        } catch (error) {
            const statusCode = error.message === 'Accident not found' ? 404 : 400;
            reply.code(statusCode).send({
                success: false,
                error: error.message
            });
        }
    }

    async getAccidentsByEmployee(request, reply) {
        try {
            const { employeeId } = request.params;
            const result = await this.getAccidentsByEmployeeUseCase.execute(employeeId);
            
            reply.code(200).send({
                success: true,
                data: result
            });
        } catch (error) {
            const statusCode = error.message === 'Employee not found' ? 404 : 400;
            reply.code(statusCode).send({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = AccidentController;

