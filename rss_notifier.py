#!/usr/bin/env python3
"""
DLA RSS notifier for exam-related announcements.

- Polls RSS feed
- Filters by configurable Thai keywords
- Sends alerts to Telegram and/or LINE
- Stores sent item IDs in local JSON state to avoid duplicates
"""

from __future__ import annotations

import hashlib
import json
import os
import re
import sys
import time
import ctypes
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Iterable
import xml.etree.ElementTree as ET

from urllib import error, request

DEFAULT_RSS_URL = "https://www.dla.go.th/DlaRssOfficeDoc"
DEFAULT_INTERVAL_SECONDS = 60
DEFAULT_STATE_FILE = ".dla_rss_state.json"

DEFAULT_KEYWORDS = [
    "ประกาศรายชื่อสอบ",
    "ประกาศรายชื่อเรียกรายงานตัว",
    "ผลสอบ",
    "รายชื่อผู้มีสิทธิ",
    "ผู้สอบผ่าน",
    "เรียกรายงานตัว",
    "บัญชีผู้สอบแข่งขัน",
    "ขึ้นบัญชี",
]


@dataclass
class FeedItem:
    item_id: str
    title: str
    dpm_label: str
    gbook_no: str
    date_created: str
    book_date: str
    docs: list[str]
    raw_text: str


def load_env_file(path: str = ".env") -> None:
    env_path = Path(path)
    if not env_path.exists():
        return
    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def enable_windows_ansi_colors() -> None:
    if os.name != "nt":
        return
    try:
        kernel32 = ctypes.windll.kernel32
        handle = kernel32.GetStdHandle(-11)  # STD_OUTPUT_HANDLE
        mode = ctypes.c_uint32()
        if kernel32.GetConsoleMode(handle, ctypes.byref(mode)):
            kernel32.SetConsoleMode(handle, mode.value | 0x0004)
    except Exception:
        return


def blue(text: str) -> str:
    return f"\033[96m{text}\033[0m"


def http_get_text(url: str, timeout: int = 20) -> str:
    req = request.Request(url, method="GET")
    try:
        with request.urlopen(req, timeout=timeout) as resp:
            return resp.read().decode("utf-8", errors="replace")
    except error.HTTPError as exc:
        raise RuntimeError(f"HTTP GET failed: {exc.code} {url}") from exc


def http_post_json(url: str, payload: dict, headers: dict[str, str] | None = None, timeout: int = 20) -> None:
    raw = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    merged_headers = {"Content-Type": "application/json"}
    if headers:
        merged_headers.update(headers)
    req = request.Request(url, data=raw, headers=merged_headers, method="POST")
    try:
        with request.urlopen(req, timeout=timeout):
            return
    except error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"HTTP POST failed: {exc.code} {url} body={body}") from exc


def text_of(parent: ET.Element, tag: str) -> str:
    node = parent.find(tag)
    return (node.text or "").strip() if node is not None else ""


def parse_items(xml_text: str) -> list[FeedItem]:
    root = ET.fromstring(xml_text)
    items: list[FeedItem] = []
    for item in root.findall(".//item"):
        title = text_of(item, "title")
        dpm_label = text_of(item, "dpmLabel")
        gbook_no = text_of(item, "gbookNo")
        date_created = text_of(item, "dateCreated")
        book_date = text_of(item, "bookDate")
        docs = [
            (node.text or "").strip()
            for node in item.findall("gbookDoc")
            if (node.text or "").strip()
        ]

        joined_for_id = "|".join([title, gbook_no, date_created, *docs])
        item_id = hashlib.sha256(joined_for_id.encode("utf-8")).hexdigest()
        raw_text = " ".join([title, dpm_label, gbook_no, date_created, book_date, " ".join(docs)])

        items.append(
            FeedItem(
                item_id=item_id,
                title=title,
                dpm_label=dpm_label,
                gbook_no=gbook_no,
                date_created=date_created,
                book_date=book_date,
                docs=docs,
                raw_text=raw_text,
            )
        )
    return items


def compile_keyword_pattern(keywords: Iterable[str]) -> re.Pattern[str]:
    escaped = [re.escape(k.strip()) for k in keywords if k.strip()]
    if not escaped:
        escaped = [re.escape(k) for k in DEFAULT_KEYWORDS]
    return re.compile("|".join(escaped), flags=re.IGNORECASE)


def filter_items(items: list[FeedItem], pattern: re.Pattern[str]) -> list[FeedItem]:
    return [item for item in items if pattern.search(item.raw_text)]


def load_state(path: str) -> set[str]:
    p = Path(path)
    if not p.exists():
        return set()
    try:
        data = json.loads(p.read_text(encoding="utf-8"))
        return set(data.get("sent_item_ids", []))
    except Exception:
        return set()


