const Employee = require('../../domain/entities/Employee');
const { createEmployeeSchema } = require('../validations/employeeValidation');

class CreateEmployeeUseCase {
    constructor(employeeRepository, centroTrabajoRepository, ciudadRepository) {
        this.employeeRepository = employeeRepository;
        this.centroTrabajoRepository = centroTrabajoRepository;
        this.ciudadRepository = ciudadRepository;
    }

    async execute(employeeData) {
        // Validate employee data using Yup schema
        try {
            const validatedData = await createEmployeeSchema.validate(employeeData, {
                abortEarly: false,
                stripUnknown: true
            });

            // Check if employee with same documento already exists
            const existingEmployee = await this.employeeRepository.findByDocumento(validatedData.documentoNo);
            if (existingEmployee) {
                throw new Error(`Employee with documento ${validatedData.documentoNo} already exists`);
            }

            // Check if centro de trabajo exists
            const centroTrabajo = await this.centroTrabajoRepository.findById(validatedData.centroTrabajoId);
            if (!centroTrabajo) {
                throw new Error('Centro de trabajo not found');
            }

            if (!centroTrabajo.activo) {
                throw new Error('Centro de trabajo is not active');
            }

            // Check if municipio exists
            const municipio = await this.ciudadRepository.findById(validatedData.municipioId);
            if (!municipio) {
                throw new Error('Municipio not found');
            }

            // Create new employee entity
            const employee = new Employee(validatedData);

            // Save to repository
            const createdEmployee = await this.employeeRepository.create(employee);

            return createdEmployee.toJSON();
        } catch (error) {
            if (error.name === 'ValidationError') {
                const validationErrors = error.inner.map(err => err.message);
                throw new Error(`${validationErrors.join(', ')}`);
            }
            throw error;
        }
    }
}

module.exports = CreateEmployeeUseCase;
