import io
import time
import PyPDF2
from flask import Flask, request, jsonify
import cv2
import numpy as np
import torch
from sign_land_det import process_frame
from pdf_summariser import summarizer
from flask_cors import CORS
from transformers import WhisperProcessor, WhisperForConditionalGeneration
import torchaudio
import requests
from pydub import AudioSegment
from io import BytesIO
from moviepy.editor import VideoFileClip
import os
import yt_dlp
import ffmpeg


app = Flask(__name__)
CORS(app)

@app.route('/extract-text', methods=['POST'])
def extract_text():
    data = request.json
    pdf_url = data['pdfUrl']
    
    headers = {'User-Agent': 'Mozilla/5.0 (X11; Windows; Windows x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36'}
    response = requests.get(url=pdf_url, headers=headers, timeout=120)
    on_fly_mem_obj = io.BytesIO(response.content)
    
    pdf_reader = PyPDF2.PdfReader(on_fly_mem_obj)
    text = ''
    for page_num in range(len(pdf_reader.pages)):
        page = pdf_reader.pages[page_num]
        text += page.extract_text()
    
    return jsonify({'text': text})

@app.route('/translate', methods=['POST'])
def translate():
    data = request.json
    data_aux = data['data']
    
    prediction = process_frame(data_aux)
    
    if prediction:
        return jsonify({'translation': prediction})
    else:
        return jsonify({'translation': 'No hand detected'}), 400


@app.route('/summarize', methods=['POST'])
def summarize_pdf():
    data = request.json
    pdf_url = data.get('pdf_url')

    if not pdf_url:
        return jsonify({'error': 'Invalid PDF URL'}), 400

    try:
        summary_sentences = summarizer(pdf_url)
        return jsonify({'summary': summary_sentences})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def downloading_video(url, output_path="."):
    try:
        ydl_opts = {
            'outtmpl': f'{output_path}/%(title)s.%(ext)s',  
            'format': 'best', 
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info_dict = ydl.extract_info(url, download=True)
            file_path = ydl.prepare_filename(info_dict)
        
        # Retry logic for renaming if the first attempt fails
        for _ in range(3):
            if os.path.exists(file_path):
                print(f"Download completed: {file_path}")
                return file_path
            else:
                print("Retrying file rename...")
                time.sleep(1)
        
        print("Error: Unable to rename the downloaded file.")
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None

from moviepy.editor import VideoFileClip
import torchaudio
import torchaudio.transforms as T

def extracting_audio(video_path):
    try:
        video = VideoFileClip(video_path)
        audio_file = 'output_audio.wav'
        video.audio.write_audiofile(audio_file, codec='pcm_s16le')
        return audio_file
    except Exception as e:
        print(f"Error extracting audio: {e}")
        return None
    
def format_transcription_as_vtt(transcriptions):
    vtt_content = "WEBVTT\n\n"
    for i, (start_time, end_time, text) in enumerate(transcriptions):
        vtt_content += f"{i}\n{start_time} --> {end_time}\n{text}\n\n"
    return vtt_content
    
def seconds_to_hms(seconds):
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    ms = int((seconds % 1) * 1000)
    return f"{h:02}:{m:02}:{s:02}.{ms:03}"
    
def transcribe_audio(url, download_path="."):
    filepath = downloading_video(url, download_path)
    if not filepath:
        return "Error in downloading video"
    
    audio_path = extracting_audio(filepath)
    if not audio_path:
        return "Error in extracting audio"
    
    processor = WhisperProcessor.from_pretrained("openai/whisper-base")
    model = WhisperForConditionalGeneration.from_pretrained("openai/whisper-base")
    model.config.forced_decoder_ids = None
    
    try:
        waveform, sample_rate = torchaudio.load(audio_path)
    except Exception as e:
        print(f"Error loading audio file: {e}")
        return ""

    if sample_rate != 16000:
        resample_transform = torchaudio.transforms.Resample(orig_freq=sample_rate, new_freq=16000)
        waveform = resample_transform(waveform)
    
    chunk_size = 10 * 16000  # 10 seconds
    num_chunks = waveform.size(1) // chunk_size + (1 if waveform.size(1) % chunk_size != 0 else 0)
    
    transcriptions = []
    
    for i in range(num_chunks):
        start = i * chunk_size
        end = min((i + 1) * chunk_size, waveform.size(1))
        chunk = waveform[:, start:end]
        input_features = processor(chunk.squeeze().numpy(), sampling_rate=16000, return_tensors="pt").input_features
        predicted_ids = model.generate(input_features)
        transcription = processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]
        
        start_time = seconds_to_hms(i * 10)
        end_time = seconds_to_hms((i + 1) * 10)
        transcriptions.append((start_time, end_time, transcription))
    
    vtt_transcription = format_transcription_as_vtt(transcriptions)
    return vtt_transcription

@app.route('/transcribe', methods=['POST'])
def transcribe():
    data = request.get_json()
    video_url = data.get('video_url')
    download_path = "."
    print(video_url)

    if not video_url:
        return jsonify({"error": "No video URL provided"}), 400

    transcription = transcribe_audio(video_url, download_path)
    if "Error" in transcription:
        return jsonify({"error": transcription}), 500
    

    print(transcription)
    return jsonify({"transcription": transcription})


if __name__ == '__main__':
    app.run(debug=True, port=8000)
