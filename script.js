const whatsappNumber = '19393491440';

const products = [
  {
    id: 'DOOR-001',
    name: 'Puerta Moderna con Cristal',
    category: 'entry',
    description: 'Diseño elegante con panel lateral para entrada de luz natural sin perder privacidad.',
    benefits: ['Instalación profesional', 'Acabado tipo madera', 'Diseño moderno'],
    image: 'images/products/puerta-moderna.jpg',
    badge: 'Premium'
  },
  {
    id: 'DOOR-002',
    name: 'Puerta Sólida Texturizada',
    category: 'entry',
    description: 'Aluminio sólido con textura tipo madera para máxima privacidad y presencia.',
    benefits: ['Privacidad total', 'A la medida', 'Resistente al clima'],
    image: 'images/products/puerta-solida-madera.jpg',
    badge: null
  },
  {
    id: 'DOOR-003',
    name: 'Puerta Exterior de Cristal',
    category: 'entry',
    description: 'Marco negro con panel de cristal esmerilado para luz natural y estilo moderno.',
    benefits: ['Cristal esmerilado', 'Marco moderno', 'Ideal para exterior'],
    image: 'images/products/puerta-cristal.jpg',
    badge: 'Popular'
  },
  {
    id: 'DOOR-004',
    name: 'Puertas Dobles de Interior',
    category: 'entry',
    description: 'Divisiones elegantes en cristal y aluminio negro para interiores o comercios.',
    benefits: ['Look comercial premium', 'Cristal y aluminio', 'A la medida'],
    image: 'images/products/puertas-interior-cristal.jpg',
    badge: null
  },
  {
    id: 'WIN-001',
    name: 'Ventana Casement Clara',
    category: 'window',
    description: 'Apertura casement con cristal claro para maximizar vistas y ventilación.',
    benefits: ['Cristal claro', 'Apertura funcional', 'Medidas personalizadas'],
    image: 'images/products/ventana-casement-claro.jpg',
    badge: null
  },
  {
    id: 'WIN-002',
    name: 'Ventana Casement Esmerilada',
    category: 'window',
    description: 'Cristal esmerilado ideal para baños o áreas donde se busca privacidad.',
    benefits: ['Privacidad', 'Luz natural', 'Ideal para baños'],
    image: 'images/products/ventana-casement-esmerilado.jpg',
    badge: null
  },
  {
    id: 'RAIL-001',
    name: 'Barandal de Cristal',
    category: 'railing',
    description: 'Sistema en cristal templado con vista limpia para balcones y terrazas.',
    benefits: ['Cristal templado', 'Vista abierta', 'Acabado premium'],
    image: 'images/products/barandal-cristal.jpg',
    badge: 'Premium'
  },
  {
    id: 'RAIL-002',
    name: 'Barandal Cristal Iluminado',
    category: 'railing',
    description: 'Marcos de aluminio negro con luces integradas para un efecto nocturno elegante.',
    benefits: ['Luces integradas', 'Aluminio negro', 'Look moderno'],
    image: 'images/products/barandal-cristal-noche.jpg',
    badge: 'Tendencia'
  },
  {
    id: 'RAIL-003',
    name: 'Barandal Aluminio y Madera',
    category: 'railing',
    description: 'Estructura resistente con paneles estilo madera e iluminación empotrada.',
    benefits: ['Estilo cálido', 'Estructura fuerte', 'Ideal para terrazas'],
    image: 'images/products/barandal-madera-noche.jpg',
    badge: null
  },
  {
    id: 'RAIL-004',
    name: 'Barandal Madera Día',
    category: 'railing',
    description: 'Diseño cálido en aluminio tipo madera para casas modernas y terrazas.',
    benefits: ['Tipo madera', 'A la medida', 'Exterior o interior'],
    image: 'images/products/barandal-madera-dia.jpg',
    badge: null
  },
  {
    id: 'RAIL-005',
    name: 'Barandal Comercial',
    category: 'railing',
    description: 'Cristal templado con pasamanos resistente, ideal para restaurantes y negocios.',
    benefits: ['Uso comercial', 'Diseño seguro', 'Cristal templado'],
    image: 'images/products/barandal-comercial.jpg',
    badge: 'Comercial'
  },
  {
    id: 'CLO-001',
    name: 'Closet Esmerilado y Espejo',
    category: 'closet',
    description: 'Paneles de cristal esmerilado y espejo central para un diseño limpio y elegante.',
    benefits: ['Espejo central', 'Cristal esmerilado', 'Piso a techo'],
    image: 'images/products/closet-espejo.jpg',
    badge: 'Nuevo'
  }
];

function productWhatsappLink(productName) {
  const message = `Hola, me interesa cotizar: ${productName}. ¿Me pueden orientar?`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function renderProducts(filter = 'all') {
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  const list = filter === 'all' ? products : products.filter((p) => p.category === filter);
  grid.innerHTML = list.map((p) => `
    <article class="product-card reveal visible">
      <div class="card-img">
        <img src="${p.image}" alt="${p.name}">
        ${p.badge ? `<span class="card-badge">${p.badge}</span>` : ''}
      </div>
      <div class="card-body">
        <h3 class="card-name">${p.name}</h3>
        <p class="card-desc">${p.description}</p>
        <ul class="card-benefits">
          ${p.benefits.map((b) => `<li>✔ ${b}</li>`).join('')}
        </ul>
        <a href="${productWhatsappLink(p.name)}" class="card-cta" target="_blank" rel="noopener">Cotizar por WhatsApp →</a>
      </div>
    </article>
  `).join('');
}

function filterProducts(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderProducts(cat);
}

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
renderProducts('all');
