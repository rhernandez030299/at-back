// Repository interface for Ciudad operations
class CiudadRepository {
    async findAll(filters = {}) {
        throw new Error('Method findAll must be implemented');
    }

    async findById(id) {
        throw new Error('Method findById must be implemented');
    }

    async findByDepartamentoId(departamentoId, filters = {}) {
        throw new Error('Method findByDepartamentoId must be implemented');
    }

    async count(filters = {}) {
        throw new Error('Method count must be implemented');
    }

    async exists(id) {
        throw new Error('Method exists must be implemented');
    }
}

module.exports = CiudadRepository;
