// Repository interface for Accidente operations
class AccidenteRepository {
    async create(accidente) {
        throw new Error('Method create must be implemented');
    }

    async findById(id) {
        throw new Error('Method findById must be implemented');
    }

    async findByEmpleadoId(empleadoId) {
        throw new Error('Method findByEmpleadoId must be implemented');
    }

    async findAll(filters = {}) {
        throw new Error('Method findAll must be implemented');
    }

    async update(id, accidente) {
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

    // Statistics methods
    async getAccidentsByMonth(year) {
        throw new Error('Method getAccidentsByMonth must be implemented');
    }

    async getAccidentsBySeverity() {
        throw new Error('Method getAccidentsBySeverity must be implemented');
    }

    async getAccidentsByArea() {
        throw new Error('Method getAccidentsByArea must be implemented');
    }

    async getAccidentsByTipoLesion() {
        throw new Error('Method getAccidentsByTipoLesion must be implemented');
    }
}

module.exports = AccidenteRepository;
