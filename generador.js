// ============================================
// VARIABLES GLOBALES
// ============================================
let currentType = ''; // 'cv' o 'transcripcion'
let currentCVData = null; // Guarda los datos para cambiar estilos sin perder info
let experienciaCount = 0;
let educacionCount = 0;
let cursosCount = 0;

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    checkTheme();
    console.log('✅ Generador cargado correctamente');
});

// ============================================
// MODO OSCURO / CLARO
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
function goToStep(stepId) {
    // Ocultar todos los pasos
    document.querySelectorAll('.step').forEach(step => {
        step.style.display = 'none';
    });
    // Mostrar el paso solicitado
    document.getElementById(stepId).style.display = 'block';
    window.scrollTo(0, 0);
}

function selectType(type) {
    currentType = type;
    
    if (type === 'cv') {
        document.getElementById('form-title').textContent = 'Ingresa los datos de tu CV';
        document.getElementById('form-cv').style.display = 'block';
        document.getElementById('form-transcripcion').style.display = 'none';
    } else {
        document.getElementById('form-title').textContent = 'Configura tu Transcripción';
        document.getElementById('form-cv').style.display = 'none';
        document.getElementById('form-transcripcion').style.display = 'block';
    }
    
    goToStep('step-form');
}

function toggleSecciones() {
    const completo = document.getElementById('cv-completo').checked;
    const select = document.getElementById('secciones-select');
    select.style.display = completo ? 'none' : 'block';
}

// ============================================
// CAMPOS DINÁMICOS (Experiencia, Educación, Cursos)
// ============================================
function addExperiencia() {
    experienciaCount++;
    const container = document.getElementById('experiencia-list');
    const div = document.createElement('div');
    div.className = 'item-row';
    div.id = 'exp-' + experienciaCount;
    div.innerHTML = `
        <button class="btn-remove" onclick="removeItem('exp-${experienciaCount}')">✕</button>
        <div class="form-grid">
            <div class="form-group"><label>Empresa</label><input type="text" class="exp-empresa" placeholder="Ej: Empresa XYZ"></div>
            <div class="form-group"><label>Cargo</label><input type="text" class="exp-cargo" placeholder="Ej: Gerente"></div>
            <div class="form-group"><label>Fecha Inicio</label><input type="text" class="exp-inicio" placeholder="Ej: 2020"></div>
            <div class="form-group"><label>Fecha Fin</label><input type="text" class="exp-fin" placeholder="Ej: Actualidad"></div>
        </div>
        <div class="form-group"><label>Descripción</label><textarea class="exp-desc" rows="3" placeholder="Funciones..."></textarea></div>
    `;
    container.appendChild(div);
}

function addEducacion() {
    educacionCount++;
    const container = document.getElementById('educacion-list');
    const div = document.createElement('div');
    div.className = 'item-row';
    div.id = 'edu-' + educacionCount;
    div.innerHTML = `
        <button class="btn-remove" onclick="removeItem('edu-${educacionCount}')">✕</button>
        <div class="form-grid">
            <div class="form-group"><label>Institución</label><input type="text" class="edu-inst" placeholder="Ej: Universidad"></div>
            <div class="form-group"><label>Título</label><input type="text" class="edu-titulo" placeholder="Ej: Licenciatura"></div>
            <div class="form-group"><label>Inicio</label><input type="text" class="edu-inicio" placeholder="Ej: 2015"></div>
            <div class="form-group"><label>Fin</label><input type="text" class="edu-fin" placeholder="Ej: 2019"></div>
        </div>
    `;
    container.appendChild(div);
}

function addCurso() {
    cursosCount++;
    const container = document.getElementById('cursos-list');
    const div = document.createElement('div');
    div.className = 'item-row';
    div.id = 'cur-' + cursosCount;
    div.innerHTML = `
        <button class="btn-remove" onclick="removeItem('cur-${cursosCount}')">✕</button>
        <div class="form-grid">
            <div class="form-group"><label>Nombre del Curso</label><input type="text" class="cur-nombre" placeholder="Ej: Excel"></div>
            <div class="form-group"><label>Institución</label><input type="text" class="cur-inst" placeholder="Ej: Google"></div>
            <div class="form-group"><label>Año</label><input type="text" class="cur-anio" placeholder="Ej: 2023"></div>
        </div>
    `;
    container.appendChild(div);
}

function removeItem(id) {
    const item = document.getElementById(id);
    if (item) item.remove();
}

