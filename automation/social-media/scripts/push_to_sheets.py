"""
Push generated content to Google Sheets via service account.
Run this after generate_week.py to make content available to Make.com.

Usage:
    python push_to_sheets.py                              # Push latest run
    python push_to_sheets.py week_20260615_124733.json    # Push specific file
"""

import os
import sys
import json
import glob
import base64
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv

# Fix Windows encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

load_dotenv()

try:
    from google.oauth2.service_account import Credentials
    from googleapiclient.discovery import build
    from googleapiclient.http import MediaFileUpload
except ImportError:
    print("ERROR: Missing dependencies. Run:")
    print("  pip install google-api-python-client google-auth")
    sys.exit(1)


SHEET_ID = os.getenv('GOOGLE_SHEET_ID')
DRIVE_FOLDER_ID = os.getenv('GOOGLE_DRIVE_FOLDER_ID')  # For uploading images
SERVICE_ACCOUNT_FILE = os.getenv('GOOGLE_SERVICE_ACCOUNT_JSON', 'service-account.json')

OUTPUT_DIR = Path(__file__).parent.parent / "output"
IMAGES_DIR = OUTPUT_DIR / "images"

SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file'
]

# Sheet column order — must match make.com scenario expectations
SHEET_COLUMNS = [
    'ID', 'Date', 'Time', 'Platform', 'Content Pillar',
    'Hook', 'Caption', 'Image URL', 'CTA URL',
    'Post Status', 'Buffer ID', 'Posted URL', 'Notes'
]


def get_credentials():
    """Load Google service account credentials"""
    if not os.path.exists(SERVICE_ACCOUNT_FILE):
        print(f"ERROR: Service account file not found: {SERVICE_ACCOUNT_FILE}")
        print("\nTo set up:")
        print("1. Go to https://console.cloud.google.com/")
        print("2. Create project + enable Sheets and Drive APIs")
        print("3. Create service account + download JSON key")
        print("4. Save as 'service-account.json' in this folder")
        print("5. Share your Google Sheet with the service account email")
        sys.exit(1)
    
    return Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )


def upload_image_to_drive(drive_service, image_path, filename):
    """Upload image to Google Drive and return public URL"""
    file_metadata = {
        'name': filename,
        'parents': [DRIVE_FOLDER_ID] if DRIVE_FOLDER_ID else []
    }
    
    media = MediaFileUpload(str(image_path), mimetype='image/png')
    
    file = drive_service.files().create(
        body=file_metadata,
        media_body=media,
        fields='id, webContentLink'
    ).execute()
    
    file_id = file['id']
    
    # Make it publicly accessible (Buffer needs this)
    drive_service.permissions().create(
        fileId=file_id,
        body={'role': 'reader', 'type': 'anyone'},
        fields='id'
    ).execute()
    
    # Use direct download URL that Buffer can access
    return f"https://drive.google.com/uc?export=view&id={file_id}"


def setup_sheet_headers(sheets_service):
    """Ensure the sheet has the right headers"""
    range_name = 'Content Calendar!A1:M1'
    
    result = sheets_service.spreadsheets().values().get(
        spreadsheetId=SHEET_ID,
        range=range_name
    ).execute()
    
    existing = result.get('values', [[]])[0]
    
    if existing != SHEET_COLUMNS:
        print("Setting up sheet headers...")
        sheets_service.spreadsheets().values().update(
            spreadsheetId=SHEET_ID,
            range=range_name,
            valueInputOption='RAW',
            body={'values': [SHEET_COLUMNS]}
        ).execute()
        
        # Format header row (bold, frozen)
        requests = [{
            'updateSheetProperties': {
                'properties': {
                    'sheetId': 0,
                    'gridProperties': {'frozenRowCount': 1}
                },
                'fields': 'gridProperties.frozenRowCount'
            }
        }, {
            'repeatCell': {
                'range': {
                    'sheetId': 0,
                    'startRowIndex': 0,
                    'endRowIndex': 1
                },
                'cell': {
                    'userEnteredFormat': {
                        'textFormat': {'bold': True},
                        'backgroundColor': {'red': 0.05, 'green': 0.55, 'blue': 0.9}
                    }
                },
                'fields': 'userEnteredFormat.textFormat.bold,userEnteredFormat.backgroundColor'
            }
        }]
        
        sheets_service.spreadsheets().batchUpdate(
            spreadsheetId=SHEET_ID,
            body={'requests': requests}
        ).execute()


def push_posts(input_file=None):
    """Push posts from JSON file to Google Sheets"""
    
    # Load latest output if no file specified
    if not input_file:
        files = sorted(glob.glob(str(OUTPUT_DIR / "week_*.json")))
        if not files:
            print("ERROR: No output files found")
            sys.exit(1)
        input_file = files[-1]
    
    print(f"Loading: {input_file}")
    with open(input_file, encoding='utf-8') as f:
        data = json.load(f)
    
    posts = data['posts']
    print(f"Found {len(posts)} posts\n")
    
    # Initialize Google APIs
    creds = get_credentials()
    sheets_service = build('sheets', 'v4', credentials=creds)
    drive_service = build('drive', 'v3', credentials=creds)
    
    if not SHEET_ID:
        print("ERROR: GOOGLE_SHEET_ID not in .env")
        sys.exit(1)
    
    # Ensure headers exist
    setup_sheet_headers(sheets_service)
    
    # Prepare rows
    print("Uploading images and preparing rows...")
    rows = []
    for post in posts:
        # Upload image to Drive
        image_url = ''
        if post.get('image_path') and Path(post['image_path']).exists():
            try:
                print(f"  {post['id']}: uploading image...", end=' ', flush=True)
                image_url = upload_image_to_drive(
                    drive_service,
                    post['image_path'],
                    f"{post['id']}.png"
                )
                print("OK")
            except Exception as e:
                print(f"FAILED: {e}")
        
        # Build row
        row = [
            post['id'],
            post['date'],
            post['time'],
            post['platform'],
            post['content_pillar'],
            post['hook'],
            post['caption'],
            image_url,
            post['cta_url'],
            'ready_to_post',
            '',  # Buffer ID (filled by Make.com)
            '',  # Posted URL (filled by Make.com)
            f"Generated {datetime.now().strftime('%Y-%m-%d %H:%M')}"
        ]
        rows.append(row)
    
    # Append to sheet
    print(f"\nAppending {len(rows)} rows to Google Sheet...")
    result = sheets_service.spreadsheets().values().append(
        spreadsheetId=SHEET_ID,
        range='Content Calendar!A:M',
        valueInputOption='USER_ENTERED',
        insertDataOption='INSERT_ROWS',
        body={'values': rows}
    ).execute()
    
    updated = result.get('updates', {}).get('updatedRows', 0)
    print(f"\nSUCCESS: {updated} rows added to Google Sheet")
    print(f"Sheet URL: https://docs.google.com/spreadsheets/d/{SHEET_ID}")


if __name__ == '__main__':
    input_file = sys.argv[1] if len(sys.argv) > 1 else None
    push_posts(input_file)
