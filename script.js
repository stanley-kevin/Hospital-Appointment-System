document.getElementById('year').textContent = new Date().getFullYear();

// Navigation functionality
const menuLinks = document.querySelectorAll('.menu a');
menuLinks.forEach((a) => {
  a.addEventListener('click', (e) => {
    if (a.getAttribute('href')?.startsWith('#')) {
      e.preventDefault();
      const id = a.getAttribute('href').slice(1);
      if (id === 'logout') {
        alert('Logged out successfully!');
        return;
      }
      document.querySelectorAll('.menu a').forEach(x => x.classList.remove('active'));
      a.classList.add('active');
      const el = document.getElementById(id);
      if (el) {
        window.scrollTo({ top: el.offsetTop - 60, behavior: 'smooth' });
      }
      location.hash = id;
    }
  });
});

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.menu');
  
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('open');
    });
  }

  // Set minimum date for appointment booking
  const dateInput = document.getElementById('appointment-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }
});

// Doctor search functionality
const searchCard = document.getElementById('search-card');
const featureSearch = document.getElementById('feature-search');
const featureForm = document.getElementById('feature-search-form');
const doctorForm = document.getElementById('doctor-search');
const doctorsGrid = document.getElementById('doctors-grid');

function toggleFeatureSearch(force) {
  if (!featureSearch) return;
  const willOpen = force !== undefined ? !!force : featureSearch.hasAttribute('hidden');
  if (willOpen) {
    featureSearch.removeAttribute('hidden');
    featureSearch.classList.add('open');
    searchCard && searchCard.setAttribute('aria-expanded', 'true');
  } else {
    featureSearch.classList.remove('open');
    setTimeout(() => {
      if (featureSearch && !featureSearch.classList.contains('open')) {
        featureSearch.setAttribute('hidden', '');
      }
    }, 250);
    searchCard && searchCard.setAttribute('aria-expanded', 'false');
  }
}

if (searchCard) {
  searchCard.addEventListener('click', (e) => {
    if (!e.target.closest('form')) {
      toggleFeatureSearch();
    }
  });
}

if (featureForm) {
  featureForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const dept = document.getElementById('f-dept').value;
    const locVal = document.getElementById('f-location').value;
    
    // Sync with main search form
    document.getElementById('dept').value = dept;
    document.getElementById('location').value = locVal;
    
    toggleFeatureSearch(false);
    window.location.hash = 'doctors';
    setTimeout(() => filterDoctors(), 100);
  });
}

function filterDoctors() {
  const dept = document.getElementById('dept').value.toLowerCase();
  const location = document.getElementById('location').value.toLowerCase();
  const cards = doctorsGrid.querySelectorAll('.doc-card');
  
  cards.forEach(card => {
    const cardDept = card.getAttribute('data-dept').toLowerCase();
    const cardLocation = card.getAttribute('data-location').toLowerCase();
    
    const deptMatch = !dept || cardDept === dept;
    const locationMatch = !location || cardLocation.includes(location);
    
    card.style.display = (deptMatch && locationMatch) ? 'flex' : 'none';
  });
}

if (doctorForm) {
  doctorForm.addEventListener('submit', (e) => {
    e.preventDefault();
    filterDoctors();
  });
  
  doctorForm.addEventListener('reset', () => {
    setTimeout(filterDoctors, 0);
  });
  
  document.getElementById('dept').addEventListener('change', filterDoctors);
  document.getElementById('location').addEventListener('input', filterDoctors);
}

// Booking modal functionality
const bookingModal = document.getElementById('booking-modal');
const successModal = document.getElementById('success-modal');
const bookingForm = document.getElementById('booking-form');
const heroBookBtn = document.getElementById('hero-book-btn');
let lastFocused;

function openBookingModal(doctorName = '', specialty = '') {
  document.getElementById('selected-doctor').value = doctorName || 'Select a doctor';
  bookingModal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  lastFocused = document.activeElement;
  setTimeout(() => {
    const firstInput = document.getElementById('appointment-date');
    if (firstInput) firstInput.focus();
  }, 0);
}

function closeBookingModal() {
  bookingModal.setAttribute('hidden', '');
  document.body.style.overflow = '';
  bookingForm.reset();
}

function showSuccessModal() {
  closeBookingModal();
  successModal.removeAttribute('hidden');
}

function closeSuccessModal() {
  successModal.setAttribute('hidden', '');
  document.body.style.overflow = '';
  if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
}

// Event listeners for booking
if (heroBookBtn) {
  heroBookBtn.addEventListener('click', () => openBookingModal());
}

document.querySelectorAll('.book-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const doctorName = btn.getAttribute('data-doctor');
    const specialty = btn.getAttribute('data-specialty');
    openBookingModal(doctorName, specialty);
  });
});

document.getElementById('cancel-booking').addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  closeBookingModal();
});
document.querySelector('.modal-close').addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  closeBookingModal();
});
document.getElementById('success-ok').addEventListener('click', closeSuccessModal);

// Close modal when clicking overlay
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    closeBookingModal();
    closeSuccessModal();
  }
});

// Prevent modal content clicks from closing modal
document.addEventListener('click', (e) => {
  if (e.target.closest('.modal-content')) {
    e.stopPropagation();
  }
});

