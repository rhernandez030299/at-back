const SeguimientoAccidente = require('../../../domain/entities/SeguimientoAccidente');

class CrearSeguimientoAccidenteUseCase {
    constructor(seguimientoAccidenteRepository, accidenteRepository) {
        this.seguimientoAccidenteRepository = seguimientoAccidenteRepository;
        this.accidenteRepository = accidenteRepository;
    }

    async execute(seguimientoData) {
        try {
            // Validar que el accidente existe
            const accidenteExiste = await this.accidenteRepository.exists(seguimientoData.accidenteId);
            if (!accidenteExiste) {
                throw new Error('El accidente especificado no existe');
            }

            // Crear la entidad de seguimiento
            const seguimiento = new SeguimientoAccidente(seguimientoData);

            // Guardar en el repositorio
            const seguimientoCreado = await this.seguimientoAccidenteRepository.create(seguimiento);

            return {
                success: true,
                data: seguimientoCreado,
                message: 'Seguimiento de accidente creado exitosamente'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = CrearSeguimientoAccidenteUseCase;
