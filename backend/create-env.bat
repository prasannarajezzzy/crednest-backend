@echo off
echo Creating .env file for CredNest Backend...
echo.

(
echo PORT=5000
echo MONGODB_URI=mongodb+srv://crednesttech_db_user:JiayEGJwITsrAhIM@cluster0.heovopj.mongodb.net/CredNest?retryWrites=true^&w=majority
echo JWT_SECRET=CredNest-super-secret-jwt-key-2024-change-in-production
echo ADMIN_EMAIL=admin@CredNest.com
echo ADMIN_PASSWORD=admin123
echo FRONTEND_URL=http://localhost:3000
echo NODE_ENV=development
) > .env

echo .env file created successfully!
echo.
echo Your environment variables:
type .env
echo.
echo You can now run: npm run dev
pause
