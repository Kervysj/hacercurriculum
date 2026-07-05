// ============================================
// VARIABLES GLOBALES
// ============================================
let currentType = '';
let currentStyle = 'moderno';
let experienciaCount = 0;
let educacionCount = 0;
let cursosCount = 0;

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
checkTheme();
});

// ============================================
// MODO OSCURO/CLARO
// ============================================
function toggleTheme() {
const body = document.body;
const btn = document.getElementById('theme-toggle');
body.classList.toggle('dark-mode');
if (body.classList.contains('dark-mode')) {
btn.textContent = '☀️ Modo Claro';
localStorage.setItem('theme', 'dark');
} else {
btn.textContent = '🌙 Modo Oscuro';
localStorage.setItem('theme', 'light');
}
}

function checkTheme() {
const savedTheme = localStorage.getItem('theme');
const btn = document.getElementById('theme-toggle');
if (savedTheme === 'dark') {
document.body.classList.add('dark-mode');
if (btn) btn.textContent = '☀️ Modo Claro';
}
}

// ============================================
// NAVEGACIÓN ENTRE PASOS
// ============================================
function selectType(type) {
currentType = type;
document.getElementById('step-type').style.display = 'none';
document.getElementById('step-data').style.display = 'block';

if (type === 'cv') {
document.getElementById('data-title').textContent = 'Ingresa los datos de tu CV';
document.getElementById('form-cv').style.display = 'block';
document.getElementById('form-transcripcion').style.display = 'none';
} else {
document.getElementById('data-title').textContent = 'Configura tu Transcripción';
document.getElementById('form-cv').style.display = 'none';
document.getElementById('form-transcripcion').style.display = 'block';
}

window.scrollTo(0, 0);
}

function goBackToType() {
document.getElementById('step-data').style.display = 'none';
document.getElementById('step-type').style.display = 'block';
window.scrollTo(0, 0);
}

function goBackToEdit() {
document.getElementById('step-preview').style.display = 'none';
document.getElementById('step-data').style.display = 'block';
window.scrollTo(0, 0);
}

function startOver() {
document.getElementById('step-preview').style.display = 'none';
document.getElementById('step-type').style.display = 'block';
document.getElementById('form-cv').style.display = 'none';
document.getElementById('form-transcripcion').style.display = 'none';
currentType = '';
window.scrollTo(0, 0);
}

// ============================================
// TOGGLE SECCIONES CV
// ============================================
function toggleSecciones() {
const completo = document.getElementById('cv-completo').checked;
const select = document.getElementById('secciones-select');
select.style.display = completo ? 'none' : 'block';
}

// ============================================
// AGREGAR EXPERIENCIA LABORAL
// ============================================
function addExperiencia() {
experienciaCount++;
const container = document.getElementById('experiencia-list');
const div = document.createElement('div');
div.className = 'item-row';
div.id = `exp-${experienciaCount}`;
div.innerHTML = `
<button class="btn-remove" onclick="removeItem('exp-${experienciaCount}')">✕</button>
<div class="form-grid">
<div class="form-group">
<label>Empresa</label>
<input type="text" class="exp-empresa" placeholder="Ej: Empresa XYZ">
</div>
<div class="form-group">
<label>Cargo</label>
<input type="text" class="exp-cargo" placeholder="Ej: Gerente de Ventas">
</div>
<div class="form-group">
<label>Fecha Inicio</label>
<input type="text" class="exp-inicio" placeholder="Ej: Enero 2020">
</div>
<div class="form-group">
<label>Fecha Fin</label>
<input type="text" class="exp-fin" placeholder="Ej: Actualidad">
</div>
</div>
<div class="form-group">
<label>Descripción de funciones</label>
<textarea class="exp-desc" rows="3" placeholder="Describe tus responsabilidades..."></textarea>
</div>
`;
container.appendChild(div);
}

