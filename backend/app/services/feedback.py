from app.schemas.assessment import PronunciationIssue


class FeedbackService:
    async def explain(self, transcript: str, scores: dict, issues: list[PronunciationIssue]) -> dict:
        issue_words = [issue.word for issue in issues[:5]]
        strengths = [
            "Your delivery maintains a clear sentence structure.",
            "Most words are understandable with consistent volume.",
        ]
        improvements = [
            "Slow down slightly on longer words and keep vowel sounds open.",
            "Add a short pause between ideas to improve rhythm and listener confidence.",
        ]
        if issue_words:
            improvements.insert(0, f"Practice the highlighted words: {', '.join(issue_words)}.")
        return {
            "strengths": strengths,
            "improvements": improvements,
            "feedback": (
                "Your pronunciation is understandable and close to conversational fluency. "
                "The biggest gains will come from cleaner stress on multi-syllable words, "
                "steadier pacing, and repeating the low-confidence words in short drills."
            ),
            "wordsToRepeat": issue_words,
        }
