
// Authentication and User Management
document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const loginLink = document.getElementById('login-link');
  const accountLink = document.getElementById('account-link');
  const logoutBtn = document.getElementById('logout-btn');
  const dashboardLink = document.getElementById('dashboard-link');
  
  // Auth Form Elements
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const loginMessage = document.getElementById('login-message');
  const registerMessage = document.getElementById('register-message');
  
  // Auth Modal Elements
  const termsModal = document.getElementById('terms-modal');
  const showTermsBtn = document.getElementById('show-terms');
  const acceptTermsBtn = document.getElementById('accept-terms');
  const closeModalBtn = document.querySelector('.close-button');
  const termsCheckbox = document.getElementById('terms');
  
  // Auth Tab Elements
  const tabBtns = document.querySelectorAll('.tab-btn');
  const authForms = document.querySelectorAll('.auth-form');
  
  // Password Toggle Elements
  const togglePasswordBtns = document.querySelectorAll('.toggle-password');
  
  // Sample admin user for testing
  const adminUser = {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  };
  
  // Initialize local storage with admin user if it doesn't exist
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([adminUser]));
  }
  
  // Check if the user is logged in
  function checkAuthStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
      // User is logged in
      if (loginLink) loginLink.classList.add('hidden');
      if (accountLink) accountLink.classList.remove('hidden');
      
      // Set dashboard link based on user role
      if (dashboardLink && currentUser.role === 'admin') {
        dashboardLink.innerHTML = '<a href="dashboard.html">Admin Dashboard</a>';
      } else if (dashboardLink) {
        dashboardLink.innerHTML = '<a href="dashboard.html">My Account</a>';
      }
      
      // Show order cart on menu page for regular users
      const orderCart = document.getElementById('order-cart');
      if (orderCart && currentUser.role === 'user') {
        orderCart.classList.remove('hidden');
      }
      
      return true;
    } else {
      // User is not logged in
      if (loginLink) loginLink.classList.remove('hidden');
      if (accountLink) accountLink.classList.add('hidden');
      return false;
    }
  }
  
  // Register a new user
  function registerUser(name, email, password) {
    // Get existing users
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if email already exists
    const userExists = users.some(user => user.email === email);
    if (userExists) {
      return {
        success: false,
        message: 'A user with this email already exists'
      };
    }
    
    // Create new user with 'user' role
    const newUser = {
      name,
      email,
      password, // In a real app, this would be hashed
      role: 'user',
      joinDate: new Date().toISOString()
    };
    
    // Add user to storage
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    return {
      success: true,
      message: 'Registration successful! You can now log in.'
    };
  }
  
  // Login user
  function loginUser(email, password, remember = false) {
    // Get users from local storage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find user by email and password
    const user = users.find(user => user.email === email && user.password === password);
    
    if (user) {
      // Store user info (without password) in local storage
      const { password, ...userWithoutPassword } = user;
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      
      // If remember me is checked, store email in local storage
      if (remember) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      return {
        success: true,
        message: 'Login successful!',
        user: userWithoutPassword
      };
    } else {
      return {
        success: false,
        message: 'Invalid email or password'
      };
    }
  }
  
  // Logout user
  function logoutUser() {
    localStorage.removeItem('currentUser');
    checkAuthStatus();
    window.location.href = 'index.html';
  }
  
  // Auth Event Listeners
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logoutUser();
    });
  }
  
  // Register Form
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('register-name').value;
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;
      const confirmPassword = document.getElementById('register-confirm-password').value;
      const termsAccepted = document.getElementById('terms').checked;
      
      // Validate form
      if (!name || !email || !password || !confirmPassword) {
        registerMessage.textContent = 'Please fill in all fields';
        registerMessage.className = 'auth-message error';
        return;
      }
      
      if (password !== confirmPassword) {
        registerMessage.textContent = 'Passwords do not match';
        registerMessage.className = 'auth-message error';
        return;
      }
      
      if (!termsAccepted) {
        registerMessage.textContent = 'You must accept the terms and conditions';
        registerMessage.className = 'auth-message error';
        return;
      }
      
      // Register user
      const result = registerUser(name, email, password);
      
      if (result.success) {
        registerMessage.textContent = result.message;
        registerMessage.className = 'auth-message success';
        registerForm.reset();
        
        // Switch to login tab after successful registration
        setTimeout(() => {
          tabBtns[0].click();
        }, 2000);
      } else {
        registerMessage.textContent = result.message;
        registerMessage.className = 'auth-message error';
      }
    });
  }
  
  // Login Form
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      const remember = document.getElementById('remember-me').checked;
      
      // Validate form
      if (!email || !password) {
        loginMessage.textContent = 'Please enter both email and password';
        loginMessage.className = 'auth-message error';
        return;
      }
      
      // Login user
      const result = loginUser(email, password, remember);
      
      if (result.success) {
        loginMessage.textContent = result.message;
        loginMessage.className = 'auth-message success';
        
        // Redirect after successful login
        setTimeout(() => {
          if (result.user.role === 'admin') {
            window.location.href = 'dashboard.html';
          } else {
            window.location.href = 'index.html';
          }
        }, 1500);
      } else {
        loginMessage.textContent = result.message;
        loginMessage.className = 'auth-message error';
      }
    });
    
    // Check if there's a remembered email
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      document.getElementById('login-email').value = rememberedEmail;
      document.getElementById('remember-me').checked = true;
    }
  }
  
  // Auth Tab Switching
  if (tabBtns.length > 0) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all tabs and forms
        tabBtns.forEach(b => b.classList.remove('active'));
        authForms.forEach(f => f.classList.remove('active'));
        
        // Add active class to current tab and form
        btn.classList.add('active');
        const formId = btn.getAttribute('data-tab') + '-form';
        document.getElementById(formId).classList.add('active');
        
        // Clear messages when switching tabs
        if (loginMessage) loginMessage.textContent = '';
        if (registerMessage) registerMessage.textContent = '';
      });
    });
  }
  
  // Terms Modal
  if (showTermsBtn && termsModal) {
    showTermsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      termsModal.style.display = 'block';
    });
  }
  
  if (acceptTermsBtn && termsModal && termsCheckbox) {
    acceptTermsBtn.addEventListener('click', () => {
      termsCheckbox.checked = true;
      termsModal.style.display = 'none';
    });
  }
  
  if (closeModalBtn && termsModal) {
    closeModalBtn.addEventListener('click', () => {
      termsModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
      if (e.target === termsModal) {
        termsModal.style.display = 'none';
      }
    });
  }
  
  // Password Toggle
  if (togglePasswordBtns.length > 0) {
    togglePasswordBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.parentElement.querySelector('input');
        const icon = btn.querySelector('i');
        
        if (input.type === 'password') {
          input.type = 'text';
          icon.classList.remove('fa-eye');
          icon.classList.add('fa-eye-slash');
        } else {
          input.type = 'password';
          icon.classList.remove('fa-eye-slash');
          icon.classList.add('fa-eye');
        }
      });
    });
  }
  
  // Check auth status when the page loads
  checkAuthStatus();
});
