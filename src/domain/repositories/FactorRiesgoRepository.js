/**
 * Base FactorRiesgo Repository Interface
 * Defines the contract for factor de riesgo data access operations
 */
class FactorRiesgoRepository {
    async findAll() {
        throw new Error('Method findAll must be implemented');
    }

    async findById(id) {
        throw new Error('Method findById must be implemented');
    }

    async findActivos() {
        throw new Error('Method findActivos must be implemented');
    }

    async findByNivelPeligrosidad(nivel) {
        throw new Error('Method findByNivelPeligrosidad must be implemented');
    }
}

module.exports = FactorRiesgoRepository;
