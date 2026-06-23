// dish-drop-server/src/models/Recipe.js
import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema(
  {
    recipeName: {
      type: String,
      required: [true, 'Recipe name is required'],
      trim: true,
      minlength: [3, 'Recipe name must be at least 3 characters']
    },
    recipeImage: {
      type: String,
      required: [true, 'Recipe image is required']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Breakfast', 'Lunch', 'Dinner', 'Desserts', 'Vegan', 'Snacks']
    },
    cuisineType: {
      type: String,
      required: [true, 'Cuisine type is required']
    },
    difficultyLevel: {
      type: String,
      required: [true, 'Difficulty level is required'],
      enum: ['Easy', 'Medium', 'Hard']
    },
    preparationTime: {
      type: String,
      required: [true, 'Preparation time is required']
    },
    ingredients: {
      type: [String],
      required: [true, 'Ingredients are required']
    },
    instructions: {
      type: [String],
      required: [true, 'Instructions are required']
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    authorName: {
      type: String,
      required: true
    },
    authorEmail: {
      type: String,
      required: true
    },
    likesCount: {
      type: Number,
      default: 0
    },
    // 👇 এই field যোগ করুন - Like tracking এর জন্য
    likedBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: []
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['active', 'reported', 'removed'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

// Index for better search performance
recipeSchema.index({ recipeName: 'text', category: 1, cuisineType: 1 });

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;