from flask import Blueprint, request, jsonify
from .upload_handler import validate, ValidationError
from .pdf_processor import extract_text, ExtractionError
from .summarizer import summarize, SummarizationError

api_bp = Blueprint('api', __name__)


@api_bp.route('/api/summarize', methods=['POST'])
def summarize_pdf():
    """POST /api/summarize - Accept a PDF file and return an AI-generated summary."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided.'}), 400

    file = request.files['file']
    style_option = request.form.get('style', 'executive')

    if style_option not in ('executive', 'student', 'action_items'):
        style_option = 'executive'

    try:
        validated_file = validate(file)
        text, page_count = extract_text(validated_file)
        summary = summarize(text, style_option)
    except ValidationError as e:
        return jsonify({'error': e.message}), e.status_code
    except ExtractionError as e:
        return jsonify({'error': str(e)}), 422
    except SummarizationError as e:
        return jsonify({'error': str(e)}), 503

    return jsonify({
        'summary': summary,
        'page_count': page_count,
        'original_length': len(text)
    })
