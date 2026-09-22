// VARIABLES GLOBALES
let currentType = '';
let currentCVData = null;
let currentStyle = 'moderno';

// ============================================
// UTILIDADES DE SEGURIDAD (evitan que texto pegado rompa el HTML)
// ============================================
function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function sanitizeFotoUrl(url) {
    if (!url) return '';
    const limpio = url.trim();
    if (/^(https?:)?\/\//i.test(limpio) || /^data:image\//i.test(limpio)) {
        return limpio;
    }
    return '';
}

// Copia el texto plano de cualquier elemento (editor o vista previa) al portapapeles
function copiarElemento(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const texto = (el.innerText !== undefined ? el.innerText : el.value) || '';
    if (!texto.trim()) {
        alert('❌ No hay texto para copiar todavía.');
        return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(texto)
            .then(() => alert('✅ Texto copiado al portapapeles.'))
            .catch(() => alert('❌ No se pudo copiar automáticamente. Selecciona el texto y usa Ctrl+C.'));
    } else {
        alert('❌ Tu navegador no permite copiar automáticamente. Selecciona el texto y usa Ctrl+C.');
    }
}

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

// ============================================
// PLANTILLAS DE CARTAS CON EJEMPLOS COMPLETOS
// ============================================
function updateCartaPlaceholder() {
    const tipo = document.getElementById('carta-tipo').value;
    const textarea = document.getElementById('carta-texto');

    const ejemplos = {
        // ============================================
        // CARTAS LABORALES
        // ============================================
        trabajo: `Ciudad de México, 15 de julio de 2025

A QUIEN CORRESPONDA:

Por medio de la presente, hago constar que (María González Ramírez), con documento de identidad (V-18.456.789), labora en (Distribuidora ABC, C.A.) desde el (15 de marzo de 2020) hasta la fecha, desempeñando el cargo de (Coordinadora de Ventas).

Durante su tiempo en la empresa, ha demostrado ser una persona responsable, cumplida y con excelente desempeño en sus funciones, destacándose por su liderazgo y compromiso con los objetivos del equipo.

Se expide la presente carta a solicitud del interesado para los fines que estime convenientes.

Atentamente,

(Carlos Mendoza)
(Gerente de Recursos Humanos)
(Distribuidora ABC, C.A.)
(Teléfono: 0212-555-1234)
(Email: rrhh@distribuidoraabc.com)`,

        renuncia: `Ciudad de México, 15 de julio de 2025

A: (Lic. Roberto Sánchez)
(Director de Recursos Humanos)
(Empresa XYZ, S.A. de C.V.)

Estimado (Lic. Sánchez):

Por medio de la presente, comunico mi decisión de renunciar voluntariamente al cargo de (Analista de Marketing Digital) que he venido desempeñando en (Empresa XYZ, S.A. de C.V.), efectiva a partir del (30 de julio de 2025).

Esta decisión responde a motivos estrictamente personales y profesionales que me impiden continuar formando parte de su equipo de trabajo.

Agradezco profundamente las oportunidades de crecimiento profesional y personal que me han brindado durante mi tiempo en la empresa, así como la confianza depositada en mi persona durante estos (3 años).

Me comprometo a realizar una transición ordenada de mis responsabilidades y dejar todos los procesos en orden antes de mi salida.

Sin más por el momento, me despido cordialmente.

Atentamente,

(Ana Lucía Fernández)
(Analista de Marketing Digital)
(V-22.345.678)
(Firma)`,

        despido: `Ciudad de México, 15 de julio de 2025

(Pedro Jiménez López)
(Técnico de Soporte)
Presente.-

Estimado (Sr. Jiménez):

Por medio de la presente, lamentamos informarle que la empresa (TechSolutions México, S.A. de C.V.) ha tomado la decisión de dar por terminado su contrato de trabajo, efectiva a partir del (31 de julio de 2025).

Esta decisión se basa en (reestructuración organizacional del departamento de soporte técnico, que ha reducido la necesidad de personal en su área).

Le informamos que se realizará el pago de sus prestaciones sociales, liquidación y demás derechos laborales que le corresponden según la legislación vigente, en la fecha (15 de agosto de 2025).

Agradecemos los servicios prestados durante su tiempo en la empresa y le deseamos éxito en sus futuros proyectos profesionales.

Atentamente,

(Lic. Patricia Morales)
(Directora de Recursos Humanos)
(TechSolutions México, S.A. de C.V.)
(Firma y sello)`,

        recomendacion: `Ciudad de México, 15 de julio de 2025

A QUIEN CORRESPONDA:

Por medio de la presente, recomiendo ampliamente a (Juan Carlos Pérez), quien laboró bajo mi supervisión en (Grupo Empresarial del Norte, S.A.) durante el período comprendido entre (enero de 2021) y (junio de 2024), desempeñando el cargo de (Supervisor de Logística).

Durante este tiempo, (Juan Carlos) demostró ser una persona altamente responsable, comprometida, proactiva y con excelentes habilidades para (la coordinación de equipos, la resolución de problemas bajo presión y la optimización de procesos de distribución).

Su desempeño fue siempre satisfactorio, cumpliendo con las metas establecidas y manteniendo una actitud positiva hacia el trabajo y sus compañeros. Fue pieza clave en la reducción de tiempos de entrega en un 25%.

No tengo inconveniente en recomendarlo para cualquier posición que desee desempeñar, ya que estoy convencido de que será un valioso aporte para cualquier organización.

Quedo a su disposición para cualquier información adicional que requieran.

Atentamente,

(Ing. Miguel Ángel Torres)
(Gerente de Operaciones)
(Grupo Empresarial del Norte, S.A.)
(Teléfono: 0212-555-9876)
(Email: mtorres@gruponorte.com)`,

        permiso: `Ciudad de México, 15 de julio de 2025

A: (Lic. Fernando Gutiérrez)
(Gerente de Área)
(Empresa Comercial del Sur, S.A.)

Estimado (Lic. Gutiérrez):

Por medio de la presente, solicito formalmente se me conceda un permiso (no remunerado) por (3) días, desde el (20 de julio de 2025) hasta el (22 de julio de 2025), por motivos de (asistencia al matrimonio de mi hermana en la ciudad de Guadalajara, Jalisco).

Me comprometo a dejar todas mis responsabilidades debidamente organizadas y delegadas en (mi compañera Laura Martínez) antes de mi ausencia, así como a reintegrarme a mis labores el día (23 de julio de 2025) en el horario habitual.

Agradezco de antemano su comprensión y atención a esta solicitud.

Atentamente,

(Ricardo Álvarez Mendoza)
(Analista Contable)
(V-19.876.543)
(Firma)`,

        aumentosalarial: `Ciudad de México, 15 de julio de 2025

(Lic. Roberto Fernández)
(Gerente de Recursos Humanos)
(Distribuidora Andina, S.A. de C.V.)

Estimado (Lic. Fernández):

Por medio de la presente, me dirijo a usted con el fin de solicitar formalmente una revisión de mi remuneración actual como (Analista de Ventas), cargo que desempeño desde hace (2 años y 4 meses).

Durante este período he asumido responsabilidades adicionales, incluyendo (la coordinación de la cartera de clientes corporativos), lo que ha representado (un incremento del 18% en las ventas de mi zona asignada). Considero que mi desempeño y crecimiento dentro de la organización justifican una actualización salarial acorde a las funciones actuales.

Quedo a su disposición para conversar los detalles en el momento que estime conveniente.

Atentamente,

(Marianela Sequera)
(Analista de Ventas)
(V-19.234.567)`,

        vacaciones: `Ciudad de México, 15 de julio de 2025

(Lic. Patricia Uzcátegui)
(Coordinadora de Recursos Humanos)
(Textiles del Centro, S.A. de C.V.)

Estimada (Lic. Uzcátegui):

Por medio de la presente solicito formalmente el disfrute de mi período vacacional correspondiente, a partir del (1 de agosto de 2025) hasta el (15 de agosto de 2025), ambas fechas inclusive.

Antes de mi salida, dejaré organizadas y delegadas mis funciones pendientes con (mi compañero Andrés Ruiz), garantizando así la continuidad operativa durante mi ausencia.

Agradezco de antemano la aprobación de esta solicitud.

Atentamente,

(Verónica Alejandra Duque)
(Analista de Compras)
(V-22.345.678)`,

        finiquito: `Ciudad de México, 15 de julio de 2025

CARTA DE FINIQUITO Y LIQUIDACIÓN LABORAL

Por medio de la presente, se hace constar que (Miguel Ángel Rojas), identificado con (cédula de identidad V-20.987.654), quien laboró en (Constructora del Valle, S.A. de C.V.) desempeñando el cargo de (Supervisor de Obra) desde el (1 de marzo de 2020) hasta el (15 de julio de 2025), ha recibido en este acto el pago total y definitivo de sus prestaciones sociales, salarios pendientes, vacaciones no disfrutadas y demás conceptos laborales que le correspondan, por un monto total de ($45,000.00 (cuarenta y cinco mil pesos 00/100 M.N.)).

El trabajador declara recibir dicha cantidad a su entera satisfacción, no teniendo nada más que reclamar a la empresa por concepto alguno derivado de la relación laboral que existió entre ambas partes.

Se firma la presente en (Ciudad de México), a los (15) días del mes de (julio) de (2025).

TRABAJADOR:                                    EMPRESA:

(Miguel Ángel Rojas)                          (Lic. Fernanda Castillo)
(V-20.987.654)                                (Representante de Recursos Humanos)
(Firma)                                        (Firma y sello)`,

        // ============================================
        // CARTAS ADMINISTRATIVAS Y COMERCIALES
        // ============================================
        autorizacion: `Ciudad de México, 15 de julio de 2025

A QUIEN CORRESPONDA:

Yo, (Laura Beatriz Ramírez), identificada con (cédula de identidad V-20.123.456), por medio de la presente autorizo a (Carlos Eduardo Méndez), identificado con (cédula de identidad V-18.765.432), para que en mi nombre realice el siguiente trámite:

(Retirar el título universitario original de la Universidad Nacional Autónoma de México, correspondiente a la carrera de Licenciatura en Administración, generado en el período 2018-2022).

Esta autorización es válida desde el (15 de julio de 2025) hasta el (30 de julio de 2025) o hasta que sea revocada por escrito.

Agradezco de antemano la atención prestada a la presente.

Atentamente,

(Laura Beatriz Ramírez)
(V-20.123.456)
(Teléfono: 044-55-1234-5678)
(Firma)`,

        compromiso: `Ciudad de México, 15 de julio de 2025

CARTA DE COMPROMISO

Yo, (Roberto Sánchez Díaz), identificado con (cédula de identidad V-15.234.567), en mi calidad de (representante legal de la empresa Constructora del Valle, C.A.), por medio de la presente me comprometo formalmente a:

(Realizar el pago de la suma de $25,000.00 (veinticinco mil pesos 00/100 M.N.) correspondiente a la factura N° 4521, por concepto de materiales de construcción suministrados por la empresa Proveedores Industriales, S.A.).

Me obligo a cumplir con este compromiso en el plazo establecido, que vence el (30 de julio de 2025).

En caso de incumplimiento, acepto las consecuencias legales y/o contractuales que de ello se deriven, incluyendo el pago de intereses moratorios según lo establecido en el contrato.

Se firma la presente en (Ciudad de México), a los (15) días del mes de (julio) de (2025).

Atentamente,

(Roberto Sánchez Díaz)
(V-15.234.567)
(Representante Legal - Constructora del Valle, C.A.)
(Firma)`,

        cobro: `Ciudad de México, 15 de julio de 2025

(Distribuidora El Sol, S.A. de C.V.)
(Av. Insurgentes Sur 1234, Col. Del Valle)
(Departamento de Cuentas por Cobrar)

Estimados señores:

Por medio de la presente, nos dirigimos a ustedes para solicitar formalmente el pago de la factura número (F-2025-0456) por un monto de ($18,500.00 (dieciocho mil quinientos pesos 00/100 M.N.)), la cual se encuentra vencida desde el (30 de junio de 2025).

Detalles de la deuda:
- Factura N°: (F-2025-0456)
- Fecha de emisión: (15 de junio de 2025)
- Fecha de vencimiento: (30 de junio de 2025)
- Monto adeudado: ($18,500.00)
- Concepto: (Suministro de equipos de oficina - 10 sillas ergonómicas y 5 escritorios)

Les solicitamos realizar el pago a la mayor brevedad posible en la siguiente cuenta bancaria:
- Banco: (BBVA)
- Cuenta: (0123 4567 8901 2345)
- Titular: (Mueblería Moderna, S.A. de C.V.)

En caso de que el pago ya haya sido realizado, agradecemos nos envíen el comprobante correspondiente.

Quedamos a su disposición para cualquier consulta o aclaración.

Atentamente,

(Fernanda López Castillo)
(Gerente de Finanzas)
(Teléfono: 0212-555-4321)
(Email: cobranzas@muebleriamoderna.com)`,

        presentacion: `Ciudad de México, 15 de julio de 2025

(Lic. Andrés Martínez)
(Director de Compras)
(Grupo Comercial del Pacífico, S.A.)
(Av. Revolución 567, Col. Centro)

Estimados señores:

Me dirijo a ustedes con el propósito de presentarme formalmente y poner a su disposición mis servicios profesionales en el área de (consultoría en marketing digital y estrategias de comercio electrónico).

Soy (Diana Sofía Herrera), (Licenciada en Mercadotecnia con Maestría en Marketing Digital), con (8) años de experiencia en (el desarrollo de estrategias digitales para empresas del sector retail). A lo largo de mi trayectoria, he trabajado en (empresas como Amazon México, Liverpool y El Palacio de Hierro), donde he desarrollado habilidades en (SEO, SEM, análisis de datos y gestión de campañas publicitarias).

Ofrezco servicios de:
- (Auditoría y estrategia de marketing digital)
- (Gestión de campañas en Google Ads y Meta Ads)
- (Optimización de conversión en tiendas en línea)

Estoy convencida de que mi experiencia y competencias pueden aportar valor significativo a su organización, especialmente en su expansión al comercio electrónico. Adjunto mi currículum vitae para su consideración y quedo a su entera disposición para concertar una entrevista personal.

Agradezco de antemano su atención y tiempo.

Atentamente,

(Diana Sofía Herrera)
(Licenciada en Mercadotecnia)
(Teléfono: 044-55-9876-5432)
(Email: diana.herrera@email.com)
(LinkedIn: linkedin.com/in/dianaherrera)`,

        agradecimiento: `Ciudad de México, 15 de julio de 2025

(Lic. Patricia Vargas)
(Directora de Talento Humano)
(Banco Nacional de México)

Estimada (Lic. Vargas):

Por medio de la presente, deseo expresarle mi más sincero agradecimiento por (la oportunidad de haber formado parte del proceso de selección para el cargo de Analista Financiero Senior, así como por el tiempo y atención que usted y su equipo dedicaron a entrevistarme).

Su apoyo y disposición han sido fundamentales para (conocer más a fondo la cultura organizacional de Banco Nacional de México y reafirmar mi interés en formar parte de una institución tan prestigiosa).

Valoro profundamente (la transparencia y calidez con la que me trataron durante todo el proceso, especialmente durante la entrevista técnica del pasado 10 de julio) y espero poder corresponder a su confianza en futuras oportunidades.

Reitero mi agradecimiento y quedo a su entera disposición.

Cordialmente,

(Javier Ortega Ruiz)
(Candidato al cargo de Analista Financiero Senior)
(Teléfono: 044-55-1122-3344)
(Email: javier.ortega@email.com)`,

        compromisopago: `Ciudad de México, 15 de julio de 2025

(Financiera del Centro, S.A. de C.V.)
Presente.-

Por medio de la presente, yo, (Carla Beatriz Moreno), titular de la (cédula de identidad V-17.890.123), reconozco formalmente una deuda pendiente por la cantidad de ($4,500.00 (cuatro mil quinientos pesos 00/100 M.N.)), correspondiente a la factura N.º (00458).

Me comprometo a cancelar dicho monto mediante el siguiente plan: un primer pago de ($2,000.00) el día (20 de julio de 2025), y el saldo restante de ($2,500.00) a más tardar el día (20 de agosto de 2025).

Sin otro particular, quedo a la espera de su conformidad con lo aquí expuesto.

Atentamente,

(Carla Beatriz Moreno)
(V-17.890.123)`,

        noadeudo: `Ciudad de México, 15 de julio de 2025

A QUIEN CORRESPONDA:

Por medio de la presente se hace constar que (Rafael Ignacio Contreras), titular de la (cédula de identidad V-16.234.567), ha cancelado en su totalidad la obligación contraída con esta empresa, correspondiente a (el préstamo personal N.º 2024-0089), quedando así solvente y sin ningún tipo de adeudo pendiente a la fecha.

Se extiende la presente constancia a solicitud del interesado, para los fines que estime conveniente.

Atentamente,

(Financiamientos del Sur, S.A. de C.V.)
(Departamento de Cobranzas)
(Teléfono: 0212-555-6677)`,

        felicitacioncomercial: `Ciudad de México, 15 de julio de 2025

(Sra. Ynés Carolina Blanco)
(Gerente General)
(Suministros Orientales, S.A. de C.V.)

Estimada (Sra. Blanco):

Reciba un cordial saludo. Por medio de la presente deseamos expresarle nuestro sincero agradecimiento por (la excelente atención y calidad de servicio brindada durante nuestra colaboración comercial del último trimestre).

Su profesionalismo y disposición han sido fundamentales para (el éxito de nuestro proyecto de expansión), y esperamos continuar fortaleciendo esta relación comercial en el futuro.

Atentamente,

(Daniel Ernesto Salcedo)
(Gerente de Compras)
(Comercializadora Central, S.A. de C.V.)`,

        bienvenida: `Ciudad de México, 15 de julio de 2025

Estimado(a) (Sofía Reyes Camacho):

Es un placer para nosotros darle la más cordial bienvenida a (Grupo Empresarial Andino, S.A. de C.V.), en su nuevo cargo como (Coordinadora de Marketing), a partir del (21 de julio de 2025).

Confiamos en que su experiencia y talento serán un aporte valioso para nuestro equipo, y esperamos que su integración sea (rápida y satisfactoria). No dude en acercarse a (Recursos Humanos) ante cualquier duda durante su proceso de inducción.

¡Bienvenida a bordo!

Atentamente,

(Lic. Ricardo Paredes)
(Director de Recursos Humanos)
(Grupo Empresarial Andino, S.A. de C.V.)`,

        // ============================================
        // CARTAS PERSONALES Y LEGALES
        // ============================================
        poder: `Ciudad de México, 15 de julio de 2025

CARTA PODER

Yo, (Elena María Castillo Rojas), identificada con (cédula de identidad V-17.654.321), en mi carácter de (propietaria del inmueble ubicado en Av. Juárez 456, Col. Centro, Ciudad de México), por medio de la presente otorgo poder especial y suficiente a (Luis Alberto Gómez Pérez), identificado con (cédula de identidad V-19.876.543), para que en mi nombre y representación realice los siguientes actos:

- (Firmar el contrato de arrendamiento del inmueble mencionado)
- (Recibir el pago del depósito y primer mes de renta)
- (Realizar el inventario y entrega del inmueble al arrendatario)
- (Firmar cualquier documento relacionado con dicho arrendamiento)

Este poder tiene vigencia desde el (15 de julio de 2025) hasta el (30 de septiembre de 2025) o hasta que sea revocado por escrito.

El apoderado deberá actuar siempre en beneficio de mis intereses y dentro de los límites establecidos en este documento.

Se firma la presente en (Ciudad de México), a los (15) días del mes de (julio) de (2025).

PODERDANTE:

(Elena María Castillo Rojas)
(V-17.654.321)
(Firma)

APODERADO:

(Luis Alberto Gómez Pérez)
(V-19.876.543)
(Firma)

TESTIGOS:

1. (María José Ramírez)
   Documento: (V-20.111.222)
   Firma: _______________

2. (Carlos Eduardo Díaz)
   Documento: (V-18.333.444)
   Firma: _______________`,

        invitacion: `Ciudad de México, 15 de julio de 2025

CARTA DE INVITACIÓN

Yo, (Roberto Carlos Mendoza), identificado con (pasaporte N° A12345678), residente en (Calle Reforma 789, Departamento 402, Col. Juárez, Ciudad de México, México), por medio de la presente invito formalmente a (Carmen Lucía Vargas), identificada con (cédula de identidad V-22.456.789), residente en (Av. Principal 123, Caracas, Venezuela), a visitar (México) con el propósito de (turismo y visita familiar, ya que es mi esposa y deseamos celebrar nuestro aniversario de bodas).

Durante su estancia, la invitada se hospedará en (mi domicilio: Calle Reforma 789, Departamento 402, Col. Juárez, Ciudad de México) y permanecerá en el país desde el (1 de agosto de 2025) hasta el (15 de agosto de 2025).

Me comprometo a asumir los gastos de (alojamiento, alimentación, transporte interno y seguro médico) durante su visita, así como a garantizar su retorno a su país de origen antes de la fecha indicada.

Datos del invitado:
- Nombre completo: (Carmen Lucía Vargas Mendoza)
- Documento de identidad: (V-22.456.789)
- Fecha de nacimiento: (15 de marzo de 1990)
- Nacionalidad: (Venezolana)
- Relación con el invitante: (Esposa)

Quedo a su disposición para cualquier información adicional que requieran.

Atentamente,

(Roberto Carlos Mendoza)
(Pasaporte N° A12345678)
(Calle Reforma 789, Departamento 402, Col. Juárez, Ciudad de México)
(Teléfono: 044-55-7788-9900)
(Email: roberto.mendoza@email.com)
(Firma)`,

        explicacion: `Ciudad de México, 15 de julio de 2025

CARTA DE EXPLICACIÓN / DECLARACIÓN

A QUIEN CORRESPONDA:

Yo, (Alejandro Jiménez Pérez), identificado con (cédula de identidad V-21.345.678), por medio de la presente me dirijo a ustedes con el propósito de explicar y aclarar la siguiente situación:

(El retraso en la entrega del proyecto "Sistema de Gestión de Inventarios" que tenía como fecha límite el 30 de junio de 2025).

Los hechos ocurrieron de la siguiente manera:

(El día 25 de junio de 2025, el servidor principal de la empresa sufrió una falla técnica inesperada que resultó en la pérdida parcial de los datos del proyecto. El departamento de TI tardó 5 días en recuperar la información, lo que imposibilitó cumplir con la fecha de entrega original).

Las razones o motivos que me llevaron a (solicitar una extensión del plazo) fueron:

(La necesidad de reconstruir parte del código perdido y realizar pruebas adicionales para garantizar la integridad del sistema. Además, se requirió la coordinación con el proveedor del servidor para implementar medidas de seguridad adicionales).

Declaro que la información proporcionada en esta carta es veraz y completa, asumiendo la responsabilidad que de ello se derive.

Estoy a su entera disposición para ampliar esta información o proporcionar documentación adicional que consideren necesaria, incluyendo el reporte técnico del departamento de TI.

Atentamente,

(Alejandro Jiménez Pérez)
(V-21.345.678)
(Teléfono: 044-55-3344-5566)
(Email: alejandro.jimenez@email.com)
(Firma)`,

        reclamo: `Ciudad de México, 15 de julio de 2025

(ElectroHogar México, S.A. de C.V.)
(Departamento de Atención al Cliente)
(Av. Universidad 2345, Col. Del Valle, Ciudad de México)

Estimados señores:

Por medio de la presente, me dirijo a ustedes para expresar formalmente mi inconformidad y presentar un reclamo respecto a (la lavadora automática modelo LH-5000 que adquirí en su sucursal del Centro Comercial Plaza Norte el día 20 de junio de 2025).

Detalles del reclamo:

- Fecha del incidente: (10 de julio de 2025)
- Número de factura: (F-2025-78945)
- Producto: (Lavadora automática ElectroHogar modelo LH-5000, color blanco, 20 kg)
- Lugar: (Sucursal Plaza Norte, Ciudad de México)

Descripción del problema:

(El producto presenta una falla en el sistema de drenaje que provoca que el agua no se evacue correctamente durante el ciclo de lavado, generando inundaciones en el área donde está instalada. Además, emite un ruido excesivo durante el centrifugado que no es normal según las especificaciones del fabricante).

He intentado resolver esta situación a través de (llamada al servicio técnico el 12 de julio y visita del técnico el 14 de julio, quien confirmó la falla pero indicó que no tenía las piezas de repuesto necesarias).

Por lo expuesto, solicito formalmente:

(El reemplazo del producto por uno nuevo en iguales condiciones, o en su defecto, la devolución total del dinero pagado por un monto de $12,500.00 (doce mil quinientos pesos 00/100 M.N.)).

Adjunto a esta carta los siguientes documentos de respaldo:
- (Factura de compra N° F-2025-78945)
- (Fotografías del producto y del daño causado)
- (Reporte del técnico visitante)

Espero recibir una respuesta formal en un plazo no mayor a (10) días hábiles. De no obtener una solución satisfactoria, me veré en la obligación de acudir a la Procuraduría Federal del Consumidor (PROFECO) para hacer valer mis derechos.

Atentamente,

(Sofía Martínez López)
(V-23.456.789)
(Calle Insurgentes 456, Departamento 301, Col. Roma Norte)
(Teléfono: 044-55-6677-8899)
(Email: sofia.martinez@email.com)
(Firma)`,

        justificante: `Ciudad de México, 15 de julio de 2025

(Sr. Andrés Colmenares)
(Supervisor de Operaciones)
(Constructora Central, S.A. de C.V.)

Estimado (Sr. Colmenares):

Por medio de la presente justifico mi inasistencia a mis labores el día (14 de julio de 2025), debido a (una consulta médica de carácter urgente que requirió reposo por 24 horas), según se evidencia en el (certificado médico) que adjunto a esta comunicación.

Reitero mi compromiso con mis responsabilidades laborales y quedo atento a cualquier requerimiento adicional al respecto.

Atentamente,

(José Luis Peraza)
(V-21.456.789)`,

        rescisionalquiler: `Ciudad de México, 15 de julio de 2025

(Sr. Eduardo Villalba)
Propietario del inmueble ubicado en (Av. Insurgentes Sur 1234, Depto. 4-B)

Estimado (Sr. Villalba):

Por medio de la presente le notifico formalmente mi decisión de dar por terminado el contrato de arrendamiento suscrito en fecha (1 de agosto de 2024), correspondiente al inmueble antes señalado, con efecto a partir del (15 de agosto de 2025), respetando así el plazo de notificación previa establecido en la cláusula (sexta) del contrato.

Quedo en la mejor disposición de coordinar la inspección final del inmueble y la entrega de llaves en la fecha que usted considere conveniente.

Atentamente,

(Gabriel Antonio Rojas)
(V-20.567.890)
(Teléfono: 044-55-2233-4455)`,

        autorizacionmenor: `Ciudad de México, 15 de julio de 2025

AUTORIZACIÓN DE VIAJE PARA MENOR DE EDAD

Yo, (Patricia Elena Ramírez), identificada con (cédula de identidad V-15.678.901), en mi carácter de (madre) del(la) menor (Sebastián Ramírez López), de (9) años de edad, identificado con (acta de nacimiento N.º 2016-04521), por medio de la presente autorizo a (Carmen López Díaz), identificada con (cédula de identidad V-18.234.567), en su carácter de (abuela materna), para que viaje junto con el(la) menor antes mencionado(a) a (la ciudad de Cancún, Quintana Roo), del (1 de agosto de 2025) al (8 de agosto de 2025).

Declaro que esta autorización se otorga de manera libre y voluntaria, y que asumo la responsabilidad de la veracidad de los datos aquí consignados.

Se firma la presente en (Ciudad de México), a los (15) días del mes de (julio) de (2025).

AUTORIZA:

(Patricia Elena Ramírez)
(V-15.678.901)
(Firma)`,

        buenaconducta: `Ciudad de México, 15 de julio de 2025

A QUIEN CORRESPONDA:

Por medio de la presente hago constar que conozco a (Fernando Alberto Gómez), identificado con (cédula de identidad V-19.345.678), desde hace (5 años), en calidad de (vecino y amigo cercano).

Durante este tiempo, ha demostrado ser una persona de (buena conducta, honesta y respetuosa), sin que tenga conocimiento de que se haya visto involucrado(a) en situaciones que comprometan su reputación o integridad moral.

Extiendo la presente constancia a solicitud del interesado, para los fines que estime conveniente.

Atentamente,

(María Eugenia Torres)
(V-14.567.890)
(Teléfono: 044-55-8899-0011)`,

        referenciapersonal: `Ciudad de México, 15 de julio de 2025

A QUIEN CORRESPONDA:

Por medio de la presente, extiendo la presente carta de referencia personal a favor de (Camila Andrea Salas), a quien conozco desde hace (7 años) en calidad de (amistad cercana y vecina).

Puedo dar fe de que es una persona (responsable, honesta y confiable), cualidades que ha demostrado consistentemente en el trato personal y en el cumplimiento de sus compromisos.

No tengo inconveniente en recomendarla para (los fines que la presente carta pueda servir), quedando a disposición para ampliar esta información si así se requiere.

Atentamente,

(Luis Fernando Ibarra)
(V-13.456.789)
(Teléfono: 044-55-3322-1100)
(Email: luis.ibarra@email.com)`
    };

    const plantilla = ejemplos[tipo] || ejemplos.trabajo;
    const editor = document.getElementById('carta-editor');
    if (editor) {
        editor.innerHTML = prepararTextoEditable(plantilla);
    } else if (textarea) {
        // Compatibilidad de respaldo si el editor visual no está presente
        textarea.value = plantilla;
    }
}

