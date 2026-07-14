/**
 * matches.js
 * Lógica específica de index.html (la vista de "Matches").
 * 1. Carga los partidos desde la API y los pinta en pantalla.
 * 2. Escucha los botones de filtro (Scheduled/Live/Finished/All).
 */

const matchesGrid = document.querySelector('#matches-grid');
const filterButtons = document.querySelectorAll('.filter-btn');

// Guardamos el filtro activo en una variable, para poder re-aplicarlo
// cada vez que llegan datos nuevos (por ejemplo, al recargar)
let currentFilter = 'all';

/** Punto de entrada: se ejecuta apenas carga la página */
async function initMatchesPage() {
  renderSkeletons(matchesGrid, 5);

  try {
    const matches = await getMatches();
    renderMatches(matches);
    applyFilter(currentFilter);
  } catch (error) {
    console.error('Error al cargar los partidos:', error);
    renderError(matchesGrid, error.message);
  }
}

/** Dibuja todas las tarjetas de partido en la grilla */
function renderMatches(matches) {
  if (matches.length === 0) {
    matchesGrid.innerHTML = `<p class="col-span-full text-center text-gray-500 py-10">Todavía no hay partidos programados.</p>`;
    return;
  }
  matchesGrid.innerHTML = matches.map(matchCardHTML).join('');
}

/**
 * Lógica de filtrado: recorre todas las tarjetas y agrega/quita la
 * clase "hidden" de Tailwind según coincida con el filtro elegido
 */
function applyFilter(selectedStatus) {
  currentFilter = selectedStatus;
  const matchCards = document.querySelectorAll('.match-card');

  matchCards.forEach(card => {
    const matchStatus = card.getAttribute('data-status');
    const matches = selectedStatus === 'all' || matchStatus === selectedStatus;
    card.classList.toggle('hidden', !matches);
  });

  // Actualiza el estilo visual de los botones para marcar cuál está activo
  filterButtons.forEach(btn => {
    const isActive = btn.getAttribute('data-filter') === selectedStatus;
    btn.classList.toggle('bg-indigo-100', isActive);
    btn.classList.toggle('text-indigo-700', isActive);
    btn.classList.toggle('bg-gray-100', !isActive);
    btn.classList.toggle('text-gray-600', !isActive);
  });
}

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    applyFilter(button.getAttribute('data-filter'));
  });
});

initMatchesPage();
