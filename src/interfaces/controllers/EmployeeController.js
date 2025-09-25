class EmployeeController {
    constructor({
        createEmployeeUseCase,
        getEmployeeUseCase,
        getAllEmployeesUseCase,
        updateEmployeeUseCase,
        deleteEmployeeUseCase
    }) {
        this.createEmployeeUseCase = createEmployeeUseCase;
        this.getEmployeeUseCase = getEmployeeUseCase;
        this.getAllEmployeesUseCase = getAllEmployeesUseCase;
        this.updateEmployeeUseCase = updateEmployeeUseCase;
        this.deleteEmployeeUseCase = deleteEmployeeUseCase;
    }

    async createEmployee(request, reply) {
        try {
            const employeeData = request.body;
            const result = await this.createEmployeeUseCase.execute(employeeData);
            
            reply.code(201).send({
                success: true,
                data: result,
                message: 'Employee created successfully'
            });
        } catch (error) {
            reply.code(400).send({
                success: false,
                error: error.message
            });
        }
    }

    async getEmployee(request, reply) {
        try {
            const { id } = request.params;
            const result = await this.getEmployeeUseCase.execute(id);
            
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

    async getAllEmployees(request, reply) {
        try {
            const filters = request.query;
            const result = await this.getAllEmployeesUseCase.execute(filters);
            
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

    async updateEmployee(request, reply) {
        try {
            const { id } = request.params;
            const updateData = request.body;
            const result = await this.updateEmployeeUseCase.execute(id, updateData);
            
            reply.code(200).send({
                success: true,
                data: result,
                message: 'Employee updated successfully'
            });
        } catch (error) {
            const statusCode = error.message === 'Employee not found' ? 404 : 400;
            reply.code(statusCode).send({
                success: false,
                error: error.message
            });
        }
    }

    async deleteEmployee(request, reply) {
        try {
            const { id } = request.params;
            const result = await this.deleteEmployeeUseCase.execute(id);
            
            reply.code(200).send({
                success: true,
                ...result
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

module.exports = EmployeeController;
