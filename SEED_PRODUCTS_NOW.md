# 🚀 Seed Products to MongoDB - Steps

## Why Products Show 0 in MongoDB

Products are currently hardcoded in React components and not in the database. That's why search works (it has a fallback) but MongoDB shows 0 documents.

## ✅ How to Seed Products

### Option 1: Visit the Seed Endpoint
1. Make sure your server is running: `npm run dev`
2. Open browser
3. Go to: **http://localhost:3001/api/products/seed**
4. You should see: `{"success":true,"message":"Products seeded successfully","count":5}`
5. Refresh MongoDB Atlas - products will show up!

### Option 2: Use Terminal (Already Done!)
```bash
curl http://localhost:3001/api/products/seed
```

## Products That Will Be Seeded

1. **Red Heart Candle** - ₹500
2. **Ice Ocean Breeze Candle** - ₹500
3. **Ice Coffee Latte Candle** - ₹500
4. **Big Bubble Candle** - ₹100
5. **Small Bubble Candle** - ₹1

## After Seeding

- ✅ Products will show in MongoDB Atlas
- ✅ Total Documents: 5
- ✅ Search will work from database
- ✅ Products will be searchable

## 🧪 Verify in MongoDB

1. Go to MongoDB Atlas
2. Click "Browse Collections"
3. Select `flamnora` database
4. Click `products` collection
5. Should see 5 products!


