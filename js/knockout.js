/**
 * knockout.js
 * Lógica de knockout.html: agrupa los partidos por ronda eliminatoria
 * (Ronda de 32, Octavos, Cuartos, Semifinal, Final) y los muestra en columnas.
 *
 * NOTA DE DISEÑO: un bracket "de verdad" (con líneas conectando cada
 * cruce) requiere SVG o mucho CSS a medida. Para mantener el código
 * simple y mantenible, mostramos cada ronda como una sección con sus
 * partidos en tarjetas, en el orden correcto de izquierda a derecha.
 */

const knockoutContainer = document.querySelector('#knockout-container');

async function initKnockoutPage() {
  knockoutContainer.innerHTML = `<p class="text-center text-gray-500 py-10">Cargando fase eliminatoria…</p>`;

  try {
    const matches = await getMatches();
    const knockoutMatches = matches.filter(m => m.stage !== 'GROUP_STAGE');
    renderKnockout(knockoutMatches);
  } catch (error) {
    console.error('Error al cargar la fase eliminatoria:', error);
    renderError(knockoutContainer, error.message);
  }
}

function renderKnockout(matches) {
  if (matches.length === 0) {
    knockoutContainer.innerHTML = `<p class="text-center text-gray-500 py-10">La fase eliminatoria todavía no comenzó.</p>`;
    return;
  }

  // Agrupamos los partidos por su "stage" (ronda)
  const byStage = {};
  matches.forEach(match => {
    if (!byStage[match.stage]) byStage[match.stage] = [];
    byStage[match.stage].push(match);
  });

  const sections = KNOCKOUT_STAGE_ORDER
    .filter(stage => byStage[stage] && byStage[stage].length > 0)
    .map(stage => knockoutStageHTML(stage, byStage[stage]))
    .join('');

  knockoutContainer.innerHTML = sections;
}

function knockoutStageHTML(stage, matches) {
  const cards = matches.map(matchCardHTML).join('');
  return `
    <section class="mb-10">
      <h2 class="text-2xl font-black text-indigo-900 mb-4 border-b-2 border-indigo-200 pb-2">
        ${STAGE_LABELS[stage] || stage}
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        ${cards}
      </div>
    </section>
  `;
}

initKnockoutPage();
