# Design Spec — Luckwell Export Consult Site

涵蓋 `index.html`（顧問式銷售頁）與 `catalog.html`（型錄購物車頁）。兩頁共用同一套品牌色，但版型定位不同：`index.html` 是行銷落地頁，`catalog.html` 是功能性應用頁。新增頁面前先讀這份規範，改完任一數值要同步回這裡。

## 品牌色（兩頁共用）

```css
--navy:        #1A1A2E   /* 主色：nav、標題、深色背景區塊 */
--navy-mid:    #16213E   /* catalog.html hero 背景，比 navy 略亮 */
--orange:      #FF6B00   /* 強調色：CTA、品牌字、分類標籤 */
--orange-dark: #CC5500   /* index.html 的 hover 狀態 */
--orange-hover:#e05d00   /* catalog.html 的 hover 狀態（數值略不同，未來要統一時挑一個） */
--white:       #FFFFFF
--gray-light:  #F5F5F5   /* 淺底、卡片背景 */
--gray-mid:    #E0E0E0 / var(--border)  /* 邊框、分隔線 */
--gray-text / --text-muted: #555555   /* 次要文字 */
--text (index.html 專用): #1A1A1A
```

不要引入新的品牌色。深色一律用 `--navy`，強調色一律用 `--orange`，需要更深的 hover 狀態時用 `--orange-dark`（`#CC5500`），統一採用這個而不是 catalog.html 舊有的 `#e05d00`。

## 字體

- `catalog.html`：系統字體 `'Segoe UI', Arial, sans-serif`（功能性頁面，追求跨平台一致渲染，不特別講究品牌字感）。
- `index.html`：Google Fonts `DM Sans`（英文，wght 400/500/600/700/800）+ `Noto Sans TC`（中文備援）。行銷頁的標題感、粗細對比都靠 DM Sans 的 800 字重撐出來。
- 新增行銷/介紹型頁面時跟 `index.html` 走 DM Sans + Noto Sans TC；新增功能性頁面（表單、清單、工具）時可以跟 `catalog.html` 走系統字體，不用額外載入字型。

## 間距與圓角

- Section 內距：行銷頁 `padding: 96px 40px`（大留白，桌面優先），手機自動靠 `max-width: 1080px` 置中收窄。
- 卡片圓角：`8px`–`16px` 視元件大小（按鈕/小卡 8px，大卡片/pricing box 12–16px）。
- 按鈕圓角：主要 CTA 用 `8px`（`.btn-primary`），catalog 頁的 pill 型按鈕（filter/cart）用 `20px`–`50px` 全圓角。
- Grid 間距：型錄卡片 grid `gap: 20px`（手機 `12px`），行銷頁大 grid（about/audience）`gap: 32px`–`80px`。

## 按鈕樣式

- **主要 CTA**（WhatsApp 聯絡、Browse Catalog）：`background: var(--orange)`，白字，粗體 700，`padding: 16px 36px`（行銷頁）或依情境縮小，`hover` 轉 `--orange-dark`/`--orange-hover`，並帶 `transform: translateY(-1px)`（僅行銷頁有位移效果）。
- **次要按鈕**（Browse Catalog 在深色底上）：`background: var(--navy)` 或半透明白 `rgba(255,255,255,0.15)` + 白色邊框，用在深色背景區塊上避免跟主 CTA 搶視覺。
- **Pill / Filter 按鈕**（catalog.html 專用）：白底、`border: 2px solid var(--gray-mid)`，active 狀態轉 `background: var(--navy)` 白字。
- **WhatsApp 按鈕**：固定用 WhatsApp 品牌綠 `#25D366`（hover `#1ebe5b`），不要換成品牌橘，這是唯一例外，因為要讓使用者一眼認出這是 WhatsApp 連結。

## 版面模式

- **行銷頁（index.html）**：深色/淺色區塊交錯（白 hero → navy pain points → 白 about → gray-light services → 白 audience → gray-light pricing → 白 FAQ → navy final CTA → navy footer），每個 section 用 `.section-label`（12px、大寫、letter-spacing 3px、橘色）當作小標籤起手。
- **功能頁（catalog.html）**：sticky nav + hero bar + filter bar + 雙欄（grid + sticky 側欄購物車），手機斷點 860px 把側欄收成底部浮動按鈕+抽屜（drawer）。

## 響應式斷點

- `860px`：行銷頁隱藏 nav-links；catalog 頁側欄收起、購物車轉成浮動按鈕+drawer。
- `720px`：`about-grid`、`audience-grid` 從雙欄轉單欄。
- `520px`：catalog 卡片 grid 從 auto-fill 轉固定雙欄，hero 標題字級縮小。

## Why 這樣分兩套規範而不強制統一

`index.html` 是給 AI 引擎/人類瀏覽的行銷頁，`catalog.html` 是給客戶實際操作下單的工具頁，用途不同所以排版邏輯不同，但**品牌色、按鈕語意（橘=行動、深藍=品牌/次要、綠=WhatsApp）必須保持一致**，這樣使用者在兩頁之間跳轉不會有品牌斷裂感。之後新增頁面（例如型號詳情頁）要先判斷屬於哪一類，套對應的字體/間距慣例。
