// Safe September mission pack: all scenarios operate only on local synthetic files.
const SEP01_ATTACK = [];
const SEP01_DEFENSE = [];

for (const scenario of SEP01_ATTACK) {
  if (!CYBERFORGE_ATTACK.some(existing => existing.id === scenario.id)) CYBERFORGE_ATTACK.push(scenario);
}
for (const scenario of SEP01_DEFENSE) {
  if (!CYBERFORGE_DEFENSE.some(existing => existing.id === scenario.id)) CYBERFORGE_DEFENSE.push(scenario);
}
