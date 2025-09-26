/**
 * Base TipoLesion Repository Interface
 * Defines the contract for tipo de lesion data access operations
 */
class TipoLesionRepository {
    async findAll() {
        throw new Error('Method findAll must be implemented');
    }

    async findById(id) {
        throw new Error('Method findById must be implemented');
    }

    async findActivos() {
        throw new Error('Method findActivos must be implemented');
    }

    async findByGravedad(gravedad) {
        throw new Error('Method findByGravedad must be implemented');
    }
}

module.exports = TipoLesionRepository;
