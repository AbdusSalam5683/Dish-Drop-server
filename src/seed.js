// dish-drop-server/src/seed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Recipe from './models/Recipe.js';
import User from './models/User.js';

dotenv.config();

const seedRecipes = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Find a user to be the author
    const user = await User.findOne();
    if (!user) {
      console.log('❌ No user found. Please create a user first.');
      process.exit(1);
    }

    console.log(`👨‍🍳 Using user: ${user.name} (${user.email})`);

    // Delete existing recipes
    await Recipe.deleteMany({});
    console.log('🗑️ Existing recipes deleted');

    // Sample recipes data
    const recipes = [
      {
        recipeName: 'Classic Beef Burger',
        recipeImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        category: 'Lunch',
        cuisineType: 'American',
        difficultyLevel: 'Easy',
        preparationTime: '30 min',
        ingredients: [
          '500g ground beef',
          '4 burger buns',
          'Lettuce leaves',
          'Tomato slices',
          'Onion rings',
          'Cheese slices',
          'Ketchup & Mustard'
        ],
        instructions: [
          'Form ground beef into 4 patties',
          'Season with salt and pepper',
          'Grill patties for 4-5 minutes each side',
          'Toast burger buns',
          'Assemble with lettuce, tomato, onion, cheese',
          'Add ketchup and mustard'
        ],
        authorId: user._id,
        authorName: user.name,
        authorEmail: user.email,
        likesCount: 45,
        isFeatured: true
      },
      {
        recipeName: 'Chicken Biryani',
        recipeImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400',
        category: 'Dinner',
        cuisineType: 'Indian',
        difficultyLevel: 'Medium',
        preparationTime: '45 min',
        ingredients: [
          '500g chicken',
          '2 cups basmati rice',
          'Onions',
          'Tomatoes',
          'Yogurt',
          'Biryani masala',
          'Saffron'
        ],
        instructions: [
          'Marinate chicken with yogurt and spices',
          'Fry onions until golden',
          'Layer rice and chicken in a pot',
          'Cook on low heat for 20 minutes',
          'Garnish with fried onions and serve'
        ],
        authorId: user._id,
        authorName: user.name,
        authorEmail: user.email,
        likesCount: 78,
        isFeatured: true
      },
      {
        recipeName: 'Italian Pizza Margherita',
        recipeImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
        category: 'Dinner',
        cuisineType: 'Italian',
        difficultyLevel: 'Easy',
        preparationTime: '25 min',
        ingredients: [
          'Pizza dough',
          'Tomato sauce',
          'Fresh mozzarella',
          'Basil leaves',
          'Olive oil'
        ],
        instructions: [
          'Roll out pizza dough',
          'Spread tomato sauce',
          'Add mozzarella cheese',
          'Bake at 250°C for 12-15 minutes',
          'Garnish with fresh basil'
        ],
        authorId: user._id,
        authorName: user.name,
        authorEmail: user.email,
        likesCount: 92,
        isFeatured: true
      },
      {
        recipeName: 'Spaghetti Carbonara',
        recipeImage: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400',
        category: 'Dinner',
        cuisineType: 'Italian',
        difficultyLevel: 'Medium',
        preparationTime: '30 min',
        ingredients: [
          '400g spaghetti',
          '150g pancetta',
          '4 eggs',
          'Parmesan cheese',
          'Black pepper'
        ],
        instructions: [
          'Cook spaghetti al dente',
          'Fry pancetta until crispy',
          'Mix eggs and cheese',
          'Combine everything with pasta',
          'Season with black pepper'
        ],
        authorId: user._id,
        authorName: user.name,
        authorEmail: user.email,
        likesCount: 156,
        isFeatured: false
      },
      {
        recipeName: 'Chocolate Lava Cake',
        recipeImage: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400',
        category: 'Desserts',
        cuisineType: 'French',
        difficultyLevel: 'Hard',
        preparationTime: '45 min',
        ingredients: [
          '200g dark chocolate',
          '150g butter',
          '4 eggs',
          '100g sugar',
          '50g flour'
        ],
        instructions: [
          'Melt chocolate and butter',
          'Whisk eggs and sugar',
          'Combine all ingredients',
          'Bake for 10-12 minutes',
          'Serve warm with ice cream'
        ],
        authorId: user._id,
        authorName: user.name,
        authorEmail: user.email,
        likesCount: 142,
        isFeatured: false
      },
      {
        recipeName: 'Grilled Salmon',
        recipeImage: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400',
        category: 'Dinner',
        cuisineType: 'Mediterranean',
        difficultyLevel: 'Easy',
        preparationTime: '28 min',
        ingredients: [
          '4 salmon fillets',
          'Lemon juice',
          'Olive oil',
          'Garlic',
          'Fresh herbs'
        ],
        instructions: [
          'Marinate salmon with lemon and herbs',
          'Grill for 4-5 minutes each side',
          'Serve with grilled vegetables'
        ],
        authorId: user._id,
        authorName: user.name,
        authorEmail: user.email,
        likesCount: 128,
        isFeatured: false
      },
      {
        recipeName: 'Greek Salad',
        recipeImage: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
        category: 'Lunch',
        cuisineType: 'Greek',
        difficultyLevel: 'Easy',
        preparationTime: '15 min',
        ingredients: [
          'Cucumber',
          'Tomatoes',
          'Red onion',
          'Feta cheese',
          'Olives',
          'Olive oil'
        ],
        instructions: [
          'Chop all vegetables',
          'Add feta cheese and olives',
          'Drizzle with olive oil',
          'Season with oregano and salt'
        ],
        authorId: user._id,
        authorName: user.name,
        authorEmail: user.email,
        likesCount: 98,
        isFeatured: false
      },
      {
        recipeName: 'Butter Chicken',
        recipeImage: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400',
        category: 'Dinner',
        cuisineType: 'Indian',
        difficultyLevel: 'Medium',
        preparationTime: '50 min',
        ingredients: [
          '500g chicken',
          'Butter',
          'Cream',
          'Tomato puree',
          'Garam masala',
          'Ginger garlic'
        ],
        instructions: [
          'Marinate chicken overnight',
          'Cook in butter and spices',
          'Add cream and tomato puree',
          'Simmer for 15 minutes',
          'Serve with naan'
        ],
        authorId: user._id,
        authorName: user.name,
        authorEmail: user.email,
        likesCount: 67,
        isFeatured: false
      },
      {
        recipeName: 'Banana Pancakes',
        recipeImage: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=400',
        category: 'Breakfast',
        cuisineType: 'American',
        difficultyLevel: 'Easy',
        preparationTime: '20 min',
        ingredients: [
          '2 bananas',
          '2 eggs',
          '1 cup flour',
          'Milk',
          'Maple syrup'
        ],
        instructions: [
          'Mash bananas',
          'Mix with eggs and flour',
          'Cook on a griddle',
          'Serve with maple syrup'
        ],
        authorId: user._id,
        authorName: user.name,
        authorEmail: user.email,
        likesCount: 54,
        isFeatured: false
      }
    ];

    // Insert recipes
    const inserted = await Recipe.insertMany(recipes);
    console.log(`✅ ${inserted.length} recipes seeded successfully!`);
    console.log('📊 Recipes:', inserted.map(r => r.recipeName).join(', '));

    process.exit(0);

  } catch (error) {
    console.error('❌ Seed Error:', error);
    process.exit(1);
  }
};

seedRecipes();