// ============================================
//  ANALIZAR CV PEGADO (LÓGICA MEJORADA)
// ============================================
function parsearCVCompleto() {
    const texto = document.getElementById('cv-texto-completo').value.trim();
    
    if (!texto) {
        alert('❌ Por favor pega el contenido de tu CV primero');
        return;
    }

    const datos = {
        nombre: '', telefono: '', email: '', ciudad: '', linkedin: '',
        perfil: '', experiencia: [], educacion: [], cursos: [],
        habilidades: '', idiomas: ''
    };

    const lineas = texto.split('\n').map(l => l.trim()).filter(l => l);
    let seccionActual = 'inicio';
    let bufferExp = null;
    let bufferEdu = null;

    const keywords = {
        perfil: ['PERFIL PROFESIONAL', 'PERFIL', 'OBJETIVO', 'SOBRE MÍ', 'SOBRE MI'],
        experiencia: ['EXPERIENCIA LABORAL', 'EXPERIENCIA PROFESIONAL', 'EXPERIENCIA'],
        educacion: ['FORMACIÓN ACADÉMICA', 'FORMACION ACADEMICA', 'EDUCACIÓN', 'EDUCACION', 'ESTUDIOS'],
        habilidades: ['HABILIDADES', 'SKILLS', 'COMPETENCIAS', 'DESTREZAS'],
        cursos: ['CURSOS', 'CURSOS REALIZADOS', 'CERTIFICACIONES', 'CAPACITACIONES'],
        idiomas: ['IDIOMAS', 'LANGUAGES']
    };

    for (let i = 0; i < lineas.length; i++) {
        const linea = lineas[i];
        const lineaUpper = linea.toUpperCase();
        let esInicioSeccion = false;

        // Detectar cambio de sección
        for (const key in keywords) {
            for (let j = 0; j < keywords[key].length; j++) {
                if (lineaUpper.includes(keywords[key][j])) {
                    if (bufferExp) { datos.experiencia.push(bufferExp); bufferExp = null; }
                    if (bufferEdu) { datos.educacion.push(bufferEdu); bufferEdu = null; }
                    seccionActual = key;
                    esInicioSeccion = true;
                    break;
                }
            }
            if (esInicioSeccion) break;
        }

        if (esInicioSeccion) continue;

        // Procesar datos según la sección
        if (seccionActual === 'inicio') {
            if (!datos.nombre && i === 0) {
                datos.nombre = linea;
            } else if (linea.match(/04\d{2}-?\d{7}/) || linea.toLowerCase().includes('teléfono') || linea.toLowerCase().includes('telefono')) {
                datos.telefono = linea.replace(/.*?:\s*/i, '').trim();
            } else if (linea.includes('@')) {
                datos.email = linea.replace(/.*?:\s*/i, '').trim();
            } else if (linea.toLowerCase().match(/ciudad|ubicación|direccion|edo\.|estado/)) {
                datos.ciudad = linea.replace(/.*?:\s*/i, '').trim();
            } else if (linea.toLowerCase().match(/linkedin|web|portfolio/)) {
                datos.linkedin = linea.replace(/.*?:\s*/i, '').trim();
            } else if (!datos.ciudad && linea.match(/edo\.|estado|anzoategui|guanipa/i)) {
                datos.ciudad = linea;
            }
        } else if (seccionActual === 'perfil') {
            datos.perfil += linea + ' ';
        } else if (seccionActual === 'experiencia') {
            if (linea.includes(' - ') || (linea.length < 80 && lineaUpper === linea && linea.length > 5)) {
                if (bufferExp) datos.experiencia.push(bufferExp);
                const partes = linea.split(' - ');
                bufferExp = {
                    empresa: partes[0] ? partes[0].trim() : '',
                    cargo: partes[1] ? partes[1].trim() : linea,
                    fecha: '', descripcion: ''
                };
            } else if (bufferExp) {
                if (linea.match(/\d{4}/) && !bufferExp.fecha) {
                    bufferExp.fecha = linea;
                } else {
                    bufferExp.descripcion += linea + ' ';
                }
            } else {
                bufferExp = { empresa: '', cargo: linea, fecha: '', descripcion: '' };
            }
        } else if (seccionActual === 'educacion') {
            if (linea.includes(' - ') || linea.match(/\d{4}/)) {
                if (bufferEdu) datos.educacion.push(bufferEdu);
                const partes = linea.split(' - ');
                bufferEdu = {
                    inst: partes[1] ? partes[1].trim() : '',
                    titulo: partes[0] ? partes[0].trim() : linea,
                    inicio: '', fin: ''
                };
            } else if (bufferEdu) {
                bufferEdu.titulo += ' ' + linea;
            } else {
                bufferEdu = { inst: '', titulo: linea, inicio: '', fin: '' };
            }
        } else if (seccionActual === 'habilidades') {
            datos.habilidades += linea + ', ';
        } else if (seccionActual === 'cursos') {
            if (linea.includes(' - ') || linea.match(/\d{4}/)) {
                const partes = linea.split(' - ');
                const anioMatch = linea.match(/\d{4}/);
                datos.cursos.push({
                    nombre: partes[0] ? partes[0].trim() : linea,
                    inst: partes[1] ? partes[1].replace(/\(\d{4}\)/g, '').trim() : '',
                    anio: anioMatch ? anioMatch[0] : ''
                });
            } else {
                datos.cursos.push({ nombre: linea, inst: '', anio: '' });
            }
        } else if (seccionActual === 'idiomas') {
            datos.idiomas += linea + ', ';
        }
    }

    if (bufferExp) datos.experiencia.push(bufferExp);
    if (bufferEdu) datos.educacion.push(bufferEdu);

    // LLENAR EL FORMULARIO
    if (datos.nombre) document.getElementById('cv-nombre').value = datos.nombre;
    if (datos.telefono) document.getElementById('cv-telefono').value = datos.telefono;
    if (datos.email) document.getElementById('cv-email').value = datos.email;
    if (datos.ciudad) document.getElementById('cv-ciudad').value = datos.ciudad;
    if (datos.linkedin) document.getElementById('cv-linkedin').value = datos.linkedin;
    if (datos.perfil.trim()) document.getElementById('cv-perfil').value = datos.perfil.trim();
    if (datos.habilidades.trim()) document.getElementById('cv-habilidades').value = datos.habilidades.trim();
    if (datos.idiomas.trim()) document.getElementById('cv-idiomas').value = datos.idiomas.trim();

    // Llenar experiencias
    datos.experiencia.forEach(exp => {
        if (exp.cargo || exp.empresa) {
            addExperiencia();
            const items = document.querySelectorAll('#experiencia-list .item-row');
            const last = items[items.length - 1];
            if (exp.empresa) last.querySelector('.exp-empresa').value = exp.empresa;
            if (exp.cargo) last.querySelector('.exp-cargo').value = exp.cargo;
            if (exp.fecha) last.querySelector('.exp-inicio').value = exp.fecha;
            if (exp.descripcion) last.querySelector('.exp-desc').value = exp.descripcion.trim();
        }
    });

    // Llenar educación
    datos.educacion.forEach(edu => {
        if (edu.titulo || edu.inst) {
            addEducacion();
            const items = document.querySelectorAll('#educacion-list .item-row');
            const last = items[items.length - 1];
            if (edu.titulo) last.querySelector('.edu-titulo').value = edu.titulo;
            if (edu.inst) last.querySelector('.edu-inst').value = edu.inst;
        }
    });

    // Llenar cursos
    datos.cursos.forEach(cur => {
        if (cur.nombre) {
            addCurso();
            const items = document.querySelectorAll('#cursos-list .item-row');
            const last = items[items.length - 1];
            if (cur.nombre) last.querySelector('.cur-nombre').value = cur.nombre;
            if (cur.inst) last.querySelector('.cur-inst').value = cur.inst;
            if (cur.anio) last.querySelector('.cur-anio').value = cur.anio;
        }
    });

    alert('✅ ¡CV analizado! Los campos se han llenado automáticamente. Revisa y ajusta si es necesario.');
    document.getElementById('cv-texto-completo').value = '';
    
    // Hacer scroll hacia los campos
    setTimeout(() => {
        document.querySelector('#form-cv .form-section').scrollIntoView({ behavior: 'smooth' });
    }, 300);
}

