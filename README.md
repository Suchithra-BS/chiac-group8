# Habit Tracker Application

Authentication, Habit Tracking, and Analytics with Next.js and Express.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (optional, auto-fallback to in-memory)

### Installation
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/habit-tracker.git
    cd habit-tracker
    ```

2.  **Install Dependencies:**
    ```bash
    # Install backend dependencies
    cd backend
    npm install
    
    # Install frontend dependencies (in a new terminal)
    cd ../frontend
    npm install --legacy-peer-deps
    ```

3.  **Environment Setup:**
    - **Frontend**: Create `frontend/.env.local`
      ```
      NEXT_PUBLIC_API_URL=http://localhost:5000/api
      ```
    - **Backend**: Create `backend/.env` (Optional, defaults exist)
      ```
      PORT=5000
      MONGODB_URI=mongodb://localhost:27017/habit-tracker
      JWT_SECRET=your-secret-key
      ```

### Running the App
1.  **Start Backend:**
    ```bash
    cd backend
    npm run dev
    # Runs on http://localhost:5000
    ```

2.  **Start Frontend:**
    ```bash
    cd frontend
    npm run dev
    # Runs on http://localhost:3000
    ```

## 🛠️ Tech Stack
- **Frontend**: Next.js, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, MongoDB
- **Features**: Auth, Habit Logic, Stats

## 📝 Persistence
- The app automatically connects to local MongoDB.
- If MongoDB is missing, it falls back to **In-Memory Storage** (data lost on restart).
