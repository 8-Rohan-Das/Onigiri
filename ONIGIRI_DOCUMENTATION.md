# Onigiri - Food Delivery Application Documentation

## 🍱 What is Onigiri?

Onigiri is a **food delivery application** built with modern web technologies. Think of it as a simplified version of apps like Uber Eats or DoorDash. Users can browse food items, add them to a cart, mark favorites, and place orders.

## 🎯 Who This Guide Is For

This guide is written for **beginners** who are learning React development. We'll explain everything step-by-step, from basic concepts to how different parts work together.

---

## 🛠️ Technology Stack (The Building Blocks)

### What We're Using and Why

#### **React 19.2.0** - The Foundation
- **What it is**: A JavaScript library for building user interfaces
- **Why we use it**: React lets us break our app into reusable pieces (components)
- **Beginner analogy**: Think of React like LEGO blocks - each block is a component, and you build bigger things by combining them

#### **React Router DOM 7.12.0** - Navigation
- **What it is**: Handles moving between different pages in our app
- **Why we use it**: Users need to navigate between login, home, cart, etc.
- **Beginner analogy**: Like a GPS for your app - it knows which page to show based on the URL

#### **Bootstrap 5.3.8** - Styling Made Easy
- **What it is**: A CSS framework for making apps look good
- **Why we use it**: Pre-built styles for buttons, cards, layouts
- **Beginner analogy**: Like a coloring book - the outlines are already there, you just add colors

#### **Framer Motion 12.28.1** - Animations
- **What it is**: Makes things move and animate smoothly
- **Why we use it**: Better user experience with smooth transitions
- **Beginner analogy**: Like special effects for movies - makes everything look polished

#### **Vite 7.2.4** - Development Tool
- **What it is**: A tool that runs and builds our app
- **Why we use it**: Fast development and easy setup
- **Beginner analogy**: Like a kitchen - it has all the tools to cook (build) your app quickly

## 🏗️ How Our App Is Organized (Project Structure)

### Understanding the Folder Layout

Think of your app like a house with different rooms:

```
src/                           # Main house (our app code)
├── components/                 # 🧩 Reusable building blocks
│   ├── FavoriteButton.jsx     # Heart button for favorites
│   ├── HoveringCart.jsx       # Shopping cart that floats
│   └── NotificationButton.jsx # Bell icon for notifications
├── context/                   # 🗄️ Global storage rooms
│   ├── CartContext.jsx        # Shopping cart storage
│   ├── FavoriteContext.jsx    # Favorites storage
│   └── NotificationContext.jsx # Notification storage
├── hooks/                     # 🎣 Special tools (custom functions)
│   ├── useLogin.js           # Login helper
│   ├── useCheckout.js        # Checkout helper
│   └── useForgotPassword.js  # Password reset helper
├── pages/                     # 🏠 Different rooms (pages)
│   ├── auth/                 # Login & signup room
│   ├── home/                 # Main living room (homepage)
│   ├── shop/                 # Shopping area
│   ├── checkout/             # Payment counter
│   └── user/                 # User profile room
├── utils/                     # 🔧 Utility tools
│   └── storageUtils.js       # Local storage helpers
└── assets/                    # 🖼️ Decorations (images, icons)
```

### Why This Structure Matters

- **Components**: Reusable pieces you can use anywhere (like buttons, cards)
- **Context**: Global data that multiple pages need to share (like cart items)
- **Pages**: Different screens users see (home, login, cart)
- **Hooks**: Reusable logic (like how to handle login)
- **Utils**: Helper functions (like saving data to browser)

---

## 🎯 Core Concepts for Beginners

### What is a "Component"?

A component is a **reusable piece of UI**. Think of it like a LEGO brick:

```javascript
// Simple button component
function MyButton() {
  return <button>Click me!</button>;
}

// We can reuse it anywhere
<MyButton />
<MyButton />
```

### What is "State"?

State is **data that can change over time**. Think of it like a scoreboard:

```javascript
function Counter() {
  const [count, setCount] = useState(0); // count is our state
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}
```

### What is a "Context"?

Context is like a **global bulletin board** where any component can read or write information:

```javascript
// Instead of passing data through many components
<CartContext.Provider value={cartData}>
  <App />
</CartContext.Provider>
```

---

## 🛒 Shopping Cart System (CartContext)

### What It Does

The shopping cart lets users:
- Add food items to their cart
- Remove items from cart
- Change quantities
- See total price
- Place orders

### How It Works (Step by Step)

