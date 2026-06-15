#!/usr/bin/env python3
"""
Send the latest weekly social media pack by email.

Required environment variables:
    GMAIL_USER
    GMAIL_APP_PASSWORD
    EMAIL_TO

Optional:
    WEEKLY_PACK_DIR
"""

from __future__ import annotations

import os
import smtplib
import sys
from email.message import EmailMessage
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
WEEKLY_PACK_DIR = Path(os.getenv("WEEKLY_PACK_DIR", BASE_DIR / "weekly-pack"))


def find_latest_pack() -> Path:
    pack_dirs = [path for path in WEEKLY_PACK_DIR.iterdir() if path.is_dir()]
    if not pack_dirs:
        raise FileNotFoundError(f"No weekly pack folders found in {WEEKLY_PACK_DIR}")
    return sorted(pack_dirs)[-1]


def build_message(pack_dir: Path) -> EmailMessage:
    sender = os.getenv("GMAIL_USER")
    password = os.getenv("GMAIL_APP_PASSWORD")
    recipient = os.getenv("EMAIL_TO")

    if not sender or not password or not recipient:
        missing = [name for name, value in {
            "GMAIL_USER": sender,
            "GMAIL_APP_PASSWORD": password,
            "EMAIL_TO": recipient,
        }.items() if not value]
        raise RuntimeError(f"Missing required environment variables: {', '.join(missing)}")

    json_path = pack_dir / "posts.json"
    csv_path = pack_dir / "posts.csv"

    message = EmailMessage()
    message["From"] = sender
    message["To"] = recipient
    message["Subject"] = f"ConvertNow.ca weekly social pack - {pack_dir.name}"
    message.set_content(
        f"""Your weekly ConvertNow.ca social media pack is ready.

Folder: {pack_dir}
Included files:
- {json_path.name}
- {csv_path.name}
- images/

Use the CSV for manual posting or import the JSON into your workflow.
"""
    )

    for attachment_path, mime_type in (
        (json_path, "application/json"),
        (csv_path, "text/csv"),
    ):
        if attachment_path.exists():
            message.add_attachment(
                attachment_path.read_bytes(),
                maintype=mime_type.split("/")[0],
                subtype=mime_type.split("/")[1],
                filename=attachment_path.name,
            )

    return message


def send_email() -> None:
    pack_dir = find_latest_pack()
    message = build_message(pack_dir)

    sender = os.environ["GMAIL_USER"]
    password = os.environ["GMAIL_APP_PASSWORD"]

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(sender, password)
        smtp.send_message(message)

    print(f"Email sent successfully to {os.environ['EMAIL_TO']} from {sender}")
    print(f"Attached pack: {pack_dir}")


if __name__ == "__main__":
    try:
        send_email()
    except Exception as exc:
        print(f"ERROR: {exc}")
        sys.exit(1)