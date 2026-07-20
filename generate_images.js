#!/usr/bin/env node
// Generate patient stage images via OpenAI gpt-image-2 (GPT Image 2.0)
// Case 5/6 prompts are PAT-focused (patient clinical appearance); if a realistic
// child prompt is moderation-blocked, an automatic training-manikin fallback is tried.
// Usage: node generate_images.js [filename]    (filename optional — defaults to all)

const fs = require('fs');
const path = require('path');
const os = require('os');

const apiKey = fs.readFileSync(path.join(os.homedir(), '.openai/api_key'), 'utf8').trim();
const OUT_DIR = path.join(__dirname, 'images');

const COMMON = ' Style: professional medical training photograph for healthcare educational simulation. Subject is a young patient actor / depicted for educational purposes. Ethically depicted, respectful, clinically accurate. Taiwanese ethnicity, authentic East-Asian facial features, photorealistic skin texture and natural lighting. Sharp focus on patient face and clinical signs. No text, no watermarks, no caption, no logos.';

// PAT-focused suffix: emphasise the patient's clinical appearance (Pediatric Assessment Triangle)
const PAT = ' The photograph must focus clearly on the patient and their clinical appearance for EMT / paramedic pediatric assessment education, showing skin color, breathing effort and body tone. Respectful, ethical, clinically accurate educational reference. Taiwanese ethnicity, authentic East-Asian features, photorealistic, soft even clinical lighting, no text, no watermarks, no logos.';
// Manikin fallback suffix (used only if the realistic prompt is moderation-blocked)
const PATM = ' Clearly a medical training manikin / simulation doll, not a real child. Respectful educational reference. Photorealistic, soft even lighting, no text, no watermarks, no logos.';

