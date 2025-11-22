// Dark/Light Mode Toggle
function initThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.title = 'Toggle Dark Mode';
    
    // Add to navbar
    const navbar = document.querySelector('.navbar .container');
    if (navbar) {
        navbar.appendChild(themeToggle);
    }
    
    // Theme functionality
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            this.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            this.innerHTML = '<i class="fas fa-sun"></i>';
        }
    });
}

// Animated Counter
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + '+';
        }
    }, 16);
}

// Initialize counters when in viewport
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target')) || 0;
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    });
    
    counters.forEach(counter => observer.observe(counter));
}

// Projects Filter System
function initProjectsFilter() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    const projects = document.querySelectorAll('.project-card');
    if (!filterButtons.length || !projects.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Filter projects
            projects.forEach(project => {
                if (filter === 'all' || project.getAttribute('data-category') === filter) {
                    project.style.display = 'block';
                    setTimeout(() => {
                        project.style.opacity = '1';
                        project.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    project.style.opacity = '0';
                    project.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        project.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Event Registration System
function initEventRegistration() {
    const registerButtons = document.querySelectorAll('.register-btn');
    if (!registerButtons.length) return;
    
    registerButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.card');
            if (!card) return;
            const titleEl = card.querySelector('.card-title');
            const dateEl = card.querySelector('.event-date');
            const eventTitle = titleEl ? titleEl.textContent.trim() : 'Event';
            const eventDate = dateEl ? dateEl.textContent.trim() : '';
            
            // Store in localStorage
            const registeredEvents = JSON.parse(localStorage.getItem('registeredEvents') || '[]');
            if (!registeredEvents.find(event => event.title === eventTitle)) {
                registeredEvents.push({
                    title: eventTitle,
                    date: eventDate,
                    registeredAt: new Date().toISOString()
                });
                localStorage.setItem('registeredEvents', JSON.stringify(registeredEvents));
                
                // Update button
                this.innerHTML = '<i class="fas fa-check me-2"></i>Registered';
                this.classList.remove('btn-primary');
                this.classList.add('btn-success');
                this.disabled = true;
                
                showNotification(`Successfully registered for ${eventTitle}!`);
            } else {
                showNotification(`Already registered for ${eventTitle}.`, 'info');
            }
        });
    });
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    // normalize bootstrap types: map 'error' -> 'danger'
    const bsType = type === 'error' ? 'danger' : type;
    notification.className = `alert alert-${bsType} alert-dismissible fade show`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
    `;
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// EmailJS Integration
function initEmailJS() {
    // Initialize EmailJS if SDK available
    if (typeof emailjs !== 'undefined' && emailjs.init) {
        try {
            emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your actual public key
        } catch (e) {
            // ignore init errors
            console.warn('EmailJS init failed', e);
        }
    }

    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!validateForm()) return;

        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
        }

        const formData = {
            from_name: document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value,
            from_email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        // Send email using EmailJS (replace service and template IDs)
        if (typeof emailjs !== 'undefined' && emailjs.send) {
            emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData)
                .then(function(response) {
                    showNotification("Message sent successfully! We'll get back to you soon.", 'success');
                    contactForm.reset();
                    contactForm.classList.remove('was-validated');
                })
                .catch(function(err) {
                    console.error('EmailJS send error:', err);
                    showNotification('Failed to send message. Please try again.', 'danger');
                })
                .finally(() => {
                    if (submitBtn) {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }
                });
        } else {
            // Fallback if EmailJS SDK not available
            showNotification('Email service is not available. Please try again later.', 'danger');
            if (submitBtn) {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        }
    });
}

// Form Validation
function validateForm() {
    const form = document.getElementById('contactForm');
    if (!form) return false;
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return false;
    }
    return true;
}

// DOM ready: attach lightweight handlers and initialize modules
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add loading animation to .btn (guard against multiple handlers)
    const btns = document.querySelectorAll('.btn');
    btns.forEach(button => {
        // avoid adding duplicate listeners
        if (button._loadingHandlerAttached) return;
        button.addEventListener('click', function() {
            // do not override submit / already-handled buttons that are disabled
            if (this.disabled) return;
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            setTimeout(() => {
                this.innerHTML = originalText;
            }, 1500);
        });
        button._loadingHandlerAttached = true;
    });

    // Initialize features (each init function checks for required DOM before acting)
    initEmailJS();
    initThemeToggle();
    initCounters();
    initEventRegistration();
    initProjectsFilter();
});