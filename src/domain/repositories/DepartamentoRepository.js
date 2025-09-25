class DepartamentoRepository {
    async findAll(filters = {}) {
        throw new Error('Method findAll must be implemented');
    }

    async findById(id) {
        throw new Error('Method findById must be implemented');
    }

    async findByCodigo(codigo) {
        throw new Error('Method findByCodigo must be implemented');
    }

    async count(filters = {}) {
        throw new Error('Method count must be implemented');
    }
}

module.exports = DepartamentoRepository;

