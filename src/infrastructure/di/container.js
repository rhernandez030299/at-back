// Dependency Injection Container
const DatabaseConfig = require('../config/database');
const PostgresEmpleadoRepository = require('../repositories/PostgresEmpleadoRepository');
const PostgresCentroTrabajoRepository = require('../repositories/PostgresCentroTrabajoRepository');

// Empleado Use Cases
const CrearEmpleadoUseCase = require('../../application/use-cases/Empleado/CrearEmpleadoUseCase');
const ObtenerEmpleadoUseCase = require('../../application/use-cases/Empleado/ObtenerEmpleadoUseCase');
const ObtenerTodosEmpleadosUseCase = require('../../application/use-cases/Empleado/ObtenerTodosEmpleadosUseCase');
const ActualizarEmpleadoUseCase = require('../../application/use-cases/Empleado/ActualizarEmpleadoUseCase');
const EliminarEmpleadoUseCase = require('../../application/use-cases/Empleado/EliminarEmpleadoUseCase');

// Centro de Trabajo Use Cases
const ObtenerTodosCentrosTrabajoUseCase = require('../../application/use-cases/CentroTrabajo/ObtenerTodosCentrosTrabajoUseCase');
const ObtenerCentroTrabajoUseCase = require('../../application/use-cases/CentroTrabajo/ObtenerCentroTrabajoUseCase');
const ObtenerCentrosTrabajoActivosUseCase = require('../../application/use-cases/CentroTrabajo/ObtenerCentrosTrabajoActivosUseCase');

// Accidente imports
const PostgresAccidenteRepository = require('../repositories/PostgresAccidenteRepository');
const CrearAccidenteUseCase = require('../../application/use-cases/Accidente/CrearAccidenteUseCase');
const ObtenerAccidenteUseCase = require('../../application/use-cases/Accidente/ObtenerAccidenteUseCase');
const ObtenerTodosAccidentesUseCase = require('../../application/use-cases/Accidente/ObtenerTodosAccidentesUseCase');
const ActualizarAccidenteUseCase = require('../../application/use-cases/Accidente/ActualizarAccidenteUseCase');
const EliminarAccidenteUseCase = require('../../application/use-cases/Accidente/EliminarAccidenteUseCase');
const ObtenerAccidentesPorEmpleadoUseCase = require('../../application/use-cases/Accidente/ObtenerAccidentesPorEmpleadoUseCase');
const ObtenerEstadisticasAccidentesUseCase = require('../../application/use-cases/Accidente/ObtenerEstadisticasAccidentesUseCase');

// Departamento and Ciudad imports
const PostgresDepartamentoRepository = require('../repositories/PostgresDepartamentoRepository');
const PostgresCiudadRepository = require('../repositories/PostgresCiudadRepository');
const ObtenerTodosDepartamentosUseCase = require('../../application/use-cases/Departamento/ObtenerTodosDepartamentosUseCase');
const ObtenerDepartamentoUseCase = require('../../application/use-cases/Departamento/ObtenerDepartamentoUseCase');
const ObtenerTodasCiudadesUseCase = require('../../application/use-cases/Ciudad/ObtenerTodasCiudadesUseCase');
const ObtenerCiudadesPorDepartamentoUseCase = require('../../application/use-cases/Ciudad/ObtenerCiudadesPorDepartamentoUseCase');
const DepartamentoController = require('../../interfaces/controllers/DepartamentoController');
const CiudadController = require('../../interfaces/controllers/CiudadController');

// Controllers
const EmpleadoController = require('../../interfaces/controllers/EmpleadoController');
const AccidenteController = require('../../interfaces/controllers/AccidenteController');
const CentroTrabajoController = require('../../interfaces/controllers/CentroTrabajoController');

class DIContainer {
    constructor() {
        this.dependencies = {};
    }