// ============================================
// RECOLECTAR DATOS DEL FORMULARIO
// ============================================
function recolectarDatosCV() {
    const data = {
        nombre: document.getElementById('cv-nombre').value || 'Tu Nombre',
        telefono: document.getElementById('cv-telefono').value,
        email: document.getElementById('cv-email').value,
        ciudad: document.getElementById('cv-ciudad').value,
        linkedin: document.getElementById('cv-linkedin').value,
        foto: document.getElementById('cv-foto').value,
        perfil: document.getElementById('cv-perfil').value,
        habilidades: document.getElementById('cv-habilidades').value,
        idiomas: document.getElementById('cv-idiomas').value,
        experiencias: [], educaciones: [], cursos: []
    };

    document.querySelectorAll('#experiencia-list .item-row').forEach(row => {
        data.experiencias.push({
            empresa: row.querySelector('.exp-empresa').value,
            cargo: row.querySelector('.exp-cargo').value,
            inicio: row.querySelector('.exp-inicio').value,
            fin: row.querySelector('.exp-fin').value,
            desc: row.querySelector('.exp-desc').value
        });
    });

    document.querySelectorAll('#educacion-list .item-row').forEach(row => {
        data.educaciones.push({
            inst: row.querySelector('.edu-inst').value,
            titulo: row.querySelector('.edu-titulo').value,
            inicio: row.querySelector('.edu-inicio').value,
            fin: row.querySelector('.edu-fin').value
        });
    });

    document.querySelectorAll('#cursos-list .item-row').forEach(row => {
        data.cursos.push({
            nombre: row.querySelector('.cur-nombre').value,
            inst: row.querySelector('.cur-inst').value,
            anio: row.querySelector('.cur-anio').value
        });
    });

    const completo = document.getElementById('cv-completo').checked;
    let secciones = ['perfil', 'experiencia', 'educacion', 'cursos', 'habilidades', 'idiomas'];
    if (!completo) {
        secciones = [];
        document.querySelectorAll('.seccion-check:checked').forEach(cb => secciones.push(cb.value));
    }
    data.secciones = secciones;

    return data;
}