const PROMPTS = [
  // ============ Case 1 — 3yo seizure ============
  { file: 'c1-s1.jpg', prompt:
    'Educational medical simulation photograph: a 3-year-old Taiwanese boy with a known seizure disorder having a generalized tonic-clonic seizure on an ambulance stretcher. Body is slightly stiffened and trembling rhythmically, eyes rolled upward showing whites, mouth slightly open with white frothy saliva at the corners, mild bluish discoloration around the lips. Ambulance interior background, soft warm overhead lighting.' + COMMON
  },
  { file: 'c1-s2.jpg', prompt:
    'Educational medical simulation photograph: a 3-year-old Taiwanese boy still in seizure on an ambulance stretcher, now with worsening hypoxia. Lips and fingertips clearly cyanotic (blue-purple). Visible intercostal retractions on a thin chest. White frothy saliva at the mouth. Eyes half-closed and rolled back. Urgent EMS atmosphere, ambulance interior.' + COMMON
  },
  { file: 'c1-s3.jpg', prompt:
    'Educational medical simulation photograph: a 3-year-old Taiwanese boy in postictal state on an ambulance stretcher after seizure has stopped. Lying very still, eyes gently closed, peaceful but unconscious expression, healthy pink color returning to cheeks. Pediatric non-rebreather oxygen mask covering nose and mouth. Soft ambulance interior light.' + COMMON
  },
  { file: 'c1-s4.jpg', prompt:
    'Educational medical simulation photograph: a 3-year-old Taiwanese boy on an ambulance stretcher showing post-medication respiratory depression and hypoglycemia. Very pale skin, slight cold sweat on forehead, eyes closed and unresponsive, arms limp. A pediatric bag-valve-mask (BVM) is held over face by a gloved paramedic hand (only hand visible from edge of frame). IV catheter visible on the dorsum of the hand. Urgent atmosphere.' + COMMON
  },
  { file: 'c1-s5.jpg', prompt:
    'Educational medical simulation photograph: a 3-year-old Taiwanese boy on an ambulance stretcher slowly waking up after dextrose given for hypoglycemia. Eyes just barely opening, color much better and healthy pink, calm expression. A parent\'s adult hand visible at edge of frame gently holding the child\'s small hand. Non-rebreather oxygen mask still on the face. IV line running on the arm. Soft hopeful atmosphere.' + COMMON
  },

  // ============ Case 2 — 10mo infant abusive head trauma ============
  { file: 'c2-s1.jpg', prompt:
    'Educational medical simulation photograph: a 10-month-old Taiwanese infant boy lying limp on a small stretcher with signs of increased intracranial pressure. The anterior fontanelle on top of the head is clearly bulging outward. Pale skin with slight cyanosis. Slow shallow chest movement. Eyes half-closed and unresponsive, with one pupil noticeably larger than the other (anisocoria). No facial expression. EMS scene lighting.' + COMMON
  },
  { file: 'c2-s2.jpg', prompt:
    'Educational medical simulation photograph: a 10-month-old Taiwanese infant boy on a stretcher receiving positive pressure ventilation. An infant-size bag-valve mask covers his nose and mouth, held in place by a paramedic\'s gloved hand (only hand visible). Eyes closed, body still. Skin color slightly improved (less cyanotic). Ambulance interior background.' + COMMON
  },
  { file: 'c2-s3.jpg', prompt:
    'Close-up photograph of a vital signs monitor screen in an ambulance during an active pediatric emergency call. The monitor displays a slow heart rhythm with mechanical artifact distortion (showing ongoing care being delivered), and bright red alarm indicators. Out-of-focus blurred background shows paramedic uniforms and gloved hands in motion. Soft warm ambulance interior with red and blue light reflections. Cinematic professional medical photography. Photorealistic, no text overlay on the monitor, no watermarks.'
  },
  { file: 'c2-s4.jpg', prompt:
    'Photograph of a small Taiwanese baby sleeping peacefully wrapped in a soft warm blanket on a hospital transport stretcher. Eyes closed and calm, healthy skin color. A small pediatric oxygen mask gently rests on the face. A few ECG sticker leads visible on the chest. Soft warm ambulance interior lighting. Gentle, calm and reassuring atmosphere. Professional pediatric care setting. Photorealistic, Taiwanese ethnicity, no text, no watermarks.'
  },

  // ============ Case 3 — 10yo bee sting anaphylaxis ============
  { file: 'c3-s1.jpg', prompt:
    'Educational medical simulation photograph: a 10-year-old Taiwanese boy in severe anaphylactic shock from a bee sting, lying on the ground in a mountainous outdoor setting. Clearly visible raised pink urticaria/hives covering chest and upper arms. Very swollen puffy periorbital edema around both eyes (eyes nearly swollen shut). Very pale skin, sweaty forehead. Mouth open struggling to inhale air, visible neck strain (stridorous breathing). Looking distressed and frightened. EMS team kneeling beside him.' + COMMON
  },
  { file: 'c3-s2.jpg', prompt:
    'Educational medical simulation photograph: a 10-year-old Taiwanese boy on a stretcher being treated for anaphylaxis. He wears a pediatric non-rebreather oxygen mask. A paramedic\'s gloved hand is injecting an IM epinephrine syringe into the lateral thigh (vastus lateralis muscle). The urticaria/hives are fading slightly. Periorbital swelling around eyes still visible but reduced. Patient\'s eyes open and alert. Outdoor mountain EMS scene background.' + COMMON
  },
  { file: 'c3-s3.jpg', prompt:
    'Photograph of a 10-year-old Taiwanese boy sitting up on an ambulance stretcher looking much better and calmer. He wears a nebulizer mask delivering visible white medication mist over his face. Healthy pink skin color, alert and aware, slight smile of relief. Ambulance interior with monitor in the background. Calm reassuring atmosphere of recovery. Photorealistic, Taiwanese ethnicity with authentic East-Asian features, professional medical training photography. No text, no watermarks.'
  },
  { file: 'c3-s4.jpg', prompt:
    'Educational medical simulation photograph: a 10-year-old Taiwanese boy on a stretcher inside an ambulance during stable transport after anaphylaxis treatment. Oxygen mask on. Alert and calm. A parent visible at his side holding his hand reassuringly. ECG monitor leads visible on chest. Very faint residual hives barely visible on skin. Calm monitoring atmosphere.' + COMMON
  },

  // ============ Case 4 — 6yo acute asthma ============
  { file: 'c4-s1.jpg', prompt:
    'Educational medical simulation photograph: a 6-year-old Taiwanese boy in tripod position (sitting upright leaning forward with hands braced on knees) showing severe respiratory distress from acute asthma exacerbation. Clearly visible suprasternal and intercostal retractions, nasal flaring of the nostrils, anxious wide-eyed expression. Mouth open trying to breathe, visible use of accessory neck and shoulder muscles. Wearing a school PE uniform. Outdoor schoolyard setting in cold winter weather with breath visible as condensation.' + COMMON
  },
  { file: 'c4-s2.jpg', prompt:
    'Educational medical simulation photograph: a 6-year-old Taiwanese boy sitting upright in tripod position on a stretcher with a pediatric non-rebreather oxygen mask covering nose and mouth. Still working hard to breathe but slightly less anxious than before. Slight improvement in lip color. An EMT\'s gloved hand visible adjusting the mask strap.' + COMMON
  },
  { file: 'c4-s3.jpg', prompt:
    'Educational medical simulation photograph: a 6-year-old Taiwanese boy on a stretcher with a nebulizer mask delivering bronchodilator mist (visible white mist) over his face. Breathing much easier and visibly more relaxed posture. Healthier pink skin color. Slight tremor visible in small hands (β-agonist side effect). Able to make eye contact and looking calmer. Ambulance interior.' + COMMON
  },
  { file: 'c4-s4.jpg', prompt:
    'Educational medical simulation photograph: a 6-year-old Taiwanese boy on a stretcher showing severe deterioration in asthma exacerbation toward respiratory failure. Extremely drowsy, eyes half-closed and unfocused, head tilted slightly back. A pediatric BVM bag-valve mask is being held over his face by a paramedic\'s gloved hand (only hand visible at frame edge). Very pale exhausted appearance. He is no longer using accessory respiratory muscles because he is now too exhausted. Arms limp at sides. Urgent EMS atmosphere.' + COMMON
  },

  // ============ Case 5 — 5yo myocarditis → OHCA (PAT-focused) ============
  { file: 'c5-s1.jpg',
    prompt: 'Clinical training reference photograph for EMT pediatric assessment (Pediatric Assessment Triangle). A 5-year-old Taiwanese boy sitting semi-reclined on a home sofa in decompensated shock. APPEARANCE: lethargic and weak, dull half-open eyes with poor engagement, head resting back. WORK OF BREATHING: fast shallow breathing with visible nasal flaring and mild intercostal / subcostal retractions on a thin bare chest. CIRCULATION TO SKIN: pale, faintly mottled skin with dusky grey-blue lips and fingertips. Clear upper-body view emphasising skin color and breathing effort.' + PAT,
    fallback: 'Clinical training reference photograph of a high-fidelity pediatric medical simulation manikin (lifelike training doll) representing a 5-year-old child in shock, semi-reclined, with pale mottled molded skin, dusky lips, bare chest showing intercostal retractions. Educational Pediatric Assessment Triangle reference.' + PATM },
  { file: 'c5-s3.jpg',
    prompt: 'Clinical training reference photograph for pediatric CPR education. A 5-year-old Taiwanese boy lying supine and completely motionless on the floor, unresponsive. APPEARANCE: limp, eyes closed, no movement or tone. WORK OF BREATHING: no chest movement (apnoea). CIRCULATION TO SKIN: pale grey skin with markedly cyanotic deep-blue lips. Defibrillation pads on the bare chest. Educational resuscitation scene.' + PAT,
    fallback: 'Clinical training reference photograph of a high-fidelity pediatric CPR simulation manikin (lifelike training doll) of a 5-year-old, lying supine and motionless, molded cyanotic blue lips and pale grey skin, defibrillation training pads on the chest. Educational resuscitation training reference.' + PATM },
  { file: 'c5-s5.jpg',
    prompt: 'Clinical training reference photograph. A 5-year-old Taiwanese boy lying on an ambulance stretcher after resuscitation, unconscious but perfusing again. APPEARANCE: limp and unresponsive, eyes closed. CIRCULATION TO SKIN: skin color recovering from grey toward pink. A gloved hand supports ventilation with a bag-valve mask over the face. Upper-body clinical view.' + PAT,
    fallback: 'Clinical training reference photograph of a high-fidelity pediatric simulation manikin (lifelike training doll) of a 5-year-old on a stretcher post-resuscitation, molded skin color recovering toward pink, a gloved hand holding a bag-valve mask over the face. Educational training reference.' + PATM },

  // ============ Case 6 — 11mo infant drowning OHCA (PAT-focused) ============
  { file: 'c6-s1.jpg',
    prompt: 'Clinical training reference photograph for infant assessment (Pediatric Assessment Triangle). An 11-month-old Taiwanese baby boy lying supine on a firm surface, unresponsive after a drowning. APPEARANCE: limp, no movement, eyes closed, absent tone. WORK OF BREATHING: no chest or abdominal movement (apnoea). CIRCULATION TO SKIN: diffuse blue-grey cyanosis of the face, lips and torso, skin wet. Clear view of the infant emphasising the cyanotic skin color.' + PAT,
    fallback: 'Clinical training reference photograph of a high-fidelity infant CPR simulation manikin (lifelike baby training doll), 11-month size, lying supine and motionless with molded diffuse blue-grey cyanosis and wet-looking skin. Educational infant Pediatric Assessment Triangle reference.' + PATM },
  { file: 'c6-s3.jpg',
    prompt: 'Clinical training reference photograph. An 11-month-old Taiwanese baby boy on a stretcher during resuscitation: limp, eyes closed, pale blue-grey cyanotic skin. An intraosseous needle is placed in the proximal tibia of the lower leg and a gloved hand gives medication by syringe. Clear view showing the infant\'s skin color and the IO site.' + PAT,
    fallback: 'Clinical training reference photograph of a high-fidelity infant simulation manikin (lifelike baby training doll) on a stretcher, molded cyanotic skin, with an intraosseous training needle in the proximal tibia and a gloved hand giving medication by syringe. Educational resuscitation training reference.' + PATM },
  { file: 'c6-s4.jpg',
    prompt: 'Clinical training reference photograph. An 11-month-old Taiwanese baby boy on a stretcher after return of circulation but still critically ill. APPEARANCE: limp and drowsy, eyes barely open. WORK OF BREATHING: slow shallow breathing. CIRCULATION TO SKIN: pale skin with a faint bluish tinge, wrapped in a silver warming blanket, a small oxygen mask over the face. Clear view of the infant\'s skin color.' + PAT,
    fallback: 'Clinical training reference photograph of a high-fidelity infant simulation manikin (lifelike baby training doll) on a stretcher, molded pale skin with faint bluish tinge, wrapped in a silver warming blanket, small oxygen mask over the face. Educational post-resuscitation training reference.' + PATM },
];

