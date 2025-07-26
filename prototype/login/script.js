// Create Particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size and position
        const size = Math.random() * 4 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Random animation delay
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        
        particlesContainer.appendChild(particle);
    }
}

// Toggle Password Visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.querySelector('.password-toggle');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        toggleIcon.textContent = '👁️';
    }
}

// Handle Form Submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loading = document.getElementById('loading');
    const loginCard = document.getElementById('loginCard');
    const submitBtn = document.querySelector('.login-btn');
    
    // Show loading
    loading.style.display = 'inline-block';
    submitBtn.style.pointerEvents = 'none';
    submitBtn.style.opacity = '0.7';
    
    // Simulate login process
    setTimeout(() => {
        // Hide loading
        loading.style.display = 'none';
        submitBtn.style.pointerEvents = 'auto';
        submitBtn.style.opacity = '1';
        
        // Flip card to show success
        loginCard.classList.add('flipped');
        
        // Add some extra effects
        document.body.style.background = 'linear-gradient(135deg, #00ff88 0%, #00ccff 100%)';
        
        // Reset after 3 seconds
        setTimeout(() => {
            loginCard.classList.remove('flipped');
            document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            document.getElementById('loginForm').reset();
        }, 3000);
        
    }, 2000);
});

// Add floating animation to form inputs
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'translateY(-5px)';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'translateY(0)';
    });
});

// Mouse move effect
document.addEventListener('mousemove', function(e) {
    const loginCard = document.getElementById('loginCard');
    const rect = loginCard.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const rotateX = (e.clientY - centerY) / 20;
    const rotateY = (centerX - e.clientX) / 20;
    
    if (!loginCard.classList.contains('flipped')) {
        loginCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
});

// Reset card rotation when mouse leaves
document.addEventListener('mouseleave', function() {
    const loginCard = document.getElementById('loginCard');
    if (!loginCard.classList.contains('flipped')) {
        loginCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    }
});

// Initialize particles
createParticles();

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.ctrlKey) {
        document.getElementById('loginForm').dispatchEvent(new Event('submit'));
    }
});

// Add some random glitch effects
setInterval(() => {
    const title = document.querySelector('.title');
    title.style.textShadow = `0 0 20px rgb(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255})`;
    
    setTimeout(() => {
        title.style.textShadow = '0 0 20px rgba(255, 255, 255, 0.5)';
    }, 100);
}, 5000); 