// ============================================
// GENERAR DOCUMENTOS
// ============================================
function generarCV() {
    currentCVData = recolectarDatosCV();
    const styleRadio = document.querySelector('input[name="cv-style"]:checked');
    const estilo = styleRadio ? styleRadio.value : 'moderno';
    currentCVData.estilo = estilo;
    
    renderizarCV(estilo);
    document.getElementById('style-changer-cv').style.display = 'block';
    goToStep('step-preview');
}

function generarTranscripcion() {
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
    document.getElementById('style-changer-cv').style.display = 'none';
    goToStep('step-preview');
}

function renderizarCV(estilo) {
    let html = '';
    switch(estilo) {
        case 'moderno': html = generateCVModerno(currentCVData); break;
        case 'clasico': html = generateCVClasico(currentCVData); break;
        case 'creativo': html = generateCVCreativo(currentCVData); break;
        case 'minimalista': html = generateCVMinimalista(currentCVData); break;
        case 'profesional': html = generateCVProfesional(currentCVData); break;
    }
    document.getElementById('document-preview').innerHTML = html;
}

// ============================================
// ACCIONES DE VISTA PREVIA
// ============================================
function editarDocumento() {
    // Solo cambia la vista, NO borra los datos del formulario
    goToStep('step-form');
}

function nuevoDocumento() {
    if (confirm('¿Seguro que quieres crear un nuevo documento? Se perderán los datos actuales.')) {
        currentCVData = null;
        currentType = '';
        document.getElementById('form-cv').style.display = 'none';
        document.getElementById('form-transcripcion').style.display = 'none';
        goToStep('step-type');
    }
}

function cambiarEstilo(nuevoEstilo) {
    if (!currentCVData) return;
    currentCVData.estilo = nuevoEstilo;
    renderizarCV(nuevoEstilo);
}