// ============================================
// AGREGAR EDUCACIÓN
// ============================================
function addEducacion() {
educacionCount++;
const container = document.getElementById('educacion-list');
const div = document.createElement('div');
div.className = 'item-row';
div.id = `edu-${educacionCount}`;
div.innerHTML = `
<button class="btn-remove" onclick="removeItem('edu-${educacionCount}')">✕</button>
<div class="form-grid">
<div class="form-group">
<label>Institución</label>
<input type="text" class="edu-inst" placeholder="Ej: Universidad Nacional">
</div>
<div class="form-group">
<label>Título</label>
<input type="text" class="edu-titulo" placeholder="Ej: Licenciatura en Administración">
</div>
<div class="form-group">
<label>Fecha Inicio</label>
<input type="text" class="edu-inicio" placeholder="Ej: 2015">
</div>
<div class="form-group">
<label>Fecha Fin</label>
<input type="text" class="edu-fin" placeholder="Ej: 2019">
</div>
</div>
`;
container.appendChild(div);
}

// ============================================
// AGREGAR CURSO
// ============================================
function addCurso() {
cursosCount++;
const container = document.getElementById('cursos-list');
const div = document.createElement('div');
div.className = 'item-row';
div.id = `cur-${cursosCount}`;
div.innerHTML = `
<button class="btn-remove" onclick="removeItem('cur-${cursosCount}')">✕</button>
<div class="form-grid">
<div class="form-group">
<label>Nombre del Curso</label>
<input type="text" class="cur-nombre" placeholder="Ej: Marketing Digital">
</div>
<div class="form-group">
<label>Institución</label>
<input type="text" class="cur-inst" placeholder="Ej: Google">
</div>
<div class="form-group">
<label>Año</label>
<input type="text" class="cur-anio" placeholder="Ej: 2023">
</div>
</div>
`;
container.appendChild(div);
}

function removeItem(id) {
const item = document.getElementById(id);
if (item) item.remove();
}

// ============================================
// GENERAR DOCUMENTO
// ============================================
function generateDocument() {
if (currentType === 'cv') {
generateCV();
} else {
generateTranscripcion();
}

document.getElementById('step-data').style.display = 'none';
document.getElementById('step-preview').style.display = 'block';
window.scrollTo(0, 0);
}

// ============================================
// GENERAR CV
// ============================================
function generateCV() {
const nombre = document.getElementById('cv-nombre').value || 'Tu Nombre';
const telefono = document.getElementById('cv-telefono').value;
const email = document.getElementById('cv-email').value;
const ciudad = document.getElementById('cv-ciudad').value;
const linkedin = document.getElementById('cv-linkedin').value;
const foto = document.getElementById('cv-foto').value;
const perfil = document.getElementById('cv-perfil').value;
const habilidades = document.getElementById('cv-habilidades').value;
const idiomas = document.getElementById('cv-idiomas').value;

// Recopilar experiencias
const experiencias = [];
document.querySelectorAll('#experiencia-list .item-row').forEach(row => {
experiencias.push({
empresa: row.querySelector('.exp-empresa').value,
cargo: row.querySelector('.exp-cargo').value,
inicio: row.querySelector('.exp-inicio').value,
fin: row.querySelector('.exp-fin').value,
desc: row.querySelector('.exp-desc').value
});
});

// Recopilar educación
const educaciones = [];
document.querySelectorAll('#educacion-list .item-row').forEach(row => {
educaciones.push({
inst: row.querySelector('.edu-inst').value,
titulo: row.querySelector('.edu-titulo').value,
inicio: row.querySelector('.edu-inicio').value,
fin: row.querySelector('.edu-fin').value
});
});

// Recopilar cursos
const cursos = [];
document.querySelectorAll('#cursos-list .item-row').forEach(row => {
cursos.push({
nombre: row.querySelector('.cur-nombre').value,
inst: row.querySelector('.cur-inst').value,
anio: row.querySelector('.cur-anio').value
});
});

// Determinar secciones a mostrar
const completo = document.getElementById('cv-completo').checked;
let secciones = ['perfil', 'experiencia', 'educacion', 'cursos', 'habilidades', 'idiomas'];
if (!completo) {
secciones = [];
document.querySelectorAll('.seccion-check:checked').forEach(cb => {
secciones.push(cb.value);
});
}

// Obtener estilo seleccionado
const styleRadio = document.querySelector('input[name="cv-style"]:checked');
const estilo = styleRadio ? styleRadio.value : 'moderno';

// Generar HTML según estilo
let html = '';
switch(estilo) {
case 'moderno':
html = generateCVModerno({nombre, telefono, email, ciudad, linkedin, foto, perfil, habilidades, idiomas, experiencias, educaciones, cursos, secciones});
break;
case 'clasico':
html = generateCVClasico({nombre, telefono, email, ciudad, linkedin, foto, perfil, habilidades, idiomas, experiencias, educaciones, cursos, secciones});
break;
case 'creativo':
html = generateCVCreativo({nombre, telefono, email, ciudad, linkedin, foto, perfil, habilidades, idiomas, experiencias, educaciones, cursos, secciones});
break;
case 'minimalista':
html = generateCVMinimalista({nombre, telefono, email, ciudad, linkedin, foto, perfil, habilidades, idiomas, experiencias, educaciones, cursos, secciones});
break;
case 'profesional':
html = generateCVProfesional({nombre, telefono, email, ciudad, linkedin, foto, perfil, habilidades, idiomas, experiencias, educaciones, cursos, secciones});
break;
}

document.getElementById('document-preview').innerHTML = html;
}

