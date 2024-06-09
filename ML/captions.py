from moviepy.editor import VideoFileClip
from IPython.display import display, Video
import os
from transformers import WhisperProcessor, WhisperForConditionalGeneration
import torch
import torchaudio
import cv2
from moviepy.editor import VideoFileClip, AudioFileClip
import base64

def downloading_video(url,output_path="."):
    import yt_dlp
    try:
        ydl_opts = {
            'outtmpl': f'{output_path}/%(title)s.%(ext)s',  
            'format': 'best', 
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info_dict = ydl.extract_info(url, download=True)
            file_path = ydl.prepare_filename(info_dict)
        
        print(f"Download completed: {file_path}")
        return file_path
    except Exception as e:
        print(f"Error: {e}")
        return None


def extracting_audio(video_path):
    try:
        video = VideoFileClip(video_path)
        from moviepy.video.io.ffmpeg_tools import ffmpeg_extract_audio
        audio_file = 'output_audio.wav'
        ffmpeg_extract_audio(video_path, audio_file)
        return audio_file
    except Exception as e:
        print(f"Error extracting audio: {e}")
        return None

def speech_to_text(url,download_path="."):
    filepath=downloading_video(url,download_path)
    extracting_audio(filepath)
    processor = WhisperProcessor.from_pretrained("openai/whisper-base")
    model = WhisperForConditionalGeneration.from_pretrained("openai/whisper-base")
    model.config.forced_decoder_ids = None
    file_path='output_audio.wav'
    waveform, sample_rate = torchaudio.load(file_path)

    if sample_rate != 16000:
        resample_transform = torchaudio.transforms.Resample(orig_freq=sample_rate, new_freq=16000)
        waveform = resample_transform(waveform)
    
    chunk_size = 10 * sample_rate  
    num_chunks = waveform.size(1) // chunk_size + (1 if waveform.size(1) % chunk_size != 0 else 0)
    
    transcriptions = []
    
    for i in range(num_chunks):
        start = i * chunk_size
        end = min((i + 1) * chunk_size, waveform.size(1))
        chunk = waveform[:, start:end]
        input_features = processor(chunk.squeeze().numpy(), sampling_rate=16000, return_tensors="pt").input_features
        predicted_ids = model.generate(input_features)
        transcription = processor.batch_decode(predicted_ids, skip_special_tokens=True)
        transcriptions.append(transcription[0])
        full_transcription = " ".join(transcriptions)
    
    print(full_transcription)



download_path="."
speech_to_text('https://dzylziennabbwterlnwj.supabase.co/storage/v1/object/sign/vid/So__Cloudflare_Responded....mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2aWQvU29fX0Nsb3VkZmxhcmVfUmVzcG9uZGVkLi4uLm1wNCIsImlhdCI6MTcxNzc1NTE3MSwiZXhwIjoxNzE4MzU5OTcxfQ.snz6WM4N5UaeS-kbjKHhYg9PtI1P4WaaMcc5jI-O3pc&t=2024-06-07T10%3A12%3A50.032Z',download_path)