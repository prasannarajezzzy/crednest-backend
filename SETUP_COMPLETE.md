# 🚀 CredNest - MongoDB Atlas Setup Complete!

## ✅ Your Database Configuration

**MongoDB Atlas Connection:** Already configured in server.js
- **Connection String:** mongodb+srv://crednesttech_db_user:JiayEGJwITsrAhIM@cluster0.heovopj.mongodb.net/CredNest
- **Username:** crednesttech_db_user  
- **Password:** JiayEGJwITsrAhIM
- **Database Name:** CredNest

## 🔧 Create Environment File (Optional but Recommended)

Create a file named `.env` in the backend folder with:

```
PORT=5000
MONGODB_URI=mongodb+srv://crednesttech_db_user:JiayEGJwITsrAhIM@cluster0.heovopj.mongodb.net/CredNest?retryWrites=true&w=majority
JWT_SECRET=CredNest-super-secret-jwt-key-2024-change-in-production
ADMIN_EMAIL=admin@CredNest.com
ADMIN_PASSWORD=admin123
```

## 🏃‍♂️ Start the Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
Server is running on port 5000
Connected to MongoDB Atlas
```

## 🔑 Default Admin Login Credentials

- **Email:** admin@CredNest.com
- **Password:** admin123

## 📊 API Endpoints

### Public Endpoints:
- `POST /api/loan-applications` - Submit loan application
- `POST /api/auth/login` - Admin login

### Admin Endpoints (Require Authentication):
- `GET /api/loan-applications` - Get all applications
- `GET /api/loan-applications/:id` - Get single application
- `PUT /api/loan-applications/:id/status` - Update application status
- `GET /api/loan-applications/stats/dashboard` - Get dashboard stats
- `GET /api/auth/me` - Get current admin info

## 🧪 Test the API

1. **Start the server:** `npm run dev`
2. **Test connection:** Visit http://localhost:5000
3. **Submit test application** from the frontend form
4. **Login to admin** with the credentials above

## 🔒 Security Notes

⚠️ **Important for Production:**
- Change the default admin password
- Use a stronger JWT_SECRET
- Add IP whitelist in MongoDB Atlas
- Use environment variables for sensitive data

## 🎯 Next Steps

1. ✅ Backend server configured with your MongoDB Atlas
2. 🔄 Update frontend to use real API (in progress)
3. 🎨 Create admin dashboard interface
4. 🔐 Add admin authentication UI

Your database is ready! The backend will automatically create the default admin user on first login attempt.
