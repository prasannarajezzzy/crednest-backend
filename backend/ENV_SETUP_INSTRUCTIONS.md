# 🔧 How to Create Your .env File

## Step 1: Create the .env file

1. **Navigate to the backend folder:**
   ```
   C:\Users\prasa\Desktop\CredNest\backend\
   ```

2. **Create a new file named `.env`** (with the dot at the beginning)
   - Right-click in the backend folder
   - Select "New" → "Text Document"
   - Name it `.env` (remove the .txt extension)
   - Or use your code editor to create a new file

## Step 2: Copy the Environment Variables

Copy this exact content into your `.env` file:

```
PORT=5000
MONGODB_URI=mongodb+srv://crednesttech_db_user:JiayEGJwITsrAhIM@cluster0.heovopj.mongodb.net/CredNest?retryWrites=true&w=majority
JWT_SECRET=CredNest-super-secret-jwt-key-2024-change-in-production
ADMIN_EMAIL=admin@CredNest.com
ADMIN_PASSWORD=admin123
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

## Step 3: Save the file

Make sure the file is saved as `.env` (not `.env.txt`)

## Step 4: Verify the setup

Your backend folder should now contain:
- `.env` ← Your new environment file
- `server.js`
- `package.json`
- Other backend files

## ⚠️ Important Notes:

1. **Never commit .env to Git** - It contains sensitive information
2. **The .env file should be in the backend folder**, not the root
3. **No spaces around the equals signs** in the .env file
4. **No quotes needed** around the values

## 🚀 Test Your Setup:

1. Open terminal in the backend folder
2. Run: `npm run dev`
3. You should see: "Connected to MongoDB Atlas"

If you see connection errors, double-check that your `.env` file is correctly formatted and in the right location.
