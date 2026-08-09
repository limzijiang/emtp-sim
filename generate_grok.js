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
    'A real 5-year-old Taiwanese boy sitting semi-reclined on a home living-room sofa in decompensated shock, breathing room air (no oxygen mask yet). He looks lethargic and weak with dull half-open eyes. Fast shallow breathing with visible nasal flaring and clear intercostal and subcostal retractions on a thin bare chest. Pale, slightly mottled skin with only MILD cyanosis — the lips and fingertips have just a faint dusky bluish tinge, NOT deep blue. Natural realistic skin tone overall. Round ECG electrode stickers with lead wires on the chest.' + C },
  // ② After NRM + IV fluids: mask on, IV running, SpO2 95, still shock
  { file: 'c5-s2', prompt:
    'A real 5-year-old Taiwanese boy semi-reclined on a home sofa, now wearing a pediatric non-rebreather oxygen mask with reservoir bag over the nose and mouth, and an IV line running into his arm from a saline bag. Still ill and lethargic, but the lips are now pinker and less blue than before (oxygen improving). Thin chest with mild retractions, mottled pale skin, ECG electrode stickers with lead wires on the chest.' + C },
  // ③ Deteriorates to OHCA / VF: unresponsive, apneic, defib pads
  { file: 'c5-s3', prompt:
    'A real 5-year-old Taiwanese boy lying supine and motionless on the floor during a cardiac arrest, unresponsive. Limp with eyes closed. Overall pale skin; only the LIPS themselves are slightly bluish (mild lip cyanosis). The cheeks, chin and rest of the face are a natural pale skin tone with NO blue patches, smudges or discoloration spreading beyond the lips. Two defibrillation pads with cables placed on the bare chest. Urgent clinical resuscitation scene.' + C },
  // ④ Refractory VF: active CPR, CORRECT hand position on lower-half sternum
  { file: 'c5-s4', prompt:
    'A real 5-year-old Taiwanese boy in cardiac arrest lying flat on his back on a firm surface during active resuscitation, unresponsive with eyes closed. Pale skin with only MILD cyanosis (faint bluish tinge to the lips, NOT a deep blue face). A paramedic performs chest compressions: the heel of the hand is placed FLAT and CENTERED on the breastbone in the exact MIDDLE of the chest, on the lower half of the sternum at the level midway between the two nipples. The compressing arm is straight and vertical, shoulders directly above the hands. The hand is NOT on the upper chest, NOT on the collarbone or shoulder, NOT off to the side on the ribs, NOT on the abdomen — it is squarely on the centre of the sternum. Defibrillation pads with cables on the chest, an IV line in the arm, a medication syringe nearby. Emergency CPR scene, view from the side.' + C },
  // ⑤ ROSC: color returning, BVM ventilation, post-arrest
  { file: 'c5-s5', prompt:
    'A real 5-year-old Taiwanese boy lying on an ambulance stretcher after resuscitation, unconscious but perfusing again. Limp, eyes closed, skin color recovering from grey toward pink. ECG electrode stickers with lead wires on the chest, and a gloved hand holding a bag-valve mask over the nose and mouth. Ambulance interior.' + C },

  // ===== Case 6 — 11mo infant drowning OHCA (Asystole), 4 stages =====
  // ① Arrival: cardiopulmonary arrest, MILD cyanosis, wet
  { file: 'c6-s1', prompt:
    'A real 11-month-old Taiwanese baby boy lying supine on a firm surface, unresponsive after a drowning. Limp with eyes closed. Wet-looking, overall pale skin; only the LIPS themselves are slightly bluish (mild lip cyanosis). The cheeks, chin and rest of the face are a natural pale skin tone with NO blue patches, smudges or discoloration spreading beyond the lips, and NOT a deep blue-grey face or body. AED electrode pads with cables on the small chest. Home bathroom setting.' + C },
  // ② Two-thumb encircling CPR (CORRECT position) + BVM, shoulder roll
  { file: 'c6-s2', prompt:
    'A real 11-month-old Taiwanese baby boy in cardiac arrest on a firm surface receiving two-rescuer infant CPR. One rescuer uses the two-thumb encircling technique: both thumbs placed side by side flat on the LOWER HALF OF THE STERNUM, just below the imaginary nipple line at the centre of the chest, with both hands wrapping around the sides of the small torso and fingers supporting the back. A second rescuer holds a small infant bag-valve mask over the nose and mouth. A rolled towel under the shoulders. Pale wet skin with only MILD cyanosis (faint bluish tinge to the lips, not a deep blue face). AED pads on the chest. Urgent resuscitation scene.' + C },
  // ③ IO via EZ-IO drill, no hand holding a manual needle
  { file: 'c6-s3', prompt:
    'A real 11-month-old Taiwanese baby boy on an emergency stretcher during resuscitation, limp with eyes closed. Pale skin with only MILD cyanosis (faint bluish tinge to the lips, not deep blue). An EZ-IO intraosseous device is in place at the proximal tibia of the lower leg: a teal-and-black battery-powered drill-style driver holding the intraosseous needle drilled into the bone, standing on its own. No separate hand holding a manual needle, no syringe. ECG electrode stickers on the chest. Emergency department setting.' + C },
  // ④ ROSC but HR<60, still hypoxic (SpO2 82) → still dusky, warming
  { file: 'c6-s4', prompt:
    'A real 11-month-old Taiwanese baby boy on an ambulance stretcher after return of circulation but still critically ill and hypoxic. Limp and drowsy with eyes barely open, slow breathing. Skin still pale with a persistent dusky bluish tinge to the lips. Wrapped in a silver warming blanket, a small pediatric oxygen mask over the nose and mouth, ECG leads on the chest. Ambulance interior with a monitor in the background.' + C },

  // ===== Case 7 — 6yo dodgeball head hit, epistaxis (BLS初評), 2 stages =====
  // ① Arrival: crying, agitated, nosebleed being pinched by school nurse
  { file: 'c7-s1', prompt:
    'A real 6-year-old Taiwanese boy sitting on the ground of a school playground, crying loudly and agitated, tears on his cheeks, mouth open mid-cry. He has a nosebleed: fresh red blood visible around his nostrils and several red blood stains down the front of his light-colored school PE shirt. An adult school nurse\'s hand (only hand and forearm visible) gently pinches the bridge of his nose with white gauze. Daytime outdoor school playground background.' + C },
  // ② Calmed: leaning forward, cooperative, gauze at nose, stable
  { file: 'c7-s2', prompt:
    'A real 6-year-old Taiwanese boy sitting calmly on a school playground bench, leaning slightly forward, no longer crying, calm and cooperative expression. He gently holds a piece of white gauze under his own nose; a few dried blood stains on his school PE shirt. Healthy pink skin color, breathing normally. An EMT\'s gloved hand takes his radial pulse at the wrist. Daytime school playground background.' + C },

  // ===== Case 8 — 10yo 6-metre fall, major trauma / hemorrhagic shock (ALS), 3 stages =====
  // ① Arrival: unconscious on concrete, thigh laceration bleeding, pale
  { file: 'c8-s1', prompt:
    'Exactly ONE single real 10-year-old Taiwanese boy (one head, one body, nobody else in the frame) lying supine alone on grey concrete ground of a school courtyard after a fall from height, unconscious with eyes closed, photographed from a three-quarter overhead angle. Very pale skin, a small abrasion on his cheek. His right trouser leg is torn near the knee revealing a bleeding 5 cm laceration on the thigh with a small pool of fresh red blood on the concrete. Mouth slightly open. School building blurred in the background.' + C },
  // ② After interventions: pressure dressing, NPA, NRM oxygen, pelvic binder
  { file: 'c8-s2', prompt:
    'A real 10-year-old Taiwanese boy lying supine on the ground being treated by EMTs after a fall from height, unconscious with eyes closed, very pale. A pressure bandage is wrapped around his right thigh, a soft nasopharyngeal airway tube is in one nostril, and a pediatric non-rebreather oxygen mask with reservoir bag covers his nose and mouth. Around his pelvis is a proper pelvic compression binder: ONE single broad padded blue-and-black fabric wrap about 15 cm wide, encircling the hips low at the level of the greater trochanters, lying flat and snug with a single wide black buckle strap across the front — like a SAM Pelvic Sling. It is NOT thin webbing, NOT multiple straps, NOT a climbing harness. Gloved EMT hands adjusting the dressing. Urgent trauma scene, school courtyard.' + C },
  // ③ After IV fluids: on stretcher with collar, IV running, color improving
  { file: 'c8-s3', prompt:
    'A real 10-year-old Taiwanese boy secured on an ambulance stretcher with a pediatric cervical collar, unconscious but with skin color improving from grey-pale toward light pink. A pediatric non-rebreather oxygen mask on his face, an IV line running into his arm from a saline bag held above, a pressure bandage on the right thigh and a pelvic binder visible. ECG electrode stickers on the chest. Ambulance interior, transport underway.' + C },

  // ===== Case 9 — 8mo infant suspected abusive head trauma (TBI), 3 stages =====
  // ① Arrival: comatose infant on play mat, forehead swelling, bruises, anisocoria hinted
  { file: 'c9-s1', prompt:
    'A real 8-month-old Taiwanese baby boy lying limp and unconscious on a colorful foam play mat inside a home playpen with fabric fence. Eyes closed, pale skin, mouth slightly open as if snoring. A mildly swollen reddened bump on his forehead and one small faint bruise on his upper arm. Home living room background, toys nearby.' + C },
  // ② OPA + BVM assisted ventilation
  { file: 'c9-s2', prompt:
    'A real 8-month-old Taiwanese baby boy lying flat on his back on a play mat receiving assisted ventilation with an infant bag-valve mask. The clear triangular mask is sealed OVER THE LOWER HALF OF THE FACE, covering ONLY the nose and mouth (its narrow tip on the bridge of the nose, its wide base on the chin) — it is NOT on the forehead and NOT on the top of the head. One gloved paramedic hand holds the mask in a C-E grip with fingers lifting the jaw; the self-inflating bag extends upward away from the face. Baby\'s eyes closed, limp, pale skin. On the centre of the forehead only a subtle realistic soft-tissue swelling: a faint reddened, very slightly raised area — barely noticeable, smooth normal head contour, no lump or dome. A rolled towel under the shoulders. Home interior background.' + C },
  // ③ Transport: neutral c-spine, ventilation continuing, warming
  { file: 'c9-s3', prompt:
    'A real 8-month-old Taiwanese baby boy secured on an ambulance stretcher with soft head blocks keeping the head and neck in a neutral straight position, wrapped warmly in a blanket. Eyes closed, pale but stable skin color. On the CENTRE OF THE FOREHEAD (above the eyebrows, below the hairline) there is only a subtle realistic soft-tissue swelling: a faint reddened, very slightly raised area a few centimetres wide — barely noticeable, with smooth normal head contour. It is NOT a protruding dome, NOT a lump, NOT a bulging fontanelle, and the top of the skull looks completely normal. A gloved hand continues gentle bag-valve-mask ventilation over his nose and mouth. ECG electrode stickers on the chest, monitor in the background. Ambulance interior.' + C },
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