// Booking form submission
if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    if (submitBtn) { submitBtn.classList.add('loading'); submitBtn.setAttribute('disabled','disabled'); }
    Array.from(bookingForm.elements).forEach(el=>{ try{ el.disabled = true; }catch(_){} });

    const formData = new FormData(bookingForm);
    const appointmentData = {
      doctor: document.getElementById('selected-doctor').value,
      date: document.getElementById('appointment-date').value,
      time: document.getElementById('appointment-time').value,
      patientName: document.getElementById('patient-name').value,
      phone: document.getElementById('patient-phone').value,
      reason: document.getElementById('appointment-reason').value
    };
    
    // Simulate booking process
    setTimeout(() => {
      showSuccessModal();
      console.log('Appointment booked:', appointmentData);
      if (submitBtn) { submitBtn.classList.remove('loading'); submitBtn.removeAttribute('disabled'); }
      Array.from(bookingForm.elements).forEach(el=>{ try{ el.disabled = false; }catch(_){} });
    }, 1000);
  });
}

// ESC to close modals
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape'){
    if (successModal && !successModal.hasAttribute('hidden')) closeSuccessModal();
    else if (bookingModal && !bookingModal.hasAttribute('hidden')) closeBookingModal();
  }
});

// Appointment management functions
function showAppointmentDetails() {
  alert('Appointment Details:\nDoctor: Dr. Sarah Sharma\nDate: June 25, 2024\nTime: 10:00 AM\nStatus: Confirmed');
}

function rescheduleAppointment(id) {
  const newDate = prompt('Enter new date (YYYY-MM-DD):');
  const newTime = prompt('Enter new time (HH:MM):');
  
  if (newDate && newTime) {
    alert(`Appointment ${id} rescheduled to ${newDate} at ${newTime}`);
  }
}

function cancelAppointment(id) {
  if (confirm('Are you sure you want to cancel this appointment?')) {
    alert(`Appointment ${id} has been cancelled.`);
  }
}

// Admin functions
function adminAction(action) {
  const actions = {
    'manage-doctors': 'Opening Doctor Management Panel...',
    'manage-users': 'Opening User Management Panel...',
    'add-doctor': 'Opening Add Doctor Form...',
    'approve-appointments': 'Opening Appointment Approval Panel...',
    'manage-departments': 'Opening Department Management...',
    'view-reports': 'Generating Reports...'
  };
  
  alert(actions[action] || 'Feature coming soon!');
}

// Admin button event listeners
document.querySelectorAll('.admin-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.getAttribute('data-action');
    adminAction(action);
  });
});

// Hash navigation
function navigateToHash() {
  const hash = window.location.hash?.replace('#', '');
  if (!hash) return;
  
  const target = document.getElementById(hash);
  if (target) {
    document.querySelectorAll('.menu a').forEach(x => {
      const href = x.getAttribute('href') || '';
      x.classList.toggle('active', href === `#${hash}`);
    });
    window.scrollTo({ top: target.offsetTop - 60, behavior: 'smooth' });
  }
}

window.addEventListener('DOMContentLoaded', navigateToHash);
window.addEventListener('hashchange', navigateToHash);

// Smooth animations for interactive elements
document.querySelectorAll('.interactive-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-4px)';
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0)';
  });
});

// Auto-update stats (demo)
function updateStats() {
  const statNumbers = document.querySelectorAll('.stat-number');
  statNumbers.forEach(stat => {
    const current = parseInt(stat.textContent);
    const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
    if (current + change > 0) {
      stat.textContent = current + change;
    }
  });
}

// Update stats every 30 seconds (demo)
setInterval(updateStats, 30000);

console.log('Hospital Management System loaded successfully!');
// Enhanced scroll animations
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.card, .doc-card, .appointment-card').forEach(el => {
    el.classList.add('scroll-reveal');
    observer.observe(el);
  });
}

// Particle effect for hero section
function createParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: absolute;
      width: 4px;
      height: 4px;
      background: rgba(102,126,234,0.3);
      border-radius: 50%;
      pointer-events: none;
      animation: floatParticle ${5 + Math.random() * 10}s infinite linear;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
    `;
    hero.appendChild(particle);
  }
}

// Add CSS for particle animation
const particleStyle = document.createElement('style');
particleStyle.textContent = `
  @keyframes floatParticle {
    0% { transform: translateY(0px) rotate(0deg); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
  }
`;
document.head.appendChild(particleStyle);

// Enhanced button hover effects
function enhanceButtons() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-3px) scale(1.05)';
    });
    
    btn.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
}

// Initialize all enhancements
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  createParticles();
  enhanceButtons();
  
  // Add gradient text effect to section titles
  document.querySelectorAll('.section-title').forEach(title => {
    title.classList.add('gradient-text');
  });
  
  // Add floating animation to icons
  document.querySelectorAll('.card-icon').forEach(icon => {
    icon.classList.add('floating-element');
  });
});

// Auto-update stats with smooth animation
function updateStatsAnimated() {
  const statNumbers = document.querySelectorAll('.stat-number');
  statNumbers.forEach(stat => {
    const current = parseInt(stat.textContent);
    const change = Math.floor(Math.random() * 3) - 1;
    const newValue = Math.max(0, current + change);
    
    // Animate number change
    let start = current;
    const duration = 1000;
    const startTime = performance.now();
    
    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const value = Math.round(start + (newValue - start) * progress);
      stat.textContent = value;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }
    
    requestAnimationFrame(animate);
  });
}

// Update stats every 30 seconds with animation
setInterval(updateStatsAnimated, 30000);

console.log('🏥 Enhanced Hospital Management System loaded with animations!');