// ============================================
// EDITOR VISUAL DE CARTAS: resalta los datos de ejemplo
// (nombre, empresa, fechas, montos) para que el usuario
// solo tenga que cambiar 2-3 palabras, sin descifrar paréntesis.
// ============================================
function envolverPlaceholders(texto) {
    // Envuelve cada grupo entre paréntesis (incluyendo paréntesis anidados,
    // como "($18,500.00 (dieciocho mil...))") en un único span resaltado.
    let resultado = '';
    let profundidad = 0;
    let buffer = '';
    for (let i = 0; i < texto.length; i++) {
        const ch = texto[i];
        if (ch === '(') {
            if (profundidad === 0) {
                buffer = '';
            } else {
                buffer += ch;
            }
            profundidad++;
        } else if (ch === ')') {
            profundidad = Math.max(0, profundidad - 1);
            if (profundidad === 0) {
                resultado += `<span class="campo-editable">${buffer}</span>`;
                buffer = '';
            } else {
                buffer += ch;
            }
        } else if (profundidad === 0) {
            resultado += ch;
        } else {
            buffer += ch;
        }
    }
    // Si quedó un paréntesis sin cerrar, no perdemos el texto acumulado
    if (buffer) resultado += buffer;
    return resultado;
}

function prepararTextoEditable(texto) {
    const escapado = escapeHtml(texto);
    const conResaltado = envolverPlaceholders(escapado);
    return conResaltado.replace(/\n/g, '<br>');
}

