#!/usr/bin/env python3
"""
Comprehensive YouTube Video to 30-Second Shorts Generator
========================================================

This system creates ALL possible 30-second shorts YouTube video,
 from aensuring maximum content extraction with perfect audio processing.

Key Features:
- Generate ALL possible 30-second clips from video
- Perfect audio processing for seamless cuts
- Comprehensive video coverage
- Smart overlapping for maximum content
- Quality validation for all clips
- Professional-grade output

Author: Kilo Code Assistant
Version: 3.0
"""

import os
import json
import subprocess
import logging
import time
import math
from typing import List, Dict, Tuple, Optional
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import yt_dlp
import numpy as np
from moviepy.video.io.VideoFileClip import VideoFileClip

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('comprehensive_processor.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Configuration
class Config:
    """Configuration for comprehensive 30-second clip generation"""
    
    DOWNLOAD_DIR = "downloads"
    OUTPUT_DIR = "all_30sec_shorts"
    LOGS_DIR = "logs"
    
    # Clip generation settings
    CLIP_DURATION = 30  # Exactly 30 seconds per clip
    OVERLAP_DURATION = 5  # 5-second overlap between clips for maximum coverage
    MIN_CLIP_DURATION = 25  # Minimum duration for valid clips
    AUDIO_FADE_DURATION = 0.2  # Short fade for seamless transitions
    
    # Video processing settings
    VIDEO_CRF = 18  # High quality
    AUDIO_BITRATE = "192k"
    SAMPLE_RATE = 44100
    
    # Output settings
    MAX_CLIPS_PER_VIDEO = 100  # Safety limit
    VIDEO_CODEC = "libx264"
    AUDIO_CODEC = "aac"

# Create necessary directories
os.makedirs(Config.DOWNLOAD_DIR, exist_ok=True)
os.makedirs(Config.OUTPUT_DIR, exist_ok=True)
os.makedirs(Config.LOGS_DIR, exist_ok=True)

class ComprehensiveVideoProcessor:
    """Generate ALL possible 30-second clips from video"""
    
    def __init__(self):
        logger.info("Comprehensive 30-second clip generator initialized")
    
    def download_video(self, url: str) -> Tuple[str, str, Dict]:
        """Download YouTube video with metadata"""
        logger.info(f"Downloading video: {url}")

        def progress_hook(d):
            if d['status'] == 'downloading':
                percentage_str = d.get('_percent_str', '0%').strip('%')
                try:
                    percentage = float(percentage_str)
                    # Map download progress from 0-100% to 10-30% in overall progress
                    overall_progress = 10 + (percentage * 0.2)  # 10% + (percentage * 20%)
                    update_progress('downloading', f'Downloading... {percentage:.1f}%', int(overall_progress))
                except ValueError:
                    pass
            elif d['status'] == 'finished':
                update_progress('downloading', 'Download complete, processing...', 30)

        ydl_opts = {
            'format': 'best[ext=mp4]',
            'outtmpl': f'{Config.DOWNLOAD_DIR}/%(id)s.%(ext)s',
            'quiet': True,
            'writeinfojson': True,
            'progress_hooks': [progress_hook],
        }

        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=True)
                video_path = ydl.prepare_filename(info)

                metadata = {
                    'title': info.get('title', 'Unknown'),
                    'duration': info.get('duration', 0),
                    'uploader': info.get('uploader', 'Unknown'),
                    'description': info.get('description', ''),
                    'view_count': info.get('view_count', 0),
                    'upload_date': info.get('upload_date', ''),
                }

                metadata_path = video_path.replace('.mp4', '_metadata.json')
                with open(metadata_path, 'w', encoding='utf-8') as f:
                    json.dump(metadata, f, indent=2)

                logger.info(f"Video downloaded: {video_path} ({metadata['duration']}s)")
                return video_path, metadata['title'], metadata

        except Exception as e:
            logger.error(f"Download failed: {e}")
            raise
    
    def calculate_all_clip_segments(self, video_duration: int) -> List[Dict]:
        """Calculate ALL possible 30-second clip segments with overlap"""
        segments = []
        
        # Start from 0 and create clips every (CLIP_DURATION - OVERLAP_DURATION) seconds
        step_size = Config.CLIP_DURATION - Config.OVERLAP_DURATION  # 25 seconds
        start_time = 0
        
        clip_count = 0
        while start_time < video_duration and clip_count < Config.MAX_CLIPS_PER_VIDEO:
            end_time = start_time + Config.CLIP_DURATION
            
            # Ensure we don't go beyond video duration
            if end_time > video_duration:
                # Create final clip that reaches exactly to the end
                end_time = video_duration
                actual_duration = end_time - start_time
                
                # Only include if it's long enough
                if actual_duration >= Config.MIN_CLIP_DURATION:
                    segments.append({
                        'start_time': start_time,
                        'end_time': end_time,
                        'duration': actual_duration,
                        'clip_number': clip_count + 1,
                        'is_final_clip': True
                    })
                break
            
            # Add this 30-second segment
            segments.append({
                'start_time': start_time,
                'end_time': end_time,
                'duration': Config.CLIP_DURATION,
                'clip_number': clip_count + 1,
                'is_final_clip': False
            })
            
            # Move to next starting position
            start_time += step_size
            clip_count += 1
        
        logger.info(f"Calculated {len(segments)} possible 30-second segments")
        return segments
    
    def create_all_30sec_clips(self, video_path: str, title: str, progress_callback=None) -> List[Dict]:
        """Create ALL possible 30-second clips from the video"""
        logger.info("Starting comprehensive 30-second clip generation...")

        # Ensure output directory exists
        os.makedirs(Config.OUTPUT_DIR, exist_ok=True)

        # Get video information
        try:
            clip = VideoFileClip(video_path)
            video_duration = clip.duration
            clip.close()
        except Exception as e:
            logger.error(f"Failed to get video duration: {e}")
            return []

        # Calculate all possible segments
        segments = self.calculate_all_clip_segments(video_duration)

        if not segments:
            logger.warning("No valid segments found")
            return []

        # Generate all clips
        created_clips = []
        clean_title = self._sanitize_filename(title)
        
        for i, segment in enumerate(segments):
            try:
                logger.info(f"Creating clip {i+1}/{len(segments)}: {segment['start_time']:.1f}s - {segment['end_time']:.1f}s")
                
                # Update progress if callback provided
                if progress_callback:
                    progress_percent = 40 + int((i / len(segments)) * 50)  # 40-90%
                    progress_callback('processing', f'Generating clip {i+1}/{len(segments)}...', progress_percent, len(segments), i+1)
                
                # Create output filename
                output_filename = f"{clean_title}_clip_{segment['clip_number']:03d}_{segment['start_time']:.0f}s.mp4"
                output_path = os.path.join(Config.OUTPUT_DIR, output_filename)
                
                # Create the 30-second clip
                success = self._create_30sec_clip(
                    video_path, segment, output_path
                )
                
                if success:
                    created_clips.append({
                        'path': output_path,
                        'clip_number': segment['clip_number'],
                        'start_time': segment['start_time'],
                        'end_time': segment['end_time'],
                        'duration': segment['duration'],
                        'filename': output_filename,
                        'size_mb': os.path.getsize(output_path) / (1024 * 1024)
                    })
                    logger.info(f"✅ Created: {output_filename}")
                else:
                    logger.error(f"❌ Failed to create clip {segment['clip_number']}")
                    
            except Exception as e:
                logger.error(f"Error creating clip {i+1}: {e}")
                continue
        
        logger.info(f"Successfully created {len(created_clips)} clips out of {len(segments)} planned")
        return created_clips
    
    def _create_30sec_clip(self, video_path: str, segment: Dict, output_path: str) -> bool:
        """Create a single 30-second clip with optimal processing"""
        try:
            start_time = segment['start_time']
            end_time = segment['end_time']
            duration = segment['duration']
            
            # Enhanced FFmpeg command for perfect 30-second clips
            cmd = [
                'ffmpeg', '-y',
                '-ss', str(start_time),
                '-i', video_path,
                '-t', str(duration),
                
                # Video encoding
                '-c:v', Config.VIDEO_CODEC,
                '-preset', 'fast',
                '-crf', str(Config.VIDEO_CRF),
                '-profile:v', 'high',
                '-level', '4.0',
                '-pix_fmt', 'yuv420p',
                '-movflags', '+faststart',
                
                # Audio processing
                '-c:a', Config.AUDIO_CODEC,
                '-b:a', Config.AUDIO_BITRATE,
                '-ar', str(Config.SAMPLE_RATE),
                '-ac', '2',
                
                # Audio enhancement for seamless playback
                '-af', (
                    f'afade=t=in:st=0:d={Config.AUDIO_FADE_DURATION},'
                    f'afade=t=out:st={duration - Config.AUDIO_FADE_DURATION}:d={Config.AUDIO_FADE_DURATION},'
                    'highpass=f=80,'  # Remove low-frequency noise
                    'lowpass=f=12000,'  # Remove high-frequency noise
                    'acompressor=threshold=0.1:ratio=3:attack=5:release=50,'
                    'loudnorm=I=-16:LRA=11:TP=-1.5'
                ),
                
                output_path
            ]
            
            # Execute FFmpeg
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=180  # 3-minute timeout per clip
            )
            
            if result.returncode == 0 and os.path.exists(output_path):
                # Verify file size (should be substantial for 30-second clips)
                file_size = os.path.getsize(output_path)
                if file_size > 500000:  # At least 500KB for a 30-second clip
                    logger.info(f"Perfect clip created: {duration:.1f}s ({file_size/1024/1024:.1f}MB)")
                    return True
                else:
                    logger.error(f"File too small: {file_size/1024:.1f}KB")
                    return False
            else:
                logger.error(f"FFmpeg error: {result.stderr}")
                return False
                
        except subprocess.TimeoutExpired:
            logger.error("FFmpeg processing timed out")
            return False
        except Exception as e:
            logger.error(f"Clip creation failed: {e}")
            return False
    
    def _sanitize_filename(self, filename: str) -> str:
        """Sanitize filename for safe file system usage"""
        invalid_chars = '<>:"/\\|?*'
        for char in invalid_chars:
            filename = filename.replace(char, '_')
        
        if len(filename) > 100:
            filename = filename[:100]
        
        filename = filename.strip('. ')
        return filename
    
    def generate_comprehensive_report(self, created_clips: List[Dict], metadata: Dict, output_dir: str) -> str:
        """Generate comprehensive report for all generated clips"""
        if not created_clips:
            return "No clips were created"
        
        # Calculate statistics
        total_duration = sum(clip['duration'] for clip in created_clips)
        video_duration = metadata.get('duration', 0)
        coverage_percentage = (total_duration / video_duration * 100) if video_duration > 0 else 0
        
        report = {
            'processing_summary': {
                'total_clips_created': len(created_clips),
                'total_duration_generated': total_duration,
                'original_video_duration': video_duration,
                'video_coverage_percentage': round(coverage_percentage, 2),
                'video_title': metadata.get('title', 'Unknown'),
                'video_uploader': metadata.get('uploader', 'Unknown'),
                'processing_timestamp': time.strftime('%Y-%m-%d %H:%M:%S')
            },
            'clip_details': created_clips,
            'statistics': {
                'average_clip_duration': total_duration / len(created_clips),
                'shortest_clip': min(clip['duration'] for clip in created_clips),
                'longest_clip': max(clip['duration'] for clip in created_clips),
                'total_output_size_mb': sum(clip['size_mb'] for clip in created_clips),
                'average_file_size_mb': sum(clip['size_mb'] for clip in created_clips) / len(created_clips)
            }
        }
        
        # Save report
        report_path = os.path.join(output_dir, "report.json")
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2)
        
        return report_path

