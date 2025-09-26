const SeguimientoAccidente = require('../../../domain/entities/SeguimientoAccidente');

class ActualizarSeguimientoAccidenteUseCase {
    constructor(seguimientoAccidenteRepository) {
        this.seguimientoAccidenteRepository = seguimientoAccidenteRepository;
    }

    async execute(id, seguimientoData) {
        try {
            // Verificar que el seguimiento existe
            const seguimientoExistente = await this.seguimientoAccidenteRepository.findById(id);
            if (!seguimientoExistente) {
                return {
                    success: false,
                    error: 'Seguimiento no encontrado'
                };
            }

            // Crear entidad con los datos existentes y aplicar actualizaciones
            const seguimientoActualizado = new SeguimientoAccidente({
                ...seguimientoExistente,
                ...seguimientoData,
                id: id, // Asegurar que el ID no cambie
                accidenteId: seguimientoExistente.accidenteId // El accidenteId no debe cambiar
            });

            // Actualizar en el repositorio
            const resultado = await this.seguimientoAccidenteRepository.update(id, seguimientoActualizado);

            return {
                success: true,
                data: resultado,
                message: 'Seguimiento actualizado exitosamente'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = ActualizarSeguimientoAccidenteUseCase;
