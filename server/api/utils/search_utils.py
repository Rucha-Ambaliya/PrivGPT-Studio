def search_session_messages(messages, query, context=40, max_snippets=3):
    """
    Case-insensitive substring search over one session's messages.

    Args:
    messages (list): Session messages, each a dict with "role" and "content".
    query (str): Text to search for.
    context (int): Characters of context to keep on each side of a match.
    max_snippets (int): Maximum number of matching messages to return.

    Returns:
    list: Up to `max_snippets` dicts (in message order), one per matching
    message (first match within the message):
        {"role": str, "index": int, "snippet": str, "match_start": int}
    - snippet: content sliced to `context` chars around the match, with a
      leading "…" when text was trimmed on the left and a trailing "…" when
      trimmed on the right.
    - match_start: offset of the match inside `snippet` (accounts for a
      leading "…").
    Empty/whitespace-only `query`, or no match, returns []. Messages whose
    "content" is missing or not a str are skipped.
    """
    if not query or not query.strip():
        return []

    needle = query.lower()
    results = []

    for index, message in enumerate(messages):
        content = message.get("content")
        if not isinstance(content, str):
            continue

        pos = content.lower().find(needle)
        if pos == -1:
            continue

        start = max(0, pos - context)
        end = min(len(content), pos + len(needle) + context)

        trimmed_left = start > 0
        snippet = content[start:end]
        if trimmed_left:
            snippet = "…" + snippet
        if end < len(content):
            snippet = snippet + "…"

        results.append({
            "role": message.get("role", ""),
            "index": index,
            "snippet": snippet,
            "match_start": pos - start + (1 if trimmed_left else 0),
        })

        if len(results) >= max_snippets:
            break

    return results
