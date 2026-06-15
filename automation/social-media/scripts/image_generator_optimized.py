#!/usr/bin/env python3
"""
ConvertNow.ca Image Generator - Cost-Optimized Version
Supports multiple image generation providers via OpenRouter or direct APIs
"""

import os
import json
import asyncio
import base64
from datetime import datetime
from typing import List, Optional, Dict
from dataclasses import dataclass
from enum import Enum
import aiohttp
import aiofiles


class ImageProvider(Enum):
    """Available image generation providers"""
    OPENAI_DALLE = "openai_dalle"           # Best quality, higher cost (~$0.04/image)
    STABILITY_AI = "stability_ai"           # Good quality, moderate cost (~$0.02/image)
    LEONARDO_AI = "leonardo_ai"             # Good quality, low cost (~$0.01/image)
    POLLINATIONS = "pollinations"           # Free tier available
    TOGETHER_AI = "together_ai"             # Very cheap, decent quality


@dataclass
class ImageProviderConfig:
    """Configuration for an image provider"""
    name: str
    provider: ImageProvider
    price_per_image: float  # USD
    strengths: List[str]
    aspect_ratios: List[str]
    avg_generation_time: int  # seconds


# Image Provider Catalog
IMAGE_PROVIDERS = {
    ImageProvider.OPENAI_DALLE: ImageProviderConfig(
        name="DALL-E 3",
        provider=ImageProvider.OPENAI_DALLE,
        price_per_image=0.040,
        strengths=["best quality", "follows prompts well", "great text understanding"],
        aspect_ratios=["1024x1024", "1024x1792", "1792x1024"],
        avg_generation_time=10
    ),
    ImageProvider.STABILITY_AI: ImageProviderConfig(
        name="Stable Diffusion XL",
        provider=ImageProvider.STABILITY_AI,
        price_per_image=0.020,
        strengths=["good quality", "fast", "style variety"],
        aspect_ratios=["1024x1024", "1024x576", "576x1024"],
        avg_generation_time=5
    ),
    ImageProvider.LEONARDO_AI: ImageProviderConfig(
        name="Leonardo AI",
        provider=ImageProvider.LEONARDO_AI,
        price_per_image=0.008,
        strengths=["cheap", "decent quality", "good for concepts"],
        aspect_ratios=["1024x1024", "1024x768", "768x1024"],
        avg_generation_time=15
    ),
    ImageProvider.POLLINATIONS: ImageProviderConfig(
        name="Pollinations AI",
        provider=ImageProvider.POLLINATIONS,
        price_per_image=0.000,
        strengths=["free", "unlimited", "decent for simple images"],
        aspect_ratios=["1024x1024", "1024x576", "576x1024"],
        avg_generation_time=8
    ),
    ImageProvider.TOGETHER_AI: ImageProviderConfig(
        name="Together AI (SDXL)",
        provider=ImageProvider.TOGETHER_AI,
        price_per_image=0.004,
        strengths=["very cheap", "fast", "open source models"],
        aspect_ratios=["1024x1024"],
        avg_generation_time=4
    ),
}


@dataclass
class ImageJob:
    post_id: str
    prompt: str
    output_path: str
    provider: ImageProvider
    size: str = "1024x1024"


