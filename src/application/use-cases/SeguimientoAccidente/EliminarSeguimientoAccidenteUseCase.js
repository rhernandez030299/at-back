class EliminarSeguimientoAccidenteUseCase {
    constructor(seguimientoAccidenteRepository) {
        this.seguimientoAccidenteRepository = seguimientoAccidenteRepository;
    }

    async execute(id) {
        try {
            // Verificar que el seguimiento existe
            const seguimientoExiste = await this.seguimientoAccidenteRepository.exists(id);
            if (!seguimientoExiste) {
                return {
                    success: false,
                    error: 'Seguimiento no encontrado'
                };
            }

            // Eliminar el seguimiento
            const eliminado = await this.seguimientoAccidenteRepository.delete(id);

            if (!eliminado) {
                return {
                    success: false,
                    error: 'No se pudo eliminar el seguimiento'
                };
            }

            return {
                success: true,
                message: 'Seguimiento eliminado exitosamente'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = EliminarSeguimientoAccidenteUseCase;
