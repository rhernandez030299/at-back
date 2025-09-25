const Accidente = require('../../../domain/entities/Accidente');
const { createAccidenteSchema } = require('../../validations/accidenteValidation');

class CrearAccidenteUseCase {
    constructor(accidenteRepository, empleadoRepository) {
        this.accidenteRepository = accidenteRepository;
        this.empleadoRepository = empleadoRepository;
    }

    async execute(accidenteData) {
        try {
            // Validate accidente data using Yup schema
            const validatedData = await createAccidenteSchema.validate(accidenteData, {
                abortEarly: false,
                stripUnknown: true
            });

            // Check if empleado exists
            const empleado = await this.empleadoRepository.findById(validatedData.empleadoId);
            if (!empleado) {
                throw new Error('Empleado not found');
            }

            // Create new accidente entity
            const accidente = new Accidente(validatedData);

            // Save to repository
            const createdAccidente = await this.accidenteRepository.create(accidente);

            return createdAccidente.toJSON();
        } catch (error) {
            if (error.name === 'ValidationError') {
                const validationErrors = error.inner.map(err => err.message);
                throw new Error(`${validationErrors.join(', ')}`);
            }
            throw error;
        }
    }
}

module.exports = CrearAccidenteUseCase;
