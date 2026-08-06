function ensureRealWorldPanel() {
  let panel = document.getElementById('realWorldPanel');
  if (panel) return panel;

  panel = document.createElement('section');
  panel.id = 'realWorldPanel';
  panel.className = 'real-world-panel locked';
  panel.innerHTML = `
    <header class="real-world-header">
      <div>
        <span class="eyebrow">DOPO IL SIMULATORE</span>
        <h3>Codice reale sicuro</h3>
      </div>
      <span id="realWorldLanguage" class="pill">LAB</span>
    </header>
    <p id="realWorldLock" class="real-world-lock">
      Completa correttamente il comando della CyberRange per sbloccare l’esempio in un linguaggio reale.
    </p>
    <div id="realWorldContent" class="hidden">
      <h4 id="realWorldTitle"></h4>
      <p id="realWorldScope" class="real-world-scope"></p>
      <pre id="realWorldCode"></pre>
      <div id="realWorldLines" class="real-world-lines"></div>
      <p id="realWorldPurpose" class="real-world-purpose"></p>
      <p class="real-world-boundary">
        Esegui questi esempi soltanto su localhost, file locali, dati sintetici o sistemi che possiedi e per i quali hai autorizzazione esplicita. Non sono incluse tecniche per occultare un attacco, cancellare tracce o eludere controlli.
      </p>
    </div>`;

  const instruction = document.querySelector('.instruction-card');
  instruction?.insertAdjacentElement('afterend', panel);
  return panel;
}

function renderRealWorldExample(unlocked) {
  const panel = ensureRealWorldPanel();
  if (!adSession) return;

  const scenario = AD_SCENARIOS[adSession.mode][adSession.index];
  const example = REAL_WORLD_EXAMPLES[scenario.id];
  const lock = document.getElementById('realWorldLock');
  const content = document.getElementById('realWorldContent');

  if (!example) {
    panel.classList.add('locked');
    lock.classList.remove('hidden');
    lock.textContent = 'L’esempio reale per questo scenario sarà aggiunto in un prossimo aggiornamento.';
    content.classList.add('hidden');
    return;
  }

  document.getElementById('realWorldLanguage').textContent = example.language;
  document.getElementById('realWorldTitle').textContent = example.title;
  document.getElementById('realWorldScope').textContent = example.scope;
  document.getElementById('realWorldCode').textContent = example.code;
  document.getElementById('realWorldPurpose').innerHTML = `<strong>Perché ti serve:</strong> ${escapeHtml(example.purpose)}`;
  document.getElementById('realWorldLines').innerHTML = example.lines
    .map(([line, meaning]) => `
      <div class="real-world-line">
        <code>${escapeHtml(line)}</code>
        <span>${escapeHtml(meaning)}</span>
      </div>`)
    .join('');

  panel.classList.toggle('locked', !unlocked);
  lock.classList.toggle('hidden', unlocked);
  content.classList.toggle('hidden', !unlocked);
}

const baseRenderAdScenario = renderAdScenario;
renderAdScenario = function renderAdScenarioWithRealCode() {
  baseRenderAdScenario();
  renderRealWorldExample(false);
};

const baseVerifyAdScenario = verifyAdScenario;
verifyAdScenario = function verifyAdScenarioWithRealCode() {
  baseVerifyAdScenario();
  if (adWasCorrect) {
    renderRealWorldExample(true);
    document.getElementById('realWorldPanel')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
};

document.getElementById('battleVerify').onclick = verifyAdScenario;
ensureRealWorldPanel();