class CostOptimizedImageGenerator:
    """Image generator with cost optimization strategies"""
    
    def __init__(self):
        self.openai_key = os.getenv('OPENAI_API_KEY')
        self.stability_key = os.getenv('STABILITY_API_KEY')
        self.leonardo_key = os.getenv('LEONARDO_API_KEY')
        self.together_key = os.getenv('TOGETHER_API_KEY')
        self.session_cost = 0.0
        self.session_images = 0
    
    def select_provider(self, content_type: str = "standard", force_cheap: bool = False) -> ImageProvider:
        """Select best provider based on content needs and cost"""
        
        if force_cheap:
            # Use free/cheap options for testing or budget mode
            return ImageProvider.POLLINATIONS
        
        # For product spotlights (important posts), use DALL-E 3
        if content_type == "product_spotlight":
            return ImageProvider.OPENAI_DALLE
        
        # For infographics and text-heavy images, use DALL-E 3
        if content_type == "infographic":
            return ImageProvider.OPENAI_DALLE
        
        # For engagement posts and simple visuals, use cheaper options
        if content_type in ["engagement", "question_poll"]:
            return ImageProvider.LEONARDO_AI
        
        # Default to balanced option
        return ImageProvider.STABILITY_AI
    
    async def generate_image(self, job: ImageJob) -> Optional[str]:
        """Generate image using selected provider"""
        
        provider_config = IMAGE_PROVIDERS[job.provider]
        print(f"🎨 [{job.post_id}] Using {provider_config.name}...")
        
        try:
            if job.provider == ImageProvider.OPENAI_DALLE:
                result = await self._generate_dalle(job)
            elif job.provider == ImageProvider.STABILITY_AI:
                result = await self._generate_stability(job)
            elif job.provider == ImageProvider.LEONARDO_AI:
                result = await self._generate_leonardo(job)
            elif job.provider == ImageProvider.POLLINATIONS:
                result = await self._generate_pollinations(job)
            elif job.provider == ImageProvider.TOGETHER_AI:
                result = await self._generate_together(job)
            else:
                raise ValueError(f"Unknown provider: {job.provider}")
            
            if result:
                self.session_cost += provider_config.price_per_image
                self.session_images += 1
                print(f"   ✅ Saved: {result}")
            
            return result
            
        except Exception as e:
            print(f"   ❌ Error: {e}")
            # Fallback to free option
            if job.provider != ImageProvider.POLLINATIONS:
                print(f"   🔄 Falling back to Pollinations (free)...")
                job.provider = ImageProvider.POLLINATIONS
                return await self.generate_image(job)
            return None
    
    async def _generate_dalle(self, job: ImageJob) -> Optional[str]:
        """Generate with DALL-E 3"""
        async with aiohttp.ClientSession() as session:
            headers = {
                "Authorization": f"Bearer {self.openai_key}",
                "Content-Type": "application/json"
            }
            
            enhanced_prompt = self._enhance_prompt(job.prompt)
            
            payload = {
                "model": "dall-e-3",
                "prompt": enhanced_prompt,
                "size": job.size,
                "quality": "standard",
                "style": "vivid",
                "response_format": "b64_json"
            }
            
            async with session.post(
                "https://api.openai.com/v1/images/generations",
                headers=headers,
                json=payload
            ) as response:
                if response.status != 200:
                    error = await response.text()
                    raise Exception(f"DALL-E error: {error}")
                
                data = await response.json()
                b64_image = data['data'][0]['b64_json']
                
                image_data = base64.b64decode(b64_image)
                async with aiofiles.open(job.output_path, 'wb') as f:
                    await f.write(image_data)
                
                return job.output_path
    
    async def _generate_stability(self, job: ImageJob) -> Optional[str]:
        """Generate with Stability AI"""
        async with aiohttp.ClientSession() as session:
            headers = {
                "Authorization": f"Bearer {self.stability_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "text_prompts": [{"text": self._enhance_prompt(job.prompt)}],
                "cfg_scale": 7,
                "samples": 1,
                "steps": 30
            }
            
            async with session.post(
                "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
                headers=headers,
                json=payload
            ) as response:
                if response.status != 200:
                    error = await response.text()
                    raise Exception(f"Stability error: {error}")
                
                data = await response.json()
                b64_image = data['artifacts'][0]['base64']
                
                image_data = base64.b64decode(b64_image)
                async with aiofiles.open(job.output_path, 'wb') as f:
                    await f.write(image_data)
                
                return job.output_path
    
    async def _generate_leonardo(self, job: ImageJob) -> Optional[str]:
        """Generate with Leonardo AI"""
        async with aiohttp.ClientSession() as session:
            headers = {
                "Authorization": f"Bearer {self.leonardo_key}",
                "Content-Type": "application/json"
            }
            
            # First, create generation
            payload = {
                "prompt": self._enhance_prompt(job.prompt),
                "modelId": "6bef9f1b-29cb-40c7-b9df-32b51c1f67d3",  # Leonardo Kino XL
                "width": 1024,
                "height": 1024,
                "num_images": 1
            }
            
            async with session.post(
                "https://cloud.leonardo.ai/api/rest/v1/generations",
                headers=headers,
                json=payload
            ) as response:
                if response.status != 200:
                    error = await response.text()
                    raise Exception(f"Leonardo error: {error}")
                
                data = await response.json()
                generation_id = data['sdGenerationJob']['generationId']
                
                # Wait and fetch result
                await asyncio.sleep(20)
                
                async with session.get(
                    f"https://cloud.leonardo.ai/api/rest/v1/generations/{generation_id}",
                    headers=headers
                ) as result_response:
                    result_data = await result_response.json()
                    image_url = result_data['generations_by_pk']['generated_images'][0]['url']
                    
                    # Download image
                    async with session.get(image_url) as img_response:
                        image_data = await img_response.read()
                        async with aiofiles.open(job.output_path, 'wb') as f:
                            await f.write(image_data)
                        
                        return job.output_path
    
    async def _generate_pollinations(self, job: ImageJob) -> Optional[str]:
        """Generate with Pollinations AI (FREE)"""
        # Pollinations has a simple URL-based API
        encoded_prompt = job.prompt.replace(' ', '%20')
        width, height = job.size.split('x')
        
        url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width={width}&height={height}&nologo=true"
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status == 200:
                    image_data = await response.read()
                    async with aiofiles.open(job.output_path, 'wb') as f:
                        await f.write(image_data)
                    return job.output_path
                else:
                    raise Exception(f"Pollinations error: {response.status}")
    
    async def _generate_together(self, job: ImageJob) -> Optional[str]:
        """Generate with Together AI"""
        async with aiohttp.ClientSession() as session:
            headers = {
                "Authorization": f"Bearer {self.together_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "model": "stabilityai/stable-diffusion-xl-base-1.0",
                "prompt": self._enhance_prompt(job.prompt),
                "width": 1024,
                "height": 1024,
                "steps": 20,
                "n": 1
            }
            
            async with session.post(
                "https://api.together.xyz/v1/images/generations",
                headers=headers,
                json=payload
            ) as response:
                if response.status != 200:
                    error = await response.text()
                    raise Exception(f"Together error: {error}")
                
                data = await response.json()
                b64_image = data['data'][0]['b64_json']
                
                image_data = base64.b64decode(b64_image)
                async with aiofiles.open(job.output_path, 'wb') as f:
                    await f.write(image_data)
                
                return job.output_path
    
    def _enhance_prompt(self, base_prompt: str) -> str:
        """Add brand consistency to image prompts"""
        brand_elements = """
Style: Clean, modern, professional quality, bright inviting colors.
Brand colors: Blue (#0c8ee7), white, subtle gradients.
Format: Social media optimized, high contrast for mobile.
No text or watermarks in the image.
"""
        return f"{base_prompt}. {brand_elements}"
    
    async def generate_batch(
        self,
        jobs: List[ImageJob],
        max_concurrent: int = 2
    ) -> List[str]:
        """Generate multiple images with rate limiting"""
        
        semaphore = asyncio.Semaphore(max_concurrent)
        
        async def generate_with_limit(job: ImageJob) -> Optional[str]:
            async with semaphore:
                result = await self.generate_image(job)
                await asyncio.sleep(1)  # Rate limiting
                return result
        
        tasks = [generate_with_limit(job) for job in jobs]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        successful = [r for r in results if isinstance(r, str)]
        failed = len([r for r in results if r is None or isinstance(r, Exception)])
        
        print(f"\n📊 Batch Complete: {len(successful)} succeeded, {failed} failed")
        return successful
    
    def print_cost_summary(self):
        """Print cost breakdown"""
        print("\n" + "="*50)
        print("💰 IMAGE GENERATION COST SUMMARY")
        print("="*50)
        print(f"Images generated: {self.session_images}")
        print(f"Total cost: ${self.session_cost:.4f}")
        print(f"Average per image: ${self.session_cost/self.session_images:.4f}" if self.session_images > 0 else "N/A")
        print()
        print("Provider Pricing:")
        for provider, config in IMAGE_PROVIDERS.items():
            print(f"  {config.name}: ${config.price_per_image:.3f}/image")