// ============================================
// ESTILO 1: MODERNO
// ============================================
function generateCVModerno(data) {
let sidebar = `
<div class="cv-sidebar">
${data.foto ? `<img src="${data.foto}" style="width:150px; height:150px; border-radius:50%; object-fit:cover; margin-bottom:20px;">` : ''}
<h2 style="margin-bottom:20px;">${data.nombre}</h2>
${data.telefono ? `<p>📞 ${data.telefono}</p>` : ''}
${data.email ? `<p>✉️ ${data.email}</p>` : ''}
${data.ciudad ? `<p>📍 ${data.ciudad}</p>` : ''}
${data.linkedin ? `<p>🔗 ${data.linkedin}</p>` : ''}

${data.secciones.includes('habilidades') && data.habilidades ? `
<div style="margin-top:30px;">
<h3 style="border-bottom:2px solid white; padding-bottom:10px; margin-bottom:15px;">️ Habilidades</h3>
<ul style="list-style:none; padding:0;">
${data.habilidades.split(',').map(h => `<li style="margin-bottom:8px;">• ${h.trim()}</li>`).join('')}
</ul>
</div>
` : ''}

${data.secciones.includes('idiomas') && data.idiomas ? `
<div style="margin-top:30px;">
<h3 style="border-bottom:2px solid white; padding-bottom:10px; margin-bottom:15px;">🌐 Idiomas</h3>
<ul style="list-style:none; padding:0;">
${data.idiomas.split(',').map(i => `<li style="margin-bottom:8px;">• ${i.trim()}</li>`).join('')}
</ul>
</div>
` : ''}
</div>
`;

let main = `<div class="cv-main">`;

if (data.secciones.includes('perfil') && data.perfil) {
main += `
<div style="margin-bottom:30px;">
<h2 style="color:#3b82f6; border-bottom:3px solid #3b82f6; padding-bottom:10px; margin-bottom:15px;">🎯 Perfil Profesional</h2>
<p style="line-height:1.6;">${data.perfil}</p>
</div>
`;
}

if (data.secciones.includes('experiencia') && data.experiencias.length > 0) {
main += `
<div style="margin-bottom:30px;">
<h2 style="color:#3b82f6; border-bottom:3px solid #3b82f6; padding-bottom:10px; margin-bottom:15px;">💼 Experiencia Laboral</h2>
`;
data.experiencias.forEach(exp => {
main += `
<div style="margin-bottom:20px;">
<h3 style="margin-bottom:5px;">${exp.cargo}</h3>
<p style="color:#6b7280; font-style:italic; margin-bottom:10px;">${exp.empresa} | ${exp.inicio} - ${exp.fin}</p>
<p style="line-height:1.6;">${exp.desc}</p>
</div>
`;
});
main += `</div>`;
}

if (data.secciones.includes('educacion') && data.educaciones.length > 0) {
main += `
<div style="margin-bottom:30px;">
<h2 style="color:#3b82f6; border-bottom:3px solid #3b82f6; padding-bottom:10px; margin-bottom:15px;">🎓 Educación</h2>
`;
data.educaciones.forEach(edu => {
main += `
<div style="margin-bottom:15px;">
<h3 style="margin-bottom:5px;">${edu.titulo}</h3>
<p style="color:#6b7280; font-style:italic;">${edu.inst} | ${edu.inicio} - ${edu.fin}</p>
</div>
`;
});
main += `</div>`;
}

if (data.secciones.includes('cursos') && data.cursos.length > 0) {
main += `
<div style="margin-bottom:30px;">
<h2 style="color:#3b82f6; border-bottom:3px solid #3b82f6; padding-bottom:10px; margin-bottom:15px;">📚 Cursos</h2>
`;
data.cursos.forEach(cur => {
main += `
<div style="margin-bottom:15px;">
<h3 style="margin-bottom:5px;">${cur.nombre}</h3>
<p style="color:#6b7280; font-style:italic;">${cur.inst} | ${cur.anio}</p>
</div>
`;
});
main += `</div>`;
}

main += `</div>`;

return `<div class="cv-moderno">${sidebar}${main}</div>`;
}

