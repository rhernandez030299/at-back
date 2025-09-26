/**
 * Base ParteCuerpo Repository Interface
 * Defines the contract for parte del cuerpo data access operations
 */
class ParteCuerpoRepository {
    async findAll() {
        throw new Error('Method findAll must be implemented');
    }

    async findById(id) {
        throw new Error('Method findById must be implemented');
    }

    async findActivos() {
        throw new Error('Method findActivos must be implemented');
    }

    async findByRegionAnatomica(region) {
        throw new Error('Method findByRegionAnatomica must be implemented');
    }
}

module.exports = ParteCuerpoRepository;
