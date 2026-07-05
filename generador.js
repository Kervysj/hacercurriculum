// VARIABLES GLOBALES
let currentType = '';
let currentCVData = null;
let currentStyle = 'moderno';

// MODO OSCURO
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const btn = document.getElementById('theme-toggle');
    if (document.body.classList.contains('dark-mode')) {
        btn.textContent = '☀️ Modo Claro';
        localStorage.setItem('theme', 'dark');
    } else {
        btn.textContent = '🌙 Modo Oscuro';
        localStorage.setItem('theme', 'light');
    }
}

// Cargar tema guardado
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = '☀️ Modo Claro';
}

// Navegación
function goToStep(stepId) {
    document.querySelectorAll('.step').forEach(step => {
        step.style.display = 'none';
    });
    document.getElementById(stepId).style.display = 'block';
    window.scrollTo(0, 0);
}

function selectType(type) {
    currentType = type;
    document.getElementById('step-type').style.display = 'none';
    document.getElementById('step-input').style.display = 'block';

    if (type === 'cv') {
        document.getElementById('input-title').textContent = 'Pega tu Currículum';
        document.getElementById('cv-input').style.display = 'block';
        document.getElementById('carta-input').style.display = 'none';
        document.getElementById('legal-input').style.display = 'none';
    } else if (type === 'carta') {
        document.getElementById('input-title').textContent = 'Configura tu Carta';
        document.getElementById('cv-input').style.display = 'none';
        document.getElementById('carta-input').style.display = 'block';
        document.getElementById('legal-input').style.display = 'none';
        updateCartaPlaceholder();
    } else if (type === 'legal') {
        document.getElementById('input-title').textContent = 'Documento Legal/Transcripción';
        document.getElementById('cv-input').style.display = 'none';
        document.getElementById('carta-input').style.display = 'none';
        document.getElementById('legal-input').style.display = 'block';
    }
}

function updateCartaPlaceholder() {
    const tipo = document.getElementById('carta-tipo').value;
    const textarea = document.getElementById('carta-texto');
    const fecha = new Date().toLocaleDateString('es-ES', {year: 'numeric', month: 'long', day: 'numeric'});

    const placeholders = {
        formal: `${fecha}

Destinatario:
[Nombre del destinatario]
[Cargo]
[Empresa/Institución]

Estimado/a [Nombre]:

[Cuerpo de la carta - escribe aquí el contenido]

Atentamente,
[Tu nombre]
[Tu cargo]`,

        renuncia: `${fecha}

A: [Nombre del jefe/RRHH]
[Cargo]
[Empresa]

Estimado/a [Nombre]:

Por medio de la presente, comunico mi decisión de renunciar al puesto de [tu cargo] que he venido desempeñando en [empresa], efectiva a partir del [fecha].

Agradezco las oportunidades de desarrollo profesional y personal que me han brindado durante mi tiempo en la empresa.

Quedo a su disposición para realizar la transición de mis responsabilidades.

Atentamente,
[Tu nombre]
[Firma]`,

        recomendacion: `${fecha}

A quien corresponda:

Por medio de la presente, recomiendo ampliamente a [Nombre de la persona] quien trabajó bajo mi supervisión en [empresa] durante el período [fecha inicio - fecha fin].

Durante este tiempo, demostró ser una persona responsable, comprometida y con excelentes habilidades para [mencionar habilidades].

Sin más por el momento, quedo a su disposición para cualquier información adicional.

Atentamente,
[Tu nombre]
[Tu cargo]
[Teléfono de contacto]`,

        motivacion: `${fecha}

Estimados señores de [Empresa]:

Me dirijo a ustedes con el propósito de expresar mi interés en formar parte de su equipo de trabajo en el puesto de [puesto].

Considero que mi experiencia en [área] y mis habilidades en [habilidades] me hacen un candidato ideal para este puesto.

Adjunto mi currículum vitae para su consideración y quedo a su disposición para una entrevista personal.

Atentamente,
[Tu nombre]
[Teléfono]
[Email]`,

        personal: `${fecha}

Estimado/a [Nombre]:

[Escribe aquí el contenido de tu carta personal]

Sin más por el momento, recibe un cordial saludo.

Atentamente,
[Tu nombre]`
    };

    textarea.placeholder = placeholders[tipo] || placeholders.formal;
}

