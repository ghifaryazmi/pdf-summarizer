import openai
import os


class SummarizationError(Exception):
    """Custom exception for summarization errors."""
    pass


STYLE_PROMPTS = {
    'executive': (
        "Write an executive summary. Use formal, professional tone. "
        "Start with the main conclusion/recommendation, then supporting points. "
        "Focus on decisions, outcomes, and strategic implications. "
        "Use concise paragraphs."
    ),
    'student': (
        "Write study notes for a student. Use clear, educational tone. "
        "Organize with bullet points and key terms highlighted. "
        "Include definitions of important concepts. "
        "Focus on main ideas, supporting details, and relationships between concepts."
    ),
    'action_items': (
        "Extract and list all action items, tasks, and next steps from the text. "
        "Format as a numbered list. Each item should be a clear, actionable statement. "
        "Include who is responsible (if mentioned) and any deadlines. "
        "If no explicit action items exist, infer logical next steps from the content."
    ),
}


def summarize(text, style='executive'):
    """Generates an AI summary of the text in the requested style.

    Args:
        text: The extracted text to summarize.
        style: One of 'executive', 'student', 'action_items'.

    Returns:
        The summary string.

    Raises:
        SummarizationError: If the AI service is unavailable or times out.
    """
    if len(text) < 100:
        return text

    style_instruction = STYLE_PROMPTS.get(style, STYLE_PROMPTS['executive'])

    client_kwargs = {'api_key': os.getenv('OPENAI_API_KEY')}
    base_url = os.getenv('OPENAI_BASE_URL')
    if base_url:
        client_kwargs['base_url'] = base_url

    client = openai.OpenAI(**client_kwargs)

    try:
        response = client.chat.completions.create(
            model=os.getenv('OPENAI_MODEL', 'gpt-4o-mini'),
            messages=[
                {
                    "role": "system",
                    "content": (
                        f"You are a document summarizer. "
                        f"{style_instruction} "
                        f"Output only the summary with no preamble."
                    )
                },
                {"role": "user", "content": text}
            ],
            timeout=60,
        )
        summary = response.choices[0].message.content
        if not summary or not summary.strip():
            raise SummarizationError(
                "Summarization returned an empty result. Please try again."
            )
        return summary.strip()

    except openai.APIConnectionError:
        raise SummarizationError(
            "Summarization service is currently unavailable. Please try again later."
        )
    except openai.RateLimitError:
        raise SummarizationError(
            "Summarization service is currently unavailable. Please try again later."
        )
    except openai.APITimeoutError:
        raise SummarizationError(
            "Summarization request timed out. Please try again later."
        )
    except SummarizationError:
        raise
    except Exception:
        raise SummarizationError(
            "Summarization service is currently unavailable. Please try again later."
        )