async function generate(prompt) {
  const resp = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-image-2',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      quality: 'medium',
      output_format: 'jpeg',
      output_compression: 88,
    }),
  });
  const text = await resp.text();
  if (!resp.ok) {
    const blocked = /moderation_blocked|safety system/i.test(text);
    const err = new Error(`HTTP ${resp.status}: ${text.slice(0, 300)}`);
    err.moderationBlocked = blocked;
    throw err;
  }
  const json = JSON.parse(text);
  if (!json.data?.[0]?.b64_json) throw new Error(`No image in response: ${text.slice(0, 300)}`);
  return Buffer.from(json.data[0].b64_json, 'base64');
}

const onlyFile = process.argv[2];
const targets = onlyFile ? PROMPTS.filter(p => p.file === onlyFile) : PROMPTS;
if (onlyFile && targets.length === 0) {
  console.error(`No prompt for file: ${onlyFile}`);
  console.error(`Available: ${PROMPTS.map(p => p.file).join(', ')}`);
  process.exit(1);
}

(async () => {
  let ok = 0, fail = 0;
  for (const entry of targets) {
    const { file, prompt, fallback } = entry;
    const outPath = path.join(OUT_DIR, file);
    if (!onlyFile && fs.existsSync(outPath)) {
      console.log(`⊙ ${file}  (skip, exists)`);
      continue;
    }
    process.stdout.write(`→ ${file}  ...  `);
    const t0 = Date.now();
    try {
      let buf;
      try {
        buf = await generate(prompt);
      } catch (e) {
        if (e.moderationBlocked && fallback) {
          process.stdout.write(`(blocked → manikin fallback) `);
          await new Promise(r => setTimeout(r, 800));
          buf = await generate(fallback);
        } else {
          throw e;
        }
      }
      fs.writeFileSync(outPath, buf);
      const sz = (buf.length / 1024).toFixed(0);
      const dt = ((Date.now() - t0) / 1000).toFixed(1);
      console.log(`✓ ${sz} KB  (${dt}s)`);
      ok++;
    } catch (e) {
      console.log(`✗ ${e.message.slice(0, 200)}`);
      fail++;
    }
    await new Promise(r => setTimeout(r, 800));
  }
  console.log(`\nDone. ✓ ${ok}  ✗ ${fail}`);
})();