// ============================================
// ESTILO 2: CLÁSICO
// ============================================
function generateCVClasico(data) {
let html = `<div class="cv-clasico">`;

html += `
<div class="cv-header">
<h1 style="font-size:2rem; margin-bottom:10px;">${data.nombre}</h1>
<div style="color:#6b7280; font-size:1rem;">
${data.telefono ? `<span>${data.telefono}</span>` : ''}
${data.email ? `<span> | ${data.email}</span>` : ''}
${data.ciudad ? `<span> | ${data.ciudad}</span>` : ''}
${data.linkedin ? `<span> | ${data.linkedin}</span>` : ''}
</div>
</div>
`;

if (data.secciones.includes('perfil') && data.perfil) {
html += `
<div style="margin-bottom:30px; text-align:left;">
<h2 style="border-bottom:2px solid #333; padding-bottom:5px; margin-bottom:15px;">PERFIL PROFESIONAL</h2>
<p style="line-height:1.6;">${data.perfil}</p>
</div>
`;
}

if (data.secciones.includes('experiencia') && data.experiencias.length > 0) {
html += `
<div style="margin-bottom:30px; text-align:left;">
<h2 style="border-bottom:2px solid #333; padding-bottom:5px; margin-bottom:15px;">EXPERIENCIA LABORAL</h2>
`;
data.experiencias.forEach(exp => {
html += `
<div style="margin-bottom:20px;">
<h3 style="margin-bottom:5px;">${exp.cargo}</h3>
<p style="color:#6b7280; font-style:italic; margin-bottom:10px;">${exp.empresa} | ${exp.inicio} - ${exp.fin}</p>
<p style="line-height:1.6;">${exp.desc}</p>
</div>
`;
});
html += `</div>`;
}

if (data.secciones.includes('educacion') && data.educaciones.length > 0) {
html += `
<div style="margin-bottom:30px; text-align:left;">
<h2 style="border-bottom:2px solid #333; padding-bottom:5px; margin-bottom:15px;">EDUCACIÓN</h2>
`;
data.educaciones.forEach(edu => {
html += `
<div style="margin-bottom:15px;">
<h3 style="margin-bottom:5px;">${edu.titulo}</h3>
<p style="color:#6b7280; font-style:italic;">${edu.inst} | ${edu.inicio} - ${edu.fin}</p>
</div>
`;
});
html += `</div>`;
}

if (data.secciones.includes('cursos') && data.cursos.length > 0) {
html += `
<div style="margin-bottom:30px; text-align:left;">
<h2 style="border-bottom:2px solid #333; padding-bottom:5px; margin-bottom:15px;">CURSOS</h2>
`;
data.cursos.forEach(cur => {
html += `
<div style="margin-bottom:15px;">
<h3 style="margin-bottom:5px;">${cur.nombre}</h3>
<p style="color:#6b7280; font-style:italic;">${cur.inst} | ${cur.anio}</p>
</div>
`;
});
html += `</div>`;
}

if (data.secciones.includes('habilidades') && data.habilidades) {
html += `
<div style="margin-bottom:30px; text-align:left;">
<h2 style="border-bottom:2px solid #333; padding-bottom:5px; margin-bottom:15px;">HABILIDADES</h2>
<p>${data.habilidades}</p>
</div>
`;
}

if (data.secciones.includes('idiomas') && data.idiomas) {
html += `
<div style="margin-bottom:30px; text-align:left;">
<h2 style="border-bottom:2px solid #333; padding-bottom:5px; margin-bottom:15px;">IDIOMAS</h2>
<p>${data.idiomas}</p>
</div>
`;
}

html += `</div>`;
return html;
}

