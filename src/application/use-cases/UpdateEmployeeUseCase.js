const { updateEmployeeSchema, idValidationSchema } = require('../validations/employeeValidation');

class UpdateEmployeeUseCase {
    constructor(employeeRepository, centroTrabajoRepository, ciudadRepository) {
        this.employeeRepository = employeeRepository;
        this.centroTrabajoRepository = centroTrabajoRepository;
        this.ciudadRepository = ciudadRepository;
    }

    async execute(id, updateData) {
        try {
            // Validate ID
            await idValidationSchema.validate({ id }, { abortEarly: false });

            // Check if employee exists
            const existingEmployee = await this.employeeRepository.findById(id);
            if (!existingEmployee) {
                throw new Error('Employee not found');
            }

            // Validate update data using Yup schema
            const validatedData = await updateEmployeeSchema.validate(updateData, {
                abortEarly: false,
                stripUnknown: true
            });

            // Check if documento is being changed and if new documento already exists
            if (validatedData.documentoNo && validatedData.documentoNo !== existingEmployee.documentoNo) {
                const employeeWithSameDocumento = await this.employeeRepository.findByDocumento(validatedData.documentoNo);
                if (employeeWithSameDocumento && employeeWithSameDocumento.id !== id) {
                    throw new Error(`Employee with documento ${validatedData.documentoNo} already exists`);
                }
            }

            // Check if centro de trabajo is being changed and if it exists
            if (validatedData.centroTrabajoId && validatedData.centroTrabajoId !== existingEmployee.centroTrabajoId) {
                const centroTrabajo = await this.centroTrabajoRepository.findById(validatedData.centroTrabajoId);
                if (!centroTrabajo) {
                    throw new Error('Centro de trabajo not found');
                }

                if (!centroTrabajo.activo) {
                    throw new Error('Centro de trabajo is not active');
                }
            }

            // Check if municipio is being changed and if it exists
            if (validatedData.municipioId && validatedData.municipioId !== existingEmployee.municipioId) {
                const municipio = await this.ciudadRepository.findById(validatedData.municipioId);
                if (!municipio) {
                    throw new Error('Municipio not found');
                }
            }

            // Update employee
            const updatedEmployee = await this.employeeRepository.update(id, validatedData);

            return updatedEmployee.toJSON();
        } catch (error) {
            if (error.name === 'ValidationError') {
                const validationErrors = error.inner.map(err => err.message);
                throw new Error(`${validationErrors.join(', ')}`);
            }
            throw error;
        }
    }
}

module.exports = UpdateEmployeeUseCase;
