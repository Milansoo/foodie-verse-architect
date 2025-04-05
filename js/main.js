
// Theme Switcher
document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme from local storage or default to light
  const savedTheme = localStorage.getItem('theme') || 'light';
  const themeToggle = document.getElementById('theme-toggle');
  
  // Apply the saved theme
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    if (themeToggle) themeToggle.checked = true;
  }
  
  // Toggle theme when switch is clicked
  if (themeToggle) {
    themeToggle.addEventListener('change', () => {
      if (themeToggle.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
      }
    });
  }
  
  // Mobile Navigation
  const hamburger = document.querySelector('.hamburger-menu');
  const navbar = document.getElementById('navbar');
  
  if (hamburger && navbar) {
    hamburger.addEventListener('click', () => {
      navbar.classList.toggle('active');
    });
  }
  
  // Account Dropdown for Mobile
  const accountDropdown = document.getElementById('account-dropdown');
  const accountLink = document.getElementById('account-link');
  
  if (accountDropdown && accountLink) {
    accountDropdown.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        accountLink.classList.toggle('active');
      }
    });
  }
  
  // Testimonial Slider
  const testimonials = document.querySelectorAll('.testimonial');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  
  if (testimonials.length > 0 && dots.length > 0) {
    // Function to show a specific slide
    function showSlide(index) {
      testimonials.forEach(testimonial => testimonial.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      
      testimonials[index].classList.add('active');
      dots[index].classList.add('active');
      currentSlide = index;
    }
    
    // Function to show the next slide
    function nextSlide() {
      currentSlide++;
      if (currentSlide >= testimonials.length) {
        currentSlide = 0;
      }
      showSlide(currentSlide);
    }
    
    // Click event for dots
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showSlide(index);
      });
    });
    
    // Auto-advance the slider every 5 seconds
    setInterval(nextSlide, 5000);
  }
  
  // Prevents the dropdown menu from closing when clicked inside
  document.querySelectorAll('.dropdown-menu').forEach(dropdown => {
    dropdown.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navbar && navbar.classList.contains('active')) {
      if (!navbar.contains(e.target) && !hamburger.contains(e.target)) {
        navbar.classList.remove('active');
      }
    }
    
    if (accountLink && accountLink.classList.contains('active')) {
      if (!accountLink.contains(e.target)) {
        accountLink.classList.remove('active');
      }
    }
  });
});
