
// Menu Management
document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const menuContainer = document.getElementById('menu-items-container');
  const categoryBtns = document.querySelectorAll('.category-btn');
  const cartItemsList = document.getElementById('cart-items-list');
  const cartCount = document.getElementById('cart-count');
  const cartTotal = document.getElementById('cart-total');
  const toggleCartBtn = document.getElementById('toggle-cart');
  const cartItems = document.getElementById('cart-items');
  const emptyCartMessage = document.getElementById('empty-cart-message');
  const placeOrderBtn = document.getElementById('place-order-btn');
  const deliveryAddressInput = document.getElementById('delivery-address');
  const deliveryTimeSelect = document.getElementById('delivery-time');
  const specificTimeContainer = document.getElementById('specific-time-container');
  const specificTimeInput = document.getElementById('specific-time-input');
  
  // Sample menu items for initial setup
  const sampleMenuItems = [
    {
      id: '1',
      name: 'Herb-Crusted Salmon',
      category: 'mains',
      price: 24.95,
      description: 'Fresh Atlantic salmon with a crispy herb crust, served with seasonal vegetables',
      image: 'https://images.unsplash.com/photo-1464500447964-8970009b4b6a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
    },
    {
      id: '2',
      name: 'Truffle Risotto',
      category: 'mains',
      price: 22.95,
      description: 'Creamy Arborio rice with wild mushrooms, truffle oil, and aged Parmesan',
      image: 'https://images.unsplash.com/photo-1544025162-c59e1f6383ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80'
    },
    {
      id: '3',
      name: 'Filet Mignon',
      category: 'mains',
      price: 32.95,
      description: 'Prime cut tenderloin, garlic mashed potatoes, and red wine reduction',
      image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
    },
    {
      id: '4',
      name: 'Caesar Salad',
      category: 'appetizers',
      price: 12.95,
      description: 'Crisp romaine lettuce, garlic croutons, Parmesan cheese, and classic Caesar dressing',
      image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
    },
    {
      id: '5',
      name: 'Bruschetta',
      category: 'appetizers',
      price: 10.95,
      description: 'Toasted garlic bread topped with tomatoes, fresh basil, and extra virgin olive oil',
      image: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80'
    },
    {
      id: '6',
      name: 'Chocolate Lava Cake',
      category: 'desserts',
      price: 9.95,
      description: 'Warm chocolate cake with a molten center, served with vanilla ice cream',
      image: 'https://images.unsplash.com/photo-1579306194872-64d3b7bac4c2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1005&q=80'
    },
    {
      id: '7',
      name: 'Tiramisu',
      category: 'desserts',
      price: 8.95,
      description: 'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream',
      image: 'https://images.unsplash.com/photo-1542124948-dc391252a940?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
    },
    {
      id: '8',
      name: 'Cabernet Sauvignon',
      category: 'drinks',
      price: 12.95,
      description: 'Glass of premium Cabernet with notes of black cherry, tobacco and spice',
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
    },
    {
      id: '9',
      name: 'Craft Mocktail',
      category: 'drinks',
      price: 7.95,
      description: 'Handcrafted non-alcoholic beverage with fresh fruit, herbs, and sparkling water',
      image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80'
    }
  ];
  
  // Initialize menu items in local storage if they don't exist
  if (!localStorage.getItem('menuItems')) {
    localStorage.setItem('menuItems', JSON.stringify(sampleMenuItems));
  }
  
  // Get menu items from local storage
  function getMenuItems() {
    return JSON.parse(localStorage.getItem('menuItems')) || [];
  }
  
  // Display menu items based on category filter
  function displayMenuItems(category = 'all') {
    // Clear menu container
    if (menuContainer) {
      menuContainer.innerHTML = '';
      
      const menuItems = getMenuItems();
      let filteredItems = menuItems;
      
      // Filter items by category if not 'all'
      if (category !== 'all') {
        filteredItems = menuItems.filter(item => item.category === category);
      }
      
      // Display message if no items in category
      if (filteredItems.length === 0) {
        menuContainer.innerHTML = '<div class="loading">No items found in this category.</div>';
        return;
      }
      
      // Create and append menu item elements
      filteredItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
          <div class="menu-item-image" style="background-image: url('${item.image || 'https://via.placeholder.com/300x200?text=No+Image'}');">
            <span class="menu-item-category">${item.category}</span>
          </div>
          <div class="menu-item-content">
            <div class="menu-item-header">
              <h3 class="menu-item-title">${item.name}</h3>
              <div class="menu-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <p class="menu-item-description">${item.description}</p>
            <div class="menu-item-actions">
              <button class="add-to-cart-btn" data-id="${item.id}">
                <i class="fas fa-cart-plus"></i> Add to Cart
              </button>
            </div>
          </div>
        `;
        menuContainer.appendChild(menuItem);
      });
      
      // Add event listeners for add to cart buttons
      document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', addToCart);
      });
    }
  }
  
  // Add item to cart
  function addToCart(e) {
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
  
  // Update cart display
  function updateCartDisplay() {
    if (!cartItemsList || !cartCount || !cartTotal || !emptyCartMessage) return;
    
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
      validateOrderForm();
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
  
  // Validate order form
  function validateOrderForm() {
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const address = deliveryAddressInput ? deliveryAddressInput.value.trim() : '';
    const timeOption = deliveryTimeSelect ? deliveryTimeSelect.value : '';
    const specificTime = specificTimeInput ? specificTimeInput.value : '';
    
    // Enable order button only if cart has items and delivery details are filled
    if (cart.length > 0 && address !== '' && 
        (timeOption !== '' && timeOption !== 'specific' || 
         (timeOption === 'specific' && specificTime !== ''))) {
      placeOrderBtn.disabled = false;
      placeOrderBtn.style.opacity = '1';
    } else {
      placeOrderBtn.disabled = true;
      placeOrderBtn.style.opacity = '0.5';
    }
  }
  
  // Place an order
  function placeOrder() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    
    if (!currentUser || cart.length === 0) return;
    
    // Get delivery details
    const address = deliveryAddressInput.value.trim();
    const timeOption = deliveryTimeSelect.value;
    const specificTime = specificTimeInput.value;
    
    // Format delivery time
    let deliveryTime = '';
    switch(timeOption) {
      case 'asap':
        deliveryTime = 'As soon as possible';
        break;
      case '30min':
        deliveryTime = 'Within 30 minutes';
        break;
      case '1hour':
        deliveryTime = 'Within 1 hour';
        break;
      case '2hour':
        deliveryTime = 'Within 2 hours';
        break;
      case 'specific':
        deliveryTime = `At ${specificTime}`;
        break;
      default:
        deliveryTime = 'Not specified';
    }
    
    // Calculate total price
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create new order
    const order = {
      id: generateOrderId(),
      userId: currentUser.email,
      userName: currentUser.name,
      items: cart,
      total: total,
      address: address,
      deliveryTime: deliveryTime,
      status: 'pending',
      date: new Date().toISOString()
    };
    
    // Get existing orders
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Add new order
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart and form
    sessionStorage.removeItem('cart');
    if(deliveryAddressInput) deliveryAddressInput.value = '';
    if(deliveryTimeSelect) deliveryTimeSelect.value = '';
    if(specificTimeInput) specificTimeInput.value = '';
    updateCartDisplay();
    
    // Show success message
    alert('Order placed successfully! You can view your order in your account dashboard.');
  }
  
  // Generate unique order ID
  function generateOrderId() {
    return 'ORD' + Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  }
  
  // Event listeners for category buttons
  if (categoryBtns) {
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons
        categoryBtns.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Get category value and display items
        const category = btn.getAttribute('data-category');
        displayMenuItems(category);
      });
    });
  }
  
  // Toggle cart display
  if (toggleCartBtn && cartItems) {
    toggleCartBtn.addEventListener('click', () => {
      cartItems.classList.toggle('active');
      
      if (cartItems.classList.contains('active')) {
        toggleCartBtn.innerHTML = `<i class="fas fa-times"></i> Close Cart <span id="cart-count">${cartCount.textContent}</span>`;
      } else {
        toggleCartBtn.innerHTML = `<i class="fas fa-shopping-cart"></i> <span id="cart-count">${cartCount.textContent}</span>`;
      }
    });
  }
  
  // Show/hide specific time input based on delivery time selection
  if (deliveryTimeSelect) {
    deliveryTimeSelect.addEventListener('change', function() {
      if (this.value === 'specific') {
        specificTimeContainer.style.display = 'block';
      } else {
        specificTimeContainer.style.display = 'none';
      }
      validateOrderForm();
    });
  }
  
  // Add event listeners for form inputs
  if (deliveryAddressInput) {
    deliveryAddressInput.addEventListener('input', validateOrderForm);
  }
  
  if (specificTimeInput) {
    specificTimeInput.addEventListener('input', validateOrderForm);
  }
  
  // Place order button
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', placeOrder);
  }
  
  // Load saved address from user profile if available
  function loadUserAddress() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.address && deliveryAddressInput) {
      deliveryAddressInput.value = currentUser.address;
      validateOrderForm();
    }
  }
  
  // Initialize menu display
  displayMenuItems();
  
  // Initialize cart display
  updateCartDisplay();
  
  // Load user address if available
  loadUserAddress();
});
