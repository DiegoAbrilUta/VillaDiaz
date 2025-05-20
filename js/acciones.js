// ==============================
// Configuración general
// ==============================
const DIAS_SEMANA = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const horasInicio = [8, 13]; // Horas de inicio de servicio
const horasFin = [13, 18];   // Horas de fin de servicio

// ==============================
// Actualización del reloj y estado general
// ==============================
function actualizarReloj() {
  const ahora = new Date();
  const fechaEcuador = new Date(ahora.toLocaleString('en-US', { timeZone: 'America/Guayaquil' }));

  const hora = fechaEcuador.getHours().toString().padStart(2, '0');
  const minutos = fechaEcuador.getMinutes().toString().padStart(2, '0');
  const segundos = fechaEcuador.getSeconds().toString().padStart(2, '0');
  const horaTexto = `${hora}:${minutos}:${segundos}`;

  const diaSemana = fechaEcuador.getDay();
  const dia = fechaEcuador.getDate();
  const mes = MESES[fechaEcuador.getMonth()];
  const anio = fechaEcuador.getFullYear();

  actualizarDOMTiempo(horaTexto, diaSemana, dia, mes, anio);
  bloquearMenus(fechaEcuador);
  actualizarEstadoServicio(fechaEcuador);
  actualizarColorReloj(Number(hora), Number(minutos));
}

function actualizarDOMTiempo(hora, diaSemana, dia, mes, anio) {
  const actualizar = (id, texto) => {
    const el = document.getElementById(id);
    if (el) el.textContent = texto;
  };

  actualizar("hora", hora);
  actualizar("reloj-digital", hora);
  actualizar("reloj", hora);
  actualizar("dia-semana", DIAS_SEMANA[diaSemana]);
  actualizar("dia", dia);
  actualizar("mes", mes);
  actualizar("anio", anio);
  actualizar("anio-reloj", anio);
}

// ==============================
// Estado "ABIERTO" o "CERRADO"
// ==============================
function actualizarEstadoServicio(fecha) {
  const izq = document.getElementById('texto-vertical');
  const der = document.getElementById('texto-vertical-derecho');
  if (!izq || !der) return;

  const menus = [
    document.getElementById('MenuDiario'),
    document.getElementById('MenuNocturno'),
    document.getElementById('MenuEspecial')
  ];

  const abierto = menus.some(menu => menu && !menu.classList.contains('bloqueado'));

  const texto = abierto ? "ABIERTO" : "CERRADO";
  const clase = `abierto-vertical ${abierto ? 'abierto' : 'cerrado'}`;

  izq.textContent = texto;
  der.textContent = texto;
  izq.className = `${clase} left`;
  der.className = `${clase} right`;
}

// ==============================
// Color del reloj
// ==============================
function actualizarColorReloj(hora, minutos) {
  const reloj = document.getElementById("reloj");
  if (!reloj) return;

  const minTotales = hora * 60 + minutos;
  let abierto = false;

  for (let i = 0; i < horasInicio.length; i++) {
    if (minTotales >= horasInicio[i] * 60 && minTotales < horasFin[i] * 60) {
      abierto = true;
      break;
    }
  }

  reloj.style.color = abierto ? "limegreen" : "crimson";
}

// ==============================
// Bloqueo de menús según horario
// ==============================
function bloquearMenus(fecha) {
  bloquearMenu("MenuDiario", () => {
    const dia = fecha.getDay();
    const hora = fecha.getHours();
    return (dia >= 1 && dia <= 5 && hora >= 8 && hora < 14);
  }, "El menú diario no está disponible después de las 14:00 o en fines de semana.");

  bloquearMenu("MenuNocturno", () => {
    const dia = fecha.getDay();
    const horaDecimal = fecha.getHours() + fecha.getMinutes() / 60;
    return (dia >= 1 && dia <= 5 && horaDecimal >= 15 && horaDecimal <= 22.5);
  }, "El menú nocturno está disponible solo de lunes a viernes entre 15:00 y 22:30.");

  bloquearMenuEspecial(fecha);
}

function bloquearMenu(id, condicionHabilitado, mensajeBloqueo) {
  const img = document.getElementById(id);
  if (!img) return;

  if (condicionHabilitado()) {
    img.classList.remove("bloqueado");
    img.title = "";
  } else {
    img.classList.add("bloqueado");
    img.title = mensajeBloqueo;
  }
}

function bloquearMenuEspecial(fecha) {
  const img = document.getElementById('MenuEspecial');
  if (!img) return;

  const dia = fecha.getDay();
  const hora = fecha.getHours();

  const habilitado = (dia === 6 && hora >= 8 && hora < 15);

  if (habilitado) {
    img.classList.remove("bloqueado");
    img.title = "";
  } else {
    img.classList.add("bloqueado");
    img.title = "El menú especial solo está disponible los sábados de 08:00 a 15:00.";
  }
}

// ==============================
// Modal de imagen ampliada
// ==============================
function mostrarImagen(imgElement) {
  const modal = document.getElementById('modal');
  const imgModal = document.getElementById('imgModal');
  if (!modal || !imgModal) return;

  imgModal.src = imgElement.src;
  modal.style.display = 'flex';
}

// ==============================
// Efecto zoom en imágenes desbloqueadas
// ==============================
function activarZoomEnImagenes() {
  document.querySelectorAll('.menu-imagen:not(.bloqueado), .menu-especial-imagen:not(.bloqueado)').forEach(img => {
    img.classList.add('zoom-click');

    img.addEventListener('click', () => {
      mostrarImagen(img);
      document.querySelectorAll('.zoom-click.zoomed').forEach(el => el.classList.remove('zoomed'));
      img.classList.add('zoomed');
    });
  });
}

// ==============================
// Modal horario_atencion
// ==============================
function activarModalHorario() {
  const horarioImg = document.querySelector('#horario_atencion img');
  const modalFondo = document.getElementById('modal-fondo');
  const modalImg = document.getElementById('modal-img');

  if (!horarioImg || !modalFondo || !modalImg) return;

  horarioImg.style.cursor = 'pointer';

  horarioImg.addEventListener('click', () => {
    modalImg.src = horarioImg.src;
    modalFondo.style.display = 'flex';
  });

  modalFondo.addEventListener('click', () => {
    modalFondo.style.display = 'none';
  });
}

// ==============================
// Inicialización al cargar
// ==============================
document.addEventListener('DOMContentLoaded', () => {
  activarZoomEnImagenes();
  activarModalHorario();
  actualizarReloj();
  setInterval(actualizarReloj, 1000);
});