// ============================================
// FUNCIONES DE DISEÑO CV (5 ESTILOS)
// ============================================
function generateCVModerno(d) {
    let sidebar = `<div class="cv-sidebar">`;
    if (d.foto) sidebar += `<img src="${d.foto}" style="width:150px; height:150px; border-radius:50%; object-fit:cover; margin-bottom:20px; border: 4px solid white;">`;
    sidebar += `<h2 style="margin-bottom:20px;">${d.nombre}</h2>`;
    if (d.telefono) sidebar += `<p>📞 ${d.telefono}</p>`;
    if (d.email) sidebar += `<p>✉️ ${d.email}</p>`;
    if (d.ciudad) sidebar += `<p>📍 ${d.ciudad}</p>`;
    if (d.linkedin) sidebar += `<p>🔗 ${d.linkedin}</p>`;
    
    if (d.secciones.includes('habilidades') && d.habilidades) {
        sidebar += `<div style="margin-top:30px;"><h3 style="border-bottom:2px solid white; padding-bottom:10px; margin-bottom:15px;">Habilidades</h3><ul style="list-style:none; padding:0;">`;
        d.habilidades.split(',').forEach(h => { if (h.trim()) sidebar += `<li style="margin-bottom:8px;">• ${h.trim()}</li>`; });
        sidebar += `</ul></div>`;
    }
    if (d.secciones.includes('idiomas') && d.idiomas) {
        sidebar += `<div style="margin-top:30px;"><h3 style="border-bottom:2px solid white; padding-bottom:10px; margin-bottom:15px;">Idiomas</h3><ul style="list-style:none; padding:0;">`;
        d.idiomas.split(',').forEach(i => { if (i.trim()) sidebar += `<li style="margin-bottom:8px;">• ${i.trim()}</li>`; });
        sidebar += `</ul></div>`;
    }
    sidebar += `</div>`;
    
    let main = `<div class="cv-main">`;
    if (d.secciones.includes('perfil') && d.perfil) main += `<div style="margin-bottom:30px;"><h2 style="color:#3b82f6; border-bottom:3px solid #3b82f6; padding-bottom:10px; margin-bottom:15px;">Perfil Profesional</h2><p style="line-height:1.6;">${d.perfil}</p></div>`;
    if (d.secciones.includes('experiencia') && d.experiencias.length > 0) {
        main += `<div style="margin-bottom:30px;"><h2 style="color:#3b82f6; border-bottom:3px solid #3b82f6; padding-bottom:10px; margin-bottom:15px;">Experiencia Laboral</h2>`;
        d.experiencias.forEach(e => { main += `<div style="margin-bottom:20px;"><h3 style="margin-bottom:5px;">${e.cargo}</h3><p style="color:#6b7280; font-style:italic; margin-bottom:10px;">${e.empresa} | ${e.inicio} - ${e.fin}</p><p style="line-height:1.6;">${e.desc}</p></div>`; });
        main += `</div>`;
    }
    if (d.secciones.includes('educacion') && d.educaciones.length > 0) {
        main += `<div style="margin-bottom:30px;"><h2 style="color:#3b82f6; border-bottom:3px solid #3b82f6; padding-bottom:10px; margin-bottom:15px;">Educación</h2>`;
        d.educaciones.forEach(e => { main += `<div style="margin-bottom:15px;"><h3 style="margin-bottom:5px;">${e.titulo}</h3><p style="color:#6b7280; font-style:italic;">${e.inst} | ${e.inicio} - ${e.fin}</p></div>`; });
        main += `</div>`;
    }
    if (d.secciones.includes('cursos') && d.cursos.length > 0) {
        main += `<div style="margin-bottom:30px;"><h2 style="color:#3b82f6; border-bottom:3px solid #3b82f6; padding-bottom:10px; margin-bottom:15px;">Cursos</h2>`;
        d.cursos.forEach(c => { main += `<div style="margin-bottom:15px;"><h3 style="margin-bottom:5px;">${c.nombre}</h3><p style="color:#6b7280; font-style:italic;">${c.inst} | ${c.anio}</p></div>`; });
        main += `</div>`;
    }
    main += `</div>`;
    return `<div class="cv-moderno">${sidebar}${main}</div>`;
}

function generateCVClasico(d) {
    let html = `<div class="cv-clasico"><div class="cv-header"><h1 style="font-size:2rem; margin-bottom:10px;">${d.nombre}</h1><div style="color:#6b7280;">`;
    if (d.telefono) html += `<span>${d.telefono}</span>`;
    if (d.email) html += `<span> | ${d.email}</span>`;
    if (d.ciudad) html += `<span> | ${d.ciudad}</span>`;
    html += `</div></div>`;
    
    if (d.secciones.includes('perfil') && d.perfil) html += `<div style="margin-bottom:30px; text-align:left;"><h2>PERFIL PROFESIONAL</h2><p style="line-height:1.6;">${d.perfil}</p></div>`;
    if (d.secciones.includes('experiencia') && d.experiencias.length > 0) {
        html += `<div style="margin-bottom:30px; text-align:left;"><h2>EXPERIENCIA LABORAL</h2>`;
        d.experiencias.forEach(e => { html += `<div style="margin-bottom:20px;"><h3>${e.cargo}</h3><p style="color:#6b7280; font-style:italic;">${e.empresa} | ${e.inicio} - ${e.fin}</p><p style="line-height:1.6;">${e.desc}</p></div>`; });
        html += `</div>`;
    }
    if (d.secciones.includes('educacion') && d.educaciones.length > 0) {
        html += `<div style="margin-bottom:30px; text-align:left;"><h2>EDUCACIÓN</h2>`;
        d.educaciones.forEach(e => { html += `<div style="margin-bottom:15px;"><h3>${e.titulo}</h3><p style="color:#6b7280; font-style:italic;">${e.inst} | ${e.inicio} - ${e.fin}</p></div>`; });
        html += `</div>`;
    }
    if (d.secciones.includes('cursos') && d.cursos.length > 0) {
        html += `<div style="margin-bottom:30px; text-align:left;"><h2>CURSOS</h2>`;
        d.cursos.forEach(c => { html += `<div style="margin-bottom:15px;"><h3>${c.nombre}</h3><p style="color:#6b7280; font-style:italic;">${c.inst} | ${c.anio}</p></div>`; });
        html += `</div>`;
    }
    if (d.secciones.includes('habilidades') && d.habilidades) html += `<div style="margin-bottom:30px; text-align:left;"><h2>HABILIDADES</h2><p>${d.habilidades}</p></div>`;
    if (d.secciones.includes('idiomas') && d.idiomas) html += `<div style="margin-bottom:30px; text-align:left;"><h2>IDIOMAS</h2><p>${d.idiomas}</p></div>`;
    html += `</div>`;
    return html;
}