// ============================================
// ESTILO 3: CREATIVO
// ============================================
function generateCVCreativo(data) {
let html = `<div class="cv-creativo">`;

html += `
<div class="cv-header">
<h1 style="font-size:2.5rem; margin-bottom:10px;">${data.nombre}</h1>
<div style="font-size:1.1rem;">
${data.telefono ? `<span>📞 ${data.telefono}</span>` : ''}
${data.email ? `<span> | ✉️ ${data.email}</span>` : ''}
${data.ciudad ? `<span> | 📍 ${data.ciudad}</span>` : ''}
</div>
</div>
`;

if (data.secciones.includes('perfil') && data.perfil) {
html += `
<div style="margin-bottom:30px;">
<h2 style="color:#f59e0b; margin-bottom:15px;">🎯 Sobre Mí</h2>
<p style="line-height:1.6;">${data.perfil}</p>
</div>
`;
}

if (data.secciones.includes('experiencia') && data.experiencias.length > 0) {
html += `
<div style="margin-bottom:30px;">
<h2 style="color:#f59e0b; margin-bottom:15px;">💼 Experiencia</h2>
`;
data.experiencias.forEach(exp => {
html += `
<div style="margin-bottom:20px; padding-left:15px; border-left:4px solid #f59e0b;">
<h3 style="margin-bottom:5px;">${exp.cargo}</h3>
<p style="color:#6b7280; font-style:italic; margin-bottom:10px;">${exp.empresa} | ${exp.inicio} - ${exp.fin}</p>
<p style="line-height:1.6;">${exp.desc}</p>
</div>
`;
});
html += `</div>`;
}

if (data.secciones.includes('educacion') && data.educaciones.length > 0) {
html += `
<div style="margin-bottom:30px;">
<h2 style="color:#f59e0b; margin-bottom:15px;">🎓 Educación</h2>
`;
data.educaciones.forEach(edu => {
html += `
<div style="margin-bottom:15px; padding-left:15px; border-left:4px solid #f59e0b;">
<h3 style="margin-bottom:5px;">${edu.titulo}</h3>
<p style="color:#6b7280; font-style:italic;">${edu.inst} | ${edu.inicio} - ${edu.fin}</p>
</div>
`;
});
html += `</div>`;
}

if (data.secciones.includes('cursos') && data.cursos.length > 0) {
html += `
<div style="margin-bottom:30px;">
<h2 style="color:#f59e0b; margin-bottom:15px;">📚 Cursos</h2>
`;
data.cursos.forEach(cur => {
html += `
<div style="margin-bottom:15px; padding-left:15px; border-left:4px solid #f59e0b;">
<h3 style="margin-bottom:5px;">${cur.nombre}</h3>
<p style="color:#6b7280; font-style:italic;">${cur.inst} | ${cur.anio}</p>
</div>
`;
});
html += `</div>`;
}

if (data.secciones.includes('habilidades') && data.habilidades) {
html += `
<div style="margin-bottom:30px;">
<h2 style="color:#f59e0b; margin-bottom:15px;">🛠️ Habilidades</h2>
<div style="display:flex; flex-wrap:wrap; gap:10px;">
${data.habilidades.split(',').map(h => `<span style="background:#f59e0b; color:white; padding:5px 15px; border-radius:20px;">${h.trim()}</span>`).join('')}
</div>
</div>
`;
}

if (data.secciones.includes('idiomas') && data.idiomas) {
html += `
<div style="margin-bottom:30px;">
<h2 style="color:#f59e0b; margin-bottom:15px;">🌐 Idiomas</h2>
<p>${data.idiomas}</p>
</div>
`;
}

html += `</div>`;
return html;
}

