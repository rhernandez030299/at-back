# Empleado Management API

A Node.js REST API built with Fastify and PostgreSQL using Clean Architecture and Hexagonal Architecture patterns.

## Features

- 🏗️ **Clean Architecture**: Separation of concerns with domain, application, infrastructure, and interface layers
- 🔧 **Fastify**: High-performance web framework
- 💾 **PostgreSQL**: Robust database with proper schema design
- 📝 **CRUD Operations**: Complete empleado management functionality
- 🔍 **Filtering & Pagination**: Advanced query capabilities
- ✅ **Input Validation**: Request validation with JSON schemas
- 🚀 **Production Ready**: Error handling, logging, and graceful shutdown

## Architecture

```
src/
├── domain/                 # Business logic and entities
│   ├── entities/          # Domain entities
│   └── repositories/      # Repository interfaces
├── application/           # Use cases and business rules
│   └── use-cases/        # Application use cases
├── infrastructure/        # External concerns
│   ├── config/           # Configuration files
│   ├── database/         # Database migrations and config
│   ├── repositories/     # Repository implementations
│   └── di/              # Dependency injection
├── interfaces/           # Controllers and routes
│   ├── controllers/      # HTTP controllers
│   └── routes/          # Route definitions
└── main.js              # Application entry point
```

## Empleado Schema

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique identifier |
| nombreYApellidos | String | Full name |
| documentoNo | String | Document number (unique) |
| fechaDeNacimiento | Date | Birth date |
| ciudad | String | Municipality |
| cpt | Enum | Workplace (CPT) |
| sexo | Enum | Gender (M/F) |
| salario | Number | Salary |
| fechaDeIngreso | DateTime | Entry date |
| edad | Computed | Age (calculated from birth date) |
| mes | Computed | Month from entry date |

### CPT (Workplace) Options
- `FISCALIA_GENERAL_DE_LA_NACION`
- `DISPENSARIO_MEDICO_DE_IBAGUE`
- `EMAB_ADMINISTRATIVO`
- `HOSPITAL_PSIQUIATRICO_SAN_CAMILO`

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)

### Installation

1. **Clone and setup**:
   ```bash
   cd back
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp env.example .env
   # Edit .env with your database credentials
   ```

3. **Setup database**:
   ```bash
   # Create database
   createdb empleado_management
   
   # Run migrations
   npm run migrate
   ```

4. **Start the server**:
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Base URL: `http://localhost:3000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/info` | API information |
| POST | `/api/empleados` | Create empleado |
| GET | `/api/empleados` | Get all empleados |
| GET | `/api/empleados/:id` | Get empleado by ID |
| PUT | `/api/empleados/:id` | Update empleado |
| DELETE | `/api/empleados/:id` | Delete empleado |

### Query Parameters (GET /api/empleados)

- `cpt`: Filter by workplace
- `sexo`: Filter by gender (M/F)
- `ciudad`: Filter by municipality (partial match)
- `minSalario`: Minimum salary
- `maxSalario`: Maximum salary
- `limit`: Results per page (1-100)
- `offset`: Results offset for pagination

### Example Requests

**Create Empleado:**
```bash
curl -X POST http://localhost:3000/api/empleados \
  -H "Content-Type: application/json" \
  -d '{
    "nombreYApellidos": "NATALIA MARIA CANO HENAO",
    "documentoNo": "24397738",
    "fechaDeNacimiento": "1981-09-13",
    "ciudad": "CALDAS",
    "cpt": "FISCALIA_GENERAL_DE_LA_NACION",
    "sexo": "F",
    "salario": 1423500
  }'
```

**Get All Empleados with Filters:**
```bash
curl "http://localhost:3000/api/empleados?cpt=FISCALIA_GENERAL_DE_LA_NACION&limit=10&offset=0"
```

**Update Empleado:**
```bash
curl -X PUT http://localhost:3000/api/empleados/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "salario": 1500000
  }'
```

## Response Format

### Success Response:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "nombreYApellidos": "NATALIA MARIA CANO HENAO",
    "documentoNo": "24397738",
    "fechaDeNacimiento": "1981-09-13T00:00:00.000Z",
    "ciudad": "CALDAS",
    "cpt": "FISCALIA_GENERAL_DE_LA_NACION",
    "sexo": "F",
    "salario": 1423500,
    "fechaDeIngreso": "2024-01-15T10:30:00.000Z",
    "edad": 43,
    "mes": "ENE",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Error Response:
```json
{
  "success": false,
  "error": "Empleado with documento 24397738 already exists"
}
```

## Development

### Database Migrations

Run migrations:
```bash
npm run migrate
```

Add new migration:
1. Create a new `.sql` file in `src/infrastructure/database/migrations/`
2. Name it with incremental number: `002_your_migration.sql`
3. Run `npm run migrate`

### Environment Variables

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=empleado_management
DB_USER=postgres
DB_PASSWORD=password

# Server
PORT=3000
HOST=0.0.0.0
LOG_LEVEL=info
```

## Project Structure Benefits

- **Domain Layer**: Pure business logic, no external dependencies
- **Application Layer**: Use cases orchestrate business operations
- **Infrastructure Layer**: Database, external services, configuration
- **Interface Layer**: HTTP controllers, route definitions
- **Dependency Injection**: Loose coupling, easy testing and maintenance

This architecture ensures:
- ✅ Testability
- ✅ Maintainability  
- ✅ Scalability
- ✅ Independence from frameworks
- ✅ Clear separation of concerns