def save_state(path: str, sent_ids: set[str]) -> None:
    Path(path).write_text(
        json.dumps(
            {
                "sent_item_ids": sorted(sent_ids),
                "updated_at": datetime.utcnow().isoformat() + "Z",
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )


def build_message(item: FeedItem) -> str:
    docs_block = "\n".join(f"- {url}" for url in item.docs[:5]) or "- (ไม่มีไฟล์แนบ)"
    extra = ""
    if len(item.docs) > 5:
        extra = f"\n- ... อีก {len(item.docs) - 5} ไฟล์"

    return (
        "📢 พบประกาศที่อาจเกี่ยวกับผลสอบ/รายงานตัว\n"
        f"หน่วยงาน: {item.dpm_label or '-'}\n"
        f"เลขหนังสือ: {item.gbook_no or '-'}\n"
        f"หัวข้อ: {item.title or '-'}\n"
        f"วันที่ประกาศ: {item.date_created or '-'}\n"
        f"ลิงก์หน้าเอกสาร: {item.book_date or '-'}\n"
        f"ไฟล์แนบ:\n{docs_block}{extra}"
    )


def send_telegram(bot_token: str, chat_id: str, message: str) -> None:
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    http_post_json(url, {"chat_id": chat_id, "text": message}, timeout=20)


def send_line(line_token: str, message: str) -> None:
    # LINE Notify is deprecated; this endpoint is for LINE Messaging API push.
    # Requires CHANNEL_ACCESS_TOKEN and TO (userId/groupId/roomId).
    # To keep config simple, we use LINE_TO in env.
    line_to = os.getenv("LINE_TO", "").strip()
    if not line_to:
        raise RuntimeError("LINE_TO is required for LINE push")

    url = "https://api.line.me/v2/bot/message/push"
    headers = {
        "Authorization": f"Bearer {line_token}",
        "Content-Type": "application/json",
    }
    payload = {
        "to": line_to,
        "messages": [{"type": "text", "text": message[:4900]}],
    }
    http_post_json(url, payload, headers=headers, timeout=20)


def notify(message: str) -> None:
    sent_any = False

    tg_token = os.getenv("TELEGRAM_BOT_TOKEN", "").strip()
    tg_chat_id = os.getenv("TELEGRAM_CHAT_ID", "").strip()
    if tg_token and tg_chat_id:
        send_telegram(tg_token, tg_chat_id, message)
        sent_any = True

    line_token = os.getenv("LINE_CHANNEL_ACCESS_TOKEN", "").strip()
    if line_token:
        send_line(line_token, message)
        sent_any = True

    if not sent_any:
        raise RuntimeError(
            "No notification channel configured. Set TELEGRAM_BOT_TOKEN+TELEGRAM_CHAT_ID "
            "or LINE_CHANNEL_ACCESS_TOKEN (+LINE_TO)."
        )


def get_keywords() -> list[str]:
    raw = os.getenv("KEYWORDS", "")
    if not raw.strip():
        return DEFAULT_KEYWORDS
    return [k.strip() for k in raw.split(",") if k.strip()]


def run_once() -> int:
    rss_url = os.getenv("RSS_URL", DEFAULT_RSS_URL)
    state_file = os.getenv("STATE_FILE", DEFAULT_STATE_FILE)

    pattern = compile_keyword_pattern(get_keywords())
    xml_text = http_get_text(rss_url)
    items = parse_items(xml_text)
    matched = filter_items(items, pattern)

    sent_ids = load_state(state_file)
    new_matches = [item for item in matched if item.item_id not in sent_ids]

    for item in new_matches:
        msg = build_message(item)
        print(blue("\n" + "=" * 70))
        print(blue("🔔 พบประกาศใหม่ที่ตรงคีย์เวิร์ด"))
        print(blue(msg))
        print(blue("=" * 70 + "\n"))
        notify(msg)
        sent_ids.add(item.item_id)

    save_state(state_file, sent_ids)
    print(
        f"[{datetime.now().isoformat(timespec='seconds')}] "
        f"total={len(items)} matched={len(matched)} new={len(new_matches)}"
    )
    return len(new_matches)


def main() -> int:
    load_env_file()
    enable_windows_ansi_colors()
    interval = int(os.getenv("POLL_INTERVAL_SECONDS", str(DEFAULT_INTERVAL_SECONDS)))
    run_forever = os.getenv("RUN_FOREVER", "true").lower() in {"1", "true", "yes"}

    print(
        f"Starting DLA RSS watcher | interval={interval}s | "
        f"run_forever={run_forever} | rss={os.getenv('RSS_URL', DEFAULT_RSS_URL)}"
    )

    if not run_forever:
        run_once()
        return 0

    while True:
        try:
            run_once()
        except Exception as exc:  # noqa: BLE001
            print(f"ERROR: {exc}", file=sys.stderr)
        time.sleep(interval)


if __name__ == "__main__":
    raise SystemExit(main())
