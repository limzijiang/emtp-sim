# EMT-P 案例模擬器

兩個自包含的 HTML 檔案，透過公開 MQTT broker (HiveMQ) 跨網域連動。

## 檔案

- `display.html` — 投影到大銀幕的畫面（Zoll X 風格生命徵象 + 右側資訊面板）
- `control.html` — 手機/平板上的講師控制台

## 使用方式

### 1. 部署（任選一種）

**最快：直接開檔**
- 雙擊 `display.html` 在電腦瀏覽器開啟，連投影機/外接螢幕
- `control.html` 上傳到手機可存取的地方（或用 AirDrop 給手機）

**推薦：GitHub Pages / Vercel / Netlify / Cloudflare Pages**
- 把整個資料夾丟上去
- `display.html` 與 `control.html` 甚至可以放在**不同網域**（這就是 MQTT 中繼的優點）

### 2. 配對

兩端用同一個 `?s=` Session ID 連到 broker：

```
display:  https://your-domain.com/display.html?s=mycase01
control:  https://your-domain.com/control.html?s=mycase01
```

控制端會在 localStorage 記住 Session ID，第一次開若沒指定會自動隨機產生並寫回 URL。點手機右上角的 Session ID 可以看到對應的 display URL（可複製、貼到大銀幕電腦）。

### 3. 操作

- **Vitals 分頁**：滑桿調整 HR / BP / SpO₂ / RR / EtCO₂ / Temp。上方「變化速度」可選擇立即、3 秒、10 秒、30 秒平滑變化（拖滑桿後會線性過渡到目標值）
- **心律分頁**：節律、異位節律、ST 段抬高/壓低部位（前壁、下壁、側壁…）、無脈搏、CPR 開關
- **大銀幕分頁**：切換右側顯示內容
  - 空白 / 病人資料 / 12 導程 ECG / 實驗室報告 / 影像 (URL) / 提示文字 / 給藥紀錄 / 自訂 HTML / 外部網頁 iframe
- **處置分頁**：除顫（會在大銀幕閃白 + 顯示焦耳數）、CPR 開關、給藥（含預設按鈕）、ROSC / VF / 檢查脈搏 三色閃示
- **情境分頁**：一鍵載入 STEMI、VF arrest、SVT、CHB、氣喘、敗血、創傷、鴉片過量、低血糖、DKA 等預設案例

## 跨網域如何運作

兩端都連 `wss://broker.hivemq.com:8884/mqtt`（HiveMQ 免費公開 broker，無需註冊）。

- 控制端 publish 到 `emtp-sim/{session}/state`（retain）
- 顯示端 subscribe 同 topic，收到就更新畫面
- 除顫 / 閃示等一次性事件用 `emtp-sim/{session}/action`

要換 broker，加 URL 參數 `?broker=wss://...`（例如 `wss://test.mosquitto.org:8081`）。

⚠️ **隱私提醒**：HiveMQ 公開 broker 上的訊息任何人都能訂閱。Session ID 是唯一保護。**不要在裡面填入真實病人資料**——這是教學模擬器，請用假資料。

## 心律模擬

12 導程根據 STEMI 部位自動產生對應導程的 ST 抬高/壓低與鏡像變化：

| 部位 | 抬高導程 | 鏡像壓低 |
|---|---|---|
| 前壁 | V1-V4 | II/III/aVF |
| 下壁 | II/III/aVF | I/aVL |
| 側壁 | I/aVL/V5/V6 | — |
| 中膈 | V1/V2 | — |
| 前側壁 | V1-V6/I/aVL | — |
| 後壁 | (V1-V3 壓低) | II/III/aVF 略抬 |
| 右室 | III/aVF/V1 | — |

可調整節律：NSR、Sinus Tach/Brady、AFib（不規則 + 心房纖顫基線）、AFlutter（鋸齒 flutter waves）、SVT、VT、Poly-VT、VF（混沌波形）、Asystole、PEA、1°/2°-I (Wenckebach) / 2°-II (Mobitz)/3° AVB、Paced（含 pacer spike）。

異位：PVC、二聯律、PAC。

## 客製化

直接編輯 HTML 即可。重要參數：
- `display.html` 中的 `LEAD_FACTORS`、`STEMI_REGIONS` — 12 導程外觀
- `control.html` 中的 `scenarios` 物件 — 情境預設
- `presets` 物件（`setLabsPreset`）— 實驗室報告預設
