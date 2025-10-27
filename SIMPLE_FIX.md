# ✅ Simple Behavior to Fix Authentication

## Create a New Database User in MongoDB Atlas

### Step 1: Go to Database Access
1. Visit: **https://cloud.mongodb.com**
2. Login
3. Click **"Database Access"** (left sidebar)

### Step 2: Create New User
1. Click **"+ ADD NEW DATABASE USER"**
2. Fill in:
   - **Username:** `flamnora_user`
   - **Password:** `flame123` (simple, lowercase, no special characters)
   - **Privileges:** Select **"Atlas admin"**
3. Click **"Add User"**

### Step 3: Update .env.local File

After creating the user, I'll update your `.env.local` file with:

```env
MONGO_URI=mongodb+srv://flamnora_user:flame123@cluster0.odqqqh8.mongodb.net/flamnora?retryWrites=true&w=majority
JWT_SECRET=flamnora_secret_key_change_in_production
```

### Step 4: Restart Server
1. Stop server: `Ctrl+C`
2. Start again: `npm run dev`
3. Test signup!

## Tell Me When You've Created the User
After you create the user with:
- Username: `flamnora_user`
- Password: `flame123`

I'll update the connection string automatically and you just need to restart the server!




