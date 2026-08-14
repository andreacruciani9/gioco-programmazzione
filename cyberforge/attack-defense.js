const AD_SCENARIOS = { attack: CYBERFORGE_ATTACK, defense: CYBERFORGE_DEFENSE };

const AD_KEY = 'cyberforge-terminal-v2';
let adProgress = loadAdProgress();
let adSession = null;
let adAnswered = false;
let adHintIndex = 0;
let adWasCorrect = false;

function loadAdProgress() {
  const fallback = { completed: {}, xp: 0, lastMode: 'attack' };
  try { return { ...fallback, ...JSON.parse(localStorage.getItem(AD_KEY) || '{}') }; }
  catch { return fallback; }
}
function saveAdProgress() { localStorage.setItem(AD_KEY, JSON.stringify(adProgress)); }
function adCompletedCount(mode) { return AD_SCENARIOS[mode].filter(s => adProgress.completed[s.id]).length; }
function refreshAttackDefenseCard() {
  const a = adCompletedCount('attack'), d = adCompletedCount('defense');
  document.getElementById('attackPathProgress').textContent = `${a}/${AD_SCENARIOS.attack.length}`;
  document.getElementById('defensePathProgress').textContent = `${d}/${AD_SCENARIOS.defense.length}`;
  document.getElementById('attackDefenseProgress').textContent = `${a + d}/${AD_SCENARIOS.attack.length + AD_SCENARIOS.defense.length}`;
}
function openAttackDefenseHub() {
  show('dashboardView'); dashboard(); refreshAttackDefenseCard();
  setTimeout(() => document.getElementById('attackDefenseCard')?.scrollIntoView({behavior:'smooth',block:'start'}), 60);
}
function startAdPath(mode) {
  const list = AD_SCENARIOS[mode];
  let index = list.findIndex(s => !adProgress.completed[s.id]);
  if (index < 0) index = 0;
  adProgress.lastMode = mode; saveAdProgress();
  adSession = { mode, index, gainedXp: 0 };
  show('battleView');
  document.querySelectorAll('.bottom-nav button').forEach(b => b.classList.remove('active'));
  document.getElementById('navBattle').classList.add('active');
  renderAdScenario();
}
function renderMap(nodes) {
  document.getElementById('labMap').innerHTML = nodes.map(n => `<div class="lab-node ${n.state || ''}"><strong>${escapeHtml(n.name)}</strong><small>${escapeHtml(n.detail)}</small></div>`).join('');
}
function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
}
function terminalLine(text, type='system') { return `<div class="terminal-line ${type}">${escapeHtml(text)}</div>`; }
function renderAdScenario() {
  adAnswered = false; adWasCorrect = false; adHintIndex = 0;
  const s = AD_SCENARIOS[adSession.mode][adSession.index], list = AD_SCENARIOS[adSession.mode];
  document.getElementById('battleMode').textContent = adSession.mode === 'attack' ? 'Attacco simulato' : 'Difesa';
  document.getElementById('battleLevel').textContent = `${s.level} · ${adSession.index + 1}/${list.length}`;
  document.getElementById('battleProgress').style.width = `${(adSession.index / list.length) * 100}%`;
  document.getElementById('battleDomain').textContent = s.domain;
  document.getElementById('battleTitle').textContent = s.title;
  document.getElementById('battleObjective').textContent = s.objective;
  document.getElementById('battleStory').textContent = s.story;
  document.getElementById('battleLesson').innerHTML = `<strong>Prima di scrivere</strong><br>${escapeHtml(s.lesson)}`;
  document.getElementById('battleQuestion').textContent = s.task;
  document.getElementById('expectedFormat').textContent = s.format;
  document.getElementById('terminalPrompt').textContent = s.prompt;
  document.getElementById('terminalInput').value = '';
  document.getElementById('terminalInput').disabled = false;
  document.getElementById('terminalHistory').innerHTML = terminalLine('CyberForge Terminal v2 — ambiente simulato locale', 'system') + terminalLine(`Scenario caricato: ${s.title}`, 'comment') + terminalLine('Scrivi il codice richiesto e premi “Esegui nel laboratorio”.', 'comment');
  document.getElementById('battleFeedback').className = 'battle-feedback hidden';
  document.getElementById('battleVerify').classList.remove('hidden');
  document.getElementById('battleNext').classList.add('hidden');
  document.getElementById('battleHint').disabled = false;
  document.getElementById('battleHint').textContent = 'Suggerimento 1/3';
  renderMap(s.nodes);
  setTimeout(() => document.getElementById('terminalInput').focus(), 80);
}
function normalizeCode(value) { return value.toLowerCase().replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/\s+/g,' ').trim(); }
function verifyAdScenario() {
  if (adAnswered) return;
  const s = AD_SCENARIOS[adSession.mode][adSession.index];
  const raw = document.getElementById('terminalInput').value;
  if (!raw.trim()) return alert('Scrivi il comando o il codice nel terminale.');
  const normalized = normalizeCode(raw);
  const missing = s.tokens.filter(token => !normalized.includes(normalizeCode(token)));
  const correct = missing.length === 0;
  const history = document.getElementById('terminalHistory');
  history.innerHTML += terminalLine(`${s.prompt} ${raw}`, 'command');
  adAnswered = true; adWasCorrect = correct;
  if (!correct) {
    history.innerHTML += terminalLine(`Errore di sintassi o elementi mancanti: ${missing.join(', ')}`, 'error');
    const feedback = document.getElementById('battleFeedback');
    feedback.className = 'battle-feedback bad';
    feedback.innerHTML = `<strong>❌ Il terminale non può completare l’obiettivo</strong><p>Mancano o non sono riconosciuti: <code>${escapeHtml(missing.join(', '))}</code></p><p>Usa i suggerimenti e riscrivi l’intero comando.</p>`;
    document.getElementById('battleVerify').classList.add('hidden');
    document.getElementById('battleNext').classList.remove('hidden');
    document.getElementById('battleNext').textContent = 'Riprova il codice';
    return;
  }
  history.innerHTML += s.output.split('\n').map(line => terminalLine(line, line.includes('FLAG') || line.includes('[PASS]') ? 'success' : 'system')).join('');
  renderMap(s.afterNodes);
  const gain = s.level === 'Base' ? 60 : s.level === 'Junior' ? 80 : s.level === 'Intermedio' ? 100 : s.level === 'Avanzato' ? 120 : s.level === 'Esperto' ? 150 : 200;
  if (!adProgress.completed[s.id]) {
    adProgress.completed[s.id] = true; adProgress.xp += gain; adSession.gainedXp += gain;
    if (typeof P !== 'undefined') { P.xp += gain; save(); dashboard(); }
    saveAdProgress();
  }
  const lineHtml = s.explanation.map(([line, meaning, purpose]) => `<div class="code-line-explanation"><code>${escapeHtml(line)}</code><span><strong>Significa:</strong> ${escapeHtml(meaning)}<br><strong>Ti serve per:</strong> ${escapeHtml(purpose)}</span></div>`).join('');
  const opposite = adSession.mode === 'attack' ? `<strong>Come si difende:</strong> ${escapeHtml(s.defense)}` : `<strong>Cosa cambia per l’attaccante:</strong> ${escapeHtml(s.attackView)}`;
  const feedback = document.getElementById('battleFeedback');
  feedback.className = 'battle-feedback ok';
  feedback.innerHTML = `<strong>✅ Codice eseguito nel simulatore <span class="terminal-badge">+${gain} XP</span></strong><p><strong>Codice corretto:</strong></p><code>${escapeHtml(s.answer)}</code><div class="code-explanation">${lineHtml}</div><p>${opposite}</p>`;
  document.getElementById('terminalInput').disabled = true;
  document.getElementById('battleVerify').classList.add('hidden');
  document.getElementById('battleNext').classList.remove('hidden');
  document.getElementById('battleNext').textContent = 'Prossimo scenario';
  refreshAttackDefenseCard();
  history.scrollTop = history.scrollHeight;
}
function nextAdScenario() {
  if (!adWasCorrect) return renderAdScenario();
  const list = AD_SCENARIOS[adSession.mode];
  if (adSession.index < list.length - 1) { adSession.index += 1; return renderAdScenario(); }
  document.getElementById('battleProgress').style.width = '100%';
  document.getElementById('resultTitle').textContent = adSession.mode === 'attack' ? 'Percorso offensivo simulato completato' : 'Percorso difensivo completato';
  document.getElementById('resultScore').textContent = `${adSession.gainedXp} XP`;
  document.getElementById('resultText').textContent = 'Hai scritto e compreso tutti i comandi del percorso disponibile. Gli aggiornamenti aggiungeranno nuovi domini e laboratori.';
  show('resultView');
}
function showAdHint() {
  const s = AD_SCENARIOS[adSession.mode][adSession.index];
  const hint = s.hints[Math.min(adHintIndex, s.hints.length - 1)];
  const feedback = document.getElementById('battleFeedback');
  feedback.className = 'battle-feedback hint';
  feedback.innerHTML = `<strong>💡 Suggerimento ${Math.min(adHintIndex + 1, 3)}/3</strong><p>${escapeHtml(hint)}</p>${adHintIndex === 2 ? '<p>Ora riscrivi tu il codice nel terminale, senza copiarlo automaticamente.</p>' : ''}`;
  adHintIndex = Math.min(adHintIndex + 1, 3);
  document.getElementById('battleHint').textContent = adHintIndex < 3 ? `Suggerimento ${adHintIndex + 1}/3` : 'Soluzione mostrata';
  if (adHintIndex >= 3) document.getElementById('battleHint').disabled = true;
}