#### 1. **Creating the Cart Storage**
```javascript
// We create a "context" - like a global storage box
const CartContext = createContext();

// We make a custom hook to easily access the cart
export const useCart = () => useContext(CartContext);
```

#### 2. **Cart Provider - The Storage Manager**
```javascript
export const CartProvider = ({ children }) => {
  // This is where we store cart items
  const [cartItems, setCartItems] = useState([
    // Default items for testing
    { id: 'def-1', name: 'Vegan Pizza Dough', quantity: 1, price: 120.00, icon: '🍕' }
  ]);
  
  // All the functions to manage the cart go here...
}
```

#### 3. **Key Functions Explained**

##### `addToCart(item)` - Adding Items
```javascript
const addToCart = (item) => {
  setCartItems(prev => {
    const existing = prev.find(i => i.id === item.id);
    if (existing) {
      // Item already exists, just increase quantity
      return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
    }
    // New item, add it with quantity 1
    return [...prev, { ...item, quantity: 1 }];
  });
};
```

**What this does:**
- Checks if the item is already in cart
- If yes: increases the quantity
- If no: adds the item with quantity 1

##### `removeFromCart(id)` - Removing Items
```javascript
const removeFromCart = (id) => {
  setCartItems(prev => prev.filter(i => i.id !== id));
};
```

**What this does:**
- Removes the item completely from cart
- Uses `filter` to keep only items that don't match the ID

##### `updateQuantity(id, quantity)` - Changing Quantities
```javascript
const updateQuantity = (id, quantity) => {
  if (quantity <= 0) {
    removeFromCart(id); // Remove if quantity is 0 or less
    return;
  }
  setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
};

**What this does:**
- Updates the quantity of a specific item
- Removes item if quantity becomes 0

##### `getCartTotal()` - Calculating Total Price
```javascript
const getCartTotal = () => {
  return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
};
```

**What this does:**
- Goes through each item in cart
- Multiplies price by quantity for each item
- Adds them all up for the total

#### 4. **How to Use the Cart in Components**
```javascript
function MyComponent() {
  // Get cart functions and data
  const { addToCart, cartItems, getCartTotal } = useCart();
  
  const handleAddToCart = (foodItem) => {
    addToCart(foodItem); // Add item to cart
  };
  
  return (
    <div>
      <p>Total items: {cartItems.length}</p>
      <p>Total price: ₹{getCartTotal()}</p>
      <button onClick={() => handleAddToCart(item)}>
        Add to Cart
      </button>
    </div>
  );
}
```

---

## ❤️ Favorites System (FavoriteContext)

### What It Does

The favorites system lets users:
- Save food items they like
- View their favorite items
- Remove items from favorites
- Check if an item is already favorited

### How It Works

#### 1. **Setting Up Favorites Storage**
```javascript
const FavoriteProvider = ({ children }) => {
  const [favoriteItems, setFavoriteItems] = useState(() => {
    // Load favorites from browser storage when app starts
    const stored = getStoredItem('favorites', []);
    return Array.isArray(stored) ? stored : [];
  });
}
```

#### 2. **Key Functions Explained**

##### `addToFavorites(item)` - Adding to Favorites
```javascript
const addToFavorites = (item) => {
  // Check if already favorited
  const existing = favoriteItems.find(fav => fav.id === item.id);
  if (existing) {
    // Show notification: "Already in favorites"
    addNotification({
      type: 'favorite',
      title: 'Already in Favorites',
      message: `${item.name} is already in your favorites.`,
      icon: '❤️'
    });
    return;
  }

  // Add to favorites
  setFavoriteItems(prev => [...prev, { ...item }]);
  
  // Show success notification
  addNotification({
    type: 'favorite',
    title: 'Added to Favorites',
    message: `${item.name} has been added to your favorites.`,
    icon: '❤️'
  });
};
```

**What this does:**
- Checks if item is already favorited
- If yes: shows notification and stops
- If no: adds item and shows success notification

##### `isFavorite(id)` - Checking if Item is Favorited
```javascript
const isFavorite = (id) => {
  return favoriteItems.some(fav => fav.id === id);
};
```

**What this does:**
- Returns `true` if item is in favorites
- Returns `false` if item is not in favorites

#### 3. **Favorite Button Component**
```javascript
const FavoriteButton = ({ item }) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  
  const isFavorited = isFavorite(item.id);
  
  const handleToggleFavorite = (e) => {
    e.stopPropagation(); // Don't trigger other click events
    
    if (isFavorited) {
      removeFromFavorites(item);
    } else {
      addToFavorites(item);
    }
  };
  
  return (
    <button onClick={handleToggleFavorite}>
      {isFavorited ? '❤️' : '🤍'} {/* Filled or empty heart */}
    </button>
  );
};
```

---

## 🔔 Notification System (NotificationContext)

### What It Does

The notification system shows users important updates:
- Order confirmations
- Status updates
- Error messages
- Success messages

### How It Works

#### 1. **Notification Structure**
Each notification has:
```javascript
{
  id: 1234567890,           // Unique ID
  timestamp: "2024-01-01T12:00:00Z", // When it was created
  read: false,             // Has user seen it?
  type: "order",           // What kind of notification
  title: "Order Placed!",   // Short title
  message: "Your order #123 has been placed", // Detailed message
  icon: "📦",              // Emoji icon
  action: "/order-history" // Where to go when clicked
}
```

#### 2. **Key Functions**

##### `addNotification(notification)` - Adding Notifications
```javascript
const addNotification = (notification) => {
  const newNotification = {
    id: Date.now(),                    // Use timestamp as unique ID
    timestamp: new Date().toISOString(),
    read: false,                       // New notifications are unread
    ...notification                    // Add the notification data
  };

  setNotifications(prev => [newNotification, ...prev]);
};
```

##### `markAsRead(id)` - Marking as Read
```javascript
const markAsRead = (notificationId) => {
  setNotifications(prev => 
    prev.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    )
  );
};
```

#### 3. **Specialized Notification Functions**

These are shortcuts for common notifications:

##### Order Notifications
```javascript
const notifyOrderPlaced = (orderDetails) => {
  addNotification({
    type: 'order',
    title: 'Order Placed Successfully!',
    message: `Your order #${orderDetails.orderId} has been placed.`,
    icon: '📦',
    action: '/order-history'
  });
};
```

##### Favorite Notifications
```javascript
const notifyFavoriteAdded = (itemName) => {
  addNotification({
    type: 'favorite',
    title: 'Added to Favorites',
    message: `${itemName} has been added to your favorites.`,
    icon: '❤️',
    action: '/favorite'
  });
};
```

---

## 💾 Data Storage (storageUtils.js)

### Why We Need Storage Helpers

When users close and reopen the app, we want their cart and favorites to still be there. We use the browser's `localStorage` for this, but it can be tricky, so we created helper functions.

### Key Functions

#### `getStoredItem(key, defaultValue)` - Safe Reading
```javascript
export const getStoredItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    
    const parsedItem = JSON.parse(item);
    return parsedItem === null ? defaultValue : parsedItem;
  } catch (error) {
    console.warn(`Error reading "${key}":`, error);
    return defaultValue; // Return default if something goes wrong
  }
};
```

**What this does:**
- Tries to read data from browser storage
- If data doesn't exist or is broken, returns default value
- Prevents app crashes from storage errors

#### `setStoredItem(key, value)` - Safe Writing
```javascript
export const setStoredItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving "${key}":`, error);
  }
};
```

