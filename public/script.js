// Enhanced Animations
document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS
  AOS.init({
    duration: 800,
    once: true,
    easing: 'ease-in-out-quad'
  });

  // Text gradient animation
  const textGradients = document.querySelectorAll('.text-gradient');
  textGradients.forEach(el => {
    el.style.background = 'linear-gradient(90deg, #00f0ff, #0084ff)';
    el.style.webkitBackgroundClip = 'text';
    el.style.backgroundClip = 'text';
    el.style.color = 'transparent';
    el.style.display = 'inline-block';
  });

  // Contact Form Handling (Firebase Firestore)
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const spinner = document.getElementById('spinner');
      const submitText = submitBtn.querySelector('.submit-text');
      const resultDiv = document.getElementById('formResult');

      // Show loading state
      submitText.textContent = 'Sending...';
      spinner.classList.remove('d-none');
      submitBtn.disabled = true;

      try {
        // Save message to Firestore
        await db.collection("messages").add({
          name: document.getElementById('name').value.trim(),
          email: document.getElementById('email').value.trim(),
          message: document.getElementById('message').value.trim(),
          date: new Date()
        });

        resultDiv.innerHTML = `
          <div class="alert alert-success">
            <i class="bi bi-check-circle-fill"></i> Your message has been saved!
          </div>
        `;

        contactForm.reset();

      } catch (error) {
        console.error(error);
        resultDiv.innerHTML = `
          <div class="alert alert-danger">
            <i class="bi bi-exclamation-triangle-fill"></i> ${error.message}
          </div>
        `;
      }

      // Reset button
      submitText.textContent = 'Send Message';
      spinner.classList.add('d-none');
      submitBtn.disabled = false;

      // Hide response after 5 seconds
      setTimeout(() => {
        resultDiv.innerHTML = '';
      }, 5000);
    });
  }

  // Floating bubble effect
  for (let i = 0; i < 15; i++) {
    const bubble = document.createElement('div');
    bubble.className = 'floating-bubble';
    bubble.style.left = `${Math.random() * 100}vw`;
    bubble.style.width = `${10 + Math.random() * 30}px`;
    bubble.style.height = bubble.style.width;
    bubble.style.animationDuration = `${10 + Math.random() * 20}s`;
    bubble.style.animationDelay = `${Math.random() * 5}s`;
    bubble.style.opacity = `${0.2 + Math.random() * 0.5}`;
    document.body.appendChild(bubble);
  }
});
