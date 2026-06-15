#!/usr/bin/env python3
"""
ConvertNow.ca Image Generator
Generates social media images using DALL-E 3
"""

import os
import json
import asyncio
import base64
from datetime import datetime
from typing import List, Optional
from dataclasses import dataclass
import aiohttp
import aiofiles


@dataclass
class ImageJob:
    post_id: str
    prompt: str
    output_path: str
    size: str = "1024x1024"


class ImageGenerator:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv('OPENAI_API_KEY')
        self.base_url = "https://api.openai.com/v1"
        
    async def generate_image(self, job: ImageJob) -> Optional[str]:
        """Generate a single image using DALL-E 3"""
        async with aiohttp.ClientSession() as session:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            # Enhance prompt with brand consistency
            enhanced_prompt = self._enhance_prompt(job.prompt)
            
            payload = {
                "model": "dall-e-3",
                "prompt": enhanced_prompt,
                "size": job.size,
                "quality": "standard",
                "style": "vivid",
                "response_format": "b64_json"
            }
            
            print(f"🎨 Generating image for {job.post_id}...")
            
            async with session.post(
                f"{self.base_url}/images/generations",
                headers=headers,
                json=payload
            ) as response:
                if response.status != 200:
                    error_text = await response.text()
                    print(f"❌ Error generating {job.post_id}: {error_text}")
                    return None
                
                data = await response.json()
                b64_image = data['data'][0]['b64_json']
                
                # Save image
                image_data = base64.b64decode(b64_image)
                async with aiofiles.open(job.output_path, 'wb') as f:
                    await f.write(image_data)
                
                print(f"✅ Saved: {job.output_path}")
                return job.output_path
    
    async def generate_batch(self, jobs: List[ImageJob], max_concurrent: int = 3) -> List[str]:
        """Generate multiple images with rate limiting"""
        semaphore = asyncio.Semaphore(max_concurrent)
        
        async def generate_with_limit(job: ImageJob) -> Optional[str]:
            async with semaphore:
                result = await self.generate_image(job)
                # Small delay to respect rate limits
                await asyncio.sleep(1)
                return result
        
        tasks = [generate_with_limit(job) for job in jobs]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        successful = [r for r in results if isinstance(r, str)]
        failed = [i for i, r in enumerate(results) if r is None or isinstance(r, Exception)]
        
        print(f"\n📊 Batch Complete: {len(successful)} succeeded, {len(failed)} failed")
        return successful
    
    def _enhance_prompt(self, base_prompt: str) -> str:
        """Add brand consistency to image prompts"""
        brand_elements = """
Style guidelines:
- Clean, modern design
- Professional quality
- Bright, inviting colors
- ConvertNow brand colors: blue (#0c8ee7), white, subtle gradients
- Suitable for social media (Instagram/Facebook)
- No text or watermarks in the image
- High contrast for mobile viewing
"""
        return f"{base_prompt}\n\n{brand_elements}"


class CloudStorageUploader:
    """Upload images to cloud storage (AWS S3, Cloudflare R2, etc.)"""
    
    def __init__(self, provider: str = "s3"):
        self.provider = provider
        self.bucket = os.getenv('STORAGE_BUCKET')
        self.access_key = os.getenv('STORAGE_ACCESS_KEY')
        self.secret_key = os.getenv('STORAGE_SECRET_KEY')
        self.endpoint = os.getenv('STORAGE_ENDPOINT')
    
    async def upload(self, local_path: str, remote_name: str) -> Optional[str]:
        """Upload image and return public URL"""
        # Implementation depends on storage provider
        # This is a placeholder for the actual upload logic
        
        if self.provider == "s3":
            return await self._upload_s3(local_path, remote_name)
        elif self.provider == "r2":
            return await self._upload_r2(local_path, remote_name)
        else:
            raise ValueError(f"Unknown provider: {self.provider}")
    
    async def _upload_s3(self, local_path: str, remote_name: str) -> str:
        """Upload to AWS S3"""
        import boto3
        from botocore.exceptions import ClientError
        
        s3 = boto3.client(
            's3',
            aws_access_key_id=self.access_key,
            aws_secret_access_key=self.secret_key
        )
        
        try:
            s3.upload_file(
                local_path, 
                self.bucket, 
                remote_name,
                ExtraArgs={'ACL': 'public-read', 'ContentType': 'image/png'}
            )
            return f"https://{self.bucket}.s3.amazonaws.com/{remote_name}"
        except ClientError as e:
            print(f"❌ S3 upload failed: {e}")
            return None
    
    async def _upload_r2(self, local_path: str, remote_name: str) -> str:
        """Upload to Cloudflare R2"""
        import boto3
        
        s3 = boto3.client(
            's3',
            endpoint_url=self.endpoint,
            aws_access_key_id=self.access_key,
            aws_secret_access_key=self.secret_key
        )
        
        try:
            s3.upload_file(
                local_path,
                self.bucket,
                remote_name,
                ExtraArgs={'ContentType': 'image/png'}
            )
            return f"{self.endpoint}/{self.bucket}/{remote_name}"
        except Exception as e:
            print(f"❌ R2 upload failed: {e}")
            return None


async def generate_for_posts(posts_json_path: str, output_dir: str = "images"):
    """Generate images for all posts in a JSON file"""
    # Load posts
    with open(posts_json_path, 'r') as f:
        posts = json.load(f)
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Create image jobs
    jobs = []
    for post in posts:
        job = ImageJob(
            post_id=post['id'],
            prompt=post['image_prompt'],
            output_path=f"{output_dir}/{post['id']}.png",
            size="1024x1024"  # Square format works for both FB and IG
        )
        jobs.append(job)
    
    # Generate images
    generator = ImageGenerator()
    results = await generator.generate_batch(jobs)
    
    # Update posts with image paths
    for post in posts:
        image_path = f"{output_dir}/{post['id']}.png"
        if os.path.exists(image_path):
            post['image_local_path'] = image_path
            post['image_status'] = 'generated'
        else:
            post['image_status'] = 'failed'
    
    # Save updated posts
    output_json = posts_json_path.replace('.json', '_with_images.json')
    with open(output_json, 'w') as f:
        json.dump(posts, f, indent=2)
    
    print(f"\n💾 Updated posts saved to {output_json}")
    return posts


async def main():
    """CLI entry point"""
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python image_generator.py <posts_json_file>")
        print("Example: python image_generator.py content_week_20240115.json")
        sys.exit(1)
    
    posts_file = sys.argv[1]
    await generate_for_posts(posts_file)


if __name__ == "__main__":
    asyncio.run(main())
