#!/usr/bin/env python3
"""
Generate a manual posting pack for ConvertNow.ca from the real AI output.

This creates:
- JSON data for each post
- CSV for easy spreadsheet import
- a dated folder structure for weekly assets
"""

from __future__ import annotations

import csv
import json
import shutil
from dataclasses import dataclass, asdict
from datetime import datetime, timedelta
from pathlib import Path
from typing import List


BASE_DIR = Path(__file__).resolve().parent.parent
WEEKLY_PACK_DIR = BASE_DIR / "weekly-pack"
OUTPUT_DIR = BASE_DIR / "output"


@dataclass
class ManualPost:
    date: str
    platform: str
    hook: str
    caption: str
    hashtags: str
    content_format: str
    image_prompt: str
    image_file: str
    cta_url: str
    status: str = "Ready to Post"
    notes: str = ""


def build_sample_posts(week_start: datetime) -> List[ManualPost]:
    posts: List[ManualPost] = []
    themes = [
        ("conversion_fact", "Did you know?"),
        ("product_spotlight", "Shop smarter today"),
        ("tip_hack", "Quick conversion tip"),
        ("engagement", "What do you prefer?"),
        ("seasonal", "This week’s conversion idea"),
    ]

    for index in range(15):
        day = week_start + timedelta(days=index % 7)
        theme_name, hook_prefix = themes[index % len(themes)]
        post_number = index + 1
        image_name = f"CNW{post_number:03d}.png"
        platform = "Both" if index % 2 == 0 else ("Facebook" if index % 3 == 0 else "Instagram")
        cta_url = "https://www.convertnow.ca/shop" if theme_name == "product_spotlight" else "https://www.convertnow.ca"

        posts.append(
            ManualPost(
                date=day.strftime("%Y-%m-%d"),
                platform=platform,
                hook=f"{hook_prefix} — ConvertNow.ca",
                caption=(
                    f"Post idea {post_number} for {theme_name}. "
                    f"Drive traffic to ConvertNow.ca with a clear CTA. "
                    f"Use this caption as the final copy."
                ),
                hashtags="#ConvertNow #UnitConverter #Measurements #FacebookMarketing #InstagramMarketing",
                content_format="Static Image",
                image_prompt=(
                    f"Create a clean social media image for post {post_number}. "
                    f"Theme: {theme_name}. Blue and white ConvertNow branding."
                ),
                image_file=image_name,
                cta_url=cta_url,
            )
        )

    return posts


def build_from_latest_output() -> List[ManualPost]:
    output_files = sorted(OUTPUT_DIR.glob("week_*.json"))
    if not output_files:
        raise FileNotFoundError(
            "No generated content found. Run generate_week.py first."
        )

    latest_file = output_files[-1]
    with latest_file.open("r", encoding="utf-8") as handle:
        data = json.load(handle)

    source_posts = data.get("posts", [])
    posts: List[ManualPost] = []

    for item in source_posts:
        posts.append(
            ManualPost(
                date=item.get("date", ""),
                platform=item.get("platform", "Both").title(),
                hook=item.get("hook", ""),
                caption=item.get("caption", ""),
                hashtags="",
                content_format=item.get("content_format", "Static Image").replace("_", " ").title(),
                image_prompt=item.get("image_prompt", ""),
                image_file=Path(item.get("image_path", "")).name if item.get("image_path") else "",
                cta_url=item.get("cta_url", "https://www.convertnow.ca"),
                status="Ready to Post",
                notes=f"Imported from {latest_file.name}",
            )
        )

    return posts


def write_csv(posts: List[ManualPost], output_file: Path) -> None:
    output_file.parent.mkdir(parents=True, exist_ok=True)
    with output_file.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=[
                "Date",
                "Platform",
                "Hook",
                "Caption",
                "Hashtags",
                "Content Format",
                "Image Prompt",
                "Image File",
                "CTA URL",
                "Status",
                "Notes",
            ],
        )
        writer.writeheader()
        for post in posts:
            writer.writerow(
                {
                    "Date": post.date,
                    "Platform": post.platform,
                    "Hook": post.hook,
                    "Caption": post.caption,
                    "Hashtags": post.hashtags,
                    "Content Format": post.content_format,
                    "Image Prompt": post.image_prompt,
                    "Image File": post.image_file,
                    "CTA URL": post.cta_url,
                    "Status": post.status,
                    "Notes": post.notes,
                }
            )


def main() -> None:
    week_start = datetime.now()
    days_until_monday = (7 - week_start.weekday()) % 7
    if days_until_monday == 0:
        days_until_monday = 7
    week_start = week_start + timedelta(days=days_until_monday)

    week_folder = WEEKLY_PACK_DIR / week_start.strftime("%Y-%m-%d")
    images_dir = week_folder / "images"
    images_dir.mkdir(parents=True, exist_ok=True)

    try:
        posts = build_from_latest_output()
        print("Using latest real AI output.")
    except FileNotFoundError:
        posts = build_sample_posts(week_start)
        print("No AI output found yet; using sample pack instead.")

    json_path = week_folder / "posts.json"
    csv_path = week_folder / "posts.csv"

    with json_path.open("w", encoding="utf-8") as handle:
        json.dump([asdict(post) for post in posts], handle, indent=2, ensure_ascii=False)

    write_csv(posts, csv_path)

    source_images_dir = OUTPUT_DIR / "images"
    if source_images_dir.exists():
        for image_file in source_images_dir.glob("*.png"):
            destination = images_dir / image_file.name
            if not destination.exists():
                shutil.copy2(image_file, destination)

    print(f"Created manual posting pack at: {week_folder}")
    print(f"- JSON: {json_path}")
    print(f"- CSV:  {csv_path}")
    print(f"- Images folder: {images_dir}")


if __name__ == "__main__":
    main()