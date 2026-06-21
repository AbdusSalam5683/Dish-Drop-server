// dish-drop-server/src/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    image: {
      type: String,
      default: 'https://ui-avatars.com/api/?background=D85A30&color=fff&size=128'
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    isBlocked: {
      type: Boolean,
      default: false
    },
    isPremium: {
      type: Boolean,
      default: false
    },
    premiumSince: {
      type: Date,
      default: null
    },
    recipeCount: {
      type: Number,
      default: 0
    },
    totalLikesReceived: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// ==================== MIDDLEWARE ====================
// this middleware remove needed fields from the response
// userSchema.pre('save', function(next) {
//   next();
// });

// ==================== METHODS ====================
userSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

userSchema.methods.isPremiumUser = function() {
  return this.isPremium === true;
};

userSchema.methods.isBlockedUser = function() {
  return this.isBlocked === true;
};

// ==================== MODEL ====================
const User = mongoose.model('User', userSchema);

export default User;