# Job Applier Application

A full-stack web application designed to help users apply for jobs, featuring a Next.js frontend and a Node.js/Express backend with MongoDB.

## Project Structure

- **`frontend/`**: Next.js application (React, Tailwind CSS, Redux)
- **`backend/`**: Node.js Express server with Mongoose

## Tech Stack

*   **Frontend**: Next.js 14, React, Tailwind CSS
*   **Backend**: Node.js, Express.js, MongoDB (Mongoose)
*   **Design**: Modern UI with vibrant colors and responsive layout.

## Getting Started

### Prerequisites

*   Node.js installed
*   MongoDB installed or a MongoDB Atlas URI

### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up environment variables:
    *   Create a `config.env` file in the `backend` directory.
    *   Add your MongoDB connection string and port:
        ```env
        PORT=5000
        MONGO_URI=your_mongodb_connection_string
        ```
4.  Start the server:
    ```bash
    npm start
    # or for development with nodemon
    npm run dev
    ```

### Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## Features

*   **Home Page**: Landing page for the application.
*   **User Authentication**: Sign In and Sign Up functionality (Frontend implemented).
*   **Job Finding**: Interface to browse and find jobs.
*   **Profile**: Basic user information management.

## Contributing

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.