// GENERAR CV
function generarCV() {
    const texto = document.getElementById('cv-texto').value.trim();
    const foto = document.getElementById('cv-foto-url').value.trim();

    if (!texto) {
        alert('❌ Por favor pega el contenido de tu CV');
        return;
    }

    currentCVData = parsearCV(texto, foto);
    renderizarCV(currentStyle);

    document.getElementById('style-selector-cv').style.display = 'block';
    document.getElementById('step-input').style.display = 'none';
    document.getElementById('step-preview').style.display = 'block';
    window.scrollTo(0, 0);
}

// Parsear CV
function parsearCV(texto, foto) {
    const lineas = texto.split('\n').map(l => l.trim()).filter(l => l);
    const datos = {
        nombre: '', titulo: '', telefono: '', email: '', ciudad: '', linkedin: '',
        perfil: '', experiencia: [], educacion: [], habilidades: '', idiomas: '', cursos: [], foto: foto
    };

    let seccionActual = 'inicio';
    let bufferExp = null;

    const keywords = {
        perfil: ['PERFIL PROFESIONAL', 'PERFIL', 'OBJETIVO', 'SOBRE MÍ', 'SOBRE MI'],
        experiencia: ['EXPERIENCIA LABORAL', 'EXPERIENCIA PROFESIONAL', 'EXPERIENCIA'],
        educacion: ['FORMACIÓN ACADÉMICA', 'EDUCACIÓN', 'EDUCACION', 'ESTUDIOS'],
        habilidades: ['HABILIDADES', 'SKILLS', 'COMPETENCIAS'],
        idiomas: ['IDIOMAS', 'LANGUAGES'],
        cursos: ['CURSOS', 'CERTIFICACIONES', 'CAPACITACIONES']
    };

    for (let i = 0; i < lineas.length; i++) {
        const linea = lineas[i];
        const lineaUpper = linea.toUpperCase();
        let esInicioSeccion = false;

        for (const [key, words] of Object.entries(keywords)) {
            if (words.some(w => lineaUpper.includes(w))) {
                if (bufferExp) { datos.experiencia.push(bufferExp); bufferExp = null; }
                seccionActual = key;
                esInicioSeccion = true;
                break;
            }
        }

        if (esInicioSeccion) continue;

        if (seccionActual === 'inicio') {
            if (!datos.nombre && i === 0) datos.nombre = linea;
            else if (!datos.titulo && i === 1 && linea.length < 100) datos.titulo = linea;
            else if (linea.match(/04\d{2}-?\d{7}/) || linea.toLowerCase().includes('teléfono')) datos.telefono = linea.replace(/.*?:\s*/i, '').trim();
            else if (linea.includes('@')) datos.email = linea.replace(/.*?:\s*/i, '').trim();
            else if (linea.toLowerCase().match(/ciudad|ubicación|direccion|edo\.|estado/)) datos.ciudad = linea.replace(/.*?:\s*/i, '').trim();
            else if (linea.toLowerCase().match(/linkedin|web|portfolio/)) datos.linkedin = linea.replace(/.*?:\s*/i, '').trim();
        } else if (seccionActual === 'perfil') {
            datos.perfil += linea + ' ';
        } else if (seccionActual === 'experiencia') {
            if (linea.includes(' - ') || linea.match(/\(\d{4}/)) {
                if (bufferExp) datos.experiencia.push(bufferExp);
                const partes = linea.split(' - ');
                bufferExp = {
                    cargo: partes[0].trim(),
                    empresa: partes[1] ? partes[1].replace(/\(.*?\)/, '').trim() : '',
                    fecha: linea.match(/\(.*?\)/) ? linea.match(/\(.*?\)/)[0] : '',
                    descripcion: ''
                };
            } else if (bufferExp && linea.startsWith('-')) {
                bufferExp.descripcion += linea.substring(1).trim() + ' ';
            } else if (bufferExp) {
                bufferExp.descripcion += linea + ' ';
            }
        } else if (seccionActual === 'educacion') {
            if (linea.includes(' - ') || linea.match(/\d{4}/)) {
                const partes = linea.split(' - ');
                const anioMatch = linea.match(/\d{4}/);
                datos.educacion.push({
                    titulo: partes[0].trim(),
                    institucion: partes[1] ? partes[1].replace(/\(.*?\)/, '').trim() : '',
                    anio: anioMatch ? anioMatch[0] : ''
                });
            }
        } else if (seccionActual === 'habilidades') {
            datos.habilidades += linea + ', ';
        } else if (seccionActual === 'idiomas') {
            datos.idiomas += linea + ', ';
        } else if (seccionActual === 'cursos') {
            if (linea.includes(' - ') || linea.match(/\d{4}/)) {
                const partes = linea.split(' - ');
                const anioMatch = linea.match(/\d{4}/);
                datos.cursos.push({
                    nombre: partes[0].trim(),
                    institucion: partes[1] ? partes[1].replace(/\(.*?\)/, '').trim() : '',
                    anio: anioMatch ? anioMatch[0] : ''
                });
            }
        }
    }

    if (bufferExp) datos.experiencia.push(bufferExp);
    datos.habilidades = datos.habilidades.replace(/,\s*$/, '');
    datos.idiomas = datos.idiomas.replace(/,\s*$/, '');
    datos.perfil = datos.perfil.trim();

    return datos;
}

// Renderizar CV
function renderizarCV(estilo) {
    let html = '';
    switch(estilo) {
        case 'moderno': html = generarCVModerno(); break;
        case 'clasico': html = generarCVClasico(); break;
        case 'creativo': html = generarCVCreativo(); break;
        case 'minimalista': html = generarCVMinimalista(); break;
        case 'profesional': html = generarCVProfesional(); break;
    }
    document.getElementById('document-preview').innerHTML = html;
}

// Funciones de estilo CV
function generarCVModerno() {
    const d = currentCVData;
    let sidebar = `<div class="cv-sidebar">`;
    if (d.foto) sidebar += `<img src="${d.foto}" style="width:150px; height:150px; border-radius:50%; object-fit:cover; margin-bottom:20px; border: 4px solid white;">`;
    sidebar += `<h2 style="margin-bottom:20px;">${d.nombre}</h2>`;
    if (d.titulo) sidebar += `<p style="font-size:1.1rem; margin-bottom:15px;">${d.titulo}</p>`;
    if (d.telefono) sidebar += `<p>📞 ${d.telefono}</p>`;
    if (d.email) sidebar += `<p>✉️ ${d.email}</p>`;
    if (d.ciudad) sidebar += `<p>📍 ${d.ciudad}</p>`;
    if (d.linkedin) sidebar += `<p>🔗 ${d.linkedin}</p>`;
    if (d.habilidades) sidebar += `<div style="margin-top:30px;"><h3 style="border-bottom:2px solid white; padding-bottom:10px; margin-bottom:15px;">Habilidades</h3><p>${d.habilidades}</p></div>`;
    if (d.idiomas) sidebar += `<div style="margin-top:20px;"><h3 style="border-bottom:2px solid white; padding-bottom:10px; margin-bottom:15px;">Idiomas</h3><p>${d.idiomas}</p></div>`;
    sidebar += `</div>`;

    let main = `<div class="cv-main">`;
    if (d.perfil) main += `<div style="margin-bottom:30px;"><h2 style="color:#3b82f6; border-bottom:3px solid #3b82f6; padding-bottom:10px; margin-bottom:15px;">Perfil Profesional</h2><p style="line-height:1.6;">${d.perfil}</p></div>`;
    if (d.experiencia.length > 0) {
        main += `<div style="margin-bottom:30px;"><h2 style="color:#3b82f6; border-bottom:3px solid #3b82f6; padding-bottom:10px; margin-bottom:15px;">Experiencia Laboral</h2>`;
        d.experiencia.forEach(e => {
            main += `<div style="margin-bottom:20px;"><h3 style="margin-bottom:5px;">${e.cargo}</h3><p style="color:#6b7280; font-style:italic; margin-bottom:10px;">${e.empresa} ${e.fecha}</p><p style="line-height:1.6;">${e.descripcion}</p></div>`;
        });
        main += `</div>`;
    }
    if (d.educacion.length > 0) {
        main += `<div style="margin-bottom:30px;"><h2 style="color:#3b82f6; border-bottom:3px solid #3b82f6; padding-bottom:10px; margin-bottom:15px;">Educación</h2>`;
        d.educacion.forEach(e => {
            main += `<div style="margin-bottom:15px;"><h3 style="margin-bottom:5px;">${e.titulo}</h3><p style="color:#6b7280; font-style:italic;">${e.institucion} ${e.anio}</p></div>`;
        });
        main += `</div>`;
    }
    if (d.cursos.length > 0) {
        main += `<div style="margin-bottom:30px;"><h2 style="color:#3b82f6; border-bottom:3px solid #3b82f6; padding-bottom:10px; margin-bottom:15px;">Cursos</h2>`;
        d.cursos.forEach(c => {
            main += `<div style="margin-bottom:15px;"><h3 style="margin-bottom:5px;">${c.nombre}</h3><p style="color:#6b7280; font-style:italic;">${c.institucion} ${c.anio}</p></div>`;
        });
        main += `</div>`;
    }
    main += `</div>`;
    return `<div class="cv-moderno">${sidebar}${main}</div>`;
}

function generarCVClasico() {
    const d = currentCVData;
    let html = `<div class="cv-clasico"><div class="cv-header"><h1 style="font-size:2rem; margin-bottom:10px;">${d.nombre}</h1>`;
    if (d.titulo) html += `<p style="font-size:1.2rem; color:#6b7280; margin-bottom:10px;">${d.titulo}</p>`;
    html += `<div style="color:#6b7280;">`;
    if (d.telefono) html += `<span>${d.telefono}</span>`;
    if (d.email) html += `<span> | ${d.email}</span>`;
    if (d.ciudad) html += `<span> | ${d.ciudad}</span>`;
    html += `</div></div>`;
    if (d.perfil) html += `<div style="margin-bottom:30px; text-align:left;"><h2 style="border-bottom:2px solid #333; padding-bottom:5px; margin-bottom:15px;">PERFIL PROFESIONAL</h2><p style="line-height:1.6;">${d.perfil}</p></div>`;
    if (d.experiencia.length > 0) {
        html += `<div style="margin-bottom:30px; text-align:left;"><h2 style="border-bottom:2px solid #333; padding-bottom:5px; margin-bottom:15px;">EXPERIENCIA LABORAL</h2>`;
        d.experiencia.forEach(e => {
            html += `<div style="margin-bottom:20px;"><h3 style="margin-bottom:5px;">${e.cargo}</h3><p style="color:#6b7280; font-style:italic; margin-bottom:10px;">${e.empresa} ${e.fecha}</p><p style="line-height:1.6;">${e.descripcion}</p></div>`;
        });
        html += `</div>`;
    }
    if (d.educacion.length > 0) {
        html += `<div style="margin-bottom:30px; text-align:left;"><h2 style="border-bottom:2px solid #333; padding-bottom:5px; margin-bottom:15px;">EDUCACIÓN</h2>`;
        d.educacion.forEach(e => {
            html += `<div style="margin-bottom:15px;"><h3 style="margin-bottom:5px;">${e.titulo}</h3><p style="color:#6b7280; font-style:italic;">${e.institucion} ${e.anio}</p></div>`;
        });
        html += `</div>`;
    }
    if (d.habilidades) html += `<div style="margin-bottom:30px; text-align:left;"><h2 style="border-bottom:2px solid #333; padding-bottom:5px; margin-bottom:15px;">HABILIDADES</h2><p>${d.habilidades}</p></div>`;
    if (d.idiomas) html += `<div style="margin-bottom:30px; text-align:left;"><h2 style="border-bottom:2px solid #333; padding-bottom:5px; margin-bottom:15px;">IDIOMAS</h2><p>${d.idiomas}</p></div>`;
    html += `</div>`;
    return html;
}

function generarCVCreativo() {
    const d = currentCVData;
    let html = `<div class="cv-creativo"><div class="cv-header"><h1 style="font-size:2.5rem; margin-bottom:10px;">${d.nombre}</h1>`;
    if (d.titulo) html += `<p style="font-size:1.2rem; margin-bottom:10px;">${d.titulo}</p>`;
    html += `<div style="font-size:1.1rem;">`;
    if (d.telefono) html += `<span>📞 ${d.telefono}</span>`;
    if (d.email) html += `<span> | ✉️ ${d.email}</span>`;
    if (d.ciudad) html += `<span> | 📍 ${d.ciudad}</span>`;
    html += `</div></div>`;
    if (d.perfil) html += `<div style="margin-bottom:30px;"><h2 style="color:#f59e0b; margin-bottom:15px;">Sobre Mí</h2><p style="line-height:1.6;">${d.perfil}</p></div>`;
    if (d.experiencia.length > 0) {
        html += `<div style="margin-bottom:30px;"><h2 style="color:#f59e0b; margin-bottom:15px;">Experiencia</h2>`;
        d.experiencia.forEach(e => {
            html += `<div style="margin-bottom:20px; padding-left:15px; border-left:4px solid #f59e0b;"><h3 style="margin-bottom:5px;">${e.cargo}</h3><p style="color:#6b7280; font-style:italic; margin-bottom:10px;">${e.empresa} ${e.fecha}</p><p style="line-height:1.6;">${e.descripcion}</p></div>`;
        });
        html += `</div>`;
    }
    if (d.educacion.length > 0) {
        html += `<div style="margin-bottom:30px;"><h2 style="color:#f59e0b; margin-bottom:15px;">Educación</h2>`;
        d.educacion.forEach(e => {
            html += `<div style="margin-bottom:15px; padding-left:15px; border-left:4px solid #f59e0b;"><h3 style="margin-bottom:5px;">${e.titulo}</h3><p style="color:#6b7280; font-style:italic;">${e.institucion} ${e.anio}</p></div>`;
        });
        html += `</div>`;
    }
    if (d.habilidades) html += `<div style="margin-bottom:30px;"><h2 style="color:#f59e0b; margin-bottom:15px;">Habilidades</h2><p>${d.habilidades}</p></div>`;
    if (d.idiomas) html += `<div style="margin-bottom:30px;"><h2 style="color:#f59e0b; margin-bottom:15px;">Idiomas</h2><p>${d.idiomas}</p></div>`;
    html += `</div>`;
    return html;
}

function generarCVMinimalista() {
    const d = currentCVData;
    let html = `<div class="cv-minimalista"><div class="cv-header"><h1 style="font-size:2.5rem; font-weight:300; margin-bottom:10px;">${d.nombre}</h1>`;
    if (d.titulo) html += `<p style="font-size:1.2rem; color:#6b7280; margin-bottom:10px;">${d.titulo}</p>`;
    html += `<div style="color:#6b7280;">`;
    if (d.telefono) html += `<span>${d.telefono}</span>`;
    if (d.email) html += `<span> · ${d.email}</span>`;
    if (d.ciudad) html += `<span> · ${d.ciudad}</span>`;
    html += `</div></div>`;
    if (d.perfil) html += `<div style="margin-bottom:40px;"><p style="line-height:1.8; font-size:1.1rem;">${d.perfil}</p></div>`;
    if (d.experiencia.length > 0) {
        html += `<div style="margin-bottom:40px;"><h2 style="font-weight:300; font-size:1.2rem; margin-bottom:20px; text-transform:uppercase; letter-spacing:2px;">Experiencia</h2>`;
        d.experiencia.forEach(e => {
            html += `<div style="margin-bottom:25px;"><h3 style="font-weight:500; margin-bottom:5px;">${e.cargo}</h3><p style="color:#6b7280; font-style:italic; margin-bottom:10px;">${e.empresa} ${e.fecha}</p><p style="line-height:1.6;">${e.descripcion}</p></div>`;
        });
        html += `</div>`;
    }
    if (d.educacion.length > 0) {
        html += `<div style="margin-bottom:40px;"><h2 style="font-weight:300; font-size:1.2rem; margin-bottom:20px; text-transform:uppercase; letter-spacing:2px;">Educación</h2>`;
        d.educacion.forEach(e => {
            html += `<div style="margin-bottom:20px;"><h3 style="font-weight:500; margin-bottom:5px;">${e.titulo}</h3><p style="color:#6b7280; font-style:italic;">${e.institucion} ${e.anio}</p></div>`;
        });
        html += `</div>`;
    }
    if (d.habilidades) html += `<div style="margin-bottom:40px;"><h2 style="font-weight:300; font-size:1.2rem; margin-bottom:20px; text-transform:uppercase; letter-spacing:2px;">Habilidades</h2><p>${d.habilidades}</p></div>`;
    if (d.idiomas) html += `<div style="margin-bottom:40px;"><h2 style="font-weight:300; font-size:1.2rem; margin-bottom:20px; text-transform:uppercase; letter-spacing:2px;">Idiomas</h2><p>${d.idiomas}</p></div>`;
    html += `</div>`;
    return html;
}

function generarCVProfesional() {
    const d = currentCVData;
    let sidebar = `<div class="cv-sidebar">`;
    if (d.foto) sidebar += `<img src="${d.foto}" style="width:150px; height:150px; border-radius:50%; object-fit:cover; margin-bottom:20px;">`;
    sidebar += `<h2 style="margin-bottom:20px; color:#1e3a8a;">${d.nombre}</h2>`;
    if (d.titulo) sidebar += `<p style="color:#6b7280; margin-bottom:15px;">${d.titulo}</p>`;
    if (d.telefono) sidebar += `<p>📞 ${d.telefono}</p>`;
    if (d.email) sidebar += `<p>✉️ ${d.email}</p>`;
    if (d.ciudad) sidebar += `<p>📍 ${d.ciudad}</p>`;
    if (d.linkedin) sidebar += `<p>🔗 ${d.linkedin}</p>`;
    if (d.habilidades) sidebar += `<div style="margin-top:30px;"><h3 style="color:#1e3a8a; border-bottom:2px solid #1e3a8a; padding-bottom:10px; margin-bottom:15px;">Habilidades</h3><p>${d.habilidades}</p></div>`;
    if (d.idiomas) sidebar += `<div style="margin-top:20px;"><h3 style="color:#1e3a8a; border-bottom:2px solid #1e3a8a; padding-bottom:10px; margin-bottom:15px;">Idiomas</h3><p>${d.idiomas}</p></div>`;
    sidebar += `</div>`;

    let main = `<div>`;
    if (d.perfil) main += `<div style="margin-bottom:30px;"><h2 style="color:#1e3a8a; border-bottom:3px solid #1e3a8a; padding-bottom:10px; margin-bottom:15px;">Perfil Profesional</h2><p style="line-height:1.6;">${d.perfil}</p></div>`;
    if (d.experiencia.length > 0) {
        main += `<div style="margin-bottom:30px;"><h2 style="color:#1e3a8a; border-bottom:3px solid #1e3a8a; padding-bottom:10px; margin-bottom:15px;">Experiencia Laboral</h2>`;
        d.experiencia.forEach(e => {
            main += `<div style="margin-bottom:20px;"><h3 style="margin-bottom:5px;">${e.cargo}</h3><p style="color:#6b7280; font-style:italic; margin-bottom:10px;">${e.empresa} ${e.fecha}</p><p style="line-height:1.6;">${e.descripcion}</p></div>`;
        });
        main += `</div>`;
    }
    if (d.educacion.length > 0) {
        main += `<div style="margin-bottom:30px;"><h2 style="color:#1e3a8a; border-bottom:3px solid #1e3a8a; padding-bottom:10px; margin-bottom:15px;">Educación</h2>`;
        d.educacion.forEach(e => {
            main += `<div style="margin-bottom:15px;"><h3 style="margin-bottom:5px;">${e.titulo}</h3><p style="color:#6b7280; font-style:italic;">${e.institucion} ${e.anio}</p></div>`;
        });
        main += `</div>`;
    }
    if (d.cursos.length > 0) {
        main += `<div style="margin-bottom:30px;"><h2 style="color:#1e3a8a; border-bottom:3px solid #1e3a8a; padding-bottom:10px; margin-bottom:15px;">Cursos</h2>`;
        d.cursos.forEach(c => {
            main += `<div style="margin-bottom:15px;"><h3 style="margin-bottom:5px;">${c.nombre}</h3><p style="color:#6b7280; font-style:italic;">${c.institucion} ${c.anio}</p></div>`;
        });
        main += `</div>`;
    }
    main += `</div>`;
    return `<div class="cv-profesional">${sidebar}${main}</div>`;
}

// GENERAR CARTA
function generarCarta() {
    const texto = document.getElementById('carta-texto').value.trim();
    
    if (!texto) {
        alert('❌ Por favor escribe el contenido de la carta');
        return;
    }

    let html = `<div class="carta-formal">`;
    html += `<div class="cuerpo" style="white-space: pre-line; font-family:'Times New Roman', Times, serif; font-size:12pt; line-height:1.5;">${texto}</div>`;
    html += `</div>`;

    document.getElementById('document-preview').innerHTML = html;
    document.getElementById('style-selector-cv').style.display = 'none';
    document.getElementById('step-input').style.display = 'none';
    document.getElementById('step-preview').style.display = 'block';
    window.scrollTo(0, 0);
}

// GENERAR DOCUMENTO LEGAL
function generarLegal() {
    const tipo = document.getElementById('legal-tipo').value;
    const titulo = document.getElementById('legal-titulo').value || 'Documento';
    const fecha = document.getElementById('legal-fecha').value;
    const lugar = document.getElementById('legal-lugar').value;
    const contenido = document.getElementById('legal-texto').value.trim();

    if (!contenido) {
        alert('❌ Por favor ingresa el contenido del documento');
        return;
    }

    let html = '';
    const fechaFormateada = fecha ? new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', {year: 'numeric', month: 'long', day: 'numeric'}) : '';

    if (tipo === 'apa') {
        // APA 2.0 (doble espacio)
        html = `<div class="apa-2">`;
        html += `<div style="text-align:center; margin-bottom:30px;"><h1 style="font-size:12pt; margin-bottom:10px;">${titulo}</h1>`;
        if (fechaFormateada) html += `<p style="font-size:12pt;">${fechaFormateada}</p>`;
        if (lugar) html += `<p style="font-size:12pt;">${lugar}</p>`;
        html += `</div>`;
        const parrafos = contenido.split('\n\n').filter(p => p.trim());
        parrafos.forEach(p => {
            html += `<p style="text-indent:1.27cm; margin-bottom:0;">${p.trim()}</p>`;
        });
        html += `</div>`;
    } else if (tipo === 'apa15') {
        // APA 1.5
        html = `<div class="apa-15">`;
        html += `<div style="text-align:center; margin-bottom:30px;"><h1 style="font-size:12pt; margin-bottom:10px;">${titulo}</h1>`;
        if (fechaFormateada) html += `<p style="font-size:12pt;">${fechaFormateada}</p>`;
        if (lugar) html += `<p style="font-size:12pt;">${lugar}</p>`;
        html += `</div>`;
        const parrafos = contenido.split('\n\n').filter(p => p.trim());
        parrafos.forEach(p => {
            html += `<p style="text-indent:1.27cm; margin-bottom:0;">${p.trim()}</p>`;
        });
        html += `</div>`;
    } else if (tipo === 'legal') {
        // Documento Legal
        html = `<div class="legal-doc">`;
        html += `<div class="header"><h1 style="font-size:14pt; margin-bottom:10px;">${titulo}</h1>`;
        if (fechaFormateada) html += `<p style="font-size:12pt;"><strong>Fecha:</strong> ${fechaFormateada}</p>`;
        if (lugar) html += `<p style="font-size:12pt;"><strong>Lugar:</strong> ${lugar}</p>`;
        html += `</div>`;
        const lineas = contenido.split('\n').filter(l => l.trim());
        lineas.forEach(linea => {
            const match = linea.match(/^([A-ZÁÉÍÓÚÑa-záéíóúñ\s]+):\s*(.+)$/);
            if (match) {
                html += `<div class="dialogo" style="margin-bottom:15px;"><span class="hablante">${match[1]}:</span> ${match[2]}</div>`;
            } else {
                html += `<p style="margin-bottom:10px;">${linea}</p>`;
            }
        });
        html += `</div>`;
    } else {
        // Transcripción general
        html = `<div style="font-family:'Times New Roman', serif; font-size:12pt; line-height:1.5;">`;
        html += `<h1 style="text-align:center; margin-bottom:30px;">${titulo}</h1>`;
        if (fechaFormateada) html += `<p style="text-align:center; margin-bottom:10px;"><strong>Fecha:</strong> ${fechaFormateada}</p>`;
        if (lugar) html += `<p style="text-align:center; margin-bottom:30px;"><strong>Lugar:</strong> ${lugar}</p>`;
        html += `<div style="white-space: pre-line;">${contenido}</div>`;
        html += `</div>`;
    }

    document.getElementById('document-preview').innerHTML = html;
    document.getElementById('style-selector-cv').style.display = 'none';
    document.getElementById('step-input').style.display = 'none';
    document.getElementById('step-preview').style.display = 'block';
    window.scrollTo(0, 0);
}

// CAMBIAR ESTILO CV
function cambiarEstiloCV(estilo) {
    currentStyle = estilo;
    document.querySelectorAll('.style-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderizarCV(estilo);
}

// EDITAR DOCUMENTO
function editarDocumento() {
    document.getElementById('step-preview').style.display = 'none';
    document.getElementById('step-input').style.display = 'block';
    window.scrollTo(0, 0);
}

// NUEVO DOCUMENTO
function nuevoDocumento() {
    if (confirm('¿Seguro que quieres crear un nuevo documento?')) {
        document.getElementById('cv-texto').value = '';
        document.getElementById('cv-foto-url').value = '';
        document.getElementById('carta-texto').value = '';
        document.getElementById('legal-texto').value = '';
        document.getElementById('legal-titulo').value = '';
        currentCVData = null;
        currentType = '';
        document.getElementById('step-preview').style.display = 'none';
        document.getElementById('step-type').style.display = 'block';
        window.scrollTo(0, 0);
    }
}

// DESCARGAR PDF
function descargarPDF() {
    window.print();
}

// DESCARGAR WORD
function descargarWord() {
    const content = document.getElementById('document-preview').innerHTML;
    const html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
    <meta charset='utf-8'>
    <title>Documento</title>
    <style>
    body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; }
    </style>
    </head>
    <body>${content}</body>
    </html>
    `;
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'documento.doc';
    link.click();
    URL.revokeObjectURL(url);
    alert('📝 Documento descargado. Ábrelo con Word para editar.');
}