async def generate_for_posts(
    posts_json_path: str,
    output_dir: str = "images",
    force_cheap: bool = False
):
    """Generate images for all posts in a JSON file"""
    
    # Load posts
    with open(posts_json_path, 'r') as f:
        posts = json.load(f)
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Create image jobs with smart provider selection
    generator = CostOptimizedImageGenerator()
    jobs = []
    
    for post in posts:
        # Select provider based on content type
        provider = generator.select_provider(
            post.get('content_pillar', 'standard'),
            force_cheap=force_cheap
        )
        
        job = ImageJob(
            post_id=post['id'],
            prompt=post['image_prompt'],
            output_path=f"{output_dir}/{post['id']}.png",
            provider=provider,
            size="1024x1024"
        )
        jobs.append(job)
        
        print(f"   {post['id']}: {IMAGE_PROVIDERS[provider].name}")
    
    # Generate images
    results = await generator.generate_batch(jobs)
    
    # Update posts with image paths
    for post in posts:
        image_path = f"{output_dir}/{post['id']}.png"
        if os.path.exists(image_path):
            post['image_local_path'] = image_path
            post['image_status'] = 'generated'
            # Find the provider used
            for job in jobs:
                if job.post_id == post['id']:
                    post['image_provider'] = IMAGE_PROVIDERS[job.provider].name
                    post['image_cost'] = IMAGE_PROVIDERS[job.provider].price_per_image
                    break
        else:
            post['image_status'] = 'failed'
    
    # Save updated posts
    output_json = posts_json_path.replace('.json', '_with_images.json')
    with open(output_json, 'w') as f:
        json.dump(posts, f, indent=2)
    
    print(f"\n💾 Updated posts saved to {output_json}")
    
    generator.print_cost_summary()
    
    return posts


async def main():
    """CLI entry point"""
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python image_generator_optimized.py <posts_json_file> [--cheap]")
        print("Example: python image_generator_optimized.py content_week_20240115.json")
        print("         python image_generator_optimized.py content_week_20240115.json --cheap")
        sys.exit(1)
    
    posts_file = sys.argv[1]
    force_cheap = '--cheap' in sys.argv
    
    if force_cheap:
        print("💰 CHEAP MODE: Using free/cheap providers only\n")
    
    await generate_for_posts(posts_file, force_cheap=force_cheap)


if __name__ == "__main__":
    asyncio.run(main())
