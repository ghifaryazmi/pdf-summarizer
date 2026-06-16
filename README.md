# PDF Summarizer

Pdf Summarizer is built for professionals and students who receive PDFs they don’t have time to read in full, such as meeting notes, reports, research papers, and school documents. Its core purpose is simple: upload a PDF and get a useful summary without copy-pasting content or dealing with formatting issues. I chose this problem because I regularly need to quickly understand long PDF documents, and existing solutions are often paid, require manual work, or struggle with real-world files such as scanned documents and malformed PDFs.

The MVP focuses on reliable document summarization through PDF and HTML uploads, automatic text extraction (including OCR for scanned files), and three summary styles: Executive Summary, Student Notes, and Action Items. I intentionally left out features such as user accounts, history, and batch processing to keep the product focused on validating its core value. Success will be measured by fast summary generation, low extraction failure rates, and users returning to summarize multiple documents. Future improvements could include streaming responses, batch uploads, URL-based summarization, and analytics to better understand user behavior.

## How to run ?

```bash
git clone https://github.com/ghifaryazmi/pdf-summarizer.git
cd pdf-summarizer

# Backend
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Add your OPENAI_API_KEY
python run.py

# Frontend
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. Done.

Or with Docker (recommended):
```bash
cp backend/.env.example backend/.env  # Add your OPENAI_API_KEY
docker compose up --build -d
# Open http://localhost:8080
```

### Environment variables (`backend/.env`)
```
OPENAI_API_KEY=sk-your-key        # Required
OPENAI_BASE_URL=                   # Optional (for OpenRouter, custom endpoints)
OPENAI_MODEL=gpt-4o-mini           # Optional (default: gpt-4o-mini)
```

## How I used AI

AI (i use AI tools : Kiro) helped with: scaffolding the project structure, writing boilerplate React code, generating Tailwind UI markup. Also guide and assist me when doing the backend with Python. It saved significant time on my work.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Python 3.11, Flask, pdfplumber, PyPDF2, pikepdf, pytesseract |
| AI | OpenAI-compatible API (configurable) |
| Deploy | Docker Compose (Nginx + Gunicorn) |