**What this does:**
- Saves data to browser storage
- Converts JavaScript objects to JSON strings
- Handles errors gracefully

---

## 🧩 Reusable Components

### FavoriteButton Component

This is a reusable heart button that can be used anywhere in the app.

```javascript
const FavoriteButton = ({ item, size = 'normal', className = '' }) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  
  const isFavorited = isFavorite(item.id);
  
  const handleToggleFavorite = (e) => {
    e.stopPropagation(); // Prevent other click events
    
    if (isFavorited) {
      removeFromFavorites(item);
    } else {
      addToFavorites(item);
    }
  };
  
  return (
    <button 
      onClick={handleToggleFavorite}
      className={`favorite-btn ${size} ${isFavorited ? 'active' : ''} ${className}`}
    >
      {isFavorited ? '❤️' : '🤍'}
    </button>
  );
};
```

**Props (Inputs):**
- `item` - The food item to favorite
- `size` - 'normal' or 'small' button size
- `className` - Extra CSS classes

**Features:**
- Shows filled heart if favorited, empty if not
- Handles click events
- Prevents event bubbling
- Works with the favorites context

---

## 🚀 How Everything Works Together

### User Journey Example: Adding an Item to Cart

1. **User sees food item on homepage**
2. **User clicks "Add to Cart" button**
3. **Button calls `addToCart(item)` function**
4. **CartContext updates the cart state**
5. **CartContext saves to localStorage**
6. **Cart icon updates to show new count**
7. **Notification shows "Item added to cart"**

### Data Flow Diagram

```
User Action → Component Function → Context Update → localStorage Save → UI Update
     ↓                ↓                ↓               ↓              ↓
  Click button → addToCart() → setCartItems() → setStoredItem() → Re-render
```

