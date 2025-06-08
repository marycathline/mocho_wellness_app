document.addEventListener('DOMContentLoaded', function() {
  // Dropdown toggle functionality
  window.toggleDropdown = function(dropdownId) {
    document.getElementById(dropdownId).classList.toggle('show');
    
    // Close other dropdowns
    const dropdowns = document.getElementsByClassName('dropdown-content');
    for (let i = 0; i < dropdowns.length; i++) {
      const openDropdown = dropdowns[i];
      if (openDropdown.id !== dropdownId && openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  };
  
  // Close the dropdown when clicking outside
  window.addEventListener('click', function(event) {
    if (!event.target.matches('.dropdown button')) {
      const dropdowns = document.getElementsByClassName('dropdown-content');
      for (let i = 0; i < dropdowns.length; i++) {
        const openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  });
  
  // Mobile menu toggle (for responsive design)
  const mobileMenuToggle = document.createElement('button');
  mobileMenuToggle.innerText = '☰ Menu';
  mobileMenuToggle.classList.add('mobile-menu-toggle', 'd-lg-none', 'btn', 'btn-outline-primary', 'mb-3');
  
  const nav = document.querySelector('.nav');
  if (nav) {
    const navUl = nav.querySelector('ul');
    nav.insertBefore(mobileMenuToggle, navUl);
    
    mobileMenuToggle.addEventListener('click', function() {
      navUl.classList.toggle('show-mobile');
      
      if (navUl.classList.contains('show-mobile')) {
        mobileMenuToggle.innerText = '✕ Close';
      } else {
        mobileMenuToggle.innerText = '☰ Menu';
      }
    });
  }

  // Initialize tooltips everywhere
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
  
  // Initialize popovers
  const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
  popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });
  
  // Smooth scrolling for anchor links
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
  
  // Add active class to current navigation item
  const currentPage = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav a');
  
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage || 
        (currentPage.includes(link.getAttribute('href')) && link.getAttribute('href') !== '#' && link.getAttribute('href') !== '/')) {
      link.classList.add('active');
      
      // If it's in a dropdown, also highlight the dropdown button
      const parentDropdown = link.closest('.dropdown');
      if (parentDropdown) {
        const dropdownButton = parentDropdown.querySelector('button');
        if (dropdownButton) {
          dropdownButton.classList.add('active');
        }
      }
    }
  });
});
