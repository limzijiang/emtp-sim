# 病人圖片生成 Prompts

每個 vital sign 套組對應一張病人狀態圖片。共 **17 張**，依以下命名存到 `images/` 資料夾，commit 後系統會自動載入。

## 使用方式

1. 打開 ChatGPT (需 Plus 帳號才能用 GPT Image 2.0) 或 Sora / Midjourney / DALL-E
2. 把下方每個 prompt 貼入，生成方形 / 直式照片
3. 下載後依命名規則放入 `images/`：
   - `c1-s1.jpg` → 案例 1 階段 1
   - `c2-s3.jpg` → 案例 2 階段 3
   - ⋯
4. `git add images/ && git commit && git push` 推到 GitHub
5. 大銀幕點 vital sign 套組按鈕時會自動顯示對應圖片

## 共通要求 (每個 prompt 都加)

> Ultra-realistic photograph, Taiwanese ethnicity, authentic East-Asian facial features, photorealistic skin texture, natural lighting, medical EMS / pre-hospital context, no text, no watermarks, no caption, no logos.

---

## 案例 1：3 歲男童癲癇重積 (15 kg)

### `c1-s1.jpg` — ① 到場：抽搐中
> Hyper-realistic photograph of a 3-year-old Taiwanese boy mid generalized tonic-clonic seizure on an ambulance stretcher, body slightly stiffened and trembling, eyes rolled upward showing whites, mouth slightly open with white foamy saliva at the corners, mild perioral cyanosis, ambulance interior lighting. Taiwanese ethnicity, authentic East-Asian features, photorealistic, no text, no watermarks.

### `c1-s2.jpg` — ② 持續抽搐 · SpO₂ 下降
> Hyper-realistic photograph of a 3-year-old Taiwanese boy still seizing on an ambulance stretcher, lips and fingertips clearly cyanotic (blue-purple), visible intercostal retractions on a thin chest, foamy saliva, eyes half-closed and rolled back, urgent atmosphere, ambulance interior. Taiwanese ethnicity, photorealistic, no text.

### `c1-s3.jpg` — ③ Midazolam IM 後抽搐停止
> Hyper-realistic photograph of a 3-year-old Taiwanese boy lying still on an ambulance stretcher in a postictal state, eyes closed, peaceful but unconscious, pink color returning to cheeks, pediatric non-rebreather oxygen mask covering nose and mouth, ambulance interior soft light. Taiwanese ethnicity, photorealistic, no text.

### `c1-s4.jpg` — ④ BZD 副作用 + 低血糖 (惡化)
> Hyper-realistic photograph of a 3-year-old Taiwanese boy on an ambulance stretcher with worrying signs: very pale skin, slight diaphoresis (cold sweat), eyes closed and limp, pediatric BVM bag-valve-mask held over face by a paramedic's gloved hand (only hand visible), IV catheter in the dorsum of hand, urgent atmosphere. Taiwanese ethnicity, photorealistic, no text.

### `c1-s5.jpg` — ⑤ D10W 後恢復
> Hyper-realistic photograph of a 3-year-old Taiwanese boy on an ambulance stretcher slowly waking up, eyes just barely opening, color much better and healthy pink, a parent's hand visible holding the child's small hand, non-rebreather oxygen mask still on, IV line running on arm, soft hopeful atmosphere. Taiwanese ethnicity, photorealistic, no text.

---

## 案例 2：10 個月嬰兒兒虐 IICP → OHCA (10 kg)

### `c2-s1.jpg` — ① 緩脈 + IICP 徵象
> Hyper-realistic photograph of a 10-month-old Taiwanese infant boy lying limp on a small stretcher, anterior fontanelle (top of head) clearly bulging, pale and slightly cyanotic skin, slow shallow chest movement, eyes half-closed with one pupil noticeably larger than the other (anisocoria), no facial expression, EMS scene lighting. Taiwanese ethnicity, infant features, photorealistic, no text.

### `c2-s2.jpg` — ② BVM 正壓通氣
> Hyper-realistic photograph of a 10-month-old Taiwanese infant boy on a stretcher receiving bag-valve-mask ventilation, an infant-size mask covering nose and mouth held by a paramedic's hand (only hand visible), eyes closed, body still, slightly improved skin color, ambulance interior. Taiwanese ethnicity, infant features, photorealistic, no text.

