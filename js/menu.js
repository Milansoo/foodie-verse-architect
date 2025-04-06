// Add these functions to your existing menu.js file

// Get menu items function
function getMenuItems() {
  // Here you would typically fetch menu data from a server
  // For now, we'll use static menu items stored in the JavaScript
  return [
    {
      id: "item1",
      name: "Classic Burger",
      description: "Juicy beef patty with lettuce, tomato, and special sauce",
      price: 8.99,
      category: "burgers",
      image: "images/classic-burger.jpg"
    },
    {
      id: "item2",
      name: "Veggie Burger",
      description: "Plant-based patty with avocado, sprouts, and vegan mayo",
      price: 9.99,
      category: "burgers",
      image: "images/veggie-burger.jpg"
    },
    {
      id: "item3",
      name: "Caesar Salad",
      description: "Crisp romaine lettuce with Caesar dressing and croutons",
      price: 7.99,
      category: "salads",
      image: "images/caesar-salad.jpg"
    },
    {
      id: "item4",
      name: "Margherita Pizza",
      description: "Classic pizza with tomato sauce, mozzarella, and basil",
      price: 12.99,
      category: "pizza",
      image: "images/margherita-pizza.jpg"
    },
    {
      id: "item5",
      name: "Chocolate Brownie",
      description: "Rich chocolate brownie with vanilla ice cream",
      price: 5.99,
      category: "desserts",
      image: "images/chocolate-brownie.jpg"
    }
  ];
}

// Add to Cart Function
function addToCart(e) {
  // Get current user
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
  // Only allow logged in users to add to cart
  if (!currentUser) {
    window.location.href = 'auth.html';
    return;
  }
  
  const itemId = e.currentTarget.getAttribute('data-id');
  const menuItems = getMenuItems();
  const item = menuItems.find(item => item.id === itemId);
  
  // Get cart from session storage
  const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
  
  // Check if item is already in cart
  const existingItem = cart.find(cartItem => cartItem.id === itemId);
  
  if (existingItem) {
    // Increment quantity if item already in cart
    existingItem.quantity += 1;
  } else {
    // Add item to cart with quantity 1
    cart.push({
      ...item,
      quantity: 1
    });
  }
  
  // Save cart to session storage
  sessionStorage.setItem('cart', JSON.stringify(cart));
  
  // Show success message
  const addButton = e.currentTarget;
  const originalText = addButton.innerHTML;
  addButton.innerHTML = '<i class="fas fa-check"></i> Added!';
  addButton.disabled = true;
  addButton.style.backgroundColor = '#4CAF50';
  
  // Reset button after 2 seconds
  setTimeout(() => {
    addButton.innerHTML = originalText;
    addButton.disabled = false;
    addButton.style.backgroundColor = '';
  }, 2000);
  
  // Update cart display
  updateCartDisplay();
}

