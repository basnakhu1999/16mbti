# 16MBTI Pro

A modern, English-first MBTI-style personality test website with detailed analysis for all 16 personality types.

## What this version includes
- 16-question Likert-scale test (1–5) across E/I, S/N, T/F, and J/P dimensions
- In-depth result sections: summary, strengths, blind spots, career fit, and relationship style
- Full directory of all 16 personality profiles
- SEO-ready metadata (description, Open Graph, Twitter Card, canonical, and JSON-LD Website schema)
- Responsive single-page experience built with vanilla HTML, CSS, and JavaScript

## Run locally
Open `index.html` in your browser.

## RSS notifier for DLA exam announcements
Added a simple Python automation script: `rss_notifier.py`

### What it does
- Reads RSS from `https://www.dla.go.th/DlaRssOfficeDoc`
- Filters news/items by Thai keywords related to exam results and reporting announcements
- Sends alerts to Telegram and/or LINE
- Shows alert in CMD/terminal with blue highlight when matched
- Avoids duplicate alerts by storing sent IDs in `.dla_rss_state.json`

### Quick start
1. Install dependency:
   ```bash
   pip install -r requirements.txt
   ```
2. Copy env file and set tokens:
   ```bash
   cp .env.example .env
   ```
3. Run once (test):
   ```bash
   RUN_FOREVER=false python3 rss_notifier.py
   ```
4. Run as a background watcher:
   ```bash
   python3 rss_notifier.py
   ```
   > Default checks every 60 seconds continuously.

### Suggested keywords
Default keywords include:
- ประกาศรายชื่อสอบ
- ประกาศรายชื่อเรียกรายงานตัว
- ผลสอบ
- รายชื่อผู้มีสิทธิ
- ผู้สอบผ่าน
- เรียกรายงานตัว
- บัญชีผู้สอบแข่งขัน
- ขึ้นบัญชี

You can override with `KEYWORDS` in `.env`.
