const { updateAccidenteSchema, idValidationSchema } = require('../../validations/accidenteValidation');

class ActualizarAccidenteUseCase {
    constructor(accidenteRepository, empleadoRepository) {
        this.accidenteRepository = accidenteRepository;
        this.empleadoRepository = empleadoRepository;
    }

    async execute(id, updateData) {
        try {
            // Validate ID
            await idValidationSchema.validate({ id }, { abortEarly: false });

            // Check if accidente exists
            const existingAccidente = await this.accidenteRepository.findById(id);
            if (!existingAccidente) {
                throw new Error('Accidente not found');
            }

            // Validate update data using Yup schema
            const validatedData = await updateAccidenteSchema.validate(updateData, {
                abortEarly: false,
                stripUnknown: true
            });

            // If empleadoId is being changed, check if new empleado exists
            if (validatedData.empleadoId && validatedData.empleadoId !== existingAccidente.empleadoId) {
                const empleado = await this.empleadoRepository.findById(validatedData.empleadoId);
                if (!empleado) {
                    throw new Error('Empleado not found');
                }
            }

            // Update accidente
            const updatedAccidente = await this.accidenteRepository.update(id, validatedData);

            return updatedAccidente.toJSON();
        } catch (error) {
            if (error.name === 'ValidationError') {
                const validationErrors = error.inner.map(err => err.message);
                throw new Error(`${validationErrors.join(', ')}`);
            }
            throw error;
        }
    }
}

module.exports = ActualizarAccidenteUseCase;
