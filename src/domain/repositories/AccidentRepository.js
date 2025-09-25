// Repository interface for Accident operations
class AccidentRepository {
    async create(accident) {
        throw new Error('Method create must be implemented');
    }

    async findById(id) {
        throw new Error('Method findById must be implemented');
    }

    async findByEmployeeId(employeeId) {
        throw new Error('Method findByEmployeeId must be implemented');
    }

    async findAll(filters = {}) {
        throw new Error('Method findAll must be implemented');
    }

    async update(id, accident) {
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

    async getAccidentsByDateRange(startDate, endDate) {
        throw new Error('Method getAccidentsByDateRange must be implemented');
    }

    async getAccidentStatistics(filters = {}) {
        throw new Error('Method getAccidentStatistics must be implemented');
    }
}

module.exports = AccidentRepository;