document.getElementById('startAttackPath').onclick = () => startAdPath('attack');
document.getElementById('startDefensePath').onclick = () => startAdPath('defense');
document.getElementById('navBattle').onclick = openAttackDefenseHub;
document.getElementById('exitBattle').onclick = openAttackDefenseHub;
document.getElementById('battleVerify').onclick = verifyAdScenario;
document.getElementById('battleNext').onclick = nextAdScenario;
document.getElementById('battleHint').onclick = showAdHint;
refreshAttackDefenseCard();

function loadTrainingScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-cyberforge-update="${src}"]`);
    if (existing) return resolve();
    const script = document.createElement('script');
    script.src = src;
    script.dataset.cyberforgeUpdate = src;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

(async function loadScheduledContent() {
  try {
    await loadTrainingScript('./update-2026-08-11.js');
    await loadTrainingScript('./update-2026-08-14.js');
    AD_SCENARIOS.attack = CYBERFORGE_ATTACK;
    AD_SCENARIOS.defense = CYBERFORGE_DEFENSE;
    refreshAttackDefenseCard();

    await loadTrainingScript('./update-2026-08-11-examples.js');
    await loadTrainingScript('./update-2026-08-14-examples.js');
  } catch (error) {
    console.error('CyberForge: caricamento aggiornamenti non riuscito', error);
  }
})();