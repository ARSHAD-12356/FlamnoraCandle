# MongoDB Setup Guide for Flamnora

## ✅ What's Been Done

Your app now has **real authentication** with MongoDB Atlas! Here's what was implemented:

### 1. **MongoDB Connection** (`lib/dbConnect.js`)
- ✅ Proper connection caching for Next.js
- ✅ Avoids reconnecting on every API request
- ✅ Handles connection errors gracefully

### 2. **Signup API** (`app/api/Signup/route.js`)
- ✅ Password hashing with bcryptjs
- ✅ Email uniqueness validation
- ✅ Password length validation (minimum 6 characters)
- ✅ Proper error handling

### 3. **Login API** (`app/api/login/route.ts`)
- ✅ Password verification with bcrypt
- ✅ Secure authentication
- ✅ Returns user data without password

### 4. **Auth Context** (`context/auth-context.tsx`)
- ✅ Now calls real API endpoints
- ✅ Handles authentication responses
- ✅ Stores user in localStorage

## 🔧 Setup Instructions

### Step 1: Install Dependencies
Already done! The following packages were installed:
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing

### Step 2: Configure MongoDB Atlas

1. **Create MongoDB Atlas Account** (if you haven't)
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Sign up for free tier

2. **Create a Cluster**
   - Create a new free cluster
   - Select your preferred region
   - Wait for deployment (2-3 minutes)

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `flamnora_user` (or your choice)
   - Password: Create a strong password
   - Set privileges to "Atlas admin"
   - Click "Add User"

4. **Whitelist Your IP**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/...`

### Step 3: Create `.env.local` File

Create a file named `.env.local` in your project root:

```bash
MONGO_URI=your_connection_string_here
```

**Important:** Replace `username` and `password` in the connection string with your actual database user credentials!

Example:
```bash
MONGO_URI=mongodb+srv://flamnora_user:mypassword123@cluster0.abc123.mongodb.net/flamnora?retryWrites=true&w=majority
```

### Step 4: Restart Development Server

```bash
npm run dev
```

## 🧪 Test Your Setup

1. **Go to Signup Page**: http://localhost:3000/signup
2. **Create an account** with:
   - Name: John Doe
   - Email: john@example.com
   - Password: 123456 (or any password)
3. **Check MongoDB Atlas**: You should see your user in the database!
4. **Try Login**: http://localhost:3000/login
5. **Login with the same credentials**

## 📊 Database Structure

Your users will be stored with this schema:

```javascript
{
  _id: ObjectId,
  name: "John Doe",
  email: "john@example.com",
  password: "$2a$10$hashedPassword...", // Securely hashed
  createdAt: ISODate
}
```

## 🔒 Security Features

- ✅ Passwords are hashed with bcrypt (10 rounds)
- ✅ Passwords never sent back in API responses
- ✅ Email uniqueness enforced
- ✅ Input validation on both client and server

## 🐛 Troubleshooting

### Connection Error?
- Check your connection string in `.env.local`
- Verify your IP is whitelisted in MongoDB Atlas
- Make sure your database user password is correct

### User Already Exists?
- This means the email is already registered
- Try a different email or login with existing credentials

### API Not Working?
- Make sure `.env.local` file exists
- Restart your development server (`npm run dev`)
- Check browser console for errors

## 📝 Next Steps

Your authentication is now fully functional! Users can:
- ✅ Sign up with email, password, and name
- ✅ Login with email and password
- ✅ Have their sessions saved in localStorage
- ✅ Access protected routes (you can add more routes)

**Optional Enhancements:**
- Add JWT tokens for more secure sessions
- Add password reset functionality
- Add email verification
- Add password strength requirements
- Add "Remember Me" functionality

