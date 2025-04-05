
// Authentication Functionality
document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const tabButtons = document.querySelectorAll('.tab-btn');
  
  const termsLink = document.getElementById('terms-link');
  const termsModal = document.getElementById('terms-modal');
  const acceptTermsBtn = document.getElementById('accept-terms');
  const closeButton = document.querySelector('.close-button');
  
  // Initialize data if not exists
  if (!localStorage.getItem('users')) {
    // Create default admin account
    const defaultAdmin = {
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      joinDate: new Date().toISOString()
    };
    
    // Create initial users array with admin
    const initialUsers = [defaultAdmin];
    localStorage.setItem('users', JSON.stringify(initialUsers));
    
    // Create empty orders and menu items
    if (!localStorage.getItem('orders')) {
      localStorage.setItem('orders', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('menuItems')) {
      const initialMenuItems = [
        {
          id: 'item1',
          name: 'Classic Burger',
          category: 'mains',
          price: 12.99,
          description: 'Juicy beef patty with lettuce, tomato, and special sauce on a brioche bun.',
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 'item2',
          name: 'Caesar Salad',
          category: 'appetizers',
          price: 8.99,
          description: 'Crisp romaine lettuce with Caesar dressing, croutons, and parmesan cheese.',
          image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 'item3',
          name: 'Chocolate Cake',
          category: 'desserts',
          price: 6.99,
          description: 'Rich chocolate cake with a molten center, served with vanilla ice cream.',
          image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 'item4',
          name: 'Signature Cocktail',
          category: 'drinks',
          price: 9.99,
          description: 'Our signature blend of premium spirits with fresh fruit juices.',
          image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        }
      ];
      localStorage.setItem('menuItems', JSON.stringify(initialMenuItems));
    }
  }
  
  // Check if user is logged in
  checkAuthStatus();
  
  // Tab functionality
  if (tabButtons) {
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all tab buttons and forms
        tabButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
        
        // Add active class to clicked button and corresponding form
        button.classList.add('active');
        const formId = `${button.getAttribute('data-tab')}-form`;
        document.getElementById(formId).classList.add('active');
      });
    });
  }
  
  // Login form functionality
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      const userType = document.querySelector('input[name="user-type"]:checked').value;
      const rememberMe = document.getElementById('remember-me').checked;
      
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users')) || [];
      
      // Find user with matching email and password
      const user = users.find(user => user.email === email && user.password === password);
      
      const messageEl = document.getElementById('login-message');
      
      // Check if user exists
      if (!user) {
        messageEl.textContent = 'Invalid email or password.';
        messageEl.className = 'auth-message error';
        return;
      }
      
      // Check user role if they're trying to log in as admin
      if (userType === 'admin' && user.role !== 'admin') {
        messageEl.textContent = 'You do not have admin privileges.';
        messageEl.className = 'auth-message error';
        return;
      }
      
      // Set current user in localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      // Set session expiration if 'remember me' is not checked
      if (!rememberMe) {
        const expiration = new Date().getTime() + (24 * 60 * 60 * 1000); // 1 day
        localStorage.setItem('sessionExpires', expiration);
      } else {
        localStorage.removeItem('sessionExpires');
      }
      
      // Show success message and redirect
      messageEl.textContent = 'Login successful! Redirecting...';
      messageEl.className = 'auth-message success';
      
      // Redirect to dashboard after short delay
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    });
  }
  
  // Registration form functionality
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('register-name').value;
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;
      const confirmPassword = document.getElementById('register-confirm-password').value;
      const termsChecked = document.getElementById('terms-checkbox').checked;
      
      // Get message element
      const messageEl = document.getElementById('register-message');
      
      // Validate form
      if (!termsChecked) {
        messageEl.textContent = 'Please accept the terms and conditions.';
        messageEl.className = 'auth-message error';
        return;
      }
      
      if (password !== confirmPassword) {
        messageEl.textContent = 'Passwords do not match.';
        messageEl.className = 'auth-message error';
        return;
      }
      
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users')) || [];
      
      // Check if email already exists
      if (users.some(user => user.email === email)) {
        messageEl.textContent = 'Email already registered.';
        messageEl.className = 'auth-message error';
        return;
      }
      
      // Create new user object (all new registrations are regular users, not admins)
      const newUser = {
        name,
        email,
        password,
        role: 'user', // Default role is 'user'
        joinDate: new Date().toISOString()
      };
      
      // Add user to array and save to localStorage
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Show success message
      messageEl.textContent = 'Registration successful! You can now log in.';
      messageEl.className = 'auth-message success';
      
      // Reset form and show login tab after delay
      setTimeout(() => {
        registerForm.reset();
        document.querySelector('.tab-btn[data-tab="login"]').click();
      }, 2000);
    });
  }
  
  // Terms and conditions modal
  if (termsLink && termsModal) {
    termsLink.addEventListener('click', (e) => {
      e.preventDefault();
      termsModal.style.display = 'block';
    });
    
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        termsModal.style.display = 'none';
      });
    }
    
    if (acceptTermsBtn) {
      acceptTermsBtn.addEventListener('click', () => {
        document.getElementById('terms-checkbox').checked = true;
        termsModal.style.display = 'none';
      });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
      if (e.target === termsModal) {
        termsModal.style.display = 'none';
      }
    });
  }
  
  // Check auth status function
  function checkAuthStatus() {
    const currentUser = localStorage.getItem('currentUser');
    const sessionExpires = localStorage.getItem('sessionExpires');
    
    // Check if session has expired
    if (sessionExpires && new Date().getTime() > parseInt(sessionExpires)) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('sessionExpires');
      return;
    }
    
    // If user is logged in, redirect to dashboard
    if (currentUser && window.location.pathname.includes('auth.html')) {
      window.location.href = 'dashboard.html';
    }
  }
});

// Logout function (can be called from other scripts)
function logout() {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('sessionExpires');
  window.location.href = 'index.html';
}