    async initialize() {
        // Database
        this.dependencies.database = new DatabaseConfig();
        await this.dependencies.database.connect();

        // Repositories
        this.dependencies.empleadoRepository = new PostgresEmpleadoRepository(
            this.dependencies.database
        );

        this.dependencies.centroTrabajoRepository = new PostgresCentroTrabajoRepository(
            this.dependencies.database
        );

        this.dependencies.accidenteRepository = new PostgresAccidenteRepository(
            this.dependencies.database
        );

        this.dependencies.departamentoRepository = new PostgresDepartamentoRepository(
            this.dependencies.database
        );

        this.dependencies.ciudadRepository = new PostgresCiudadRepository(
            this.dependencies.database
        );

        // Empleado Use Cases
        this.dependencies.crearEmpleadoUseCase = new CrearEmpleadoUseCase(
            this.dependencies.empleadoRepository,
            this.dependencies.centroTrabajoRepository,
            this.dependencies.ciudadRepository
        );

        this.dependencies.obtenerEmpleadoUseCase = new ObtenerEmpleadoUseCase(
            this.dependencies.empleadoRepository
        );

        this.dependencies.obtenerTodosEmpleadosUseCase = new ObtenerTodosEmpleadosUseCase(
            this.dependencies.empleadoRepository
        );

        this.dependencies.actualizarEmpleadoUseCase = new ActualizarEmpleadoUseCase(
            this.dependencies.empleadoRepository,
            this.dependencies.centroTrabajoRepository,
            this.dependencies.ciudadRepository
        );

        this.dependencies.eliminarEmpleadoUseCase = new EliminarEmpleadoUseCase(
            this.dependencies.empleadoRepository
        );

        // Accidente Use Cases
        this.dependencies.crearAccidenteUseCase = new CrearAccidenteUseCase(
            this.dependencies.accidenteRepository,
            this.dependencies.empleadoRepository
        );

        this.dependencies.obtenerAccidenteUseCase = new ObtenerAccidenteUseCase(
            this.dependencies.accidenteRepository
        );

        this.dependencies.obtenerTodosAccidentesUseCase = new ObtenerTodosAccidentesUseCase(
            this.dependencies.accidenteRepository
        );

        this.dependencies.actualizarAccidenteUseCase = new ActualizarAccidenteUseCase(
            this.dependencies.accidenteRepository,
            this.dependencies.empleadoRepository
        );

        this.dependencies.eliminarAccidenteUseCase = new EliminarAccidenteUseCase(
            this.dependencies.accidenteRepository
        );

        this.dependencies.obtenerAccidentesPorEmpleadoUseCase = new ObtenerAccidentesPorEmpleadoUseCase(
            this.dependencies.accidenteRepository,
            this.dependencies.empleadoRepository
        );

        this.dependencies.obtenerEstadisticasAccidentesUseCase = new ObtenerEstadisticasAccidentesUseCase(
            this.dependencies.accidenteRepository
        );

        // Centro de Trabajo Use Cases
        this.dependencies.obtenerTodosCentrosTrabajoUseCase = new ObtenerTodosCentrosTrabajoUseCase(
            this.dependencies.centroTrabajoRepository
        );

        this.dependencies.obtenerCentroTrabajoUseCase = new ObtenerCentroTrabajoUseCase(
            this.dependencies.centroTrabajoRepository
        );

        this.dependencies.obtenerCentrosTrabajoActivosUseCase = new ObtenerCentrosTrabajoActivosUseCase(
            this.dependencies.centroTrabajoRepository
        );

        // Controllers
        this.dependencies.empleadoController = new EmpleadoController({
            crearEmpleadoUseCase: this.dependencies.crearEmpleadoUseCase,
            obtenerEmpleadoUseCase: this.dependencies.obtenerEmpleadoUseCase,
            obtenerTodosEmpleadosUseCase: this.dependencies.obtenerTodosEmpleadosUseCase,
            actualizarEmpleadoUseCase: this.dependencies.actualizarEmpleadoUseCase,
            eliminarEmpleadoUseCase: this.dependencies.eliminarEmpleadoUseCase
        });

        this.dependencies.accidenteController = new AccidenteController({
            crearAccidenteUseCase: this.dependencies.crearAccidenteUseCase,
            obtenerAccidenteUseCase: this.dependencies.obtenerAccidenteUseCase,
            obtenerTodosAccidentesUseCase: this.dependencies.obtenerTodosAccidentesUseCase,
            actualizarAccidenteUseCase: this.dependencies.actualizarAccidenteUseCase,
            eliminarAccidenteUseCase: this.dependencies.eliminarAccidenteUseCase,
            obtenerAccidentesPorEmpleadoUseCase: this.dependencies.obtenerAccidentesPorEmpleadoUseCase,
            obtenerEstadisticasAccidentesUseCase: this.dependencies.obtenerEstadisticasAccidentesUseCase
        });

        this.dependencies.centroTrabajoController = new CentroTrabajoController({
            obtenerTodosCentrosTrabajoUseCase: this.dependencies.obtenerTodosCentrosTrabajoUseCase,
            obtenerCentroTrabajoUseCase: this.dependencies.obtenerCentroTrabajoUseCase,
            obtenerCentrosTrabajoActivosUseCase: this.dependencies.obtenerCentrosTrabajoActivosUseCase
        });

        // Departamento Use Cases
        this.dependencies.obtenerTodosDepartamentosUseCase = new ObtenerTodosDepartamentosUseCase(
            this.dependencies.departamentoRepository
        );

        this.dependencies.obtenerDepartamentoUseCase = new ObtenerDepartamentoUseCase(
            this.dependencies.departamentoRepository
        );

        // Ciudad Use Cases
        this.dependencies.obtenerTodasCiudadesUseCase = new ObtenerTodasCiudadesUseCase(
            this.dependencies.ciudadRepository
        );

        this.dependencies.obtenerCiudadesPorDepartamentoUseCase = new ObtenerCiudadesPorDepartamentoUseCase(
            this.dependencies.ciudadRepository,
            this.dependencies.departamentoRepository
        );

        // Departamento and Ciudad Controllers
        this.dependencies.departamentoController = new DepartamentoController(
            this.dependencies.obtenerTodosDepartamentosUseCase,
            this.dependencies.obtenerDepartamentoUseCase
        );

        this.dependencies.ciudadController = new CiudadController(
            this.dependencies.obtenerTodasCiudadesUseCase,
            this.dependencies.obtenerCiudadesPorDepartamentoUseCase
        );

        console.log('✅ Dependency injection container initialized');
        return this.dependencies;
    }

    get(dependencyName) {
        if (!this.dependencies[dependencyName]) {
            throw new Error(`Dependency '${dependencyName}' not found`);
        }
        return this.dependencies[dependencyName];
    }

    async close() {
        if (this.dependencies.database) {
            await this.dependencies.database.close();
        }
    }
}

module.exports = DIContainer;

