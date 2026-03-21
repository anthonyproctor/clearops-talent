document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // MVP Wizard of Oz interactions
    const employerBtn = document.querySelector('.funnel-card .btn-primary');
    const talentBtn = document.querySelector('.funnel-card .btn-secondary');

    if (employerBtn) {
        employerBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const email = prompt("Enter your corporate email to submit a requisition:");
            if (email) {
                try {
                    const formData = new FormData();
                    formData.append('email', email);
                    await fetch('/api/contractor', {
                        method: 'POST',
                        body: formData
                    });
                    alert(`Thanks! Your request has been securely logged. Our vetting team will contact ${email} within 24 hours with candidate matches.`);
                } catch(error) {
                    alert('Error reaching our secured server. Please ensure the backend is running locally.');
                }
            }
        });
    }

    if (talentBtn) {
        talentBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const email = prompt("Enter your best contact email:");
            if (!email) return;
            const clearance = prompt("Enter your active clearance level (e.g. Secret, TS, TS/SCI):");
            if (clearance) {
                try {
                    const formData = new FormData();
                    formData.append('email', email);
                    formData.append('clearance', clearance);
                    await fetch('/api/talent', {
                        method: 'POST',
                        body: formData
                    });
                    alert(`Great! Your ${clearance} profile is secured. We will contact you at ${email} to complete DISS verification.`);
                } catch(error) {
                    alert('Error reaching our secured server. Please ensure the backend is running locally.');
                }
            }
        });
    }

    // Add entry animation to glass panels on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.glass-panel').forEach((panel) => {
        panel.style.opacity = 0;
        panel.style.transform = 'translateY(20px)';
        panel.style.transition = 'all 0.6s ease-out';
        observer.observe(panel);
    });
});
