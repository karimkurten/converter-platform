"""Quick preview of generated content"""
import json
import sys
import glob
import os

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

output_dir = os.path.join(os.path.dirname(__file__), '..', 'output')
files = sorted(glob.glob(os.path.join(output_dir, 'week_*.json')))
if not files:
    print("No output files found")
    sys.exit(1)

latest = files[-1]
print(f"File: {os.path.basename(latest)}\n")

with open(latest, encoding='utf-8') as f:
    data = json.load(f)

print(f"Total posts: {len(data['posts'])}\n")
print("=" * 70)

for p in data['posts'][:5]:
    print(f"\n[{p['id']}] {p['content_pillar']:18} | {p['platform']:10} | {p['date']} {p['time']}")
    print(f"Model: {p['model_used'].split('/')[-1]}")
    print(f"Hook:    {p['hook']}")
    print(f"Caption: {p['caption'][:300]}{'...' if len(p['caption']) > 300 else ''}")
    print(f"Image:   {os.path.basename(p['image_path'])}")
    print("-" * 70)

print(f"\n... and {len(data['posts']) - 5} more posts")
