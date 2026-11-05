# Student CRUD Application - Project Context & Implementation Plan

> **Note**: This file serves as the single source of truth for the project context, allowing seamless transfer and continuation across different machines and environments.

---

## 1. Project Overview
This repository contains a full-stack **Student CRUD (Create, Read, Update, Delete)** management application:
- **Backend:** Spring Boot (Java 17+) with Spring Data JPA & PostgreSQL.
- **Frontend:** React (JavaScript) powered by Vite.

---

## 2. Backend Architecture & API Specification

### 2.1 Backend Location
- Path: `student/`
- Build Tool: Apache Maven (`mvnw` / `mvnw.cmd` included)
- Config: [`application.properties`](file:///C:/Users/Student-00/DA3A/STUDENT-CRUID/student/src/main/resources/application.properties)

### 2.2 Database Configuration
- **DBMS:** PostgreSQL
- **Database URL:** `jdbc:postgresql://localhost:5432/db_student`
- **Username:** `postgres`
- **Password:** `admin`
- **Hibernate DDL Mode:** `update` (tables auto-created/updated)

### 2.3 Student Entity Schema
Defined in [`Student.java`](file:///C:/Users/Student-00/DA3A/STUDENT-CRUID/student/src/main/java/com/manuntag/student/Student.java):
| Field | Type | Description |
|---|---|---|
| `id` | `Integer` | Primary Key, Auto-generated (`GenerationType.AUTO`) |
| `firstname` | `String` | Student's first name |
| `lastname` | `String` | Student's last name |
| `course` | `String` | Degree/Program (e.g., BSIT, BSCS) |
| `section` | `String` | Section identifier (e.g., 3A, 2B) |

### 2.4 REST API Endpoints
Base URL: `http://localhost:8080/manuntag/students` (Controller: [`StudentController.java`](file:///C:/Users/Student-00/DA3A/STUDENT-CRUID/student/src/main/java/com/manuntag/student/StudentController.java))

| Method | Endpoint | Description | Request Body | Response (Success) | Response (Error) |
|---|---|---|---|---|---|
| `GET` | `/manuntag/students` | Get all students | None | `200 OK` + `Student[]` | `500 Internal Error` |
| `GET` | `/manuntag/students/{id}` | Get student by ID | None | `200 OK` + `Student` | `404 Not Found` |
| `POST` | `/manuntag/students` | Create student | `{"firstname": "...", "lastname": "...", "course": "...", "section": "..."}` | `201 Created` + `Student` | `500 / 400` |
| `PUT` | `/manuntag/students/{id}` | Update student | `{"firstname": "...", "lastname": "...", "course": "...", "section": "..."}` | `200 OK` + `Student` | `404 Not Found` |
| `DELETE` | `/manuntag/students/{id}` | Delete student | None | `200 OK` ("Student with id X deleted.") | `404 Not Found` |

### 2.5 CORS Handling Strategy
Spring Boot's `StudentController` does not currently include `@CrossOrigin`. To prevent browser CORS issues during development:
- **Primary Option (Vite Proxy - Recommended):** Configure `vite.config.js` proxy:
  ```javascript
  server: {
    proxy: {
      '/manuntag': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
  ```
- **Secondary Option:** Add `@CrossOrigin(origins = "http://localhost:5173")` to `StudentController.java`.

---

## 3. Frontend Architecture (Vite + React + JavaScript)

### 3.1 Proposed Directory: `frontend`
```text
STUDENT-CRUID/
├── .gitignore
├── PROJECT_CONTEXT.md
├── student/                     # Spring Boot Backend
└── frontend/                    # Vite React Frontend
    ├── package.json
    ├── vite.config.js           # Includes dev proxy to backend :8080
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx              # Main dashboard layout & state
        ├── index.css            # Base styles / Tailwind / modern design
        ├── api/
        │   └── studentApi.js    # API service calls (fetch/axios)
        ├── components/
        │   ├── Navbar.jsx       # Header with branding & quick stats
        │   ├── StudentTable.jsx # Tabular student view with action buttons
        │   ├── StudentForm.jsx  # Modal or inline form for Create/Edit
        │   ├── ConfirmModal.jsx # Confirmation dialog for deletion
        │   ├── SearchBar.jsx    # Search by name, course, or section
        │   └── Notification.jsx # Toast alerts for success/failure feedback
        └── hooks/
            └── useStudents.js   # Custom hook managing CRUD states & loading
```

### 3.2 UI & UX Features Planned
1. **Student Listing:**
   - Responsive table displaying ID, First Name, Last Name, Course, Section, and Actions.
   - Empty state when no records exist.
   - Loading spinners during network calls.
2. **Create & Edit Modal/Form:**
   - Single reusable form for both creating and updating a student.
   - Client-side validation (all fields required, trimmed strings).
3. **Delete Confirmation:**
   - Confirmation modal prevents accidental deletions.
4. **Search & Filter:**
   - Instant client-side search across First Name, Last Name, Course, and Section.
5. **Feedback System:**
   - Toast banners for success (e.g., "Student created successfully") and errors (e.g., "Failed to connect to backend").

---

## 4. Step-by-Step Implementation Roadmap

- [ ] **Phase 1: Project Scaffolding**
  - Initialize Vite React JavaScript project (`npm create vite@latest frontend -- --template react`).
  - Install icons/utilities (e.g. `lucide-react` for clean icons).
  - Configure `vite.config.js` proxy to redirect `/manuntag` requests to `http://localhost:8080`.

- [ ] **Phase 2: API Client Layer**
  - Implement `frontend/src/api/studentApi.js` encapsulating:
    - `getAllStudents()`
    - `getStudentById(id)`
    - `createStudent(payload)`
    - `updateStudent(id, payload)`
    - `deleteStudent(id)`
  - Implement centralized error handling.

- [ ] **Phase 3: Core CRUD State & Components**
  - Create `StudentTable` with Edit and Delete triggers.
  - Create `StudentForm` with pre-filled inputs when editing, blank when creating.
  - Create `ConfirmModal` for safe deletions.
  - Integrate operations in `App.jsx` or `useStudents` hook.

- [ ] **Phase 4: Search, UX Enhancements & Polish**
  - Add search bar filtering records in real-time.
  - Add loading indicators, toast notifications, and form validation warnings.
  - Implement modern, clean styling (responsive card/table layout).

- [ ] **Phase 5: End-to-End Verification**
  - Verify PostgreSQL DB connection.
  - Test Create student -> Verify in DB / table.
  - Test Read & Search students.
  - Test Update student -> Verify changes reflected.
  - Test Delete student -> Verify item removed.

---

## 5. How to Run on Any Computer

### Prerequisites
1. **Java Development Kit (JDK 17+)**
2. **PostgreSQL** running locally on port `5432` with database `db_student`
3. **Node.js (v18+)** and `npm`

### Step 1: Start Backend (Spring Boot)
1. Ensure PostgreSQL is running:
   ```sql
   CREATE DATABASE db_student;
   ```
2. Navigate to `student` directory:
   ```powershell
   cd student
   .\mvnw.cmd spring-boot:run
   ```
   Backend will start at `http://localhost:8080`.

### Step 2: Start Frontend (Vite React)
1. Navigate to `frontend` directory:
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```
2. Open your browser at `http://localhost:5173`.
