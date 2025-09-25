const EmpleadoRepository = require('../../domain/repositories/EmpleadoRepository');
const Empleado = require('../../domain/entities/Empleado');

class PostgresEmpleadoRepository extends EmpleadoRepository {
    constructor(database) {
        super();
        this.db = database;
    }

    async create(employee) {
        const query = `
            INSERT INTO empleados (
                id, nombres, apellidos, numero_documento, fecha_nacimiento,
                ciudad_id, centro_trabajo_id, sexo, salario, fecha_ingreso
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `;

        const values = [
            employee.id,
            employee.nombres,
            employee.apellidos,
            employee.documentoNo,
            employee.fechaDeNacimiento,
            employee.ciudadId,
            employee.centroTrabajoId,
            employee.sexo,
            employee.salario,
            employee.fechaDeIngreso
        ];

        try {
            const result = await this.db.query(query, values);
            return this._mapRowToEmployee(result.rows[0]);
        } catch (error) {
            if (error.code === '23505') { // Unique violation
                throw new Error(`Employee with documento ${employee.documentoNo} already exists`);
            }
            throw error;
        }
    }

    async findById(id) {
        const query = `
            SELECT 
                e.*,
                ct.codigo as centro_trabajo_codigo,
                ct.nombre as centro_trabajo_nombre,
                ct.descripcion as centro_trabajo_descripcion,
                c.codigo as ciudad_codigo,
                c.nombre as ciudad_nombre,
                d.id as departamento_id,
                d.codigo as departamento_codigo,
                d.nombre as departamento_nombre
            FROM empleados e
            LEFT JOIN centros_trabajo ct ON e.centro_trabajo_id = ct.id
            LEFT JOIN ciudades c ON e.ciudad_id = c.id
            LEFT JOIN departamentos d ON c.departamento_id = d.id
            WHERE e.id = $1
        `;
        const result = await this.db.query(query, [id]);
        
        if (result.rows.length === 0) {
            return null;
        }

        return this._mapRowToEmployee(result.rows[0]);
    }

    async findByDocumento(documentoNo) {
        const query = `
            SELECT 
                e.*,
                ct.codigo as centro_trabajo_codigo,
                ct.nombre as centro_trabajo_nombre,
                ct.descripcion as centro_trabajo_descripcion,
                c.codigo as ciudad_codigo,
                c.nombre as ciudad_nombre,
                d.id as departamento_id,
                d.codigo as departamento_codigo,
                d.nombre as departamento_nombre
            FROM empleados e
            LEFT JOIN centros_trabajo ct ON e.centro_trabajo_id = ct.id
            LEFT JOIN ciudades c ON e.ciudad_id = c.id
            LEFT JOIN departamentos d ON c.departamento_id = d.id
            WHERE e.numero_documento = $1
        `;
        const result = await this.db.query(query, [documentoNo]);
        
        if (result.rows.length === 0) {
            return null;
        }

        return this._mapRowToEmployee(result.rows[0]);
    }

    async findAll(filters = {}) {
        let query = `
            SELECT 
                e.*,
                ct.codigo as centro_trabajo_codigo,
                ct.nombre as centro_trabajo_nombre,
                ct.descripcion as centro_trabajo_descripcion,
                c.codigo as ciudad_codigo,
                c.nombre as ciudad_nombre,
                d.id as departamento_id,
                d.codigo as departamento_codigo,
                d.nombre as departamento_nombre
            FROM empleados e
            LEFT JOIN centros_trabajo ct ON e.centro_trabajo_id = ct.id
            LEFT JOIN ciudades c ON e.ciudad_id = c.id
            LEFT JOIN departamentos d ON c.departamento_id = d.id
            WHERE 1=1
        `;
        const values = [];
        let paramCount = 1;

        // Apply filters
        if (filters.centroTrabajoId) {
            query += ` AND e.centro_trabajo_id = $${paramCount}`;
            values.push(filters.centroTrabajoId);
            paramCount++;
        }

        if (filters.sexo) {
            query += ` AND e.sexo = $${paramCount}`;
            values.push(filters.sexo);
            paramCount++;
        }

        if (filters.ciudadId) {
            query += ` AND e.ciudad_id = $${paramCount}`;
            values.push(filters.ciudadId);
            paramCount++;
        }

        if (filters.departamentoId) {
            query += ` AND d.id = $${paramCount}`;
            values.push(filters.departamentoId);
            paramCount++;
        }

        if (filters.minSalario) {
            query += ` AND e.salario >= $${paramCount}`;
            values.push(filters.minSalario);
            paramCount++;
        }

        if (filters.maxSalario) {
            query += ` AND e.salario <= $${paramCount}`;
            values.push(filters.maxSalario);
            paramCount++;
        }

        // Add ordering
        query += ' ORDER BY e.creado_en DESC';

        // Add pagination
        if (filters.limit) {
            query += ` LIMIT $${paramCount}`;
            values.push(filters.limit);
            paramCount++;
        }

        if (filters.offset) {
            query += ` OFFSET $${paramCount}`;
            values.push(filters.offset);
            paramCount++;
        }

        const result = await this.db.query(query, values);
        return result.rows.map(row => this._mapRowToEmployee(row));
    }

