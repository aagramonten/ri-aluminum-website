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
  const formDateInput = document.getElementById('preferredDateForm');
  const today = new Date();
  today.setDate(today.getDate() + 1);
  const minDate = today.toISOString().split('T')[0];
  if (dateInput) dateInput.min = minDate;
  if (formDateInput) formDateInput.min = minDate;
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

function copyAppointmentToForm() {
  const dateInput = document.getElementById('appointmentDate');
  const formDateInput = document.getElementById('preferredDateForm');
  const formTimeInput = document.getElementById('preferredTimeForm');
  const selectedDate = dateInput?.value || '';

  if (!selectedDate || !selectedAppointmentTime) {
    alert('Selecciona una fecha y un horario primero.');
    return;
  }

  if (formDateInput) formDateInput.value = selectedDate;
  if (formTimeInput) formTimeInput.value = selectedAppointmentTime;
  document.getElementById('estimate')?.scrollIntoView({ behavior: 'smooth' });
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

// On small screens, hide the floating shortcuts while either form is visible
// so they never cover the scheduler or its action buttons.
const formSectionsInView = new Set();
const formVisibilityObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) formSectionsInView.add(entry.target);
    else formSectionsInView.delete(entry.target);
  });
  document.body.classList.toggle('form-section-visible', formSectionsInView.size > 0);
}, { threshold: 0.08 });

document.querySelectorAll('#appointment, #estimate').forEach((section) => {
  formVisibilityObserver.observe(section);
});

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
function openGalleryModal(src, caption) {
  const modal = document.getElementById('galleryModal');
  document.getElementById('galleryModalImg').src = src;
  document.getElementById('galleryModalCaption').textContent = caption;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeGalleryModal() {
  document.getElementById('galleryModal').classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {
  const gModal = document.getElementById('galleryModal');
  if (gModal) {
    gModal.addEventListener('click', (e) => {
      if (e.target === gModal) closeGalleryModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeGalleryModal();
  });
});
