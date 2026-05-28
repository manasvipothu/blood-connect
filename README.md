# Blood Connect 🩸

Blood Connect is a modern, real-time blood donation platform designed to bridge the gap between critical emergencies and willing donors instantly. Built with a sleek, glassmorphic UI and cutting-edge web technologies, it provides a seamless experience for Donors, Blood Banks, and Administrators.

## Features ✨

- **Find Donors**: Instantly search for compatible blood donors in your area with advanced filtering by State, City, and Blood Type.
- **Emergency Requests**: Broadcast urgent blood requirements in real-time, visualized on an interactive map.
- **Blood Bank Directory**: A comprehensive directory of verified hospitals and blood banks.
- **Blood Donation Drives**: Hospitals and organizations can schedule and manage local blood donation drives.
- **Dark/Light Mode**: Beautifully crafted themes with a modern glassmorphic design system.
- **Responsive Dashboard**: Dedicated portals for individual donors and blood bank administrators.

## Tech Stack 🛠️

**Frontend:**
- React (Vite)
- Tailwind CSS
- Framer Motion (Animations)
- Lucide React (Icons)
- Leaflet (Interactive Maps)

**Backend:**
- Node.js & Express
- MySQL (Database)
- JSON Web Tokens (JWT Auth)

## Local Development Setup 🚀

### 1. Clone the repository
Ensure you are in the `blood connect` root directory.

### 2. Database Setup (MySQL)
Create a MySQL database named `blood_connect`. You can use the provided SQL scripts (if any) or rely on the backend seeder to structure the tables.

### 3. Backend Configuration
Navigate to the `backend` folder:
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory and add your database credentials:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=blood_connect
JWT_SECRET=your_super_secret_key
```
Start the backend server:
```bash
npm run dev
```

### 4. Frontend Configuration
Open a new terminal and navigate to the `frontend` folder:
```bash
cd frontend
npm install
```
Start the frontend development server:
```bash
npm run dev
```
The application will be running at `http://localhost:5173`.

## Deployment 🌍

To deploy this application to production, you will need to host three separate pieces: the **Database**, the **Backend**, and the **Frontend**.

### 1. Database Deployment (Aiven or PlanetScale)
1. Create a free managed MySQL database on [Aiven](https://aiven.io/) or [PlanetScale](https://planetscale.com/).
2. Once created, copy the **Connection URI** (it looks like `mysql://user:pass@host:port/dbname`).

### 2. Backend Deployment (Render or Railway)
1. Push your code to a GitHub repository.
2. Sign up for [Render.com](https://render.com/).
3. Create a new **Web Service** and connect your GitHub repository.
4. Set the Root Directory to `backend`.
5. Set the Build Command to `npm install`.
6. Set the Start Command to `node index.js` (or `npm start`).
7. In the Environment Variables section, add:
   - `DATABASE_URL` (paste your MySQL connection string here)
   - `JWT_SECRET` (enter a long random string)
   - `PORT` (Render handles this automatically, but you can set it to `5000`)

### 3. Frontend Deployment (Vercel or Netlify)
1. Go to your frontend code, specifically `frontend/src/App.jsx` or your Axios calls. You need to ensure all `http://localhost:5000` URLs are replaced with your newly deployed Render Backend URL (e.g., `https://your-backend.onrender.com`).
2. Sign up for [Vercel](https://vercel.com/).
3. Create a new project and import your GitHub repository.
4. Set the Framework Preset to **Vite**.
5. Set the Root Directory to `frontend`.
6. Click Deploy!

---
*Every Drop Can Save A Life.* ❤️
