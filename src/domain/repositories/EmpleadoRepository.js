// Repository interface for Empleado operations
class EmpleadoRepository {
    async create(employee) {
        throw new Error('Method create must be implemented');
    }

    async findById(id) {
        throw new Error('Method findById must be implemented');
    }

    async findByDocumento(documentoNo) {
        throw new Error('Method findByDocumento must be implemented');
    }

    async findAll(filters = {}) {
        throw new Error('Method findAll must be implemented');
    }

    async update(id, employee) {
        throw new Error('Method update must be implemented');
    }

    async delete(id) {
        throw new Error('Method delete must be implemented');
    }

    async exists(id) {
        throw new Error('Method exists must be implemented');
    }

    async count(filters = {}) {
        throw new Error('Method count must be implemented');
    }
}

module.exports = EmpleadoRepository;
