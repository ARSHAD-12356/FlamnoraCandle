# 🔧 Fix Authentication - Step by Step

## Current Problem
Getting 500 errors when trying to sign up.

## Solution Steps

### Step 1: Stop and Restart Server
The `.env.local` file was created AFTER the server started, so environment variables weren't loaded.

**Do this:**
1. Go to your terminal where `npm run dev` is running
2. Press `Ctrl + C` to stop the server
3. Run: `npm run dev`
4. Wait for "Ready in X.Xs"

### Step 2: Use the Correct Port
Your server is running on port **3001** (not 3000):

**Correct URLs:**
- **Sign Up:** http://localhost:3001/signup
- **Login:** http://localhost:3001/login
- **Home:** http://localhost:3001/

### Step 3: Test Sign Up
1. Go to http://localhost:3001/signup
2. Fill in:
   - **Name:** John Doe
   - **Email:** Flamnora456@gmail.com
   - **Password:** 123456
3. Click "Sign Up"

### Step 4: Check for Errors
**In the terminal**, you should see:
- `Signup API called`
- `MONGO_URI exists: true`
- `MongoDB connected successfully` (if working)

**If you see errors:**
- `MONGO_URI exists: false` - environment variable not loaded
- `MongoDB Connection Failed` - check MongoDB Atlas settings

### Step 5: Check MongoDB Atlas
If signup works, go to MongoDB Atlas:
1. Click on your cluster
2. Click "Browse Collections"
3. Should see a `flamnora` database
4. Should see a `users` collection with your user

## Troubleshooting

### If it still doesn't work:

**Check 1: MongoDB IP Whitelist**
1. Go to MongoDB Atlas
2. Click "Network Access"
3. Make sure your IP is whitelisted OR click "Allow Access from Anywhere"

**Check 2: Database User**
1. Go to "Database Access" in Atlas
2. Make sure user `flamnoracandles456_db_user` exists
3. Make sure password is correct

**Check 3: Connection String**
Check `.env.local` file contains:
```
MONGO_URI=mongodb+srv://flamnoracandles456_db_user:vatwF3Jtlx1kqYR5@cluster0.odqqqh8.mongodb.net/flamnora?retryWrites=true&w=majority
JWT_SECRET od:flamnora_secret_key_change_in_production
```

## Still having issues?
Share:
1. What you see in terminal after clicking "Sign Up"
2. Any error messages
3. Browser console errors (F12 → Console tab)