function generateCVCreativo(d) {
    let html = `<div class="cv-creativo"><div class="cv-header"><h1 style="font-size:2.5rem; margin-bottom:10px;">${d.nombre}</h1><div style="font-size:1.1rem;">`;
    if (d.telefono) html += `<span> ${d.telefono}</span>`;
    if (d.email) html += `<span> | ️ ${d.email}</span>`;
    if (d.ciudad) html += `<span> |  ${d.ciudad}</span>`;
    html += `</div></div>`;
    
    if (d.secciones.includes('perfil') && d.perfil) html += `<div style="margin-bottom:30px;"><h2 style="color:#f59e0b;">Sobre Mí</h2><p style="line-height:1.6;">${d.perfil}</p></div>`;
    if (d.secciones.includes('experiencia') && d.experiencias.length > 0) {
        html += `<div style="margin-bottom:30px;"><h2 style="color:#f59e0b;">Experiencia</h2>`;
        d.experiencias.forEach(e => { html += `<div style="margin-bottom:20px; padding-left:15px; border-left:4px solid #f59e0b;"><h3>${e.cargo}</h3><p style="color:#6b7280; font-style:italic;">${e.empresa} | ${e.inicio} - ${e.fin}</p><p style="line-height:1.6;">${e.desc}</p></div>`; });
        html += `</div>`;
    }
    if (d.secciones.includes('educacion') && d.educaciones.length > 0) {
        html += `<div style="margin-bottom:30px;"><h2 style="color:#f59e0b;">Educación</h2>`;
        d.educaciones.forEach(e => { html += `<div style="margin-bottom:15px; padding-left:15px; border-left:4px solid #f59e0b;"><h3>${e.titulo}</h3><p style="color:#6b7280; font-style:italic;">${e.inst} | ${e.inicio} - ${e.fin}</p></div>`; });
        html += `</div>`;
    }
    if (d.secciones.includes('cursos') && d.cursos.length > 0) {
        html += `<div style="margin-bottom:30px;"><h2 style="color:#f59e0b;">Cursos</h2>`;
        d.cursos.forEach(c => { html += `<div style="margin-bottom:15px; padding-left:15px; border-left:4px solid #f59e0b;"><h3>${c.nombre}</h3><p style="color:#6b7280; font-style:italic;">${c.inst} | ${c.anio}</p></div>`; });
        html += `</div>`;
    }
    if (d.secciones.includes('habilidades') && d.habilidades) {
        html += `<div style="margin-bottom:30px;"><h2 style="color:#f59e0b;">Habilidades</h2><div style="display:flex; flex-wrap:wrap; gap:10px;">`;
        d.habilidades.split(',').forEach(h => { if (h.trim()) html += `<span style="background:#f59e0b; color:white; padding:5px 15px; border-radius:20px;">${h.trim()}</span>`; });
        html += `</div></div>`;
    }
    if (d.secciones.includes('idiomas') && d.idiomas) html += `<div style="margin-bottom:30px;"><h2 style="color:#f59e0b;">Idiomas</h2><p>${d.idiomas}</p></div>`;
    html += `</div>`;
    return html;
}

