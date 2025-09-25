class ObtenerDepartamentoUseCase {
    constructor(departamentoRepository) {
        this.departamentoRepository = departamentoRepository;
    }

    async execute(id) {
        try {
            // Validate UUID format
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(id)) {
                throw new Error('Invalid departamento ID format');
            }

            const departamento = await this.departamentoRepository.findById(id);

            if (!departamento) {
                throw new Error('Departamento not found');
            }

            return departamento.toJSON();
        } catch (error) {
            console.error('Error in ObtenerDepartamentoUseCase:', error);
            throw error;
        }
    }
}

module.exports = ObtenerDepartamentoUseCase;
