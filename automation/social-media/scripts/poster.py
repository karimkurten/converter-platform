#!/usr/bin/env python3
"""
ConvertNow.ca Social Media Poster
Posts content to Buffer for scheduling
"""

import os
import json
import asyncio
from datetime import datetime, timedelta
from typing import List, Optional, Dict
from dataclasses import dataclass
import aiohttp


@dataclass
class PostJob:
    post_id: str
    platform: str  # 'facebook', 'instagram', 'both'
    caption: str
    image_url: str
    scheduled_time: datetime
    cta_url: str


class BufferAPI:
    """Buffer API client for social media posting"""
    
    def __init__(self, access_token: str = None):
        self.access_token = access_token or os.getenv('BUFFER_ACCESS_TOKEN')
        self.base_url = "https://api.bufferapp.com/1"
        self.profile_ids = {
            'facebook': os.getenv('BUFFER_FB_PROFILE_ID'),
            'instagram': os.getenv('BUFFER_IG_PROFILE_ID')
        }
    
    async def get_profiles(self) -> List[Dict]:
        """Get connected social profiles"""
        async with aiohttp.ClientSession() as session:
            url = f"{self.base_url}/profiles.json?access_token={self.access_token}"
            async with session.get(url) as response:
                if response.status == 200:
                    return await response.json()
                else:
                    error = await response.text()
                    raise Exception(f"Failed to get profiles: {error}")
    
    async def create_post(
        self,
        profile_ids: List[str],
        text: str,
        media: Dict,
        scheduled_at: Optional[str] = None
    ) -> Optional[str]:
        """Create a new post in Buffer"""
        async with aiohttp.ClientSession() as session:
            url = f"{self.base_url}/updates/create.json"
            
            payload = {
                'access_token': self.access_token,
                'profile_ids[]': profile_ids,
                'text': text,
                'media': json.dumps(media)
            }
            
            if scheduled_at:
                payload['scheduled_at'] = scheduled_at
            
            async with session.post(url, data=payload) as response:
                if response.status == 200:
                    data = await response.json()
                    return data.get('id')
                else:
                    error = await response.text()
                    print(f"❌ Buffer API error: {error}")
                    return None
    
    async def schedule_posts(self, jobs: List[PostJob]) -> List[Dict]:
        """Schedule multiple posts"""
        results = []
        
        for job in jobs:
            # Determine profile IDs
            profile_ids = []
            if job.platform in ['facebook', 'both']:
                profile_ids.append(self.profile_ids['facebook'])
            if job.platform in ['instagram', 'both']:
                profile_ids.append(self.profile_ids['instagram'])
            
            if not profile_ids:
                print(f"⚠️ No profile IDs configured for {job.platform}")
                continue
            
            # Format scheduled time
            scheduled_at = job.scheduled_time.strftime('%Y-%m-%dT%H:%M:%S%z')
            
            # Create media object
            media = {
                'photo': job.image_url,
                'link': job.cta_url
            }
            
            print(f"📤 Scheduling {job.post_id} for {job.platform} at {scheduled_at}...")
            
            post_id = await self.create_post(
                profile_ids=profile_ids,
                text=job.caption,
                media=media,
                scheduled_at=scheduled_at
            )
            
            results.append({
                'post_id': job.post_id,
                'buffer_id': post_id,
                'status': 'scheduled' if post_id else 'error',
                'platform': job.platform,
                'scheduled_time': scheduled_at
            })
            
            # Rate limiting
            await asyncio.sleep(1)
        
        return results


class GoogleSheetsIntegration:
    """Update Google Sheets with posting status"""
    
    def __init__(self, sheet_id: str = None):
        self.sheet_id = sheet_id or os.getenv('GOOGLE_SHEET_ID')
        self.api_key = os.getenv('GOOGLE_API_KEY')
    
    async def update_post_status(self, post_id: str, status: str, buffer_id: str = None, notes: str = ""):
        """Update post status in Google Sheets"""
        # This would use Google Sheets API
        # For now, just log the update
        print(f"📝 Sheet update: {post_id} -> {status}")
    
    async def get_pending_posts(self) -> List[Dict]:
        """Get posts ready to be scheduled"""
        # This would fetch from Google Sheets
        # Return mock data for now
        return []


class PosterOrchestrator:
    """Orchestrates the posting workflow"""
    
    def __init__(self):
        self.buffer = BufferAPI()
        self.sheets = GoogleSheetsIntegration()
    
    async def run_daily_posting(self):
        """Run the daily posting workflow"""
        print("🚀 Starting daily posting workflow...")
        
        # Get pending posts from Google Sheets
        pending = await self.sheets.get_pending_posts()
        
        if not pending:
            print("ℹ️ No pending posts for today")
            return
        
        # Convert to PostJobs
        jobs = []
        for post in pending:
            job = PostJob(
                post_id=post['id'],
                platform=post['platform'].lower(),
                caption=post['caption'],
                image_url=post['image_url'],
                scheduled_time=datetime.fromisoformat(post['scheduled_time']),
                cta_url=post['cta_url']
            )
            jobs.append(job)
        
        # Schedule posts
        results = await self.buffer.schedule_posts(jobs)
        
        # Update Google Sheets with results
        for result in results:
            await self.sheets.update_post_status(
                post_id=result['post_id'],
                status=result['status'],
                buffer_id=result['buffer_id']
            )
        
        # Print summary
        scheduled = len([r for r in results if r['status'] == 'scheduled'])
        errors = len([r for r in results if r['status'] == 'error'])
        
        print(f"\n📊 Posting Summary:")
        print(f"   ✅ Scheduled: {scheduled}")
        print(f"   ❌ Errors: {errors}")
    
    async def post_single(self, post_data: Dict):
        """Post a single item immediately"""
        job = PostJob(
            post_id=post_data['id'],
            platform=post_data['platform'].lower(),
            caption=post_data['caption'],
            image_url=post_data['image_url'],
            scheduled_time=datetime.now(),
            cta_url=post_data['cta_url']
        )
        
        results = await self.buffer.schedule_posts([job])
        return results[0] if results else None


async def main():
    """CLI entry point"""
    import sys
    
    orchestrator = PosterOrchestrator()
    
    if len(sys.argv) > 1 and sys.argv[1] == '--daily':
        # Run daily workflow
        await orchestrator.run_daily_posting()
    elif len(sys.argv) > 1 and sys.argv[1] == '--test':
        # Test with sample post
        test_post = {
            'id': 'TEST001',
            'platform': 'facebook',
            'caption': 'Test post from ConvertNow automation system! 🚀\n\nVisit https://www.convertnow.ca',
            'image_url': 'https://via.placeholder.com/1024x1024.png?text=ConvertNow',
            'cta_url': 'https://www.convertnow.ca'
        }
        result = await orchestrator.post_single(test_post)
        print(f"Test result: {result}")
    else:
        print("Usage:")
        print("  python poster.py --daily    # Run daily posting workflow")
        print("  python poster.py --test     # Post a test message")


if __name__ == "__main__":
    asyncio.run(main())