// Update Cart Display Function
function updateCartDisplay() {
  const cartItemsList = document.getElementById('cart-items-list');
  const cartCount = document.getElementById('cart-count');
  const cartTotal = document.getElementById('cart-total');
  const emptyCartMessage = document.getElementById('empty-cart-message');
  const placeOrderBtn = document.getElementById('place-order-btn');

  const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
  
  // Update cart count
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = totalItems;
  
  // Show/hide empty cart message
  if (cart.length === 0) {
    emptyCartMessage.style.display = 'block';
    placeOrderBtn.disabled = true;
    placeOrderBtn.style.opacity = '0.5';
  } else {
    emptyCartMessage.style.display = 'none';
    placeOrderBtn.disabled = false;
    placeOrderBtn.style.opacity = '1';
  }
  
  // Clear cart items list
  cartItemsList.innerHTML = '';
  
  // Calculate total price
  let totalPrice = 0;
  
  // Add each item to the cart list
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    totalPrice += itemTotal;
    
    const cartItem = document.createElement('li');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
      </div>
      <div class="cart-item-quantity">
        <button class="quantity-btn decrease-quantity" data-id="${item.id}">-</button>
        <span>${item.quantity}</span>
        <button class="quantity-btn increase-quantity" data-id="${item.id}">+</button>
        <button class="remove-item-btn" data-id="${item.id}">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `;
    
    cartItemsList.appendChild(cartItem);
  });
  
  // Update total price
  cartTotal.textContent = `Total: $${totalPrice.toFixed(2)}`;
  
  // Add event listeners for cart item buttons
  document.querySelectorAll('.decrease-quantity').forEach(btn => {
    btn.addEventListener('click', decreaseQuantity);
  });
  
  document.querySelectorAll('.increase-quantity').forEach(btn => {
    btn.addEventListener('click', increaseQuantity);
  });
  
  document.querySelectorAll('.remove-item-btn').forEach(btn => {
    btn.addEventListener('click', removeFromCart);
  });
}

// Increase item quantity in cart
function increaseQuantity(e) {
  const itemId = e.currentTarget.getAttribute('data-id');
  const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
  
  const item = cart.find(item => item.id === itemId);
  if (item) {
    item.quantity += 1;
    sessionStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
  }
}

// Decrease item quantity in cart
function decreaseQuantity(e) {
  const itemId = e.currentTarget.getAttribute('data-id');
  const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
  
  const item = cart.find(item => item.id === itemId);
  if (item) {
    if (item.quantity > 1) {
      item.quantity -= 1;
      sessionStorage.setItem('cart', JSON.stringify(cart));
    } else {
      removeFromCart(e);
      return;
    }
    updateCartDisplay();
  }
}

// Remove item from cart
function removeFromCart(e) {
  const itemId = e.currentTarget.getAttribute('data-id');
  let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
  
  cart = cart.filter(item => item.id !== itemId);
  sessionStorage.setItem('cart', JSON.stringify(cart));
  updateCartDisplay();
}

// Place an order
function placeOrder() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
  
  if (!currentUser || cart.length === 0) return;
  
  // Calculate total price
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Create new order
  const order = {
    id: generateOrderId(),
    userId: currentUser.email,
    userName: currentUser.name,
    items: cart,
    total: total,
    status: 'pending',
    date: new Date().toISOString()
  };
  
  // Get existing orders
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  
  // Add new order
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));
  
  // Clear cart
  sessionStorage.removeItem('cart');
  updateCartDisplay();
  
  // Show success message
  alert('Order placed successfully! You can view your order in your account dashboard.');
}

// Generate unique order ID
function generateOrderId() {
  return 'ORD' + Math.floor(Math.random() * 100000).toString().padStart(5, '0');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM fully loaded, setting up cart functionality");
  
  // Get all add to cart buttons
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
  console.log("Found " + addToCartButtons.length + " 'Add to Cart' buttons");
  
  // Add click event listener to each button
  addToCartButtons.forEach(btn => {
    btn.addEventListener('click', addToCart);
    console.log("Added click event listener to button: " + btn.getAttribute('data-id'));
  });

  // Toggle Cart Button Event Listener
  const toggleCartBtn = document.getElementById('toggle-cart');
  const cartItems = document.getElementById('cart-items');
  
  if (toggleCartBtn && cartItems) {
    toggleCartBtn.addEventListener('click', () => {
      cartItems.classList.toggle('active');
      
      if (cartItems.classList.contains('active')) {
        toggleCartBtn.innerHTML = `<i class="fas fa-times"></i> Close Cart <span id="cart-count">${document.getElementById('cart-count').textContent}</span>`;
      } else {
        toggleCartBtn.innerHTML = `<i class="fas fa-shopping-cart"></i> <span id="cart-count">${document.getElementById('cart-count').textContent}</span>`;
      }
    });
    console.log("Added toggle event listener to cart button");
  } else {
    console.warn("Could not find toggle cart button or cart items container");
  }

  // Place Order Button Event Listener
  const placeOrderBtn = document.getElementById('place-order-btn');
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', placeOrder);
    console.log("Added click event listener to Place Order button");
  } else {
    console.warn("Could not find place order button");
  }

  // Initialize cart display
  updateCartDisplay();
  console.log("Cart display initialized");
});