    async update(id, employeeData) {
        const existingEmployee = await this.findById(id);
        if (!existingEmployee) {
            return null;
        }

        // Update the employee entity
        existingEmployee.update(employeeData);

        const query = `
            UPDATE empleados SET
                nombres = $2,
                apellidos = $3,
                numero_documento = $4,
                fecha_nacimiento = $5,
                ciudad_id = $6,
                centro_trabajo_id = $7,
                sexo = $8,
                salario = $9,
                fecha_ingreso = $10,
                actualizado_en = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
        `;

        const values = [
            id,
            existingEmployee.nombres,
            existingEmployee.apellidos,
            existingEmployee.documentoNo,
            existingEmployee.fechaDeNacimiento,
            existingEmployee.ciudadId,
            existingEmployee.centroTrabajoId,
            existingEmployee.sexo,
            existingEmployee.salario,
            existingEmployee.fechaDeIngreso
        ];

        try {
            const result = await this.db.query(query, values);
            return this._mapRowToEmployee(result.rows[0]);
        } catch (error) {
            if (error.code === '23505') { // Unique violation
                throw new Error(`Employee with documento ${existingEmployee.documentoNo} already exists`);
            }
            throw error;
        }
    }

    async delete(id) {
        const query = 'DELETE FROM empleados WHERE id = $1 RETURNING *';
        const result = await this.db.query(query, [id]);
        
        if (result.rows.length === 0) {
            return null;
        }

        return this._mapRowToEmployee(result.rows[0]);
    }

    async exists(id) {
        const query = 'SELECT 1 FROM empleados WHERE id = $1';
        const result = await this.db.query(query, [id]);
        return result.rows.length > 0;
    }

    async count(filters = {}) {
        let query = `
            SELECT COUNT(*) as count 
            FROM empleados e
            LEFT JOIN centros_trabajo ct ON e.centro_trabajo_id = ct.id
            LEFT JOIN ciudades c ON e.ciudad_id = c.id
            LEFT JOIN departamentos d ON c.departamento_id = d.id
            WHERE 1=1
        `;
        const values = [];
        let paramCount = 1;

        // Apply same filters as findAll
        if (filters.centroTrabajoId) {
            query += ` AND e.centro_trabajo_id = $${paramCount}`;
            values.push(filters.centroTrabajoId);
            paramCount++;
        }

        if (filters.sexo) {
            query += ` AND e.sexo = $${paramCount}`;
            values.push(filters.sexo);
            paramCount++;
        }

        if (filters.ciudadId) {
            query += ` AND e.ciudad_id = $${paramCount}`;
            values.push(filters.ciudadId);
            paramCount++;
        }

        if (filters.departamentoId) {
            query += ` AND d.id = $${paramCount}`;
            values.push(filters.departamentoId);
            paramCount++;
        }

        if (filters.minSalario) {
            query += ` AND e.salario >= $${paramCount}`;
            values.push(filters.minSalario);
            paramCount++;
        }

        if (filters.maxSalario) {
            query += ` AND e.salario <= $${paramCount}`;
            values.push(filters.maxSalario);
            paramCount++;
        }

        const result = await this.db.query(query, values);
        return parseInt(result.rows[0].count);
    }

    _mapRowToEmployee(row) {
        const employee = new Empleado({
            id: row.id,
            nombres: row.nombres,
            apellidos: row.apellidos,
            documentoNo: row.numero_documento,
            fechaDeNacimiento: row.fecha_nacimiento,
            ciudadId: row.ciudad_id,
            centroTrabajoId: row.centro_trabajo_id,
            sexo: row.sexo,
            salario: parseFloat(row.salario),
            fechaDeIngreso: row.fecha_ingreso,
            createdAt: row.creado_en,
            updatedAt: row.actualizado_en
        });

        // Add centro de trabajo information if available
        if (row.centro_trabajo_codigo) {
            employee.centroTrabajo = {
                codigo: row.centro_trabajo_codigo,
                nombre: row.centro_trabajo_nombre,
                descripcion: row.centro_trabajo_descripcion
            };
        }

        // Add ciudad information if available
        if (row.ciudad_codigo) {
            employee.ciudad = {
                codigo: row.ciudad_codigo,
                nombre: row.ciudad_nombre,
                departamento: {
                    id: row.departamento_id,
                    codigo: row.departamento_codigo,
                    nombre: row.departamento_nombre
                }
            };
        }

        return employee;
    }
}

module.exports = PostgresEmpleadoRepository;