#!/usr/bin/env node
// Generate case 5/6 patient images via xAI Grok (grok-imagine-image-quality).
// Realistic Taiwanese children WITH full clinical PAT signs (cyanosis, retractions, ECG, IO).
// Writes to the official images/<file>.jpg (overwrites). Reads key from ~/.xai/api_key.
// Usage: node generate_grok.js [file]   e.g. node generate_grok.js c5-s1

const fs = require('fs');
const path = require('path');
const os = require('os');

const apiKey = fs.readFileSync(path.join(os.homedir(), '.xai/api_key'), 'utf8').trim();
const OUT_DIR = path.join(__dirname, 'images');

const C = ' Ultra-photorealistic clinical training photograph. Real child with authentic Taiwanese / East-Asian facial features. Photorealistic skin texture, natural clinical lighting, sharp focus on the face and chest. Educational pediatric assessment (PAT) reference for paramedic training. No text, no watermarks, no captions.';

const ITEMS = [
  // ===== Case 5 — 5yo myocarditis → OHCA (VF), 5 stages =====
  // ① Arrival: decompensated shock, room air (SpO2 86), conscious but lethargic
  { file: 'c5-s1', prompt:
    'A real 5-year-old Taiwanese boy sitting semi-reclined on a home living-room sofa in decompensated shock, breathing room air (no oxygen mask yet). He looks lethargic and weak with dull half-open eyes. Fast shallow breathing with visible nasal flaring and clear intercostal and subcostal retractions on a thin bare chest. Cool, pale, blotchy mottled skin with distinctly dusky grey-blue cyanotic lips and bluish fingertips. Round ECG electrode stickers with lead wires on the chest.' + C },
  // ② After NRM + IV fluids: mask on, IV running, SpO2 95, still shock
  { file: 'c5-s2', prompt:
    'A real 5-year-old Taiwanese boy semi-reclined on a home sofa, now wearing a pediatric non-rebreather oxygen mask with reservoir bag over the nose and mouth, and an IV line running into his arm from a saline bag. Still ill and lethargic, but the lips are now pinker and less blue than before (oxygen improving). Thin chest with mild retractions, mottled pale skin, ECG electrode stickers with lead wires on the chest.' + C },
  // ③ Deteriorates to OHCA / VF: unresponsive, apneic, defib pads
  { file: 'c5-s3', prompt:
    'A real 5-year-old Taiwanese boy lying supine and motionless on the floor during a cardiac arrest, unresponsive. Limp with eyes closed. Pale grey skin with markedly cyanotic deep-blue lips. Two defibrillation pads with cables placed on the bare chest. Urgent clinical resuscitation scene.' + C },
  // ④ Refractory VF: active CPR compressions + epinephrine/amiodarone syringes
  { file: 'c5-s4', prompt:
    'A real 5-year-old Taiwanese boy in cardiac arrest on the floor during active resuscitation, unresponsive with eyes closed and deep cyanotic blue-grey skin. A paramedic\'s two gloved hands are performing chest compressions on the centre of the bare chest. Defibrillation pads with cables on the chest, an IV line in the arm and a medication syringe nearby. Intense emergency CPR scene, multiple gloved hands.' + C },
  // ⑤ ROSC: color returning, BVM ventilation, post-arrest
  { file: 'c5-s5', prompt:
    'A real 5-year-old Taiwanese boy lying on an ambulance stretcher after resuscitation, unconscious but perfusing again. Limp, eyes closed, skin color recovering from grey toward pink. ECG electrode stickers with lead wires on the chest, and a gloved hand holding a bag-valve mask over the nose and mouth. Ambulance interior.' + C },

  // ===== Case 6 — 11mo infant drowning OHCA (Asystole), 4 stages =====
  // ① Arrival: cardiopulmonary arrest, cyanotic, wet
  { file: 'c6-s1', prompt:
    'A real 11-month-old Taiwanese baby boy lying supine on a firm surface, unresponsive after a drowning. Limp with eyes closed. Diffuse blue-grey cyanosis of the face, lips and torso, skin wet-looking. AED electrode pads with cables on the small chest. Home bathroom setting.' + C },
  // ② Two-rescuer 15:2 CPR + BVM, shoulder roll
  { file: 'c6-s2', prompt:
    'A real 11-month-old Taiwanese baby boy in cardiac arrest on a firm surface receiving two-rescuer CPR. One paramedic\'s two thumbs press the centre of the chest with hands encircling the small torso (two-thumb technique), while a second gloved hand holds an infant bag-valve mask over the face for ventilation. A rolled towel under the shoulders. Diffuse blue-grey cyanotic wet skin, limp, eyes closed. AED pads on the chest. Urgent resuscitation scene.' + C },
  // ③ IO + epinephrine
  { file: 'c6-s3', prompt:
    'A real 11-month-old Taiwanese baby boy on an emergency stretcher during resuscitation, limp with eyes closed and diffuse blue-grey cyanotic skin. An intraosseous needle is inserted in the proximal tibia of the lower leg, secured with tape, and a gloved adult hand holds a syringe attached to it. ECG electrode stickers on the chest. Emergency department setting.' + C },
  // ④ ROSC but HR<60, still hypoxic (SpO2 82) → still dusky, warming
  { file: 'c6-s4', prompt:
    'A real 11-month-old Taiwanese baby boy on an ambulance stretcher after return of circulation but still critically ill and hypoxic. Limp and drowsy with eyes barely open, slow breathing. Skin still pale with a persistent dusky bluish tinge to the lips. Wrapped in a silver warming blanket, a small pediatric oxygen mask over the nose and mouth, ECG leads on the chest. Ambulance interior with a monitor in the background.' + C },
];

async function generate(prompt) {
  const resp = await fetch('https://api.x.ai/v1/images/generations', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'grok-imagine-image-quality', prompt, n: 1, response_format: 'b64_json' }),
  });
  const text = await resp.text();
  if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${text.slice(0, 300)}`);
  const d = JSON.parse(text).data?.[0];
  if (!d) throw new Error(`No image: ${text.slice(0, 200)}`);
  if (d.b64_json) return Buffer.from(d.b64_json, 'base64');
  const r = await fetch(d.url); return Buffer.from(await r.arrayBuffer());
}

const only = process.argv[2];
const targets = only ? ITEMS.filter(i => i.file === only) : ITEMS;

(async () => {
  let ok = 0, fail = 0;
  for (const { file, prompt } of targets) {
    process.stdout.write(`→ ${file}  ...  `);
    const t0 = Date.now();
    try {
      const buf = await generate(prompt);
      fs.writeFileSync(path.join(OUT_DIR, `${file}.jpg`), buf);
      console.log(`✓ ${(buf.length/1024).toFixed(0)} KB  (${((Date.now()-t0)/1000).toFixed(1)}s)`);
      ok++;
    } catch (e) { console.log(`✗ ${e.message.slice(0, 200)}`); fail++; }
    await new Promise(r => setTimeout(r, 600));
  }
  console.log(`\nDone. ✓ ${ok}  ✗ ${fail}`);
})();