// ============================================
// GENERAR CV
// ============================================
function generarCV() {
    const texto = document.getElementById('cv-texto').value.trim();
    const foto = document.getElementById('cv-foto-url').value.trim();

    if (!texto) {
        alert('❌ Por favor pega el contenido de tu CV');
        return;
    }

    currentCVData = parsearCV(texto, foto);
    mostrarRevisionCV();
}

// ============================================
// PASO DE REVISIÓN: muestra lo que se detectó del texto pegado
// para que el usuario lo corrija antes de generar el CV final
// ============================================
function unescapeHtml(str) {
    if (!str) return '';
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
}

function mostrarRevisionCV() {
    const d = currentCVData;
    document.getElementById('rev-nombre').value = unescapeHtml(d.nombre);
    document.getElementById('rev-titulo').value = unescapeHtml(d.titulo);
    document.getElementById('rev-telefono').value = unescapeHtml(d.telefono);
    document.getElementById('rev-email').value = unescapeHtml(d.email);
    document.getElementById('rev-ciudad').value = unescapeHtml(d.ciudad);
    document.getElementById('rev-linkedin').value = unescapeHtml(d.linkedin);
    document.getElementById('rev-perfil').value = unescapeHtml(d.perfil).trim();
    document.getElementById('rev-habilidades').value = unescapeHtml(d.habilidades).trim();
    document.getElementById('rev-idiomas').value = unescapeHtml(d.idiomas).trim();

    renderRevExperiencia();
    renderRevEducacion();
    renderRevCursos();

    document.getElementById('step-input').style.display = 'none';
    document.getElementById('step-preview').style.display = 'none';
    document.getElementById('step-cv-revision').style.display = 'block';
    window.scrollTo(0, 0);
}

