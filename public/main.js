document.addEventListener('DOMContentLoaded', function() {
  // Toggle dropdown function
  window.toggleDropdown = function(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    const dropdowns = document.getElementsByClassName('dropdown-content');
    
    // Close all other open dropdowns
    for (let i = 0; i < dropdowns.length; i++) {
      if (dropdowns[i].id !== dropdownId && dropdowns[i].classList.contains('show')) {
        dropdowns[i].classList.remove('show');
      }
    }
    
    // Toggle this dropdown
    dropdown.classList.toggle('show');
  };
  
  // Close dropdowns when clicking outside
  window.addEventListener('click', function(event) {
    if (!event.target.matches('.dropdown button')) {
      const dropdowns = document.getElementsByClassName('dropdown-content');
      for (let i = 0; i < dropdowns.length; i++) {
        if (dropdowns[i].classList.contains('show')) {
          dropdowns[i].classList.remove('show');
        }
      }
    }
  });
  
  // Mobile menu toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
      const navMenu = document.querySelector('.nav ul');
      navMenu.classList.toggle('active');
      mobileMenuToggle.classList.toggle('active');
    });
  }
  
  // Automatically initialize any tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
  
  // Automatically initialize any popovers
  const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
  popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
});
