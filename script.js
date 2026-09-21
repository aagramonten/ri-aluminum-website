const whatsappNumber = '19393491440';

function toggleMenu() {
  document.getElementById('navLinks')?.classList.toggle('open');
}

function closeMenu() {
  document.getElementById('navLinks')?.classList.remove('open');
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

let selectedAppointmentTime = '';

function setMinDate() {
  const dateInput = document.getElementById('appointmentDate');
  const today = new Date();
  today.setDate(today.getDate() + 1);
  const minDate = today.toISOString().split('T')[0];
  if (dateInput) dateInput.min = minDate;
}

function formatDate(dateString) {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

function updateAppointmentSummary() {
  const dateInput = document.getElementById('appointmentDate');
  const summary = document.getElementById('appointmentSummary');
  const whatsappBtn = document.getElementById('calendarWhatsapp');
  const selectedDate = dateInput?.value || '';

  if (!summary || !whatsappBtn) return;

  if (!selectedDate || !selectedAppointmentTime) {
    summary.textContent = 'Selecciona fecha y horario para preparar tu cita.';
    whatsappBtn.classList.add('disabled');
    whatsappBtn.href = '#';
    return;
  }

  const dateText = formatDate(selectedDate);
  summary.innerHTML = `<strong>Cita preferida:</strong><br>${dateText} · ${selectedAppointmentTime}`;
  const message = `Hola, quiero agendar una visita para tomar medidas. Fecha preferida: ${dateText}. Horario: ${selectedAppointmentTime}. Mi proyecto es:`;
  whatsappBtn.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  whatsappBtn.classList.remove('disabled');
}

function setupScheduler() {
  const dateInput = document.getElementById('appointmentDate');
  if (dateInput) dateInput.addEventListener('change', updateAppointmentSummary);

  document.querySelectorAll('#timeSlots button').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('#timeSlots button').forEach((b) => b.classList.remove('active'));
      button.classList.add('active');
      selectedAppointmentTime = button.dataset.time || button.textContent.trim();
      updateAppointmentSummary();
    });
  });
}

function clearFieldError(input) {
  if (!input) return;
  input.removeAttribute('aria-invalid');
  const errorId = input.getAttribute('aria-describedby');
  const error = errorId ? document.getElementById(errorId) : null;
  if (error) error.textContent = '';
}

function setFieldError(input, message) {
  if (!input) return;
  input.setAttribute('aria-invalid', 'true');
  const errorId = input.getAttribute('aria-describedby');
  const error = errorId ? document.getElementById(errorId) : null;
  if (error) error.textContent = message;
}

function validateQuoteForm(form) {
  const nameInput = form.elements.name;
  const phoneInput = form.elements.phone;
  const emailInput = form.elements.email;
  const inputs = [nameInput, phoneInput, emailInput];
  inputs.forEach(clearFieldError);

  let firstInvalid = null;
  const markInvalid = (input, message) => {
    setFieldError(input, message);
    if (!firstInvalid) firstInvalid = input;
  };

  if (!nameInput.value.trim()) {
    markInvalid(nameInput, 'Escriba su nombre.');
  }

  const phoneDigits = phoneInput.value.replace(/\D/g, '');
  if (!phoneDigits) {
    markInvalid(phoneInput, 'Escriba un número de teléfono.');
  } else if (phoneDigits.length < 10) {
    markInvalid(phoneInput, 'Escriba un teléfono válido con código de área.');
  }

  const email = emailInput.value.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    markInvalid(emailInput, 'Revise el formato del correo electrónico.');
  }

  if (firstInvalid) {
    firstInvalid.focus();
    return false;
  }

  return true;
}

async function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const messageBox = document.getElementById('formMessage');
  const submitBtn = form.querySelector('.submit-btn');

  if (messageBox) {
    messageBox.className = 'form-message';
    messageBox.textContent = '';
  }

  if (!validateQuoteForm(form)) {
    if (messageBox) {
      messageBox.textContent = 'Revise los campos marcados antes de enviar.';
      messageBox.classList.add('is-error');
    }
    return;
  }

  if (messageBox) {
    messageBox.textContent = 'Enviando solicitud...';
    messageBox.classList.add('is-pending');
  }

  if (submitBtn) submitBtn.disabled = true;

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form)
    });
    const data = await response.json();

    if (!response.ok || !data.success) throw new Error(data.message || 'Error al enviar.');

    if (messageBox) {
      messageBox.textContent = 'Solicitud enviada. Le responderemos pronto.';
      messageBox.className = 'form-message is-success';
    }
    form.reset();
    window.location.assign('/gracias.html');
  } catch (error) {
    if (messageBox) {
      messageBox.textContent = error.message || 'No se pudo enviar. Intente nuevamente o comuníquese por WhatsApp.';
      messageBox.className = 'form-message is-error';
    }
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
}

setMinDate();
setupScheduler();

// ── WhatsApp Greeting Bubble ──────────────────────────────────────
(function () {
  const bubble = document.getElementById('waBubble');
  if (!bubble) return;
  const dismissed = sessionStorage.getItem('waBubbleDismissed');
  if (dismissed) return;
  setTimeout(() => {
    bubble.classList.add('active');
  }, 10000); // show after 10 seconds
})();

function dismissBubble() {
  const bubble = document.getElementById('waBubble');
  if (bubble) bubble.classList.remove('active');
  sessionStorage.setItem('waBubbleDismissed', '1');
}

// ── Gallery Modal ─────────────────────────────────────────────────
let lastGalleryTrigger = null;

function openGalleryModal(src, caption, trigger) {
  const modal = document.getElementById('galleryModal');
  const source = document.getElementById('galleryModalSource');
  const webpBase = src.replace(/\.(jpe?g|png)$/i, '');
  lastGalleryTrigger = trigger || document.activeElement;
  if (source) source.srcset = `${webpBase}-600.webp 600w, ${webpBase}-1200.webp 1200w`;
  document.getElementById('galleryModalImg').src = src;
  document.getElementById('galleryModalCaption').textContent = caption;
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  modal.querySelector('.modal-close')?.focus();
}

function closeGalleryModal() {
  const modal = document.getElementById('galleryModal');
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  lastGalleryTrigger?.focus();
  lastGalleryTrigger = null;
}

document.addEventListener('DOMContentLoaded', () => {
  const gModal = document.getElementById('galleryModal');
  if (gModal) {
    gModal.addEventListener('click', (e) => {
      if (e.target === gModal) closeGalleryModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (!gModal?.classList.contains('active')) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closeGalleryModal();
      return;
    }
    if (e.key === 'Tab') {
      const focusable = [...gModal.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])')]
        .filter((element) => !element.hasAttribute('disabled'));
      if (!focusable.length) {
        e.preventDefault();
        gModal.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
});
