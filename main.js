document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('mainNav');
  const contactForm = document.getElementById('contactForm');
  const successAlert = document.getElementById('successAlert');
  const submitBtn = document.getElementById('submitBtn');
  const message = document.getElementById('inputMessage');
  const charCount = document.getElementById('charCount');
  const messageError = document.getElementById('messageError');

  const updateNav = () => nav?.classList.toggle('scrolled', window.scrollY > 25);
  updateNav();
  window.addEventListener('scroll', updateNav);

  document.querySelectorAll('.reveal-card').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  document.querySelectorAll('.reveal-card').forEach(card => observer.observe(card));

  message?.addEventListener('input', () => {
    const length = message.value.length;
    charCount.textContent = Math.min(length, 500);
    if (length > 500) message.value = message.value.slice(0, 500);
    messageError?.classList.toggle('invisible', length >= 10 || length === 0);
  });

  contactForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopPropagation();

    contactForm.classList.add('was-validated');

    const messageOk = !message || message.value.trim().length >= 10;
    messageError?.classList.toggle('invisible', messageOk);

    if (!contactForm.checkValidity() || !messageOk) return;

    const formData = {
      name: document.getElementById('inputName').value.trim(),
      email: document.getElementById('inputEmail').value.trim(),
      phone: document.getElementById('inputPhone').value.trim(),
      service: document.getElementById('inputService').value,
      message: document.getElementById('inputMessage').value.trim()
    };

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      const response = await fetch('http://127.0.0.1:5050/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      console.log(result);

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send message');
      }

      successAlert.classList.remove('d-none');
      contactForm.reset();
      contactForm.classList.remove('was-validated');
      charCount.textContent = '0';

      setTimeout(() => successAlert.classList.add('d-none'), 4500);
    } catch (error) {
      console.error(error);
      alert('Failed to send message. Please make sure the backend server is running.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message →';
    }
  });
});

// Extra animations for home/about/service pages
(() => {
  const counters = document.querySelectorAll('.counter');

  if (counters.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const target = Number(el.dataset.target || 0);
        let start = 0;

        const step = () => {
          start += Math.max(1, Math.ceil(target / 40));

          if (start >= target) {
            el.textContent = target;
          } else {
            el.textContent = start;
            requestAnimationFrame(step);
          }
        };

        step();
        obs.unobserve(el);
      });
    }, { threshold: 0.4 });

    counters.forEach(c => obs.observe(c));
  }

  const bars = document.querySelectorAll('.animated-bar');

  if (bars.length) {
    const obs2 = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.style.width = (entry.target.dataset.width || 0) + '%';
        obs2.unobserve(entry.target);
      });
    }, { threshold: 0.35 });

    bars.forEach(b => obs2.observe(b));
  }
})();