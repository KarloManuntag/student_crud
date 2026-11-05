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
`StudentController.java` is annotated with `@CrossOrigin(origins = "*")`, enabling both local frontend access and cloud-deployed frontend access.
Additionally, Vite's dev proxy forwards `/manuntag` to `http://localhost:8080` during local development, while `studentApi.js` dynamically uses the `VITE_API_BASE_URL` provided by Render in production.

---

## 3. Frontend Architecture (Vite + React + JavaScript)

### 3.1 Proposed Directory: `frontend`
```text
STUDENT-CRUID/
├── .gitignore
├── PROJECT_CONTEXT.md
├── student/                     # Spring Boot Backend
└── frontend/                    # Vite React Frontend (Tailwind CSS)
    ├── package.json
    ├── vite.config.js           # Includes dev proxy to backend :8080
    ├── tailwind.config.js       # Tailwind CSS configuration
    ├── postcss.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx              # Main dashboard layout (Split card layout: Form + Table)
        ├── index.css            # Tailwind directives (@tailwind base, etc.)
        ├── api/
        │   └── studentApi.js    # API service calls (fetch/axios)
        ├── components/
        │   ├── Navbar.jsx       # Header with branding & system status
        │   ├── StudentTable.jsx # Tabular student view with inline action buttons
        │   ├── StudentForm.jsx  # Card-based form for Create / Edit (NO modal)
        │   ├── SearchBar.jsx    # Search by name, course, or section
        │   └── Notification.jsx # Inline or toast feedback alerts
        └── hooks/
            └── useStudents.js   # Custom hook managing CRUD states & loading
```

### 3.2 UI & UX Features Planned (Tailwind CSS, Non-Modal Architecture)
1. **Design System:** Tailwind CSS for a modern, responsive interface with clean typography, subtle borders, and smooth transitions.
2. **Non-Modal Form (Inline Card):**
   - Persistent or toggleable card on the page (side-by-side on wide screens, stacked on mobile).
   - Serves both "Add New Student" and "Edit Student" seamlessly.
   - Shows active "Editing: [Student Name]" indicator with a clear "Cancel" button to reset back to Add mode without any modal dialogs.
   - Client-side validation with Tailwind error indicators.
3. **Non-Modal Delete Confirmation (Inline Row Action):**
   - Clicking "Delete" replaces the delete button with an in-row prompt: `"Are you sure? [Delete] [Cancel]"` right inside the table row.
   - Zero modal popups, keeping the workflow fast and non-disruptive.
4. **Student Listing & Search:**
   - Responsive Tailwind table with badges for Course and Section.
   - Instant search filter by First Name, Last Name, Course, and Section.
   - Loading spinners and empty state illustration when no records match.
5. **Feedback System:**
   - Non-blocking notification banner or floating alert for CRUD results.

---

## 4. Step-by-Step Implementation Roadmap

- [ ] **Phase 1: Project Scaffolding & Tailwind Setup**
  - Initialize Vite React JavaScript project (`npm create vite@latest frontend -- --template react`).
  - Install and configure Tailwind CSS (`tailwindcss`, `postcss`, `autoprefixer`).
  - Install `lucide-react` for modern iconography.
  - Configure `vite.config.js` proxy to redirect `/manuntag` requests to `http://localhost:8080`.

- [ ] **Phase 2: API Client Layer**
  - Implement `frontend/src/api/studentApi.js` encapsulating:
    - `getAllStudents()`
    - `getStudentById(id)`
    - `createStudent(payload)`
    - `updateStudent(id, payload)`
    - `deleteStudent(id)`
  - Standardize error handling and network resilience.

- [ ] **Phase 3: Core CRUD State & Non-Modal Components**
  - Build `StudentForm` as an inline card for Add/Edit student with Tailwind styling and cancel trigger.
  - Build `StudentTable` with in-row inline delete confirmation (replacing modal popups).
  - Connect state in `App.jsx` or `useStudents` hook for seamless live list updates.

- [ ] **Phase 4: Search, UX Enhancements & Polish**
  - Add real-time search filtering across First Name, Last Name, Course, and Section.
  - Add Tailwind badges, loading skeletons, and non-blocking notification banners.
  - Test responsive desktop split-layout (Form left/top, Table right/bottom).

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

---

## 6. Render.com Cloud Deployment

The repository uses **Render Blueprints** via [`render.yaml`](./render.yaml):
- **Database:** `student-db` (PostgreSQL free tier)
- **Backend Service:** `student-backend` (Dockerized using `student/Dockerfile`)
- **Frontend Static Site:** `student-frontend` (Static build from `frontend/dist`)

### Environment Variables on Render
- Backend reads: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `DB_SSL_MODE=require`, and `PORT=8080`.
- Frontend reads: `VITE_API_BASE_URL` mapped from `student-backend.host`.

### Deployment Steps:
1. Push repository to GitHub.
2. In Render dashboard, select **New +** &rarr; **Blueprint**.
3. Select this repository and click **Apply**.