function generateCVMinimalista(d) {
    let html = `<div class="cv-minimalista"><div class="cv-header"><h1 style="font-size:2.5rem; font-weight:300; margin-bottom:10px;">${d.nombre}</h1><div style="color:#6b7280;">`;
    if (d.telefono) html += `<span>${d.telefono}</span>`;
    if (d.email) html += `<span> · ${d.email}</span>`;
    if (d.ciudad) html += `<span> · ${d.ciudad}</span>`;
    html += `</div></div>`;
    
    if (d.secciones.includes('perfil') && d.perfil) html += `<div style="margin-bottom:40px;"><p style="line-height:1.8; font-size:1.1rem;">${d.perfil}</p></div>`;
    if (d.secciones.includes('experiencia') && d.experiencias.length > 0) {
        html += `<div style="margin-bottom:40px;"><h2>Experiencia</h2>`;
        d.experiencias.forEach(e => { html += `<div style="margin-bottom:25px;"><h3 style="font-weight:500;">${e.cargo}</h3><p style="color:#6b7280; font-style:italic;">${e.empresa} · ${e.inicio} - ${e.fin}</p><p style="line-height:1.6;">${e.desc}</p></div>`; });
        html += `</div>`;
    }
    if (d.secciones.includes('educacion') && d.educaciones.length > 0) {
        html += `<div style="margin-bottom:40px;"><h2>Educación</h2>`;
        d.educaciones.forEach(e => { html += `<div style="margin-bottom:20px;"><h3 style="font-weight:500;">${e.titulo}</h3><p style="color:#6b7280; font-style:italic;">${e.inst} · ${e.inicio} - ${e.fin}</p></div>`; });
        html += `</div>`;
    }
    if (d.secciones.includes('cursos') && d.cursos.length > 0) {
        html += `<div style="margin-bottom:40px;"><h2>Cursos</h2>`;
        d.cursos.forEach(c => { html += `<div style="margin-bottom:15px;"><h3 style="font-weight:500;">${c.nombre}</h3><p style="color:#6b7280; font-style:italic;">${c.inst} · ${c.anio}</p></div>`; });
        html += `</div>`;
    }
    if (d.secciones.includes('habilidades') && d.habilidades) html += `<div style="margin-bottom:40px;"><h2>Habilidades</h2><p>${d.habilidades}</p></div>`;
    if (d.secciones.includes('idiomas') && d.idiomas) html += `<div style="margin-bottom:40px;"><h2>Idiomas</h2><p>${d.idiomas}</p></div>`;
    html += `</div>`;
    return html;
}

function generateCVProfesional(d) {
    let sidebar = `<div style="background:#f3f4f6; padding:30px; border-radius:10px;">`;
    if (d.foto) sidebar += `<img src="${d.foto}" style="width:150px; height:150px; border-radius:50%; object-fit:cover; margin-bottom:20px;">`;
    sidebar += `<h2 style="margin-bottom:20px; color:#1e3a8a;">${d.nombre}</h2>`;
    if (d.telefono) sidebar += `<p>📞 ${d.telefono}</p>`;
    if (d.email) sidebar += `<p>✉️ ${d.email}</p>`;
    if (d.ciudad) sidebar += `<p>📍 ${d.ciudad}</p>`;
    if (d.linkedin) sidebar += `<p>🔗 ${d.linkedin}</p>`;
    
    if (d.secciones.includes('habilidades') && d.habilidades) {
        sidebar += `<div style="margin-top:30px;"><h3 style="color:#1e3a8a; border-bottom:2px solid #1e3a8a; padding-bottom:10px;">Habilidades</h3><ul style="list-style:none; padding:0;">`;
        d.habilidades.split(',').forEach(h => { if (h.trim()) sidebar += `<li>• ${h.trim()}</li>`; });
        sidebar += `</ul></div>`;
    }
    if (d.secciones.includes('idiomas') && d.idiomas) {
        sidebar += `<div style="margin-top:30px;"><h3 style="color:#1e3a8a; border-bottom:2px solid #1e3a8a; padding-bottom:10px;">Idiomas</h3><ul style="list-style:none; padding:0;">`;
        d.idiomas.split(',').forEach(i => { if (i.trim()) sidebar += `<li>• ${i.trim()}</li>`; });
        sidebar += `</ul></div>`;
    }
    sidebar += `</div>`;
    
    let main = `<div>`;
    if (d.secciones.includes('perfil') && d.perfil) main += `<div style="margin-bottom:30px;"><h2 style="color:#1e3a8a; border-bottom:3px solid #1e3a8a; padding-bottom:10px;">Perfil Profesional</h2><p style="line-height:1.6;">${d.perfil}</p></div>`;
    if (d.secciones.includes('experiencia') && d.experiencias.length > 0) {
        main += `<div style="margin-bottom:30px;"><h2 style="color:#1e3a8a; border-bottom:3px solid #1e3a8a; padding-bottom:10px;">Experiencia Laboral</h2>`;
        d.experiencias.forEach(e => { main += `<div style="margin-bottom:20px;"><h3>${e.cargo}</h3><p style="color:#6b7280; font-style:italic;">${e.empresa} | ${e.inicio} - ${e.fin}</p><p style="line-height:1.6;">${e.desc}</p></div>`; });
        main += `</div>`;
    }
    if (d.secciones.includes('educacion') && d.educaciones.length > 0) {
        main += `<div style="margin-bottom:30px;"><h2 style="color:#1e3a8a; border-bottom:3px solid #1e3a8a; padding-bottom:10px;">Educación</h2>`;
        d.educaciones.forEach(e => { main += `<div style="margin-bottom:15px;"><h3>${e.titulo}</h3><p style="color:#6b7280; font-style:italic;">${e.inst} | ${e.inicio} - ${e.fin}</p></div>`; });
        main += `</div>`;
    }
    if (d.secciones.includes('cursos') && d.cursos.length > 0) {
        main += `<div style="margin-bottom:30px;"><h2 style="color:#1e3a8a; border-bottom:3px solid #1e3a8a; padding-bottom:10px;">Cursos</h2>`;
        d.cursos.forEach(c => { main += `<div style="margin-bottom:15px;"><h3>${c.nombre}</h3><p style="color:#6b7280; font-style:italic;">${c.inst} | ${c.anio}</p></div>`; });
        main += `</div>`;
    }
    main += `</div>`;
    return `<div class="cv-profesional">${sidebar}${main}</div>`;
}