// ============================================
// ESTILO 4: MINIMALISTA
// ============================================
function generateCVMinimalista(data) {
let html = `<div class="cv-minimalista">`;

html += `
<div class="cv-header">
<h1 style="font-size:2.5rem; font-weight:300; margin-bottom:10px;">${data.nombre}</h1>
<div style="color:#6b7280; font-size:1rem; font-weight:300;">
${data.telefono ? `<span>${data.telefono}</span>` : ''}
${data.email ? `<span> · ${data.email}</span>` : ''}
${data.ciudad ? `<span> · ${data.ciudad}</span>` : ''}
${data.linkedin ? `<span> · ${data.linkedin}</span>` : ''}
</div>
</div>
`;

if (data.secciones.includes('perfil') && data.perfil) {
html += `
<div style="margin-bottom:40px;">
<p style="line-height:1.8; font-size:1.1rem;">${data.perfil}</p>
</div>
`;
}

if (data.secciones.includes('experiencia') && data.experiencias.length > 0) {
html += `
<div style="margin-bottom:40px;">
<h2 style="font-weight:300; font-size:1.5rem; margin-bottom:20px; text-transform:uppercase; letter-spacing:2px;">Experiencia</h2>
`;
data.experiencias.forEach(exp => {
html += `
<div style="margin-bottom:25px;">
<h3 style="font-weight:500; margin-bottom:5px;">${exp.cargo}</h3>
<p style="color:#6b7280; font-style:italic; margin-bottom:10px;">${exp.empresa} · ${exp.inicio} - ${exp.fin}</p>
<p style="line-height:1.6;">${exp.desc}</p>
</div>
`;
});
html += `</div>`;
}

if (data.secciones.includes('educacion') && data.educaciones.length > 0) {
html += `
<div style="margin-bottom:40px;">
<h2 style="font-weight:300; font-size:1.5rem; margin-bottom:20px; text-transform:uppercase; letter-spacing:2px;">Educación</h2>
`;
data.educaciones.forEach(edu => {
html += `
<div style="margin-bottom:20px;">
<h3 style="font-weight:500; margin-bottom:5px;">${edu.titulo}</h3>
<p style="color:#6b7280; font-style:italic;">${edu.inst} · ${edu.inicio} - ${edu.fin}</p>
</div>
`;
});
html += `</div>`;
}

if (data.secciones.includes('cursos') && data.cursos.length > 0) {
html += `
<div style="margin-bottom:40px;">
<h2 style="font-weight:300; font-size:1.5rem; margin-bottom:20px; text-transform:uppercase; letter-spacing:2px;">Cursos</h2>
`;
data.cursos.forEach(cur => {
html += `
<div style="margin-bottom:15px;">
<h3 style="font-weight:500; margin-bottom:5px;">${cur.nombre}</h3>
<p style="color:#6b7280; font-style:italic;">${cur.inst} · ${cur.anio}</p>
</div>
`;
});
html += `</div>`;
}

if (data.secciones.includes('habilidades') && data.habilidades) {
html += `
<div style="margin-bottom:40px;">
<h2 style="font-weight:300; font-size:1.5rem; margin-bottom:20px; text-transform:uppercase; letter-spacing:2px;">Habilidades</h2>
<p>${data.habilidades}</p>
</div>
`;
}

if (data.secciones.includes('idiomas') && data.idiomas) {
html += `
<div style="margin-bottom:40px;">
<h2 style="font-weight:300; font-size:1.5rem; margin-bottom:20px; text-transform:uppercase; letter-spacing:2px;">Idiomas</h2>
<p>${data.idiomas}</p>
</div>
`;
}

html += `</div>`;
return html;
}

