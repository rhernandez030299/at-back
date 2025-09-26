class SeguimientoAccidenteRepository {
    /**
     * Crear un nuevo seguimiento de accidente
     * @param {SeguimientoAccidente} seguimiento
     * @returns {Promise<SeguimientoAccidente>}
     */
    async create(seguimiento) {
        throw new Error('Method not implemented');
    }

    /**
     * Obtener un seguimiento por ID
     * @param {string} id
     * @returns {Promise<SeguimientoAccidente|null>}
     */
    async findById(id) {
        throw new Error('Method not implemented');
    }

    /**
     * Obtener todos los seguimientos de un accidente
     * @param {string} accidenteId
     * @param {Object} options - Opciones de paginación y filtros
     * @returns {Promise<{seguimientos: SeguimientoAccidente[], total: number}>}
     */
    async findByAccidenteId(accidenteId, options = {}) {
        throw new Error('Method not implemented');
    }

    /**
     * Obtener todos los seguimientos con filtros
     * @param {Object} filters - Filtros de búsqueda
     * @param {Object} options - Opciones de paginación
     * @returns {Promise<{seguimientos: SeguimientoAccidente[], total: number}>}
     */
    async findAll(filters = {}, options = {}) {
        throw new Error('Method not implemented');
    }

    /**
     * Obtener seguimientos por tipo
     * @param {string} tipoSeguimiento
     * @param {Object} options - Opciones de paginación
     * @returns {Promise<{seguimientos: SeguimientoAccidente[], total: number}>}
     */
    async findByTipo(tipoSeguimiento, options = {}) {
        throw new Error('Method not implemented');
    }

    /**
     * Obtener seguimientos pendientes (no completados)
     * @param {Object} options - Opciones de paginación
     * @returns {Promise<{seguimientos: SeguimientoAccidente[], total: number}>}
     */
    async findPendientes(options = {}) {
        throw new Error('Method not implemented');
    }

    /**
     * Obtener seguimientos vencidos (con fecha próxima acción pasada y no completados)
     * @param {Object} options - Opciones de paginación
     * @returns {Promise<{seguimientos: SeguimientoAccidente[], total: number}>}
     */
    async findVencidos(options = {}) {
        throw new Error('Method not implemented');
    }

    /**
     * Obtener seguimientos por responsable
     * @param {string} responsable
     * @param {Object} options - Opciones de paginación
     * @returns {Promise<{seguimientos: SeguimientoAccidente[], total: number}>}
     */
    async findByResponsable(responsable, options = {}) {
        throw new Error('Method not implemented');
    }

    /**
     * Actualizar un seguimiento
     * @param {string} id
     * @param {SeguimientoAccidente} seguimiento
     * @returns {Promise<SeguimientoAccidente>}
     */
    async update(id, seguimiento) {
        throw new Error('Method not implemented');
    }

    /**
     * Eliminar un seguimiento
     * @param {string} id
     * @returns {Promise<boolean>}
     */
    async delete(id) {
        throw new Error('Method not implemented');
    }

    /**
     * Contar seguimientos por accidente
     * @param {string} accidenteId
     * @returns {Promise<number>}
     */
    async countByAccidenteId(accidenteId) {
        throw new Error('Method not implemented');
    }

    /**
     * Contar seguimientos por tipo
     * @param {string} tipoSeguimiento
     * @returns {Promise<number>}
     */
    async countByTipo(tipoSeguimiento) {
        throw new Error('Method not implemented');
    }

    /**
     * Verificar si existe un seguimiento
     * @param {string} id
     * @returns {Promise<boolean>}
     */
    async exists(id) {
        throw new Error('Method not implemented');
    }
}

module.exports = SeguimientoAccidenteRepository;
