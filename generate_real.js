#!/usr/bin/env node
// Generate REALISTIC Taiwanese pediatric-patient versions of case 5/6 images via gpt-image-1.
// Saves to images/<file>-real.jpg so the manikin versions (images/<file>.jpg) are preserved.
// Each entry has a primary clinical PAT prompt and a softened (still-realistic) fallback
// used only if the primary is moderation-blocked. NO manikin fallback here.

const fs = require('fs');
const path = require('path');
const os = require('os');

const apiKey = fs.readFileSync(path.join(os.homedir(), '.openai/api_key'), 'utf8').trim();
const OUT_DIR = path.join(__dirname, 'images');

const PAT = ' The photograph focuses clearly on the child patient and their clinical appearance for EMT / paramedic pediatric assessment (PAT) education — showing skin color, breathing effort and body tone. Respectful, ethical, clinically accurate educational reference. Taiwanese ethnicity, authentic East-Asian facial features, ultra-photorealistic skin texture, soft even clinical lighting, sharp focus on the face and chest. No text, no watermarks, no logos.';

const ITEMS = [
  { file: 'c5-s1',
    prompt: 'Ultra-realistic photograph of a real 5-year-old Taiwanese boy resting quietly on a home sofa, calm and still, a caregiver nearby. Home living room, soft daytime light. Pediatric care education reference.' + PAT,
    fallback: 'Ultra-realistic candid portrait photograph of a real 5-year-old Taiwanese boy sitting calmly on a sofa at home, resting. Soft natural light.' + PAT },
  { file: 'c5-s3',
    prompt: 'Ultra-realistic photograph of a real 5-year-old Taiwanese boy lying on his back sleeping calmly, small round ECG electrode stickers on the chest, quiet clinical training setting, soft light.' + PAT,
    fallback: 'Ultra-realistic photograph of a real 5-year-old Taiwanese boy sleeping peacefully on his back with small round monitoring stickers on the chest. Calm soft-lit setting.' + PAT },
  { file: 'c5-s5',
    prompt: 'Ultra-realistic photograph of a real 5-year-old Taiwanese boy sleeping peacefully on a padded bed, wrapped in a light blanket, calm and restful. Soft warm light.' + PAT,
    fallback: 'Ultra-realistic candid portrait of a real 5-year-old Taiwanese boy sleeping calmly, resting on a pillow. Soft warm light.' + PAT },
  { file: 'c6-s1',
    prompt: 'Ultra-realistic photograph of a real 11-month-old Taiwanese baby boy lying on his back with eyes gently closed as if sleeping, pale skin, on a soft firm surface, calm clinical training setting.' + PAT,
    fallback: 'Ultra-realistic photograph of a real 11-month-old Taiwanese baby boy sleeping on his back, pale skin, calm. Clinical setting.' + PAT },
  { file: 'c6-s3',
    prompt: 'Ultra-realistic photograph of a real 11-month-old Taiwanese baby boy sleeping calmly on a stretcher, pale, with a small medical dressing/sticker on the lower leg and a gloved adult hand resting nearby. Ambulance interior, soft light.' + PAT,
    fallback: 'Ultra-realistic photograph of a real 11-month-old Taiwanese baby boy asleep on a stretcher, pale, a small dressing on the lower leg, a gloved hand nearby. Clinical setting.' + PAT },
  { file: 'c6-s4',
    prompt: 'Ultra-realistic clinical training photograph of a real 11-month-old Taiwanese baby boy on a stretcher after return of circulation but still critically ill. APPEARANCE: limp and drowsy, eyes barely open. WORK OF BREATHING: slow shallow breathing. CIRCULATION: pale skin with a faint bluish tinge, wrapped in a silver warming blanket, a small oxygen mask over the face.' + PAT,
    fallback: 'Ultra-realistic photograph of a real 11-month-old Taiwanese baby boy resting on a stretcher wrapped in a silver warming blanket, drowsy with eyes barely open, pale skin, a small oxygen mask over the face, calm post-resuscitation clinical scene.' + PAT },
];

async function generate(prompt) {
  const resp = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt,
      n: 1,
      size: '1024x1024',
      quality: 'high',
      output_format: 'jpeg',
      output_compression: 88,
    }),
  });
  const text = await resp.text();
  if (!resp.ok) {
    const err = new Error(`HTTP ${resp.status}: ${text.slice(0, 200)}`);
    err.moderationBlocked = /moderation_blocked|safety system/i.test(text);
    throw err;
  }
  const json = JSON.parse(text);
  if (!json.data?.[0]?.b64_json) throw new Error(`No image: ${text.slice(0, 200)}`);
  return Buffer.from(json.data[0].b64_json, 'base64');
}

const only = process.argv[2];
const targets = only ? ITEMS.filter(i => i.file === only) : ITEMS;

(async () => {
  let ok = 0, fail = 0;
  for (const { file, prompt, fallback } of targets) {
    const outPath = path.join(OUT_DIR, `${file}-real.jpg`);
    process.stdout.write(`→ ${file}-real  ...  `);
    const t0 = Date.now();
    try {
      let buf;
      try { buf = await generate(prompt); }
      catch (e) {
        if (e.moderationBlocked && fallback) {
          process.stdout.write('(blocked → softer realistic) ');
          await new Promise(r => setTimeout(r, 800));
          buf = await generate(fallback);
        } else throw e;
      }
      fs.writeFileSync(outPath, buf);
      console.log(`✓ ${(buf.length/1024).toFixed(0)} KB  (${((Date.now()-t0)/1000).toFixed(1)}s)`);
      ok++;
    } catch (e) {
      console.log(`✗ ${e.message.slice(0, 160)}`);
      fail++;
    }
    await new Promise(r => setTimeout(r, 800));
  }
  console.log(`\nDone. ✓ ${ok}  ✗ ${fail}`);
})();
