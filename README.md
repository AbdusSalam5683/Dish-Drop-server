# DishDrop Server 🚀

Backend API for DishDrop - a community-driven recipe sharing platform.

## 🌐 Live API

[Your Render/Railway URL]

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Payment**: Stripe API
- **File Upload**: imgbb API

## 📁 API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| POST | `/api/auth/logout` | Logout user | ✅ |
| GET | `/api/auth/me` | Get current user info | ✅ |

### Recipe Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/recipes` | Get all recipes (with pagination & filters) | ❌ |
| GET | `/api/recipes/featured` | Get featured recipes | ❌ |
| GET | `/api/recipes/popular` | Get popular recipes (by likes) | ❌ |
| GET | `/api/recipes/:id` | Get single recipe by ID | ❌ |
| POST | `/api/recipes` | Create a new recipe | ✅ |
| GET | `/api/recipes/my-recipes` | Get current user's recipes | ✅ |
| PUT | `/api/recipes/:id` | Update a recipe | ✅ (Author/Admin) |
| DELETE | `/api/recipes/:id` | Delete a recipe | ✅ (Author/Admin) |
| PUT | `/api/recipes/:id/like` | Like or unlike a recipe | ✅ |

### Favorite Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/favorites` | Get user's favorites | ✅ |
| POST | `/api/favorites/:recipeId` | Add recipe to favorites | ✅ |
| DELETE | `/api/favorites/:recipeId` | Remove recipe from favorites | ✅ |
| GET | `/api/favorites/:recipeId/check` | Check if recipe is favorited | ✅ |

### Report Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/reports` | Report a recipe | ✅ |

### Payment Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/payments/create-premium-checkout` | Create Stripe checkout for premium | ✅ |
| POST | `/api/payments/create-recipe-checkout/:recipeId` | Purchase a recipe | ✅ |
| GET | `/api/payments/purchased` | Get user's purchased recipes | ✅ |
| GET | `/api/payments/premium-status` | Check user's premium status | ✅ |
| POST | `/api/payments/webhook` | Stripe webhook handler | ❌ |

### User Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/stats` | Get user dashboard stats | ✅ |
| GET | `/api/users/recent-likes` | Get recent likes on user's recipes | ✅ |
| PUT | `/api/users/profile` | Update user profile | ✅ |

### Admin Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/stats` | Get admin dashboard stats | ✅ (Admin) |
| GET | `/api/admin/users` | Get all users | ✅ (Admin) |
| PUT | `/api/admin/users/:id/block` | Block or unblock a user | ✅ (Admin) |
| GET | `/api/admin/recipes` | Get all recipes | ✅ (Admin) |
| DELETE | `/api/admin/recipes/:id` | Delete any recipe | ✅ (Admin) |
| PUT | `/api/admin/recipes/:id/feature` | Feature or unfeature a recipe | ✅ (Admin) |
| GET | `/api/admin/reports` | Get all reports | ✅ (Admin) |
| PUT | `/api/admin/reports/:id/dismiss` | Dismiss a report | ✅ (Admin) |
| PUT | `/api/admin/reports/:id/remove` | Remove recipe from a report | ✅ (Admin) |

## 📊 Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  image: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isBlocked: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false },
  premiumSince: Date,
  recipeCount: { type: Number, default: 0 },
  totalLikesReceived: { type: Number, default: 0 },
  createdAt: Date,
  updatedAt: Date
}
Recipes Collection
javascript
{
  recipeName: String,
  recipeImage: String,
  category: { type: String, enum: ['Breakfast', 'Lunch', 'Dinner', 'Desserts', 'Vegan', 'Snacks'] },
  cuisineType: String,
  difficultyLevel: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
  preparationTime: String,
  ingredients: [String],
  instructions: [String],
  authorId: ObjectId (ref: User),
  authorName: String,
  authorEmail: String,
  likesCount: { type: Number, default: 0 },
  likedBy: [ObjectId (ref: User)],
  isFeatured: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'reported', 'removed'], default: 'active' },
  createdAt: Date,
  updatedAt: Date
}
Favorites Collection
javascript
{
  userId: ObjectId (ref: User),
  recipeId: ObjectId (ref: Recipe),
  userEmail: String,
  createdAt: Date
}
Reports Collection
javascript
{
  recipeId: ObjectId (ref: Recipe),
  reporterEmail: String,
  reason: { type: String, enum: ['Spam', 'Offensive Content', 'Copyright Issue', 'Other'] },
  status: { type: String, enum: ['pending', 'dismissed', 'resolved'], default: 'pending' },
  createdAt: Date
}
Payments Collection
javascript
{
  userEmail: String,
  userId: ObjectId (ref: User),
  recipeId: ObjectId (ref: Recipe) (optional for premium),
  amount: Number,
  transactionId: String (unique),
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  paidAt: Date
}
🚀 Getting Started
Prerequisites
Node.js 18+

MongoDB (Local or Atlas)

Stripe Account

Installation
bash
# Clone the repository
git clone https://github.com/AbdusSalam5683/Dish-Drop-server.git
cd Dish-Drop-server

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your credentials

# Start development server
npm run dev
Environment Variables
Create a .env file in the root directory:

env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dishdrop

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# Server URLs
SERVER_URL=http://localhost:5000
CLIENT_URL=http://localhost:3000

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PREMIUM_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Better Auth
BETTER_AUTH_SECRET=your_better_auth_secret
Running the Server
bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
🔒 Authentication
This API uses JWT (JSON Web Tokens) for authentication:

User logs in → Server generates JWT token

Token is stored in HTTPOnly cookie

Protected routes verify token via middleware

Token expires after 7 days (configurable)

Protected Routes
To access protected routes, include the token in:

Cookie: token=your_jwt_token (automatically sent)

Header: Authorization: Bearer your_jwt_token

🧪 Testing
You can test the API using:

Postman or Thunder Client

curl commands:

bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@email.com","password":"Test@123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@email.com","password":"Test@123"}'
📦 Deployment
Deploy to Render
Push code to GitHub

Go to Render.com

Click "New +" → "Web Service"

Connect your GitHub repository

Configure:

Environment: Node

Build Command: npm install

Start Command: node src/index.js

Add all environment variables

Click "Deploy"

Deploy to Railway
Go to Railway.app

Click "New Project" → "Deploy from GitHub repo"

Select your repository

Add environment variables

Deploy

🔗 Links
Client Repository: https://github.com/AbdusSalam5683/Dish-Drop-client

Live Client: https://dishdropbd.vercel.app/

Live Server: [Your Render/Railway URL]

📄 License
MIT

👨‍💻 Contributors
Abdus Salam - @AbdusSalam5683