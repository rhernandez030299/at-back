// Dependency Injection Container
const DatabaseConfig = require('../config/database');
const PostgresEmployeeRepository = require('../repositories/PostgresEmployeeRepository');
const PostgresAccidentRepository = require('../repositories/PostgresAccidentRepository');
const PostgresCentroTrabajoRepository = require('../repositories/PostgresCentroTrabajoRepository');

// Employee Use Cases
const CreateEmployeeUseCase = require('../../application/use-cases/CreateEmployeeUseCase');
const GetEmployeeUseCase = require('../../application/use-cases/GetEmployeeUseCase');
const GetAllEmployeesUseCase = require('../../application/use-cases/GetAllEmployeesUseCase');
const UpdateEmployeeUseCase = require('../../application/use-cases/UpdateEmployeeUseCase');
const DeleteEmployeeUseCase = require('../../application/use-cases/DeleteEmployeeUseCase');

// Accident Use Cases
const CreateAccidentUseCase = require('../../application/use-cases/CreateAccidentUseCase');
const GetAccidentUseCase = require('../../application/use-cases/GetAccidentUseCase');
const GetAllAccidentsUseCase = require('../../application/use-cases/GetAllAccidentsUseCase');
const UpdateAccidentUseCase = require('../../application/use-cases/UpdateAccidentUseCase');
const DeleteAccidentUseCase = require('../../application/use-cases/DeleteAccidentUseCase');
const GetAccidentsByEmployeeUseCase = require('../../application/use-cases/GetAccidentsByEmployeeUseCase');

// Centro de Trabajo Use Cases
const GetAllCentrosTrabajoUseCase = require('../../application/use-cases/GetAllCentrosTrabajoUseCase');
const GetCentroTrabajoUseCase = require('../../application/use-cases/GetCentroTrabajoUseCase');
const GetActiveCentrosTrabajoUseCase = require('../../application/use-cases/GetActiveCentrosTrabajoUseCase');

// Departamento and Ciudad imports
const PostgresDepartamentoRepository = require('../repositories/PostgresDepartamentoRepository');
const PostgresCiudadRepository = require('../repositories/PostgresCiudadRepository');
const GetAllDepartamentosUseCase = require('../../application/use-cases/GetAllDepartamentosUseCase');
const GetDepartamentoUseCase = require('../../application/use-cases/GetDepartamentoUseCase');
const GetAllCiudadesUseCase = require('../../application/use-cases/GetAllCiudadesUseCase');
const GetCiudadesByDepartamentoUseCase = require('../../application/use-cases/GetCiudadesByDepartamentoUseCase');
const DepartamentoController = require('../../interfaces/controllers/DepartamentoController');
const CiudadController = require('../../interfaces/controllers/CiudadController');

