# 📚 Assignment Management System

## 📌 Project Overview

The Assignment Management System is a web application built with **Angular**, integrated with a **Node.js/Express** backend and **MongoDB** database. It's designed to manage assignments for students, professors, and admins. The app provides a user-friendly interface for assignment tracking, submission, grading, and management, with **role-based access control** to ensure appropriate permissions.

---

## ✅ Implemented Core Features

### 1️⃣ Assignment Listing

- Display all assignments with due dates and submission status.

### 2️⃣ Assignment Details

- View detailed information about each assignment, including submission status, grade, and feedback.

### 3️⃣ Assignment Submission (Students)

- Upload assignment files directly within the application.

### 4️⃣ Grading & Feedback (Admins and Professors)

- Assign grades (out of 20) and provide feedback for submitted assignments.

### 5️⃣ Assignment Creation, Editing, Deletion (Admins and Professors)

- Add new assignments with a due date and connect them to a specific course via a dropdown.
- Modify existing assignment details.
- Remove assignments when necessary.

### 6️⃣ Submission Status Tracking

- Mark assignments as submitted and view submission status in real-time.

---

## ✅ Additional Features & Enhancements

### 1️⃣ File Upload for Submissions

- Students can attach and submit files, with the submission stored and accessible via a file URL.

### 2️⃣ Grade & Feedback Confirmation Dialog

- Admins and professors confirm grades and feedback before submission using a dialog box.

### 3️⃣ Real-Time UI Updates

- Assignments update instantly after submission, grading, editing, or deletion.

### 4️⃣ Role-Based Authentication and Authorization

**Login System:**

- Users log in with an email, password, and role (student, professor, or admin).
- Redirection:
  - Students and professors → `/assignments`
  - Admins → `/students`

**Role Permissions:**

- **Students**: View assignment details, submit assignments, and view grades and feedback.
- **Professors**: Full assignment control (view, grade, edit, delete, add).
- **Admins**: All professor permissions + manage student and professor lists.

**Authentication:**

- Uses local storage to store tokens, roles, and user details.
- `AuthGuard` protects authenticated routes.

### 5️⃣ Course Integration

- Dropdown list of courses in the add assignment form.
- Courses are fetched from the backend and stored in MongoDB, linked via `courseId`.

### 6️⃣ Storage in LocalStorage

- Authentication data (token, role, user ID, name, image) persists across page refreshes.

### 7️⃣ Better Error Handling & Debugging Logs

- API errors are logged and shown with alerts for missing fields or duplicates.

### 8️⃣ Responsive UI with Material Design

- Built with Angular Material (`mat-card`, `mat-form-field`, `mat-select`) for a clean experience on all devices.

### 9️⃣ Navigation & Routing

- Direct links:
  - `/assignment/:id`
  - `/add`
  - `/assignment/:id/edit`
  - `/profile`
  - `/students`
  - `/professors`
- Default route: `/login` with redirection based on role.

---

## 💻 Technical Stack

- **Frontend**: Angular (standalone components) with TypeScript
- **UI Framework**: Angular Material
- **Backend**: Node.js with Express
- **Database**: MongoDB via Mongoose (hosted on MongoDB Atlas)
- **File Handling**: Multer (files stored in `uploads/`)
- **HTTP Client**: Angular's HttpClient
- **Authentication**: Custom role-based system using local storage
- **Dev Tools**: `npm`, `ng serve`, `nodemon`, browser dev tools

---

## 🛠️ How to Run the Project

### 1️⃣ Clone the Repository

````bash
git clone https://github.com/NourElBazzal/AngularAssignmentProject.git
cd assignment-app


### **2️⃣ Install Dependencies:**

```bash
npm install
```

### **3️⃣ Set Up the Backend:**

```bash
# Navigate to the backend (if separate)
cd api

# Install backend dependencies
npm install

# Start backend server
node server.js
```

### **4️⃣ Start the Angular App:**

```bash
cd ../
ng serve
```

- Open [http://localhost:4200](http://localhost:4200) in your browser.

---

## 📝 Notes

- Ensure the uploads/ directory exists in the api/ folder for file uploads to work.

---
````