function attrSeguro(str) {
    return unescapeHtml(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function renderRevExperiencia() {
    const cont = document.getElementById('rev-experiencia-list');
    cont.innerHTML = '';
    currentCVData.experiencia.forEach((e, i) => {
        const div = document.createElement('div');
        div.className = 'rev-item';
        div.innerHTML = `
            <div class="form-grid">
                <div class="form-group"><label>Cargo</label><input type="text" value="${attrSeguro(e.cargo)}" data-idx="${i}" data-campo="cargo"></div>
                <div class="form-group"><label>Empresa</label><input type="text" value="${attrSeguro(e.empresa)}" data-idx="${i}" data-campo="empresa"></div>
                <div class="form-group"><label>Fechas</label><input type="text" value="${attrSeguro(e.fecha)}" data-idx="${i}" data-campo="fecha"></div>
            </div>
            <div class="form-group"><label>Descripción / logros</label><textarea rows="3" data-idx="${i}" data-campo="descripcion">${unescapeHtml(e.descripcion).trim()}</textarea></div>
            <button type="button" class="btn-remove-item" onclick="eliminarExperiencia(${i})">🗑️ Eliminar esta experiencia</button>`;
        div.querySelectorAll('[data-campo]').forEach(input => {
            input.addEventListener('input', () => {
                currentCVData.experiencia[i][input.dataset.campo] = escapeHtml(input.value);
            });
        });
        cont.appendChild(div);
    });
}

function agregarExperiencia() {
    currentCVData.experiencia.push({ cargo: '', empresa: '', fecha: '', descripcion: '' });
    renderRevExperiencia();
}

function eliminarExperiencia(i) {
    currentCVData.experiencia.splice(i, 1);
    renderRevExperiencia();
}

function renderRevEducacion() {
    const cont = document.getElementById('rev-educacion-list');
    cont.innerHTML = '';
    currentCVData.educacion.forEach((e, i) => {
        const div = document.createElement('div');
        div.className = 'rev-item';
        div.innerHTML = `
            <div class="form-grid">
                <div class="form-group"><label>Título / grado</label><input type="text" value="${attrSeguro(e.titulo)}" data-idx="${i}" data-campo="titulo"></div>
                <div class="form-group"><label>Institución</label><input type="text" value="${attrSeguro(e.institucion)}" data-idx="${i}" data-campo="institucion"></div>
                <div class="form-group"><label>Año</label><input type="text" value="${attrSeguro(e.anio)}" data-idx="${i}" data-campo="anio"></div>
            </div>
            <button type="button" class="btn-remove-item" onclick="eliminarEducacion(${i})">🗑️ Eliminar este estudio</button>`;
        div.querySelectorAll('[data-campo]').forEach(input => {
            input.addEventListener('input', () => {
                currentCVData.educacion[i][input.dataset.campo] = escapeHtml(input.value);
            });
        });
        cont.appendChild(div);
    });
}

function agregarEducacion() {
    currentCVData.educacion.push({ titulo: '', institucion: '', anio: '' });
    renderRevEducacion();
}

function eliminarEducacion(i) {
    currentCVData.educacion.splice(i, 1);
    renderRevEducacion();
}

function renderRevCursos() {
    const cont = document.getElementById('rev-cursos-list');
    cont.innerHTML = '';
    currentCVData.cursos.forEach((c, i) => {
        const div = document.createElement('div');
        div.className = 'rev-item';
        div.innerHTML = `
            <div class="form-grid">
                <div class="form-group"><label>Nombre del curso</label><input type="text" value="${attrSeguro(c.nombre)}" data-idx="${i}" data-campo="nombre"></div>
                <div class="form-group"><label>Institución</label><input type="text" value="${attrSeguro(c.institucion)}" data-idx="${i}" data-campo="institucion"></div>
                <div class="form-group"><label>Año</label><input type="text" value="${attrSeguro(c.anio)}" data-idx="${i}" data-campo="anio"></div>
            </div>
            <button type="button" class="btn-remove-item" onclick="eliminarCurso(${i})">🗑️ Eliminar este curso</button>`;
        div.querySelectorAll('[data-campo]').forEach(input => {
            input.addEventListener('input', () => {
                currentCVData.cursos[i][input.dataset.campo] = escapeHtml(input.value);
            });
        });
        cont.appendChild(div);
    });
}

function agregarCurso() {
    currentCVData.cursos.push({ nombre: '', institucion: '', anio: '' });
    renderRevCursos();
}

function eliminarCurso(i) {
    currentCVData.cursos.splice(i, 1);
    renderRevCursos();
}

function confirmarRevisionCV() {
    const d = currentCVData;
    d.nombre = escapeHtml(document.getElementById('rev-nombre').value.trim());
    d.titulo = escapeHtml(document.getElementById('rev-titulo').value.trim());
    d.telefono = escapeHtml(document.getElementById('rev-telefono').value.trim());
    d.email = escapeHtml(document.getElementById('rev-email').value.trim());
    d.ciudad = escapeHtml(document.getElementById('rev-ciudad').value.trim());
    d.linkedin = escapeHtml(document.getElementById('rev-linkedin').value.trim());
    d.perfil = escapeHtml(document.getElementById('rev-perfil').value.trim());
    d.habilidades = escapeHtml(document.getElementById('rev-habilidades').value.trim());
    d.idiomas = escapeHtml(document.getElementById('rev-idiomas').value.trim());

    if (!d.nombre) {
        alert('❌ El nombre no puede quedar vacío.');
        document.getElementById('rev-nombre').focus();
        return;
    }

    renderizarCV(currentStyle);
    document.getElementById('style-selector-cv').style.display = 'block';
    document.getElementById('step-cv-revision').style.display = 'none';
    document.getElementById('step-preview').style.display = 'block';
    window.scrollTo(0, 0);
}

// Extrae y separa "Título - Institución (fecha)" en cualquier orden/combinación,
// usado tanto por educación como por cursos.
function partirBloqueFechado(linea) {
    const esBullet = /^[-•*▪◦]\s+/.test(linea);
    const matchRango = linea.match(/\(?\s*((19|20)\d{2})\s*[-–—]\s*((19|20)\d{2}|actualidad|presente|present|current|hoy)\s*\)?/i);
    const matchAnio = matchRango || linea.match(/\(\s*(19|20)\d{2}\s*\)/) || linea.match(/\b(19|20)\d{2}\b/);
    let resto = linea;
    let fecha = '';
    if (matchAnio) {
        fecha = matchAnio[0].replace(/^\(|\)$/g, '').trim();
        resto = (resto.slice(0, matchAnio.index) + resto.slice(matchAnio.index + matchAnio[0].length)).trim();
    }
    const separadores = [' - ', ' – ', ' — ', ' | ', ' en ', ' @ '];
    let principal = resto, secundario = '';
    for (const sep of separadores) {
        if (resto.includes(sep)) {
            const partes = resto.split(sep);
            principal = partes[0].trim();
            secundario = partes.slice(1).join(sep).trim();
            break;
        }
    }
    principal = principal.replace(/[-–—|,]+$/, '').trim();
    secundario = secundario.replace(/^[\(\)]+|[\(\)]+$/g, '').trim();
    return { esBullet, tieneFecha: !!matchAnio, principal, secundario, fecha };
}

function parsearCV(texto, foto) {
    const lineas = texto.split('\n').map(l => l.trim()).filter(l => l);
    const datos = {
        nombre: '', titulo: '', telefono: '', email: '', ciudad: '', linkedin: '',
        perfil: '', experiencia: [], educacion: [], habilidades: '', idiomas: '', cursos: [], foto: foto
    };

    let seccionActual = 'inicio';
    let bufferExp = null;
    let bufferEdu = null;
    let bufferCurso = null;

    const keywords = {
        perfil: ['PERFIL PROFESIONAL', 'PERFIL', 'OBJETIVO PROFESIONAL', 'OBJETIVO', 'SOBRE MÍ', 'SOBRE MI', 'RESUMEN PROFESIONAL', 'RESUMEN', 'ACERCA DE MÍ', 'ACERCA DE MI', 'SUMMARY', 'PROFILE'],
        experiencia: ['EXPERIENCIA LABORAL', 'EXPERIENCIA PROFESIONAL', 'EXPERIENCIA', 'TRAYECTORIA LABORAL', 'TRAYECTORIA PROFESIONAL', 'HISTORIAL LABORAL', 'ANTECEDENTES LABORALES', 'WORK EXPERIENCE', 'EXPERIENCE'],
        educacion: ['FORMACIÓN ACADÉMICA', 'FORMACION ACADEMICA', 'EDUCACIÓN', 'EDUCACION', 'ESTUDIOS', 'FORMACIÓN', 'FORMACION', 'EDUCATION'],
        habilidades: ['HABILIDADES', 'SKILLS', 'COMPETENCIAS', 'APTITUDES', 'CONOCIMIENTOS TÉCNICOS', 'CONOCIMIENTOS TECNICOS'],
        idiomas: ['IDIOMAS', 'LANGUAGES'],
        cursos: ['CURSOS Y CERTIFICACIONES', 'CURSOS', 'CERTIFICACIONES', 'CAPACITACIONES', 'FORMACIÓN COMPLEMENTARIA', 'FORMACION COMPLEMENTARIA', 'CERTIFICATIONS']
    };
    const encabezadosContacto = /^(DATOS PERSONALES|DATOS DE CONTACTO|INFORMACI[ÓO]N DE CONTACTO|INFORMACI[ÓO]N PERSONAL|CONTACTO|CONTACT|PERSONAL INFORMATION)\s*:?\s*$/;

    for (let i = 0; i < lineas.length; i++) {
        const linea = lineas[i];
        const lineaUpper = linea.toUpperCase();

        if (encabezadosContacto.test(lineaUpper)) continue;

        let esInicioSeccion = false;
        for (const [key, words] of Object.entries(keywords)) {
            if (words.some(w => lineaUpper === w || lineaUpper === w + ':' || (linea.length < 40 && lineaUpper.includes(w)))) {
                if (bufferExp) { datos.experiencia.push(bufferExp); bufferExp = null; }
                seccionActual = key;
                esInicioSeccion = true;
                break;
            }
        }
        if (esInicioSeccion) continue;

        if (seccionActual === 'inicio') {
            const soloDigitos = linea.replace(/[^\d]/g, '');
            if (linea.includes('@')) {
                datos.email = linea.replace(/.*?:\s*/i, '').trim();
            } else if (/tel[eé]fono|^tel\b|celular|\bcel\b|whatsapp|m[oó]vil|movil/i.test(linea)) {
                datos.telefono = linea.replace(/.*?:\s*/i, '').trim();
            } else if (/ciudad|ubicaci[oó]n|direcci[oó]n|domicilio|residencia|edo\.|estado/i.test(linea)) {
                datos.ciudad = linea.replace(/.*?:\s*/i, '').trim();
            } else if (/linkedin|portafolio|portfolio|github|sitio web|p[aá]gina web/i.test(linea)) {
                datos.linkedin = linea.replace(/.*?:\s*/i, '').trim();
            } else if (!datos.telefono && soloDigitos.length >= 7 && soloDigitos.length <= 15 && /^[\d\s\-\+\(\)]+$/.test(linea)) {
                datos.telefono = linea.trim();
            } else if (!datos.nombre) {
                datos.nombre = linea;
            } else if (!datos.titulo && linea.length < 100) {
                datos.titulo = linea;
            } else {
                // Cualquier otra línea suelta del encabezado no se pierde:
                // queda al inicio del perfil para que se reubique en la revisión.
                datos.perfil += linea + ' ';
            }
        } else if (seccionActual === 'perfil') {
            datos.perfil += linea + ' ';
        } else if (seccionActual === 'experiencia') {
            // Se quita un posible marcador de lista numerada ("1.", "2)") antes de
            // clasificar la línea, para no confundirlo con una viñeta de logro.
            const lineaProc = linea.replace(/^\d+[\.\)]\s+/, '').trim();
            const b = partirBloqueFechado(lineaProc);
            const pareceEncabezado = !b.esBullet && (b.tieneFecha || (lineaProc.includes(' - ') && lineaProc.length < 100));

            if (pareceEncabezado) {
                if (bufferExp && !bufferExp.fecha && !bufferExp.empresa && !bufferExp.descripcion) {
                    // La línea anterior sólo traía el cargo; esta trae empresa y/o fecha
                    bufferExp.empresa = [b.principal, b.secundario].filter(Boolean).join(' - ');
                    bufferExp.fecha = b.fecha;
                } else {
                    if (bufferExp) datos.experiencia.push(bufferExp);
                    bufferExp = { cargo: b.principal, empresa: b.secundario, fecha: b.fecha, descripcion: '' };
                }
            } else if (b.esBullet && bufferExp) {
                bufferExp.descripcion += lineaProc.replace(/^[-•*▪◦]\s+/, '').trim() + ' ';
            } else if (bufferExp && !bufferExp.empresa && !bufferExp.descripcion && lineaProc.length < 80) {
                bufferExp.empresa = lineaProc;
            } else if (bufferExp) {
                bufferExp.descripcion += lineaProc + ' ';
            } else if (!b.esBullet) {
                // Todavía no hay bloque: esta línea probablemente es el cargo de la primera experiencia
                bufferExp = { cargo: lineaProc, empresa: '', fecha: '', descripcion: '' };
            }
        } else if (seccionActual === 'educacion') {
            const lineaProc = linea.replace(/^\d+[\.\)]\s+/, '').trim();
            const b = partirBloqueFechado(lineaProc);
            const pareceEncabezado = !b.esBullet && (lineaProc.includes(' - ') || b.tieneFecha);
            if (pareceEncabezado) {
                if (bufferEdu && !bufferEdu.institucion && !bufferEdu.anio) {
                    bufferEdu.institucion = [b.principal, b.secundario].filter(Boolean).join(' - ');
                    bufferEdu.anio = b.fecha;
                } else {
                    if (bufferEdu) datos.educacion.push(bufferEdu);
                    bufferEdu = { titulo: b.principal, institucion: b.secundario, anio: b.fecha };
                }
            } else if (!b.esBullet) {
                if (bufferEdu) datos.educacion.push(bufferEdu);
                bufferEdu = { titulo: lineaProc, institucion: '', anio: '' };
            }
        } else if (seccionActual === 'habilidades') {
            datos.habilidades += linea + ', ';
        } else if (seccionActual === 'idiomas') {
            datos.idiomas += linea + ', ';
        } else if (seccionActual === 'cursos') {
            const lineaProc = linea.replace(/^\d+[\.\)]\s+/, '').trim();
            const b = partirBloqueFechado(lineaProc);
            const pareceEncabezado = !b.esBullet && (lineaProc.includes(' - ') || b.tieneFecha);
            if (pareceEncabezado) {
                if (bufferCurso && !bufferCurso.institucion && !bufferCurso.anio) {
                    bufferCurso.institucion = [b.principal, b.secundario].filter(Boolean).join(' - ');
                    bufferCurso.anio = b.fecha;
                } else {
                    if (bufferCurso) datos.cursos.push(bufferCurso);
                    bufferCurso = { nombre: b.principal, institucion: b.secundario, anio: b.fecha };
                }
            } else if (!b.esBullet) {
                if (bufferCurso) datos.cursos.push(bufferCurso);
                bufferCurso = { nombre: lineaProc, institucion: '', anio: '' };
            }
        }
    }

    if (bufferExp) datos.experiencia.push(bufferExp);
    if (bufferEdu) datos.educacion.push(bufferEdu);
    if (bufferCurso) datos.cursos.push(bufferCurso);

    // Escapamos todo el texto proveniente del pegado del usuario para que
    // símbolos como < > & " no rompan el HTML del CV renderizado.
    datos.nombre = escapeHtml(datos.nombre);
    datos.titulo = escapeHtml(datos.titulo);
    datos.telefono = escapeHtml(datos.telefono);
    datos.email = escapeHtml(datos.email);
    datos.ciudad = escapeHtml(datos.ciudad);
    datos.linkedin = escapeHtml(datos.linkedin);
    datos.perfil = escapeHtml(datos.perfil.trim());
    datos.habilidades = escapeHtml(datos.habilidades.replace(/,\s*$/, ''));
    datos.idiomas = escapeHtml(datos.idiomas.replace(/,\s*$/, ''));
    datos.experiencia = datos.experiencia.map(e => ({
        cargo: escapeHtml(e.cargo),
        empresa: escapeHtml(e.empresa),
        fecha: escapeHtml(e.fecha),
        descripcion: escapeHtml(e.descripcion.trim())
    }));
    datos.educacion = datos.educacion.map(e => ({
        titulo: escapeHtml(e.titulo),
        institucion: escapeHtml(e.institucion),
        anio: escapeHtml(e.anio)
    }));
    datos.cursos = datos.cursos.map(c => ({
        nombre: escapeHtml(c.nombre),
        institucion: escapeHtml(c.institucion),
        anio: escapeHtml(c.anio)
    }));
    datos.foto = sanitizeFotoUrl(foto);

    return datos;
}

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
    if (d.cursos.length > 0) {
        html += `<div style="margin-bottom:30px; text-align:left;"><h2 style="border-bottom:2px solid #333; padding-bottom:5px; margin-bottom:15px;">CURSOS</h2>`;
        d.cursos.forEach(c => {
            html += `<div style="margin-bottom:15px;"><h3 style="margin-bottom:5px;">${c.nombre}</h3><p style="color:#6b7280; font-style:italic;">${c.institucion} ${c.anio}</p></div>`;
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
    if (d.cursos.length > 0) {
        html += `<div style="margin-bottom:30px;"><h2 style="color:#f59e0b; margin-bottom:15px;">Cursos</h2>`;
        d.cursos.forEach(c => {
            html += `<div style="margin-bottom:15px; padding-left:15px; border-left:4px solid #f59e0b;"><h3 style="margin-bottom:5px;">${c.nombre}</h3><p style="color:#6b7280; font-style:italic;">${c.institucion} ${c.anio}</p></div>`;
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
    if (d.cursos.length > 0) {
        html += `<div style="margin-bottom:40px;"><h2 style="font-weight:300; font-size:1.2rem; margin-bottom:20px; text-transform:uppercase; letter-spacing:2px;">Cursos</h2>`;
        d.cursos.forEach(c => {
            html += `<div style="margin-bottom:20px;"><h3 style="font-weight:500; margin-bottom:5px;">${c.nombre}</h3><p style="color:#6b7280; font-style:italic;">${c.institucion} ${c.anio}</p></div>`;
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
    if (d.telefono) sidebar += `<p> ${d.telefono}</p>`;
    if (d.email) sidebar += `<p>✉️ ${d.email}</p>`;
    if (d.ciudad) sidebar += `<p> ${d.ciudad}</p>`;
    if (d.linkedin) sidebar += `<p> ${d.linkedin}</p>`;
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

function generarCarta() {
    const editor = document.getElementById('carta-editor');
    const texto = (editor ? editor.innerText : '').trim();

    if (!texto) {
        alert('❌ Por favor escribe o edita el contenido de la carta');
        return;
    }

    let html = `<div class="carta-formal">`;
    html += `<div class="cuerpo" style="white-space: pre-line; font-family:'Times New Roman', Times, serif; font-size:12pt; line-height:1.5;">${escapeHtml(texto)}</div>`;
    html += `</div>`;

    document.getElementById('document-preview').innerHTML = html;
    document.getElementById('style-selector-cv').style.display = 'none';
    document.getElementById('step-input').style.display = 'none';
    document.getElementById('step-preview').style.display = 'block';
    window.scrollTo(0, 0);
}

function toggleCamposAPA() {
    const select = document.getElementById('legal-tipo');
    const contenedor = document.getElementById('apa-extra-fields');
    if (!select || !contenedor) return;
    const esAPA = select.value === 'apa' || select.value === 'apa15';
    contenedor.style.display = esAPA ? 'grid' : 'none';
}

function generarLegal() {
    const tipo = document.getElementById('legal-tipo').value;
    const titulo = document.getElementById('legal-titulo').value || 'Documento';
    const fecha = document.getElementById('legal-fecha').value;
    const lugar = document.getElementById('legal-lugar').value;
    const contenido = document.getElementById('legal-texto').value.trim();
    const campoAutor = document.getElementById('legal-autor');
    const campoInstitucion = document.getElementById('legal-institucion');
    const campoMateria = document.getElementById('legal-materia');
    const campoProfesor = document.getElementById('legal-profesor');
    const autor = campoAutor ? campoAutor.value.trim() : '';
    const institucion = campoInstitucion ? campoInstitucion.value.trim() : '';
    const materia = campoMateria ? campoMateria.value.trim() : '';
    const profesor = campoProfesor ? campoProfesor.value.trim() : '';

    if (!contenido) {
        alert('❌ Por favor ingresa el contenido del documento');
        return;
    }

    let html = '';
    const fechaFormateada = fecha ? new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', {year: 'numeric', month: 'long', day: 'numeric'}) : '';

    const tituloSeguro = escapeHtml(titulo);
    const lugarSeguro = escapeHtml(lugar);
    const autorSeguro = escapeHtml(autor);
    const institucionSeguro = escapeHtml(institucion);
    const materiaSeguro = escapeHtml(materia);
    const profesorSeguro = escapeHtml(profesor);

    if (tipo === 'apa' || tipo === 'apa15') {
        const claseInterlineado = tipo === 'apa' ? 'apa-2' : 'apa-15';

        // Portada estilo APA 7 (estudiante): título, autor, institución, materia, profesor y fecha
        html = `<div class="apa-portada">`;
        html += `<p class="apa-titulo-portada">${tituloSeguro}</p>`;
        if (autorSeguro) html += `<p>${autorSeguro}</p>`;
        if (institucionSeguro) html += `<p>${institucionSeguro}</p>`;
        if (materiaSeguro) html += `<p>${materiaSeguro}</p>`;
        if (profesorSeguro) html += `<p>${profesorSeguro}</p>`;
        if (fechaFormateada) html += `<p>${fechaFormateada}</p>`;
        html += `</div>`;
        html += `<div style="page-break-after: always;"></div>`;

        html += `<div class="${claseInterlineado}">`;
        html += `<h2 style="text-align:center; font-size:12pt; margin-bottom:0;">${tituloSeguro}</h2>`;

        // Si el contenido incluye una línea "REFERENCIAS", todo lo posterior
        // se formatea como lista de referencias con sangría francesa.
        const lineasContenido = contenido.split('\n');
        const indiceReferencias = lineasContenido.findIndex(l => /^referencias\s*$/i.test(l.trim()));

        let cuerpo = contenido;
        let referencias = '';
        if (indiceReferencias !== -1) {
            cuerpo = lineasContenido.slice(0, indiceReferencias).join('\n');
            referencias = lineasContenido.slice(indiceReferencias + 1).join('\n');
        }

        const parrafos = cuerpo.split('\n\n').filter(p => p.trim());
        parrafos.forEach(p => {
            html += `<p style="text-indent:1.27cm; margin-bottom:0;">${escapeHtml(p.trim())}</p>`;
        });

        if (referencias.trim()) {
            html += `<div style="page-break-before: always;"></div>`;
            html += `<h2 style="text-align:center; font-size:12pt; margin-bottom:15px;">Referencias</h2>`;
            const entradas = referencias.split('\n').map(r => r.trim()).filter(r => r);
            entradas.forEach(r => {
                html += `<p style="text-indent:-1.27cm; margin-left:1.27cm; margin-bottom:0;">${escapeHtml(r)}</p>`;
            });
        }

        html += `</div>`;
    } else if (tipo === 'legal') {
        html = `<div class="legal-doc">`;
        html += `<div class="header"><h1 style="font-size:14pt; margin-bottom:10px;">${tituloSeguro}</h1>`;
        if (fechaFormateada) html += `<p style="font-size:12pt;"><strong>Fecha:</strong> ${fechaFormateada}</p>`;
        if (lugarSeguro) html += `<p style="font-size:12pt;"><strong>Lugar:</strong> ${lugarSeguro}</p>`;
        html += `</div>`;
        const lineas = contenido.split('\n').filter(l => l.trim());
        lineas.forEach(linea => {
            const match = linea.match(/^([A-ZÁÉÍÓÚÑa-záéíóúñ\s]+):\s*(.+)$/);
            if (match) {
                html += `<div class="dialogo" style="margin-bottom:15px;"><span class="hablante">${escapeHtml(match[1])}:</span> ${escapeHtml(match[2])}</div>`;
            } else {
                html += `<p style="margin-bottom:10px;">${escapeHtml(linea)}</p>`;
            }
        });
        html += `</div>`;
    } else {
        html = `<div style="font-family:'Times New Roman', serif; font-size:12pt; line-height:1.5;">`;
        html += `<h1 style="text-align:center; margin-bottom:30px;">${tituloSeguro}</h1>`;
        if (fechaFormateada) html += `<p style="text-align:center; margin-bottom:10px;"><strong>Fecha:</strong> ${fechaFormateada}</p>`;
        if (lugarSeguro) html += `<p style="text-align:center; margin-bottom:30px;"><strong>Lugar:</strong> ${lugarSeguro}</p>`;
        html += `<div style="white-space: pre-line;">${escapeHtml(contenido)}</div>`;
        html += `</div>`;
    }

    document.getElementById('document-preview').innerHTML = html;
    document.getElementById('style-selector-cv').style.display = 'none';
    document.getElementById('step-input').style.display = 'none';
    document.getElementById('step-preview').style.display = 'block';
    window.scrollTo(0, 0);
}

function cambiarEstiloCV(estilo, btn) {
    currentStyle = estilo;
    document.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderizarCV(estilo);
}

function editarDocumento() {
    document.getElementById('step-preview').style.display = 'none';
    if (currentType === 'cv' && currentCVData) {
        mostrarRevisionCV();
    } else {
        document.getElementById('step-input').style.display = 'block';
        window.scrollTo(0, 0);
    }
}

function nuevoDocumento() {
    if (confirm('¿Seguro que quieres crear un nuevo documento? Se borrará el borrador guardado.')) {
        document.getElementById('cv-texto').value = '';
        document.getElementById('cv-foto-url').value = '';
        const editor = document.getElementById('carta-editor');
        if (editor) editor.innerHTML = '';
        document.getElementById('legal-texto').value = '';
        document.getElementById('legal-titulo').value = '';
        document.getElementById('legal-lugar').value = '';
        document.getElementById('legal-fecha').value = '';
        currentCVData = null;
        currentType = '';
        borrarBorrador();
        document.getElementById('step-preview').style.display = 'none';
        document.getElementById('step-cv-revision').style.display = 'none';
        document.getElementById('step-type').style.display = 'block';
        window.scrollTo(0, 0);
    }
}

// ============================================
// AUTOGUARDADO (localStorage) - no se pierde nada al recargar
// ============================================
const CAMPOS_AUTOSAVE = ['cv-texto', 'cv-foto-url', 'legal-titulo', 'legal-fecha', 'legal-lugar', 'legal-texto', 'legal-autor', 'legal-institucion', 'legal-materia', 'legal-profesor', 'carta-tipo'];

function guardarBorrador() {
    const datos = {};
    CAMPOS_AUTOSAVE.forEach(id => {
        const el = document.getElementById(id);
        if (el) datos[id] = el.value;
    });
    const editor = document.getElementById('carta-editor');
    if (editor) datos['carta-editor'] = editor.innerHTML;
    try {
        localStorage.setItem('generadorDocs_borrador', JSON.stringify(datos));
    } catch (e) {
        // almacenamiento lleno o no disponible: se ignora silenciosamente
    }
}

function restaurarBorrador() {
    let datos;
    try {
        datos = JSON.parse(localStorage.getItem('generadorDocs_borrador') || 'null');
    } catch (e) {
        datos = null;
    }
    if (!datos) return;

    CAMPOS_AUTOSAVE.forEach(id => {
        const el = document.getElementById(id);
        if (el && datos[id] !== undefined) el.value = datos[id];
    });
    const editor = document.getElementById('carta-editor');
    if (editor && datos['carta-editor']) editor.innerHTML = datos['carta-editor'];
}

function borrarBorrador() {
    try { localStorage.removeItem('generadorDocs_borrador'); } catch (e) { /* ignorar */ }
}

document.addEventListener('input', (e) => {
    if (e.target && e.target.id && (CAMPOS_AUTOSAVE.includes(e.target.id) || e.target.id === 'carta-editor')) {
        guardarBorrador();
    }
});

restaurarBorrador();
toggleCamposAPA();

function descargarPDF() {
    window.print();
}

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
    alert(' Documento descargado. Ábrelo con Word para editar.');
}
