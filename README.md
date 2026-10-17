# Skyrovix Student Management Portal (Task 2)

A full stack MERN app for managing student records: React + Tailwind CSS (dark theme) on the front, Node/Express + MongoDB (Mongoose) on the back.

```
student-management-portal/
├── client/   React (Vite) + Tailwind + Axios + React Router DOM
│   └── src/  App.jsx, api.js, components/, pages/
└── server/   Express REST API
    ├── server.js
    ├── config/db.js
    ├── models/Student.js
    ├── controllers/studentController.js
    ├── routes/studentRoutes.js
    └── middleware/errorHandler.js
```

## Setup

**Prerequisites:** Node.js 18+, and MongoDB running locally (or a MongoDB Atlas connection string).

### 1. Server
```bash
cd server
npm install
cp .env.example .env      # edit MONGO_URI if needed
npm run dev               # http://localhost:5000
```

### 2. Client (new terminal)
```bash
cd client
npm install
cp .env.example .env      # optional in development
npm run dev               # http://localhost:5173
```
In development Vite proxies `/api` to `http://localhost:5000`, so `VITE_API_URL` can be left unset.

### Environment variables
| File | Variable | Purpose |
|---|---|---|
| server/.env | `PORT` | API port (default 5000) |
| server/.env | `MONGO_URI` | MongoDB connection string |
| server/.env | `CLIENT_URL` | Allowed CORS origin |
| client/.env | `VITE_API_URL` | API base URL (production builds) |

## Workflow

1. **Dashboard** shows total students, course count, students added this month and the 5 most recent records.
2. **Add Student** validates in the browser (name and roll no required, email format, phone 10 digits), then calls `POST /api/students`. A success or error toast appears.
3. **Student List** loads `GET /api/students`. Typing in the search bar (debounced 300 ms) filters by name, roll no or course. Each row has Edit and Delete.
4. **Edit Student** loads `GET /api/students/:id`, pre-fills the form and saves with `PUT /api/students/:id`.
5. The server validates again with Mongoose and returns clear error messages (for example duplicate roll number).

## API documentation

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/students` | Create a student |
| GET | `/students` | List students. Optional `?search=` matches name, rollNo, course (case-insensitive) |
| GET | `/students/:id` | Get one student |
| PUT | `/students/:id` | Update a student |
| DELETE | `/students/:id` | Delete a student |

**Student schema:** `name` (required), `rollNo` (required, unique), `course`, `email` (valid format), `phone` (10 digits), `dob`, `address`, `createdAt` (auto).

**Example request**
```json
POST /api/students
{ "name": "Aarav Sharma", "rollNo": "CS2024-001", "course": "B.Tech CS",
  "email": "aarav@example.com", "phone": "9876543210", "dob": "2004-05-17", "address": "Pune" }
```

**Success:** `{ "success": true, "message": "Student added successfully", "data": { ... } }`

**Errors:** `{ "success": false, "message": "..." }`

| Status | Meaning |
|---|---|
| 400 | Validation failed, invalid ID or invalid JSON (`errors` array lists each problem) |
| 404 | Student or route not found |
| 409 | Duplicate roll number |
| 500 | Unexpected server error |

## Testing steps

### API (curl)
```bash
# Create
curl -X POST localhost:5000/api/students -H "Content-Type: application/json" \
  -d '{"name":"Aarav Sharma","rollNo":"CS001","course":"CS","email":"a@example.com","phone":"9876543210"}'

# List and search
curl localhost:5000/api/students
curl "localhost:5000/api/students?search=cs"

# Get / update / delete (replace <id>)
curl localhost:5000/api/students/<id>
curl -X PUT localhost:5000/api/students/<id> -H "Content-Type: application/json" -d '{"course":"IT"}'
curl -X DELETE localhost:5000/api/students/<id>
```

### Validation checks (expected results)
| Test | Expected |
|---|---|
| POST without `name` | 400, "Name is required" |
| POST same `rollNo` twice | 409, roll number already exists |
| POST `"email":"bad"` | 400, valid email message |
| POST `"phone":"123"` | 400, "exactly 10 digits" |
| GET `/students/123` | 400, "Invalid student ID" |
| GET `/students/<valid but unknown id>` | 404, "Student not found" |

### UI checklist
- Submit an empty Add Student form: inline errors appear and no request is sent.
- Add a student: success toast, redirect to the list.
- Search by name, roll no and course: the list filters live.
- Edit a student: form is pre-filled, save shows a success toast.
- Delete a student: confirm dialog, then the row disappears with a toast.
- Resize to phone width: table becomes cards and the nav becomes a menu button.

## Production build
```bash
cd client && npm run build   # outputs client/dist
```
Set `VITE_API_URL` to your deployed API URL before building, and `CLIENT_URL` on the server to your site's origin.
