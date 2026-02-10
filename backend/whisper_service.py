import whisper
import os
import sys

# Add ffmpeg to PATH if not already available
# Common ffmpeg locations on Windows
ffmpeg_paths = [
    r"C:\Users\zibsh\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.0.1-full_build\bin",
    r"C:\ffmpeg\bin",
    r"C:\Program Files\ffmpeg\bin",
    os.path.expanduser(r"~\ffmpeg\bin"),
]

for ffmpeg_path in ffmpeg_paths:
    if os.path.exists(ffmpeg_path) and ffmpeg_path not in os.environ.get("PATH", ""):
        os.environ["PATH"] = ffmpeg_path + os.pathsep + os.environ.get("PATH", "")
        print(f"Added ffmpeg to PATH: {ffmpeg_path}")
        break

print("Loading Whisper model...")
try:
    model = whisper.load_model("base")
    print("Whisper model loaded successfully")
except Exception as e:
    print(f"Error loading Whisper model: {e}")
    model = None

def process_audio(audio_path):
    """
    Transcribe audio to text using OpenAI's Whisper model.
    
    This function takes an audio file and converts it to text,
    which can then be processed by the chatbot for intelligent responses.
    
    Args:
        audio_path: Path to the audio file to transcribe
        
    Returns:
        Transcribed text from the audio
        
    Raises:
        Exception: If the model is not loaded or the audio file is invalid
    """
    if model is None:
        raise Exception("Whisper model not loaded")
    
    if not os.path.exists(audio_path):
        raise Exception(f"Audio file not found at: {audio_path}")
    
    print(f"\n[Whisper] Processing: {audio_path}")
    print(f"[Whisper] File size: {os.path.getsize(audio_path)} bytes")
    
    try:
        print(f"[Whisper] Transcribing...")
        result = model.transcribe(audio_path)
        text = result["text"].strip()
        print(f"[Whisper] ✓ Transcription complete. Text: {text[:80] if len(text) > 80 else text}")
        
        return text
            
    except FileNotFoundError as e:
        print(f"[Whisper] ✗ File not found error: {e}")
        print(f"[Whisper] Attempted path: {audio_path}")
        raise
    except Exception as e:
        print(f"[Whisper] ✗ Error during transcription: {type(e).__name__}: {e}")
        import traceback
        print(traceback.format_exc())
        raise
