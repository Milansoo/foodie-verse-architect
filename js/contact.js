
// Contact Form Handling
document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('form-message');
  
  // Handle contact form submission
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form values
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value;
      
      // Validate form (basic validation)
      if (!name || !email || !subject || !message) {
        showMessage('Please fill in all required fields.', 'error');
        return;
      }
      
      // Simulate form submission (in a real app, this would send data to a server)
      // For now, we'll just show a success message and reset the form
      showMessage('Your message has been sent successfully! We will get back to you soon.', 'success');
      contactForm.reset();
      
      // In a real application, you would submit the form data to a server here
    });
  }
  
  // Show message function
  function showMessage(text, type) {
    if (!formMessage) return;
    
    formMessage.textContent = text;
    formMessage.className = type === 'error' ? 'error' : 'success';
    formMessage.classList.remove('hidden');
    
    // Scroll to message
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Hide message after 5 seconds
    setTimeout(() => {
      formMessage.classList.add('hidden');
    }, 5000);
  }
});