// ============================================
// ESTILO 5: PROFESIONAL
// ============================================
function generateCVProfesional(data) {
let sidebar = `
<div style="background:#f3f4f6; padding:30px; border-radius:10px;">
${data.foto ? `<img src="${data.foto}" style="width:150px; height:150px; border-radius:50%; object-fit:cover; margin-bottom:20px;">` : ''}
<h2 style="margin-bottom:20px; color:#1e3a8a;">${data.nombre}</h2>
${data.telefono ? `<p style="margin-bottom:10px;">📞 ${data.telefono}</p>` : ''}
${data.email ? `<p style="margin-bottom:10px;">️ ${data.email}</p>` : ''}
${data.ciudad ? `<p style="margin-bottom:10px;">📍 ${data.ciudad}</p>` : ''}
${data.linkedin ? `<p style="margin-bottom:10px;">🔗 ${data.linkedin}</p>` : ''}

${data.secciones.includes('habilidades') && data.habilidades ? `
<div style="margin-top:30px;">
<h3 style="color:#1e3a8a; border-bottom:2px solid #1e3a8a; padding-bottom:10px; margin-bottom:15px;">Habilidades</h3>
<ul style="list-style:none; padding:0;">
${data.habilidades.split(',').map(h => `<li style="margin-bottom:8px;">• ${h.trim()}</li>`).join('')}
</ul>
</div>
` : ''}

${data.secciones.includes('idiomas') && data.idiomas ? `
<div style="margin-top:30px;">
<h3 style="color:#1e3a8a; border-bottom:2px solid #1e3a8a; padding-bottom:10px; margin-bottom:15px;">Idiomas</h3>
<ul style="list-style:none; padding:0;">
${data.idiomas.split(',').map(i => `<li style="margin-bottom:8px;">• ${i.trim()}</li>`).join('')}
</ul>
</div>
` : ''}
</div>
`;

let main = `<div>`;

if (data.secciones.includes('perfil') && data.perfil) {
main += `
<div style="margin-bottom:30px;">
<h2 style="color:#1e3a8a; border-bottom:3px solid #1e3a8a; padding-bottom:10px; margin-bottom:15px;">Perfil Profesional</h2>
<p style="line-height:1.6;">${data.perfil}</p>
</div>
`;
}

if (data.secciones.includes('experiencia') && data.experiencias.length > 0) {
main += `
<div style="margin-bottom:30px;">
<h2 style="color:#1e3a8a; border-bottom:3px solid #1e3a8a; padding-bottom:10px; margin-bottom:15px;">Experiencia Laboral</h2>
`;
data.experiencias.forEach(exp => {
main += `
<div style="margin-bottom:20px;">
<h3 style="margin-bottom:5px;">${exp.cargo}</h3>
<p style="color:#6b7280; font-style:italic; margin-bottom:10px;">${exp.empresa} | ${exp.inicio} - ${exp.fin}</p>
<p style="line-height:1.6;">${exp.desc}</p>
</div>
`;
});
main += `</div>`;
}

if (data.secciones.includes('educacion') && data.educaciones.length > 0) {
main += `
<div style="margin-bottom:30px;">
<h2 style="color:#1e3a8a; border-bottom:3px solid #1e3a8a; padding-bottom:10px; margin-bottom:15px;">Educación</h2>
`;
data.educaciones.forEach(edu => {
main += `
<div style="margin-bottom:15px;">
<h3 style="margin-bottom:5px;">${edu.titulo}</h3>
<p style="color:#6b7280; font-style:italic;">${edu.inst} | ${edu.inicio} - ${edu.fin}</p>
</div>
`;
});
main += `</div>`;
}

if (data.secciones.includes('cursos') && data.cursos.length > 0) {
main += `
<div style="margin-bottom:30px;">
<h2 style="color:#1e3a8a; border-bottom:3px solid #1e3a8a; padding-bottom:10px; margin-bottom:15px;">Cursos</h2>
`;
data.cursos.forEach(cur => {
main += `
<div style="margin-bottom:15px;">
<h3 style="margin-bottom:5px;">${cur.nombre}</h3>
<p style="color:#6b7280; font-style:italic;">${cur.inst} | ${cur.anio}</p>
</div>
`;
});
main += `</div>`;
}

main += `</div>`;

return `<div class="cv-profesional">${sidebar}${main}</div>`;
}