// ============================================
// FUNCIONES DE TRANSCRIPCIÓN
// ============================================
function generateTransAPA(d) {
    let fechaF = '';
    if (d.fecha) {
        const fechaObj = new Date(d.fecha + 'T00:00:00');
        fechaF = fechaObj.toLocaleDateString('es-ES', {year: 'numeric', month: 'long', day: 'numeric'});
    }
    let header = `<div style="text-align:center; margin-bottom:30px;"><h1 style="font-size:${d.fuente}pt; margin-bottom:10px;">${d.titulo}</h1>`;
    if (fechaF) header += `<p style="font-size:${d.fuente}pt;">${fechaF}</p>`;
    if (d.lugar) header += `<p style="font-size:${d.fuente}pt;">${d.lugar}</p>`;
    if (d.participantes) header += `<p style="font-size:${d.fuente}pt;"><strong>Participantes:</strong> ${d.participantes}</p>`;
    header += `</div>`;
    
    const parrafos = d.contenido.split('\n\n').filter(p => p.trim());
    let body = `<div style="font-family:'Times New Roman', serif; font-size:${d.fuente}pt; line-height:${d.interlineado}; text-align:justify;">`;
    parrafos.forEach(p => { body += `<p style="text-indent:1.27cm; margin-bottom:0;">${p.trim()}</p>`; });
    body += `</div>`;
    return `<div class="trans-apa">${header}${body}</div>`;
}

function generateTransLegal(d) {
    let fechaF = '';
    if (d.fecha) {
        const fechaObj = new Date(d.fecha + 'T00:00:00');
        fechaF = fechaObj.toLocaleDateString('es-ES', {year: 'numeric', month: 'long', day: 'numeric'});
    }
    let header = `<div style="border:2px solid #333; padding:20px; margin-bottom:30px;"><h1 style="text-align:center; font-size:14pt;">${d.titulo}</h1>`;
    header += `<p style="text-align:center;"><strong>Fecha:</strong> ${fechaF}</p>`;
    if (d.lugar) header += `<p style="text-align:center;"><strong>Lugar:</strong> ${d.lugar}</p>`;
    if (d.participantes) header += `<p style="text-align:center;"><strong>Participantes:</strong> ${d.participantes}</p>`;
    header += `</div>`;
    
    const lineas = d.contenido.split('\n').filter(l => l.trim());
    let body = `<div style="font-family:'Times New Roman', serif; font-size:${d.fuente}pt; line-height:${d.interlineado};">`;
    lineas.forEach(linea => {
        const match = linea.match(/^([A-ZÁÉÍÓÚÑa-záéíóúñ\s]+):\s*(.+)$/);
        if (match) {
            body += `<div style="margin-bottom:15px;"><span style="font-weight:bold; text-transform:uppercase;">${match[1]}:</span> ${match[2]}</div>`;
        } else {
            body += `<p style="margin-bottom:10px;">${linea}</p>`;
        }
    });
    body += `</div>`;
    return `<div class="trans-legal">${header}${body}</div>`;
}

// ============================================
// DESCARGAS
// ============================================
function descargarPDF() {
    window.print();
}

function descargarWord() {
    const content = document.getElementById('document-preview').innerHTML;
    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>Documento</title></head><body>${content}</body></html>`;
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'documento.doc';
    link.click();
    URL.revokeObjectURL(url);
    alert('📝 Documento Word descargado correctamente');
}
