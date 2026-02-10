from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import shutil
import os
import traceback
import tempfile
import uuid
import json
from whisper_service import process_audio
from rewrite_service import generate_chatbot_response

app = FastAPI(title="Adizoon Chatbot API", description="AI-powered chatbot with audio transcription")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "ok"}

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...), history: str = Form(default="[]")):
    """
    Transcribe audio file to text using Whisper model.
    
    - **file**: Audio file to transcribe (supports: wav, mp3, m4a, etc.)
    - **history**: JSON string of conversation history
    - Returns: Transcribed text
    """
    file_path = None
    
    # Parse history
    try:
        chat_history = json.loads(history)
    except:
        chat_history = []
    
    try:
        # Use absolute path in temp directory with a simple name
        temp_dir = tempfile.gettempdir()
        # Generate a unique filename to avoid conflicts
        file_ext = os.path.splitext(file.filename)[1] or ".wav"
        file_path = os.path.join(temp_dir, f"audio_{uuid.uuid4()}{file_ext}")

        print(f"\n{'='*60}")
        print(f"[STEP 1] Creating temp file")
        print(f"  Filename: {file.filename}")
        print(f"  Temp dir: {temp_dir}")
        print(f"  Full path: {file_path}")
        print(f"  Extension: {file_ext}")
        
        # Create temp directory if needed
        os.makedirs(temp_dir, exist_ok=True)
        print(f"  Temp dir exists: True")
        
        # Read file data
        print(f"\n[STEP 2] Reading file data from upload")
        content = await file.read()
        print(f"  File size: {len(content)} bytes")
        
        # Write to disk
        print(f"\n[STEP 3] Writing file to disk")
        with open(file_path, "wb") as buffer:
            buffer.write(content)
        print(f"  File written successfully")
        
        # Verify file exists
        print(f"\n[STEP 4] Verifying file")
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File was not created at {file_path}")
        
        print(f"  File exists: True")
        print(f"  File size on disk: {os.path.getsize(file_path)} bytes")
        print(f"  Readable: {os.access(file_path, os.R_OK)}")
        
        # Transcribe audio to text
        print(f"\n[STEP 5] Transcribing audio using Whisper")
        print(f"  Path being passed: {file_path}")
        transcribed_text = process_audio(file_path)
        print(f"  ✓ Success")
        
        # Generate AI chatbot response
        print(f"\n[STEP 6] Generating AI response from chatbot")
        chatbot_response = generate_chatbot_response(transcribed_text, chat_history)
        print(f"  ✓ Success")
        
        print(f"\n[SUCCESS] Processing complete")
        print(f"{'='*60}\n")

        return {
            "transcribed_text": transcribed_text,
            "chatbot_response": chatbot_response
        }
        
    except FileNotFoundError as e:
        error_msg = f"FileNotFoundError: {str(e)}"
        print(f"\n[ERROR] {error_msg}")
        print(f"  File path: {file_path}")
        if file_path and os.path.exists(file_path):
            print(f"  File exists: True (size: {os.path.getsize(file_path)} bytes)")
        else:
            print(f"  File exists: False")
        print(traceback.format_exc())
        print(f"{'='*60}\n")
        
        return JSONResponse(
            status_code=400,
            content={
                "error": error_msg,
                "transcribed_text": "",
                "chatbot_response": ""
            }
        )
        
    except Exception as e:
        error_msg = f"{type(e).__name__}: {str(e)}"
        print(f"\n[ERROR] {error_msg}")
        print(f"  File path: {file_path}")
        print(traceback.format_exc())
        print(f"{'='*60}\n")
        
        return JSONResponse(
            status_code=400,
            content={
                "error": error_msg,
                "transcribed_text": "",
                "chatbot_response": ""
            }
        )
    finally:
        # Clean up temp file
        if file_path and os.path.exists(file_path):
            try:
                os.remove(file_path)
                print(f"[CLEANUP] Removed: {file_path}\n")
            except Exception as e:
                print(f"[CLEANUP] Failed to remove {file_path}: {e}\n")


from pydantic import BaseModel

class TextMessage(BaseModel):
    message: str
    history: list = []

@app.post("/chat")
async def chat_text(data: TextMessage):
    """
    Send a text message and get AI chatbot response.
    
    - **message**: Text message to send to the chatbot
    - **history**: Previous conversation messages [{"role": "user"/"assistant", "content": "..."}]
    - Returns: Chatbot response
    """
    try:
        print(f"\n{'='*60}")
        print(f"[TEXT CHAT] Received message: {data.message[:50]}...")
        print(f"[TEXT CHAT] History length: {len(data.history)} messages")
        
        # Generate AI chatbot response with history
        chatbot_response = generate_chatbot_response(data.message, data.history)
        print(f"  ✓ Success")
        print(f"{'='*60}\n")
        
        return {
            "user_message": data.message,
            "chatbot_response": chatbot_response
        }
        
    except Exception as e:
        error_msg = f"{type(e).__name__}: {str(e)}"
        print(f"\n[ERROR] {error_msg}")
        print(traceback.format_exc())
        print(f"{'='*60}\n")
        
        return JSONResponse(
            status_code=400,
            content={
                "error": error_msg,
                "chatbot_response": ""
            }
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