// ============================================
// GENERAR TRANSCRIPCIÓN
// ============================================
function generateTranscripcion() {
const tipo = document.getElementById('trans-tipo').value;
const fuente = document.getElementById('trans-fuente').value;
const interlineado = document.getElementById('trans-interlineado').value;
const titulo = document.getElementById('trans-titulo').value || 'Transcripción';
const fecha = document.getElementById('trans-fecha').value;
const lugar = document.getElementById('trans-lugar').value;
const participantes = document.getElementById('trans-participantes').value;
const contenido = document.getElementById('trans-contenido').value;

let html = '';

if (tipo === 'apa') {
html = generateTransAPA({titulo, fecha, lugar, participantes, contenido, fuente, interlineado});
} else {
html = generateTransLegal({titulo, fecha, lugar, participantes, contenido, fuente, interlineado});
}

document.getElementById('document-preview').innerHTML = html;
}

function generateTransAPA(data) {
const fechaFormateada = data.fecha ? new Date(data.fecha).toLocaleDateString('es-ES', {
year: 'numeric',
month: 'long',
day: 'numeric'
}) : '';

let header = `
<div style="text-align:center; margin-bottom:30px;">
<h1 style="font-size:${data.fuente}pt; margin-bottom:10px;">${data.titulo}</h1>
${fechaFormateada ? `<p style="font-size:${data.fuente}pt;">${fechaFormateada}</p>` : ''}
${data.lugar ? `<p style="font-size:${data.fuente}pt;">${data.lugar}</p>` : ''}
${data.participantes ? `<p style="font-size:${data.fuente}pt;"><strong>Participantes:</strong> ${data.participantes}</p>` : ''}
</div>
`;

const parrafos = data.contenido.split('\n\n').filter(p => p.trim());
let body = `<div style="font-family:'Times New Roman', serif; font-size:${data.fuente}pt; line-height:${data.interlineado}; text-align:justify;">`;

parrafos.forEach(p => {
body += `<p style="text-indent:1.27cm; margin-bottom:0;">${p.trim()}</p>`;
});

body += `</div>`;

return `<div class="trans-apa">${header}${body}</div>`;
}

function generateTransLegal(data) {
const fechaFormateada = data.fecha ? new Date(data.fecha).toLocaleDateString('es-ES', {
year: 'numeric',
month: 'long',
day: 'numeric'
}) : '';

let header = `
<div style="border:2px solid #333; padding:20px; margin-bottom:30px;">
<h1 style="text-align:center; font-size:14pt; margin-bottom:10px;">${data.titulo}</h1>
<p style="text-align:center; font-size:12pt;"><strong>Fecha:</strong> ${fechaFormateada}</p>
${data.lugar ? `<p style="text-align:center; font-size:12pt;"><strong>Lugar:</strong> ${data.lugar}</p>` : ''}
${data.participantes ? `<p style="text-align:center; font-size:12pt;"><strong>Participantes:</strong> ${data.participantes}</p>` : ''}
</div>
`;

const lineas = data.contenido.split('\n').filter(l => l.trim());
let body = `<div style="font-family:'Times New Roman', serif; font-size:${data.fuente}pt; line-height:${data.interlineado};">`;

lineas.forEach(linea => {
const match = linea.match(/^([A-ZÁÉÍÓÚÑ\s]+):\s*(.+)$/);
if (match) {
body += `<div class="dialogo"><span class="hablante">${match[1]}:</span> ${match[2]}</div>`;
} else {
body += `<p style="margin-bottom:10px;">${linea}</p>`;
}
});

body += `</div>`;

return `<div class="trans-legal">${header}${body}</div>`;
}

// ============================================
// DESCARGAR PDF
// ============================================
function downloadPDF() {
window.print();
}

// ============================================
// DESCARGAR WORD
// ============================================
function downloadWord() {
const content = document.getElementById('document-preview').innerHTML;
const html = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><meta charset='utf-8'><title>Documento</title></head>
<body>${content}</body>
</html>
`;

const blob = new Blob(['\ufeff', html], {
type: 'application/msword'
});

const url = URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = 'documento.doc';
link.click();
URL.revokeObjectURL(url);
}
