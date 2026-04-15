<<<<<<< HEAD
# AGRITECH - Revolutionary Farming Platform

AGRITECH is a comprehensive MERN stack platform designed to empower farmers and stakeholders in the agricultural ecosystem through machine learning insights and seamless communication.

## Features Included

- **Smart Crop Recommendation**: Get automated suggestions for optimal crops based on soil type, rainfall, humidity, and temperature.
- **Disease Prediction**: Upload leaf images to detect symptoms of common plant diseases utilizing ML diagnostic analysis.
- **Yield Forecasting**: Predict expected harvest volumes spanning different seasons and Indian states using farm area and crop type constraints.
- **Farmers Community**: Interactive forum platform for users to post questions, share tips, and connect with peer agriculturists.
- **AI Chatbot Assistant**: Real-time floating widget that provides automated guidance for common agricultural support questions.
- **Complete Authentication**: Secure JWT-based Login and Registration.

## Tech Stack Overview

- **Frontend**: React.js, React Router v6, Tailwind CSS, Axios, Lucide React icons
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Authentication**: JWT & basic bcrypt encryption
- **File Handling**: Multer (Image file uploads)
- **Architecture**: Strict MVC with a decoupled Service layer mimicking ML model endpoints

## Quick Start

### 1. Requirements

Ensure you have the following installed:
- Node.js (v16+)
- MongoDB (Running locally on `mongodb://localhost:27017`)

### 2. Setup Dependencies

Install packages in the root, server, and client directories.

```bash
# In the root AGRITECH directory
npm install

# In the server directory
cd server && npm install

# In the client directory
cd ../client && npm install
```

### 3. Environment Configuration

Create a `.env` file inside the `/server` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/agritech
JWT_SECRET=agritech_super_secret_key_123
CLIENT_URL=http://localhost:3000
ML_MODEL_PATHS=./ml-models
```

### 4. Running the Application

In the root `AGRITECH` directory, run:

```bash
npm run dev
```

This starts both:
- **Express Backend**: Listening on `http://localhost:5000`
- **React Frontend**: Serving on `http://localhost:3000`

---

## Deployment Strategy

1. **Frontend (Vercel)**: Point Vercel to the `/client` directory and utilize standard Create-React-App build configurations. Make sure to define the generic production `REACT_APP_API_URL` matching the endpoint hosted URL.
2. **Backend (Node.js/Render/Heroku)**: Host the Express server connecting to standard Mongo Atlas instance. 
3. **Database (MongoDB Atlas)**: Set `MONGO_URI` to target the deployed cluster instead of localhost.

*Designed specifically for standard MERN platform production structures complying with standard practices.*
=======
# farmix-main
>>>>>>> 690a2a6faa3798447dfba5094dc0e8c92763acf2
