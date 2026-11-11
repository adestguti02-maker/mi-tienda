// Menú acordeon
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
navToggle.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});
mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mainNav.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}));

const money = n => '$ ' + n.toLocaleString('es-CO');

// Pestañas de la demo
const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => tab.addEventListener('click', () => {
  tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
  tab.classList.add('active'); tab.setAttribute('aria-selected', 'true');
  document.querySelectorAll('.panel').forEach(p => p.hidden = p.id !== tab.dataset.panel);
}));

// Demo de inventario (datos de ejemplo)
const productos = [
  { nombre: 'Arroz 500 g', stock: 12, minimo: 5 },
  { nombre: 'Aceite 1 L', stock: 6, minimo: 5 },
  { nombre: 'Panela', stock: 4, minimo: 5 },
  { nombre: 'Gaseosa 1,5 L', stock: 20, minimo: 8 },
  { nombre: 'Huevos x30', stock: 3, minimo: 4 }
];
const invBody = document.getElementById('invBody');
const stockSummary = document.getElementById('stockSummary');

function renderInventario() {
  invBody.innerHTML = '';
  productos.forEach((p, i) => {
    const bajo = p.stock <= p.minimo;
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${p.nombre}</td><td>${p.stock} und</td>
      <td><span class="badge ${bajo ? 'low' : 'ok'}">${bajo ? 'Stock bajo' : 'Disponible'}</span></td>
      <td><button class="btn-sell" data-i="${i}" ${p.stock === 0 ? 'disabled' : ''}>Vender 1</button></td>`;
    invBody.appendChild(tr);
  });
  const n = productos.filter(p => p.stock <= p.minimo).length;
  stockSummary.textContent = n ? `Atención: ${n} producto${n > 1 ? 's' : ''} con stock bajo.` : 'Todo el inventario está en orden.';
}
invBody.addEventListener('click', e => {
  const btn = e.target.closest('.btn-sell');
  if (!btn) return;
  const p = productos[btn.dataset.i];
  if (p.stock > 0) p.stock--;
  renderInventario();
});
renderInventario();

// Demo de fiados (datos de ejemplo)
const clientes = [
  { nombre: 'Doña Marta', deuda: 45000 },
  { nombre: 'Carlos', deuda: 18500 },
  { nombre: 'Luisa', deuda: 72000 }
];
const debtList = document.getElementById('debtList');
const debtSummary = document.getElementById('debtSummary');

function renderFiados() {
  debtList.innerHTML = '';
  clientes.forEach((c, i) => {
    const div = document.createElement('div');
    div.className = 'debt';
    div.innerHTML = `<div class="debt-info"><strong>${c.nombre}</strong><span class="debt-amount ${c.deuda === 0 ? 'zero' : ''}">${c.deuda === 0 ? 'Al día' : money(c.deuda)}</span></div>
      <form class="debt-form" data-i="${i}" novalidate>
        <input type="number" min="1" placeholder="Monto del abono" aria-label="Abono de ${c.nombre}" ${c.deuda === 0 ? 'disabled' : ''}>
        <button class="btn btn-small" type="submit" ${c.deuda === 0 ? 'disabled' : ''}>Abonar</button>
      </form>`;
    debtList.appendChild(div);
  });
  const total = clientes.reduce((s, c) => s + c.deuda, 0);
  debtSummary.textContent = `Total que te deben: ${money(total)}`;
}
debtList.addEventListener('submit', e => {
  e.preventDefault();
  const form = e.target;
  const c = clientes[form.dataset.i];
  const monto = Number(form.querySelector('input').value);
  if (monto > 0) c.deuda = Math.max(0, c.deuda - monto);
  renderFiados();
});
renderFiados();

// Formulario de lista de espera
const form = document.getElementById('contactForm');
const msg = document.getElementById('formMsg');
function validateField(input) {
  if (!input.required) return true;
  const field = input.closest('.field');
  const error = field.querySelector('.error');
  let text = '';
  if (!input.value.trim()) text = 'Este campo es obligatorio.';
  else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) text = 'Escribe un correo válido.';
  else if (input.id === 'nombre' && input.value.trim().length < 3) text = 'Mínimo 3 caracteres.';
  field.classList.toggle('invalid', Boolean(text));
  error.textContent = text;
  return !text;
}
form.querySelectorAll('input, select').forEach(i => i.addEventListener('blur', () => validateField(i)));
form.addEventListener('submit', e => {
  e.preventDefault();
  const ok = [...form.querySelectorAll('input, select')].map(validateField).every(Boolean);
  msg.className = 'form-msg';
  if (ok) {
    msg.textContent = `¡Gracias, ${form.nombre.value.trim()}! Te avisaremos cuando Mi Tienda esté disponible.`;
    msg.classList.add('ok');
    form.reset();
  } else {
    msg.textContent = 'Revisa los campos marcados.';
  }
});