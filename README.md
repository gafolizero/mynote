# myNote - Note Management Application

A full-stack note-taking application built with React and Node.js, featuring folder organization, tagging, search, and user authentication.

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture & Engineering Decisions](#architecture--engineering-decisions)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Assumptions Made](#assumptions-made)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Logging](#logging)
- [Security Considerations](#security-considerations)

---

## Project Overview

**myNote** is a web application that allows users to create, organize, and manage notes with the following features:

- **User Authentication**: Secure signup and login with JWT tokens
- **Note Management**: Create, read, update, and delete notes
- **Folder Organization**: Organize notes into custom folders
- **Tagging System**: Tag notes for better categorization
- **Search Functionality**: Search notes by title or content
- **Filtering & Sorting**: Filter by folder, tags, archived status, and sort by various fields
- **Pin & Archive**: Pin important notes and archive completed ones

---

## Architecture & Engineering Decisions

### Backend Architecture

The backend follows a **layered architecture pattern** with clear separation of concerns:

```
Routes → Controllers → Services → Repositories → Database
```

#### 1. **Layered Architecture**

**Decision**: Implemented a 4-layer architecture (Routes → Controllers → Services → Repositories)

**Rationale**:
- **Separation of Concerns**: Each layer has a single responsibility
- **Testability**: Easy to mock dependencies and test each layer independently
- **Maintainability**: Changes in one layer don't affect others
- **Scalability**: Easy to add new features or modify existing ones

**Layers**:
- **Routes**: Define API endpoints and apply middleware (validation, authentication)
- **Controllers**: Handle HTTP requests/responses, delegate to services
- **Services**: Contain business logic, orchestrate repository calls
- **Repositories**: Handle all database operations, abstract SQL queries

#### 2. **Error Handling Strategy**

**Decision**: Centralized error handling with custom `AppError` class

**Implementation**:
- Custom `AppError` class extends native Error with status codes
- Global error middleware catches all errors
- PostgreSQL error codes (23505, 23503, 23502) are mapped to user-friendly messages
- Different error responses for development vs production

**Rationale**:
- Consistent error responses across the application
- Security: Hide stack traces in production
- Better debugging in development
- Proper HTTP status codes

#### 3. **Validation Strategy**

**Decision**: Schema-based validation using Zod

**Implementation**:
- Zod schemas for request validation
- Reusable validation middleware
- Detailed error messages for invalid inputs

**Rationale**:
- Type safety and runtime validation
- Clear, user-friendly error messages
- Prevents invalid data from reaching business logic
- Reduces boilerplate code

#### 4. **Authentication & Authorization**

**Decision**: JWT-based authentication with Bearer tokens

**Implementation**:
- JWT tokens stored in localStorage (frontend)
- Token verification middleware protects routes
- Password hashing with bcrypt (salt rounds: 10)
- Token expiration: 7 days (configurable)

**Rationale**:
- Stateless authentication (no server-side sessions)
- Scalable for distributed systems
- Secure password storage
- Industry-standard approach

#### 5. **Database Design**

**Decision**: PostgreSQL with normalized schema

**Schema Design**:
- **Users**: Authentication and user data
- **Folders**: User-specific folder organization
- **Notes**: Core note entity with folder relationship
- **Tags**: User-specific tags
- **Note_Tags**: Many-to-many relationship between notes and tags

**Key Design Decisions**:
- `ON DELETE CASCADE` for user-related data (ensures data integrity)
- `ON DELETE SET NULL` for folder_id in notes (notes can exist without folders)
- Unique constraint on `(user_id, name)` for tags (prevents duplicate tags per user)
- Timestamps for created_at and updated_at tracking

**Rationale**:
- Relational database ensures data integrity
- Foreign key constraints prevent orphaned records
- Normalized design reduces data redundancy
- Supports complex queries efficiently

#### 6. **Query Building Pattern**

**Decision**: Custom `SQLFeatures` class for dynamic query building

**Implementation**:
- Builder pattern for constructing SQL queries
- Supports filtering, sorting, pagination, and search
- Parameterized queries prevent SQL injection

**Rationale**:
- Reusable query building logic
- Prevents SQL injection attacks
- Flexible filtering and sorting
- Clean, maintainable code

#### 7. **Logging Strategy**

**Decision**: Winston-based structured logging

**Implementation**:
- File-based logging (combined.log, error.log)
- Console logging in development
- Exception and rejection handlers
- Integration with Morgan for HTTP request logging
- Log rotation (5MB files, 5 file retention)

**Rationale**:
- Production-ready logging solution
- Structured logs for easier analysis
- Different log levels for different environments
- Automatic log rotation prevents disk space issues
- Comprehensive error tracking

#### 8. **API Documentation**

**Decision**: Swagger/OpenAPI documentation

**Implementation**:
- Swagger UI at `/api-docs`
- JSDoc comments in route files
- Interactive API testing interface

**Rationale**:
- Self-documenting API
- Easy for frontend developers to understand endpoints
- Interactive testing without Postman
- Industry standard

### Frontend Architecture

#### 1. **Component-Based Architecture**

**Decision**: React functional components with hooks

**Structure**:
- **Pages**: Top-level route components (Login, Signup, Dashboard)
- **Components**: Reusable UI components (NoteCard, Sidebar, etc.)
- **Context**: Global state management (AuthContext)
- **Services**: API communication layer

**Rationale**:
- Modern React patterns
- Reusable components
- Clear component hierarchy
- Easy to test and maintain

#### 2. **State Management**

**Decision**: React Context API for authentication state

**Implementation**:
- `AuthContext` for user authentication state
- localStorage for token persistence
- Custom events for cross-component communication

**Rationale**:
- Simple state management for authentication
- No need for Redux for this use case
- Built-in React solution
- Easy to understand and maintain

#### 3. **API Communication**

**Decision**: Axios with interceptors

**Implementation**:
- Centralized API client
- Request interceptor adds JWT token
- Response interceptor handles 401 errors globally
- Toast notifications for errors

**Rationale**:
- Centralized error handling
- Automatic token injection
- Better user experience with error messages
- Reduces code duplication

---

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.2.1
- **Database**: PostgreSQL 8.16.3
- **Authentication**: JWT (jsonwebtoken 9.0.3)
- **Password Hashing**: bcrypt 6.0.0
- **Validation**: Zod 4.2.1
- **Logging**: Winston 3.19.0
- **HTTP Logging**: Morgan 1.10.1
- **API Documentation**: Swagger (swagger-jsdoc, swagger-ui-express)
- **Testing**: Jest
- **Environment**: dotenv 17.2.3

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Routing**: React Router DOM 7.11.0
- **HTTP Client**: Axios 1.13.2
- **Icons**: Lucide React 0.562.0
- **Notifications**: React Hot Toast 2.6.0
- **Linting**: ESLint 9.39.1

---

## Project Structure

```
mynote/
├── backend/
│   ├── config/
│   │   ├── config.env          # Environment variables
│   │   └── db.js               # Database connection pool
│   ├── logs/                   # Log files (auto-generated)
│   ├── scripts/
│   │   ├── initDB.js           # Database schema initialization
│   │   └── seed.js             # Sample data seeding
│   ├── src/
│   │   ├── app.js              # Express app configuration
│   │   ├── server.js           # Server entry point
│   │   ├── config/
│   │   │   └── swagger.js      # Swagger configuration
│   │   ├── controllers/        # Request handlers
│   │   ├── services/           # Business logic
│   │   ├── repositories/       # Database access layer
│   │   ├── routes/             # API route definitions
│   │   ├── middleware/         # Express middleware
│   │   └── utils/              # Utility functions & validators
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/          # React components
    │   ├── pages/               # Page components
    │   ├── context/             # React Context providers
    │   ├── services/            # API service layer
    │   ├── App.jsx              # Main app component
    │   └── main.jsx
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── eslint.config.js
```

---

## Setup Instructions

### Prerequisites

- **Node.js**: v18 or higher
- **PostgreSQL**: v12 or higher
- **npm**: v9 or higher (comes with Node.js)

### Git Clone
```bash
git clone https://github.com/gafolizero/mynote.git
```


### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   - Edit `config/config.env` with your database credentials:
     ```env
     PORT=8080
     NODE_ENV=development

     DB_HOST=localhost
     DB_USER=your_db_user
     DB_PASSWORD=your_db_password
     DB_NAME=mynote
     DB_PORT=5432

     JWT_SECRET=your_secret_key_here
     JWT_EXPIRES_IN=7d

     LOG_LEVEL=debug
     ```

4. **Create PostgreSQL database**:
   ```bash
   createdb mynote
   ```
   Or using psql:
   ```sql
   CREATE DATABASE mynote;
   ```

5. **Initialize database schema**:
   ```bash
   node scripts/initDB.js
   ```

6. **Seed database with sample data** (optional):
   ```bash
   node scripts/seed.js
   ```

7. **Start the server**:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:8080`

8. **Access API documentation**:
   - Swagger UI: `http://localhost:8080/api-docs`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

### Running Tests

**Backend tests**:
```bash
cd backend
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
```

**Frontend tests**:
```bash
cd frontend
npm test              # Run tests
```

---

## Assumptions Made

### 1. **Development Environment**
- **Assumption**: Development environment uses localhost with default ports
- **Rationale**: Standard development setup, easy to configure
- **Production Consideration**: Environment variables should be configured for production deployment

### 2. **Database**
- **Assumption**: PostgreSQL is available and accessible
- **Rationale**: PostgreSQL is a robust, open-source relational database
- **Production Consideration**: Use connection pooling and read replicas for scalability

### 3. **Authentication**
- **Assumption**: JWT tokens stored in localStorage are acceptable for this application
- **Rationale**: Simpler implementation, no server-side session management needed
- **Production Consideration**: For enhanced security, consider httpOnly cookies or token refresh mechanism

### 4. **Password Security**
- **Assumption**: bcrypt with 10 salt rounds is sufficient
- **Rationale**: Industry standard, balances security and performance
- **Production Consideration**: Consider increasing salt rounds if needed

### 5. **CORS Configuration**
- **Assumption**: Frontend runs on `http://localhost:5173`
- **Rationale**: Default Vite development server port
- **Production Consideration**: Update CORS origin to production domain

### 6. **Error Handling**
- **Assumption**: Generic error messages in production are acceptable
- **Rationale**: Prevents information leakage
- **Production Consideration**: Implement error tracking (e.g., Sentry) for production monitoring

### 7. **File Storage**
- **Assumption**: Notes are text-only (no file attachments)
- **Rationale**: Simpler implementation, meets basic requirements
- **Production Consideration**: Add file upload capability if needed

### 8. **User Management**
- **Assumption**: Single-user application (users can only access their own data)
- **Rationale**: Standard note-taking app behavior
- **Production Consideration**: Add sharing/collaboration features if needed

### 9. **Search Functionality**
- **Assumption**: Simple ILIKE search is sufficient
- **Rationale**: Works for small to medium datasets
- **Production Consideration**: Implement full-text search (PostgreSQL tsvector) for better performance

### 10. **Logging**
- **Assumption**: File-based logging is sufficient
- **Rationale**: Works for single-server deployments
- **Production Consideration**: Use centralized logging (ELK stack, CloudWatch) for distributed systems

### 11. **Testing**
- **Assumption**: Basic unit tests are sufficient for initial development
- **Rationale**: Provides foundation for testing
- **Production Consideration**: Add integration tests, E2E tests, and increase coverage

### 12. **Data Validation**
- **Assumption**: Client-side and server-side validation is sufficient
- **Rationale**: Defense in depth approach
- **Production Consideration**: Add rate limiting and input sanitization

---

## API Documentation

### Base URL
```
http://localhost:8080/api/v1
```

### Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Endpoints

#### Authentication
- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Login user

#### Notes
- `GET /notes` - Get all notes (with filters)
- `GET /notes/:id` - Get a specific note
- `POST /notes` - Create a new note
- `PATCH /notes/:id` - Update a note
- `DELETE /notes/:id` - Delete a note

#### Folders
- `GET /folders` - Get all folders
- `POST /folders` - Create a folder
- `PATCH /folders/:id` - Update a folder
- `DELETE /folders/:id` - Delete a folder

#### Tags
- `GET /tags` - Get all tags
- `POST /tags` - Create a tag
- `POST /tags/notes/:noteId` - Add tags to a note

### Interactive API Documentation
Visit `http://localhost:8080/api-docs` for interactive Swagger documentation.

---

## Testing

### Backend Tests

**Test Structure**:
- Unit tests in `src/**/__tests__/` directories
- Tests use Jest framework
- Mocks for services and external dependencies

**Running Tests**:
```bash
cd backend
npm test
```

**Test Coverage**:
- AppError utility tests
- Logger utility tests
- Auth controller tests

**Future Improvements**:
- Add service layer tests
- Add repository layer tests
- Add integration tests
- Increase test coverage

---

## Logging

### Log Files
Logs are stored in `backend/logs/`:
- `combined.log` - All logs
- `error.log` - Error-level logs only
- `exceptions.log` - Unhandled exceptions
- `rejections.log` - Unhandled promise rejections

### Log Levels
- **error**: Server errors (500+)
- **warn**: Client errors (400-499), authentication failures
- **info**: Business events (user actions, signup/login)
- **debug**: Detailed information (retrievals, auth success)

### Configuration
Set `LOG_LEVEL` in `config/config.env`:
```env
LOG_LEVEL=debug  # Options: error, warn, info, verbose, debug, silly
```

### Viewing Logs
```bash
# View all logs
tail -f backend/logs/combined.log

# View only errors
tail -f backend/logs/error.log
```

---

## Security Considerations

### Implemented Security Measures

1. **Password Hashing**: bcrypt with salt
2. **JWT Authentication**: Secure token-based authentication
3. **SQL Injection Prevention**: Parameterized queries
4. **Input Validation**: Zod schema validation
5. **Error Handling**: No sensitive data in error messages
6. **CORS**: Configured for specific origin
7. **Environment Variables**: Sensitive data in config files

### Recommendations for Production

1. **HTTPS**: Use SSL/TLS certificates
2. **Rate Limiting**: Implement rate limiting for API endpoints
3. **Token Refresh**: Implement refresh token mechanism
4. **Input Sanitization**: Additional sanitization for user inputs
5. **Security Headers**: Add security headers (helmet.js)
6. **Database Security**: Use connection encryption
7. **Secrets Management**: Use proper secrets management (AWS Secrets Manager, etc.)
8. **Monitoring**: Implement security monitoring and alerting

---

## Author
**Anish Shrestha**
Email: codes.anishshrestha@gmail.com
GitHub: [gafolizero](https://github.com/gafolizero)

