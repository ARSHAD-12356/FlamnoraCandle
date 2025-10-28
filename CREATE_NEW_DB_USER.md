# 🔧 Create New MongoDB Database User

The authentication is failing because the password might be incorrect. Let's create a NEW database user with a simple password.

## Step-by-Step Instructions:

### Step 1: Go to MongoDB Atlas Database Access
1. Visit: **https://cloud.mongodb.com**
2. Login with your account
3. In left sidebar, click **"Database Access"** (under Security)

### Step 2: Create a New User
1. Click the green **"+ ADD NEW DATABASE USER"** button
2. Choose authentication method: **"Password"**
3. Fill in:
   - **Username:** `flamnora_user`
   - **Password:** `Flamnora2024!` (or type any password you want)
   - **Database User Privileges:** Select **"Atlas admin"**
4. Click the green **"Add User"** button
5. Wait for confirmation

### Step 3: Get New Connection String
1. Go to **"Database"** (left sidebar)
2. Click on your cluster name
3. Click the **"Connect"** button (green button)
4. Choose: **"Connect your application"**
5. Select: **"Node.js"** and **version "5.5 or later"**
6. Copy the connection string (looks like):
   ```
   mongodb+srv://flamnora_user:<password>@cluster0.odqqqh8.mongodb.net/?appName=Cluster0
   ```

### Step 4: Update .env.local
Replace `<password>` with your actual password (the one you created in Step 2).

**Example:**
If your password is `Flamnora2024!`, the full connection string should be:
```
MONGO_URI=mongodb+srv://flamnora_user:Flamnora2024!@cluster0.odqqqh8.mongodb.net/flamnora?retryWrites=true&w=majority
```

**⚠️ Important:** If your password has special characters like `!`, `@`, `#`, etc., they need to be URL encoded!

### Step 5: URL Encode Special Characters (if needed)
Common special characters and their encoding:
- `!` → `%21`
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`

For password `Flamnora2024!`, the encoded version is: `Flamnora2024%21`

So the connection string becomes:
```
MONGO_URI=mongodb+srv://flamnora_user:Flamnora2024%21@cluster0.odqqqh8.mongodb.net/flamnora?retryWrites=true&w=majority
```

### Step 6: Restart Server
1. In terminal, press `Ctrl+C`
2. Run: `npm run dev`
3. Test signup!

## Alternative: Use Simple Password (No Special Characters)
To avoid encoding issues, create a user with a simple password:
- Password: `Flame123` (no special characters)
- No encoding needed!

Then connection string is simply:
```
MONGO_URI=mongodb+srv://flamnora_user:Flame123@cluster0.odqqqh8.mongodb.net/flamnora?retryWrites=true&w=majority
```

## Quick Test
Use this simple setup:
- Username: `test_user`
- Password: `test123` (simple, no encoding needed)
- Connection string:
```
MONGO_URI=mongodb+srv://test_user:test123@cluster0.odqqqh8.mongodb.net/flamnora?retryWrites=true&w=majority
```





