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

async function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const messageBox = document.getElementById('formMessage');
  const submitBtn = form.querySelector('.submit-btn');

  if (messageBox) {
    messageBox.textContent = 'Enviando solicitud...';
    messageBox.style.color = '#9a6f3a';
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
      messageBox.style.color = '#15803d';
    }
    form.reset();
  } catch (error) {
    if (messageBox) {
      messageBox.textContent = error.message || 'No se pudo enviar. Intente por WhatsApp.';
      messageBox.style.color = '#b91c1c';
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