// Controllers
const EmployeeController = require('../../interfaces/controllers/EmployeeController');
const AccidentController = require('../../interfaces/controllers/AccidentController');
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
        this.dependencies.employeeRepository = new PostgresEmployeeRepository(
            this.dependencies.database
        );

        this.dependencies.accidentRepository = new PostgresAccidentRepository(
            this.dependencies.database
        );

        this.dependencies.centroTrabajoRepository = new PostgresCentroTrabajoRepository(
            this.dependencies.database
        );

        this.dependencies.departamentoRepository = new PostgresDepartamentoRepository(
            this.dependencies.database
        );

        this.dependencies.ciudadRepository = new PostgresCiudadRepository(
            this.dependencies.database
        );

        // Employee Use Cases
        this.dependencies.createEmployeeUseCase = new CreateEmployeeUseCase(
            this.dependencies.employeeRepository,
            this.dependencies.centroTrabajoRepository,
            this.dependencies.ciudadRepository
        );

        this.dependencies.getEmployeeUseCase = new GetEmployeeUseCase(
            this.dependencies.employeeRepository
        );

        this.dependencies.getAllEmployeesUseCase = new GetAllEmployeesUseCase(
            this.dependencies.employeeRepository
        );

        this.dependencies.updateEmployeeUseCase = new UpdateEmployeeUseCase(
            this.dependencies.employeeRepository,
            this.dependencies.centroTrabajoRepository,
            this.dependencies.ciudadRepository
        );

        this.dependencies.deleteEmployeeUseCase = new DeleteEmployeeUseCase(
            this.dependencies.employeeRepository
        );

        // Accident Use Cases
        this.dependencies.createAccidentUseCase = new CreateAccidentUseCase(
            this.dependencies.accidentRepository,
            this.dependencies.employeeRepository
        );

        this.dependencies.getAccidentUseCase = new GetAccidentUseCase(
            this.dependencies.accidentRepository
        );

        this.dependencies.getAllAccidentsUseCase = new GetAllAccidentsUseCase(
            this.dependencies.accidentRepository
        );

        this.dependencies.updateAccidentUseCase = new UpdateAccidentUseCase(
            this.dependencies.accidentRepository,
            this.dependencies.employeeRepository
        );

        this.dependencies.deleteAccidentUseCase = new DeleteAccidentUseCase(
            this.dependencies.accidentRepository
        );

        this.dependencies.getAccidentsByEmployeeUseCase = new GetAccidentsByEmployeeUseCase(
            this.dependencies.accidentRepository,
            this.dependencies.employeeRepository
        );

        // Centro de Trabajo Use Cases
        this.dependencies.getAllCentrosTrabajoUseCase = new GetAllCentrosTrabajoUseCase(
            this.dependencies.centroTrabajoRepository
        );

        this.dependencies.getCentroTrabajoUseCase = new GetCentroTrabajoUseCase(
            this.dependencies.centroTrabajoRepository
        );

        this.dependencies.getActiveCentrosTrabajoUseCase = new GetActiveCentrosTrabajoUseCase(
            this.dependencies.centroTrabajoRepository
        );

        // Controllers
        this.dependencies.employeeController = new EmployeeController({
            createEmployeeUseCase: this.dependencies.createEmployeeUseCase,
            getEmployeeUseCase: this.dependencies.getEmployeeUseCase,
            getAllEmployeesUseCase: this.dependencies.getAllEmployeesUseCase,
            updateEmployeeUseCase: this.dependencies.updateEmployeeUseCase,
            deleteEmployeeUseCase: this.dependencies.deleteEmployeeUseCase
        });

        this.dependencies.accidentController = new AccidentController({
            createAccidentUseCase: this.dependencies.createAccidentUseCase,
            getAccidentUseCase: this.dependencies.getAccidentUseCase,
            getAllAccidentsUseCase: this.dependencies.getAllAccidentsUseCase,
            updateAccidentUseCase: this.dependencies.updateAccidentUseCase,
            deleteAccidentUseCase: this.dependencies.deleteAccidentUseCase,
            getAccidentsByEmployeeUseCase: this.dependencies.getAccidentsByEmployeeUseCase
        });

        this.dependencies.centroTrabajoController = new CentroTrabajoController({
            getAllCentrosTrabajoUseCase: this.dependencies.getAllCentrosTrabajoUseCase,
            getCentroTrabajoUseCase: this.dependencies.getCentroTrabajoUseCase,
            getActiveCentrosTrabajoUseCase: this.dependencies.getActiveCentrosTrabajoUseCase
        });

        // Departamento Use Cases
        this.dependencies.getAllDepartamentosUseCase = new GetAllDepartamentosUseCase(
            this.dependencies.departamentoRepository
        );

        this.dependencies.getDepartamentoUseCase = new GetDepartamentoUseCase(
            this.dependencies.departamentoRepository
        );

        // Ciudad Use Cases
        this.dependencies.getAllCiudadesUseCase = new GetAllCiudadesUseCase(
            this.dependencies.ciudadRepository
        );

        this.dependencies.getCiudadesByDepartamentoUseCase = new GetCiudadesByDepartamentoUseCase(
            this.dependencies.ciudadRepository,
            this.dependencies.departamentoRepository
        );

        // Departamento and Ciudad Controllers
        this.dependencies.departamentoController = new DepartamentoController(
            this.dependencies.getAllDepartamentosUseCase,
            this.dependencies.getDepartamentoUseCase
        );

        this.dependencies.ciudadController = new CiudadController(
            this.dependencies.getAllCiudadesUseCase,
            this.dependencies.getCiudadesByDepartamentoUseCase
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