---

## 🎨 Styling and Design

### Using Bootstrap

Bootstrap gives us pre-built styles:

```javascript
import 'bootstrap/dist/css/bootstrap.min.css';

// Use Bootstrap classes
<button className="btn btn-primary">Add to Cart</button>
<div className="card">Food Item</div>
<div className="container">Page content</div>
```

### Custom CSS

Each component has its own CSS file:

```css
/* FavoriteButton.css */
.favorite-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  transition: transform 0.2s;
}

.favorite-btn:hover {
  transform: scale(1.1);
}

.favorite-btn.active {
  color: red;
}
```

---

## 🔧 Common Patterns for Beginners

### 1. **Using Context in Components**
```javascript
function MyComponent() {
  // Get data and functions from context
  const { addToCart, cartItems } = useCart();
  const { addToFavorites } = useFavorites();
  
  // Use them in your component
  return <div>Cart has {cartItems.length} items</div>;
}
```

### 2. **Handling User Input**
```javascript
function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  return (
    <input 
      type="text"
      value={searchTerm}
      onChange={handleSearch}
      placeholder="Search food..."
    />
  );
}
```

### 3. **Conditional Rendering**
```javascript
function CartSummary() {
  const { cartItems } = useCart();
  
  return (
    <div>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <p>You have {cartItems.length} items</p>
      )}
    </div>
  );
}
```

### 4. **Mapping Over Arrays**
```javascript
function FoodList({ foods }) {
  return (
    <div>
      {foods.map(food => (
        <div key={food.id}>
          <h3>{food.name}</h3>
          <p>₹{food.price}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 🐛 Common Issues and Solutions

### Issue: "Cannot read property of undefined"
**Cause**: Trying to access data before it's loaded
**Solution**: Use default values or conditional rendering

```javascript
// Bad - might crash
const userName = user.name;

// Good - safe
const userName = user?.name || 'Guest';
```

### Issue: State not updating immediately
**Cause**: State updates are asynchronous
**Solution**: Use useEffect for side effects

```javascript
const [count, setCount] = useState(0);

useEffect(() => {
  console.log('Count changed:', count); // This runs after count updates
}, [count]);
```

### Issue: localStorage not working
**Cause**: Browser security or storage full
**Solution**: Use try-catch and fallbacks

```javascript
// Always use our helper functions
const cartItems = getStoredItem('cartItems', []);
setStoredItem('cartItems', newCartItems);
```

---

## 📚 Learning Path for Beginners

### Step 1: Understand Basic React
- Components and props
- State and useState
- Event handling
- Conditional rendering

### Step 2: Learn React Hooks
- useState for component state
- useEffect for side effects
- useContext for global state
- Custom hooks for reusable logic

### Step 3: Master Context API
- Creating contexts
- Provider pattern
- Consuming context in components
- Multiple contexts working together

### Step 4: Build Real Features
- Form handling
- Data persistence
- Navigation
- User feedback

### Step 5: Advanced Concepts
- Performance optimization
- Error boundaries
- Testing
- Deployment

---

## 🎯 Key Takeaways

### For Beginners

1. **Components are building blocks** - Break your UI into small, reusable pieces
2. **State is data that changes** - Use useState for component data
3. **Context is for sharing data** - Use it for global data like cart and favorites
4. **Props pass data down** - Parent components pass data to children
5. **Events handle user actions** - onClick, onChange, etc.

### Best Practices

1. **Keep components small** - Each component should do one thing well
2. **Use descriptive names** - `addToCart` is better than `handleClick`
3. **Handle errors gracefully** - Always have fallbacks and error handling
4. **Think about user experience** - Show loading states, notifications, etc.
5. **Organize your code** - Use folders and clear file structure

---

## 🚀 Next Steps

### Try These Exercises

1. **Add a new feature** - Implement a "recently viewed" section
2. **Create a new component** - Build a rating star component
3. **Add a new context** - Create a user preferences context
4. **Improve the UI** - Add animations or better styling
5. **Add error handling** - Show friendly error messages

### Explore Further

- Read the React documentation
- Try building your own small projects
- Learn about React Router in more detail
- Explore state management libraries
- Study modern CSS techniques

---

## 🎉 Conclusion

Onigiri demonstrates how to build a real-world React application with proper architecture, state management, and user experience. By understanding these concepts, you're well on your way to becoming a proficient React developer!

Remember: **Every expert was once a beginner**. Take it step by step, experiment with the code, and don't be afraid to make mistakes - that's how we learn!