### `c2-s3.jpg` — ③ CPR + Epi IO
> Hyper-realistic photograph of an emergency pediatric resuscitation: a 10-month-old Taiwanese infant boy on a stretcher receiving CPR with two-thumb chest compression technique (paramedic's hands visible encircling the chest), simultaneous BVM ventilation with infant mask, an intraosseous needle visible in the proximal tibia of the right leg, urgent EMS scene, dramatic lighting. Taiwanese ethnicity, infant features, photorealistic, no text.

### `c2-s4.jpg` — ④ ROSC 後送
> Hyper-realistic photograph of a 10-month-old Taiwanese infant boy on a stretcher post-resuscitation (post-ROSC), ECG monitor leads visible on small chest, pediatric oxygen mask on face, color improving (pink returning) but still unresponsive, prepared for hospital transport in ambulance. Taiwanese ethnicity, infant features, photorealistic, no text.

---

## 案例 3：10 歲蜂螫過敏性休克 + 喉頭水腫 (30 kg)

### `c3-s1.jpg` — ① 嚴重過敏性休克 (到場)
> Hyper-realistic photograph of a 10-year-old Taiwanese boy in severe anaphylactic shock, sitting on the ground in a mountainous outdoor area: clearly visible raised pink urticaria/hives covering chest and upper arms, swollen puffy periorbital edema around both eyes, very pale skin, sweaty, mouth open struggling to inhale (stridorous breathing), looking distressed and frightened, EMS team kneeling beside him. Taiwanese ethnicity, photorealistic, no text.

### `c3-s2.jpg` — ② Epinephrine IM + NRM
> Hyper-realistic photograph of a 10-year-old Taiwanese boy on a stretcher with a pediatric non-rebreather oxygen mask on, a paramedic's gloved hand injecting an IM epinephrine syringe into the lateral thigh (vastus lateralis), urticaria fading slightly, periorbital swelling still visible, eyes open and alert, outdoor mountain EMS scene. Taiwanese ethnicity, photorealistic, no text.

### `c3-s3.jpg` — ③ IVF + Epi 霧化
> Hyper-realistic photograph of a 10-year-old Taiwanese boy on a stretcher inside an ambulance, IV running into right arm with a saline bag visible, nebulizer mask delivering mist over nose and mouth, skin color much improved (pink), eyes open and alert, hives barely visible, calmer expression. Taiwanese ethnicity, photorealistic, no text.

### `c3-s4.jpg` — ④ 後送中 (biphasic 警示)
> Hyper-realistic photograph of a 10-year-old Taiwanese boy on a stretcher inside a moving ambulance, oxygen mask on, alert and calm, parent visible at his side holding his hand, ECG monitor leads visible, faint residual hives on neck, monitoring atmosphere. Taiwanese ethnicity, photorealistic, no text.

---

## 案例 4：6 歲急性氣喘發作 (20 kg)

### `c4-s1.jpg` — ① 急性氣喘嚴重發作 (到場)
> Hyper-realistic photograph of a 6-year-old Taiwanese boy in tripod position (sitting upright leaning forward with hands on knees) in severe respiratory distress, clearly visible suprasternal and intercostal retractions, nasal flaring, anxious wide-eyed expression, mouth open trying to breathe, using accessory neck muscles, wearing a school PE uniform, outdoor schoolyard in cold winter weather (12°C, breath visible). Taiwanese ethnicity, photorealistic, no text.

### `c4-s2.jpg` — ② NRM 給氧 + 坐姿
> Hyper-realistic photograph of a 6-year-old Taiwanese boy sitting upright on a stretcher in tripod position with a pediatric non-rebreather oxygen mask covering nose and mouth, still working hard to breathe but slightly less anxious, slight improvement in lip color, EMT visible adjusting mask. Taiwanese ethnicity, photorealistic, no text.

### `c4-s3.jpg` — ③ SABA + 霧化吸入後改善
> Hyper-realistic photograph of a 6-year-old Taiwanese boy on a stretcher with a nebulizer mask delivering bronchodilator mist over face, breathing much easier and more relaxed posture, healthier pink color, slight tremor in small hands (β-agonist side effect), able to make eye contact, ambulance interior. Taiwanese ethnicity, photorealistic, no text.

### `c4-s4.jpg` — ④ silent chest / 嗜睡 (惡化分支)
> Hyper-realistic photograph of a 6-year-old Taiwanese boy on a stretcher in pre-arrest exhaustion: extremely drowsy, eyes half-closed and unfocused, head tilted back, BVM bag-valve-mask held over face by a paramedic's gloved hand (only hand visible), very pale exhausted appearance, no longer using accessory muscles (now too tired), arms limp at sides, urgent EMS atmosphere. Taiwanese ethnicity, photorealistic, no text.

---

## 加分技巧

- 若 ChatGPT 生成失敗或人臉怪異，加上 `professional medical photography reference, ethical depiction, no exploitation` 緩解 safety filter
- 想要更一致的人臉，可以同一張臉做完所有階段：把第一張的生成結果連同 prompt 一起貼，要求「同一人物在不同臨床階段」
- 圖片解析度建議 1024×1024 或 1024×1536 (直式)，下載為 JPG
- 不需要太多細節，重點是辨識度高的臨床外觀變化 (蒼白 / 發紺 / 出汗 / 浮腫 / 表情等)

## 不想生圖的話

代碼會自動處理：圖片不存在時右側面板顯示「(此階段尚未生成病人圖片)」+ 該檔案路徑，不影響其他功能。可以一張一張慢慢補。
