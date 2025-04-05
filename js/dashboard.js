
// Dashboard Functionality
document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const userInfo = document.getElementById('user-info');
  const menuItems = document.querySelectorAll('.menu-item');
  const dashboardSections = document.querySelectorAll('.dashboard-section');
  
  const profileForm = document.getElementById('profile-form');
  const passwordForm = document.getElementById('change-password-form');
  const menuItemForm = document.getElementById('menu-item-form');
  const userOrdersList = document.getElementById('user-orders-list');
  
  const menuItemsTableBody = document.getElementById('menu-items-table-body');
  const ordersTableBody = document.getElementById('orders-table-body');
  const usersTableBody = document.getElementById('users-table-body');
  
  const menuItemModal = document.getElementById('menu-item-modal');
  const orderDetailModal = document.getElementById('order-detail-modal');
  const deleteConfirmationModal = document.getElementById('delete-confirmation-modal');
  
  const addMenuItemBtn = document.getElementById('add-menu-item-btn');
  const closeButtons = document.querySelectorAll('.close-button');
  const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
  const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
  
  // Profile elements
  const profileName = document.getElementById('profile-name');
  const profileEmail = document.getElementById('profile-email');
  const profilePhone = document.getElementById('profile-phone');
  const profileAddress = document.getElementById('profile-address');
  
  // Check if user is logged in and redirect if not
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) {
    window.location.href = 'auth.html';
    return;
  }
  
  // Setup dashboard based on user role
  setupDashboard(currentUser);
  
  // Display User Info
  function displayUserInfo(user) {
    if (userInfo) {
      // Create initial letter avatar
      const initial = user.name.charAt(0).toUpperCase();
      
      userInfo.innerHTML = `
        <div class="user-avatar">${initial}</div>
        <div class="user-name">${user.name}</div>
        <div class="user-role">${user.role}</div>
      `;
    }
  }
  
  // Setup dashboard based on user role
  function setupDashboard(user) {
    // Display user info
    displayUserInfo(user);
    
    // Show/hide admin-only or user-only elements
    const adminOnlyElements = document.querySelectorAll('.admin-only');
    const userOnlyElements = document.querySelectorAll('.user-only');
    
    if (user.role === 'admin') {
      adminOnlyElements.forEach(el => el.style.display = 'block');
      userOnlyElements.forEach(el => el.style.display = 'none');
    } else {
      adminOnlyElements.forEach(el => el.style.display = 'none');
      userOnlyElements.forEach(el => el.style.display = 'block');
    }
    
    // Load profile data
    loadProfileData(user);
    
    // Load section data based on role
    if (user.role === 'admin') {
      loadMenuItems();
      loadOrders();
      loadUsers();
    } else {
      loadUserOrders(user.email);
    }
  }
  
  // Load profile data
  function loadProfileData(user) {
    if (profileName && profileEmail) {
      profileName.value = user.name || '';
      profileEmail.value = user.email || '';
      profilePhone.value = user.phone || '';
      profileAddress.value = user.address || '';
    }
  }
  
  // Load menu items for admin
  function loadMenuItems() {
    if (!menuItemsTableBody) return;
    
    const menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
    menuItemsTableBody.innerHTML = '';
    
    menuItems.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>
          <div class="item-image" style="background-image: url('${item.image || 'https://via.placeholder.com/100x100?text=No+Image'}');"></div>
        </td>
        <td>${item.name}</td>
        <td>${capitalizeFirstLetter(item.category)}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td class="item-actions">
          <button class="action-btn edit-btn" data-id="${item.id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete-btn" data-id="${item.id}" data-name="${item.name}">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>
      `;
      
      menuItemsTableBody.appendChild(row);
    });
    
    // Add event listeners
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', editMenuItem);
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', confirmDeleteMenuItem);
    });
  }
  
  // Filter menu items by category
  document.querySelectorAll('.menu-categories-filter .category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      document.querySelectorAll('.menu-categories-filter .category-btn').forEach(b => {
        b.classList.remove('active');
      });
      
      // Add active class to clicked button
      btn.classList.add('active');
      
      const category = btn.getAttribute('data-category');
      filterMenuItems(category);
    });
  });
  
  function filterMenuItems(category) {
    if (!menuItemsTableBody) return;
    
    const menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
    menuItemsTableBody.innerHTML = '';
    
    const filteredItems = category === 'all' 
      ? menuItems 
      : menuItems.filter(item => item.category === category);
    
    filteredItems.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>
          <div class="item-image" style="background-image: url('${item.image || 'https://via.placeholder.com/100x100?text=No+Image'}');"></div>
        </td>
        <td>${item.name}</td>
        <td>${capitalizeFirstLetter(item.category)}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td class="item-actions">
          <button class="action-btn edit-btn" data-id="${item.id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete-btn" data-id="${item.id}" data-name="${item.name}">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>
      `;
      
      menuItemsTableBody.appendChild(row);
    });
    
    // Add event listeners
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', editMenuItem);
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', confirmDeleteMenuItem);
    });
  }
  
  // Load orders for admin
  function loadOrders() {
    if (!ordersTableBody) return;
    
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    ordersTableBody.innerHTML = '';
    
    // Sort orders by date (newest first)
    orders.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    orders.forEach(order => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${order.id}</td>
        <td>${order.userName}</td>
        <td>${formatDate(order.date)}</td>
        <td>$${order.total.toFixed(2)}</td>
        <td><span class="order-status status-${order.status}">${capitalizeFirstLetter(order.status)}</span></td>
        <td class="order-actions">
          <button class="action-btn view-btn" data-id="${order.id}">
            <i class="fas fa-eye"></i>
          </button>
        </td>
      `;
      
      ordersTableBody.appendChild(row);
    });
    
    // Add event listeners
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', viewOrderDetails);
    });
  }
  
  // Load users for admin
  function loadUsers() {
    if (!usersTableBody) return;
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    usersTableBody.innerHTML = '';
    
    users.forEach(user => {
      const row = document.createElement('tr');
      const joinDate = user.joinDate ? formatDate(user.joinDate) : 'N/A';
      
      row.innerHTML = `
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${capitalizeFirstLetter(user.role)}</td>
        <td>${joinDate}</td>
        <td class="user-actions">
          ${user.role !== 'admin' ? `
            <button class="action-btn delete-btn" data-email="${user.email}" data-name="${user.name}">
              <i class="fas fa-trash-alt"></i>
            </button>
          ` : ''}
        </td>
      `;
      
      usersTableBody.appendChild(row);
    });
    
    // Add event listeners
    document.querySelectorAll('.user-actions .delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const email = btn.getAttribute('data-email');
        const name = btn.getAttribute('data-name');
        
        // Show confirmation modal
        deleteConfirmationModal.style.display = 'block';
        document.getElementById('delete-confirmation-message').textContent = `Are you sure you want to delete the user ${name}?`;
        
        // Set data attribute for confirm delete button
        confirmDeleteBtn.setAttribute('data-type', 'user');
        confirmDeleteBtn.setAttribute('data-id', email);
      });
    });
  }
  
  // Load user orders
  function loadUserOrders(userEmail) {
    if (!userOrdersList) return;
    
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const userOrders = orders.filter(order => order.userId === userEmail);
    
    if (userOrders.length === 0) {
      userOrdersList.innerHTML = '<div class="loading">You haven\'t placed any orders yet.</div>';
      return;
    }
    
    userOrdersList.innerHTML = '';
    
    // Sort orders by date (newest first)
    userOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    userOrders.forEach(order => {
      const orderCard = document.createElement('div');
      orderCard.className = 'order-card';
      
      let itemsList = '';
      order.items.forEach(item => {
        itemsList += `
          <div class="order-item">
            <div class="order-item-name">${item.name}</div>
            <div class="order-item-quantity">x${item.quantity}</div>
            <div class="order-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
          </div>
        `;
      });
      
      orderCard.innerHTML = `
        <div class="order-header">
          <div class="order-id">${order.id}</div>
          <div class="order-date">${formatDate(order.date)}</div>
        </div>
        <div class="order-items">
          ${itemsList}
        </div>
        <div class="order-footer">
          <div class="order-total">Total: $${order.total.toFixed(2)}</div>
          <div class="order-status status-${order.status}">${capitalizeFirstLetter(order.status)}</div>
        </div>
      `;
      
      userOrdersList.appendChild(orderCard);
    });
  }
  
  // Add new menu item modal
  if (addMenuItemBtn && menuItemModal) {
    addMenuItemBtn.addEventListener('click', () => {
      // Reset form
      document.getElementById('menu-modal-title').textContent = 'Add Menu Item';
      document.getElementById('menu-item-id').value = '';
      document.getElementById('menu-item-form').reset();
      document.getElementById('menu-item-message').textContent = '';
      
      // Show modal
      menuItemModal.style.display = 'block';
    });
  }
  
  // Close modal buttons
  if (closeButtons) {
    closeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        if (modal) modal.style.display = 'none';
      });
    });
  }
  
  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      e.target.style.display = 'none';
    }
  });
  
  // Handle menu item form submission
  if (menuItemForm) {
    menuItemForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form values
      const itemId = document.getElementById('menu-item-id').value;
      const name = document.getElementById('menu-item-name').value;
      const category = document.getElementById('menu-item-category').value;
      const price = parseFloat(document.getElementById('menu-item-price').value);
      const description = document.getElementById('menu-item-description').value;
      const image = document.getElementById('menu-item-image').value;
      
      // Get menu items from storage
      const menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
      
      // Check if editing or adding
      if (itemId) {
        // Edit existing item
        const itemIndex = menuItems.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
          menuItems[itemIndex] = {
            ...menuItems[itemIndex],
            name,
            category,
            price,
            description,
            image: image || menuItems[itemIndex].image
          };
        }
      } else {
        // Add new item
        const newItem = {
          id: generateId(),
          name,
          category,
          price,
          description,
          image: image || `https://via.placeholder.com/500x300?text=${encodeURIComponent(name)}`
        };
        menuItems.push(newItem);
      }
      
      // Save to local storage
      localStorage.setItem('menuItems', JSON.stringify(menuItems));
      
      // Show success message
      const messageEl = document.getElementById('menu-item-message');
      messageEl.textContent = `Menu item ${itemId ? 'updated' : 'added'} successfully!`;
      messageEl.className = 'message success';
      
      // Reload menu items and close modal after a delay
      setTimeout(() => {
        loadMenuItems();
        menuItemModal.style.display = 'none';
      }, 1500);
    });
  }
  
  // Handle profile form submission
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form values
      const name = profileName.value;
      const phone = profilePhone.value;
      const address = profileAddress.value;
      
      // Update current user
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      currentUser.name = name;
      currentUser.phone = phone;
      currentUser.address = address;
      
      // Update user in users array
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const userIndex = users.findIndex(user => user.email === currentUser.email);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], name, phone, address };
        localStorage.setItem('users', JSON.stringify(users));
      }
      
      // Update current user in storage
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      
      // Update display
      displayUserInfo(currentUser);
      
      // Show success message
      const messageEl = document.getElementById('profile-message');
      messageEl.textContent = 'Profile updated successfully!';
      messageEl.className = 'message success';
      
      // Clear message after delay
      setTimeout(() => {
        messageEl.textContent = '';
      }, 3000);
    });
  }
  
  // Handle password change form
  if (passwordForm) {
    passwordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form values
      const currentPassword = document.getElementById('current-password').value;
      const newPassword = document.getElementById('new-password').value;
      const confirmNewPassword = document.getElementById('confirm-new-password').value;
      
      // Get message element
      const messageEl = document.getElementById('password-message');
      
      // Check if current password is correct
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const userIndex = users.findIndex(user => user.email === currentUser.email);
      
      if (userIndex === -1) {
        messageEl.textContent = 'User not found. Please log in again.';
        messageEl.className = 'message error';
        return;
      }
      
      if (users[userIndex].password !== currentPassword) {
        messageEl.textContent = 'Current password is incorrect.';
        messageEl.className = 'message error';
        return;
      }
      
      // Check if new passwords match
      if (newPassword !== confirmNewPassword) {
        messageEl.textContent = 'New passwords do not match.';
        messageEl.className = 'message error';
        return;
      }
      
      // Update password
      users[userIndex].password = newPassword;
      localStorage.setItem('users', JSON.stringify(users));
      
      // Show success message
      messageEl.textContent = 'Password changed successfully!';
      messageEl.className = 'message success';
      
      // Reset form
      passwordForm.reset();
      
      // Clear message after delay
      setTimeout(() => {
        messageEl.textContent = '';
      }, 3000);
    });
  }
  
  // Edit menu item
  function editMenuItem(e) {
    const itemId = e.currentTarget.getAttribute('data-id');
    const menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
    const item = menuItems.find(item => item.id === itemId);
    
    if (item) {
      // Fill modal with item data
      document.getElementById('menu-modal-title').textContent = 'Edit Menu Item';
      document.getElementById('menu-item-id').value = item.id;
      document.getElementById('menu-item-name').value = item.name;
      document.getElementById('menu-item-category').value = item.category;
      document.getElementById('menu-item-price').value = item.price;
      document.getElementById('menu-item-description').value = item.description;
      document.getElementById('menu-item-image').value = item.image || '';
      
      // Show modal
      menuItemModal.style.display = 'block';
    }
  }
  
  // Confirm delete menu item
  function confirmDeleteMenuItem(e) {
    const itemId = e.currentTarget.getAttribute('data-id');
    const itemName = e.currentTarget.getAttribute('data-name');
    
    // Show confirmation modal
    deleteConfirmationModal.style.display = 'block';
    document.getElementById('delete-confirmation-message').textContent = `Are you sure you want to delete the menu item "${itemName}"?`;
    
    // Set data attribute for confirm delete button
    confirmDeleteBtn.setAttribute('data-type', 'menuItem');
    confirmDeleteBtn.setAttribute('data-id', itemId);
  }
  
  // Handle delete confirmation
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', () => {
      const type = confirmDeleteBtn.getAttribute('data-type');
      const id = confirmDeleteBtn.getAttribute('data-id');
      
      if (type === 'menuItem') {
        deleteMenuItem(id);
      } else if (type === 'user') {
        deleteUser(id);
      }
      
      // Hide modal
      deleteConfirmationModal.style.display = 'none';
    });
  }
  
  // Cancel delete
  if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener('click', () => {
      deleteConfirmationModal.style.display = 'none';
    });
  }
  
  // Delete menu item
  function deleteMenuItem(itemId) {
    let menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
    menuItems = menuItems.filter(item => item.id !== itemId);
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
    
    // Reload menu items
    loadMenuItems();
  }
  
  // Delete user
  function deleteUser(email) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users = users.filter(user => user.email !== email);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Reload users
    loadUsers();
  }
  
  // View order details
  function viewOrderDetails(e) {
    const orderId = e.currentTarget.getAttribute('data-id');
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(order => order.id === orderId);
    
    if (order && orderDetailModal) {
      // Create order detail content
      let itemsList = '';
      order.items.forEach(item => {
        itemsList += `
          <div class="order-detail-item">
            <div class="order-detail-item-image" style="background-image: url('${item.image || 'https://via.placeholder.com/50x50?text=No+Image'}');"></div>
            <div>${item.name}</div>
            <div>x${item.quantity}</div>
            <div>$${(item.price * item.quantity).toFixed(2)}</div>
          </div>
        `;
      });
      
      const orderDetailContent = document.getElementById('order-detail-content');
      orderDetailContent.innerHTML = `
        <div class="order-detail-header">
          <h3>Order #${order.id}</h3>
          <div>${formatDate(order.date)}</div>
        </div>
        
        <div class="order-detail-info">
          <p><strong>Customer:</strong> ${order.userName}</p>
          <p><strong>Email:</strong> ${order.userId}</p>
        </div>
        
        <div class="order-detail-status">
          <div><strong>Status:</strong></div>
          <select id="order-status-change">
            <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
            <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
            <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
          <button id="update-status-btn" class="btn-primary" data-id="${order.id}">Update Status</button>
        </div>
        
        <h4>Order Items</h4>
        <div class="order-detail-items">
          ${itemsList}
        </div>
        
        <div class="order-detail-total">
          Total: $${order.total.toFixed(2)}
        </div>
      `;
      
      // Show modal
      orderDetailModal.style.display = 'block';
      
      // Add event listener to update status button
      const updateStatusBtn = document.getElementById('update-status-btn');
      if (updateStatusBtn) {
        updateStatusBtn.addEventListener('click', updateOrderStatus);
      }
    }
  }
  
  // Update order status
  function updateOrderStatus(e) {
    const orderId = e.currentTarget.getAttribute('data-id');
    const newStatus = document.getElementById('order-status-change').value;
    
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex !== -1) {
      orders[orderIndex].status = newStatus;
      localStorage.setItem('orders', JSON.stringify(orders));
      
      // Show notification
      alert(`Order status updated to ${capitalizeFirstLetter(newStatus)}`);
      
      // Close modal and reload orders
      orderDetailModal.style.display = 'none';
      loadOrders();
    }
  }
  
  // Dashboard navigation
  if (menuItems && dashboardSections) {
    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        const sectionId = item.getAttribute('data-section');
        
        // Check if this section should be visible for user role
        if ((currentUser.role !== 'admin' && item.classList.contains('admin-only')) ||
            (currentUser.role === 'admin' && item.classList.contains('user-only'))) {
          return;
        }
        
        // Remove active class from all menu items and sections
        menuItems.forEach(i => i.classList.remove('active'));
        dashboardSections.forEach(s => s.classList.remove('active'));
        
        // Add active class to clicked item and corresponding section
        item.classList.add('active');
        document.getElementById(`${sectionId}-section`).classList.add('active');
      });
    });
  }
  
  // Filter orders by status
  const orderStatusFilter = document.getElementById('order-status-filter');
  if (orderStatusFilter) {
    orderStatusFilter.addEventListener('change', filterOrders);
  }
  
  // Filter orders by date
  const orderDateFilter = document.getElementById('order-date-filter');
  if (orderDateFilter) {
    orderDateFilter.addEventListener('change', filterOrders);
  }
  
  // Clear filters button
  const clearFiltersBtn = document.getElementById('clear-filters-btn');
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      if (orderStatusFilter) orderStatusFilter.value = 'all';
      if (orderDateFilter) orderDateFilter.value = '';
      loadOrders();
    });
  }
  
  // Filter orders
  function filterOrders() {
    if (!ordersTableBody) return;
    
    const statusFilter = orderStatusFilter.value;
    const dateFilter = orderDateFilter.value;
    
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Filter by status
    if (statusFilter !== 'all') {
      orders = orders.filter(order => order.status === statusFilter);
    }
    
    // Filter by date
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filterDate.setHours(0, 0, 0, 0);
      
      orders = orders.filter(order => {
        const orderDate = new Date(order.date);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() === filterDate.getTime();
      });
    }
    
    // Update orders table
    ordersTableBody.innerHTML = '';
    
    if (orders.length === 0) {
      const row = document.createElement('tr');
      row.innerHTML = '<td colspan="6" class="loading">No orders found matching the filters.</td>';
      ordersTableBody.appendChild(row);
      return;
    }
    
    orders.forEach(order => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${order.id}</td>
        <td>${order.userName}</td>
        <td>${formatDate(order.date)}</td>
        <td>$${order.total.toFixed(2)}</td>
        <td><span class="order-status status-${order.status}">${capitalizeFirstLetter(order.status)}</span></td>
        <td class="order-actions">
          <button class="action-btn view-btn" data-id="${order.id}">
            <i class="fas fa-eye"></i>
          </button>
        </td>
      `;
      
      ordersTableBody.appendChild(row);
    });
    
    // Add event listeners
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', viewOrderDetails);
    });
  }
  
  // Helper Functions
  // Format date
  function formatDate(dateString) {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }
  
  // Capitalize first letter
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  // Generate unique ID
  function generateId() {
    return Math.random().toString(36).substring(2, 9);
  }
});