# Global progress tracking
progress_state = {
    'status': 'idle',  # idle, downloading, processing, complete, error
    'message': '',
    'progress': 0,
    'total_clips': 0,
    'current_clip': 0,
    'error': None
}

def update_progress(status, message, progress=0, total_clips=0, current_clip=0):
    """Update global progress state"""
    global progress_state
    progress_state.update({
        'status': status,
        'message': message,
        'progress': progress,
        'total_clips': total_clips,
        'current_clip': current_clip,
        'error': None
    })
    logger.info(f"Progress: {status} - {message} ({progress}%)")

# Flask app setup
app = Flask(__name__)
CORS(app)

@app.route('/progress', methods=['GET'])
def get_progress():
    """Get current progress status"""
    return jsonify(progress_state)

@app.route('/generate_shorts', methods=['POST'])
def generate_shorts():
    """API endpoint to generate shorts from YouTube URL"""
    try:
        data = request.get_json()
        url = data.get('url')
        output_dir = data.get('output_dir', 'all_30sec_shorts')

        if not url:
            return jsonify({'error': 'URL is required'}), 400

        # Reset progress
        update_progress('downloading', 'Starting download...', 0)

        # Initialize processor
        processor = ComprehensiveVideoProcessor()

        # Process video
        print(f"Processing YouTube URL: {url}")

        # Step 1: Download video
        update_progress('downloading', 'Downloading YouTube video...', 10)
        video_path, title, metadata = processor.download_video(url)
        update_progress('downloading', 'Download complete!', 30)

        # Step 2: Generate ALL 30-second clips
        update_progress('processing', 'Calculating clip segments...', 35)
        
        # Get video duration to calculate total clips
        try:
            from moviepy.video.io.VideoFileClip import VideoFileClip
            clip = VideoFileClip(video_path)
            video_duration = clip.duration
            clip.close()
            
            # Calculate expected number of clips
            step_size = Config.CLIP_DURATION - Config.OVERLAP_DURATION
            expected_clips = min(int(video_duration / step_size) + 1, Config.MAX_CLIPS_PER_VIDEO)
            update_progress('processing', f'Generating {expected_clips} shorts...', 40, expected_clips, 0)
        except:
            update_progress('processing', 'Generating shorts...', 40)
        
        created_clips = processor.create_all_30sec_clips(video_path, title, update_progress)
        
        update_progress('processing', 'Creating final report...', 90)

        # Step 3: Generate report
        report_path = processor.generate_comprehensive_report(created_clips, metadata, output_dir)

        # Read and return the report
        with open(report_path, 'r', encoding='utf-8') as f:
            report = json.load(f)

        update_progress('complete', f'Successfully generated {len(created_clips)} shorts!', 100, len(created_clips), len(created_clips))
        return jsonify(report)

    except Exception as e:
        logger.error(f"API error: {e}")
        progress_state['status'] = 'error'
        progress_state['error'] = str(e)
        return jsonify({'error': str(e)}), 500

@app.route('/<path:filename>')
def serve_file(filename):
    """Serve generated video files"""
    return send_from_directory('all_30sec_shorts', filename)

if __name__ == "__main__":
    print("🎬 Comprehensive 30-Second Shorts Generator API")
    print("=" * 50)
    print("Starting Flask server on http://localhost:5000")
    print("POST /generate_shorts to generate shorts from YouTube URL")
    app.run(host='0.0.0.0', port=5000, debug=False, threaded=True)