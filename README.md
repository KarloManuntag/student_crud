# Student CRUD Fullstack Application

A fullstack Student Management CRUD application featuring a **Spring Boot 3 / Java 21 REST API** backend, a **Vite + React 19 + Tailwind CSS** frontend, and **Render.com Cloud Infrastructure with PostgreSQL**.

---

## 📁 Project Architecture

```text
STUDENT-CRUID/
├── render.yaml                    # Render Blueprint (Infrastructure as Code)
├── PROJECT_CONTEXT.md             # Developer context & setup guide
├── README.md                      # Project documentation
├── .gitignore                     # Git exclusions
│
├── student/                       # Spring Boot Backend
│   ├── Dockerfile                 # Multi-stage Docker build (Java 21 Temurin)
│   ├── pom.xml                    # Maven configuration
│   ├── src/main/java/com/manuntag/student/
│   │   ├── Student.java           # JPA Entity (id, firstname, lastname, course, section)
│   │   ├── StudentRepository.java # Spring Data JPA repository
│   │   ├── StudentController.java # REST Controller with @CrossOrigin(origins = "*")
│   │   └── StudentApplication.java
│   └── src/main/resources/
│       └── application.properties # Dynamic env config for Local & Render
│
└── frontend/                      # Vite + React Frontend
    ├── package.json               # React 19, Tailwind CSS, Lucide Icons
    ├── vite.config.js             # Dev reverse proxy (/manuntag -> localhost:8080)
    └── src/
        ├── api/
        │   └── studentApi.js      # Dynamic API client (local proxy & remote URL)
        ├── components/
        │   ├── Navbar.jsx         # Sticky header with counter
        │   ├── StudentForm.jsx    # Inline card form (Add & Edit modes, no modal)
        │   ├── StudentTable.jsx   # Searchable table with inline delete confirmation
        │   ├── SearchBar.jsx      # Instant client-side search filter
        │   └── Notification.jsx   # Auto-dismissing feedback banner
        ├── App.jsx                # Main coordinator & state management
        └── index.css              # Tailwind CSS styles
```

---

## 🚀 Running Locally

### 1. Run the Backend (`student/`)
#### Requirements:
* Java JDK 17+ (JDK 21 recommended)
* PostgreSQL running locally on port `5432` with database `db_student`, user `postgres`, password `admin`

```powershell
cd student
.\mvnw.cmd spring-boot:run
```
*(On Linux/macOS: `./mvnw spring-boot:run`)*

Backend will start at: `http://localhost:8080/manuntag/students`

---

### 2. Run the Frontend (`frontend/`)
#### Requirements:
* Node.js v18+ and npm

```powershell
cd frontend
npm install
npm run dev
```

Frontend will start at: `http://localhost:5173`

---

## 📡 REST API Reference

Base Endpoint: `/manuntag/students`

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/manuntag/students` | Get all students | None |
| `GET` | `/manuntag/students/{id}` | Get student by ID | None |
| `POST` | `/manuntag/students` | Add new student | `{ firstname, lastname, course, section }` |
| `PUT` | `/manuntag/students/{id}` | Update student | `{ firstname, lastname, course, section }` |
| `DELETE` | `/manuntag/students/{id}` | Delete student | None |

---

## ☁️ Deployment on Render (Blueprint)

This repository includes a [`render.yaml`](file:///C:/Users/Student-00/DA3A/STUDENT-CRUID/render.yaml) blueprint specification:
1. **Database:** `student-db` (PostgreSQL managed database, free plan)
2. **Backend Web Service:** `student-backend` (Docker container built from [`student/Dockerfile`](file:///C:/Users/Student-00/DA3A/STUDENT-CRUID/student/Dockerfile))
3. **Frontend Static Site:** `student-frontend` (Built using `npm run build`, static files served from `frontend/dist`)

### Steps to Deploy:
1. Push this repository to **GitHub** or **GitLab**.
2. Log in to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** &rarr; **Blueprint**.
4. Connect your repository and select the `master` (or `main`) branch.
5. Render will automatically detect `render.yaml` and provision:
   - The PostgreSQL database (`student-db`)
   - The backend service (`student-backend`)
   - The frontend static site (`student-frontend`)
6. Click **Apply** to deploy all services together.
