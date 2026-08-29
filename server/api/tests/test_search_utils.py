import unittest

from api.utils.search_utils import search_session_messages

M = [
    {"role": "user", "content": "How do I center a div in CSS?"},
    {"role": "bot", "content": "Use flexbox: display:flex; justify-content:center."},
]


class SearchSessionMessages(unittest.TestCase):
    def test_empty_query_returns_empty(self):
        self.assertEqual(search_session_messages(M, ""), [])

    def test_whitespace_query_returns_empty(self):
        self.assertEqual(search_session_messages(M, "   "), [])

    def test_no_match_returns_empty(self):
        self.assertEqual(search_session_messages(M, "python"), [])

    def test_basic_match_role_and_index(self):
        r = search_session_messages(M, "flexbox")
        self.assertEqual(len(r), 1)
        self.assertEqual(r[0]["role"], "bot")
        self.assertEqual(r[0]["index"], 1)
        self.assertIn("flexbox", r[0]["snippet"].lower())

    def test_case_insensitive(self):
        self.assertEqual(len(search_session_messages(M, "CSS")), 1)
        self.assertEqual(len(search_session_messages(M, "css")), 1)

    def test_match_start_points_at_needle(self):
        r = search_session_messages(
            [{"role": "user", "content": "abc TARGET xyz"}], "TARGET", context=100
        )
        s = r[0]
        self.assertEqual(s["snippet"][s["match_start"]:s["match_start"] + 6], "TARGET")

    def test_long_content_trimmed_with_ellipsis(self):
        long = "x" * 100 + "NEEDLE" + "y" * 100
        snip = search_session_messages(
            [{"role": "bot", "content": long}], "NEEDLE", context=10
        )[0]["snippet"]
        self.assertTrue(snip.startswith("…") and snip.endswith("…"))
        self.assertIn("NEEDLE", snip)

    def test_short_content_no_ellipsis(self):
        snip = search_session_messages(
            [{"role": "bot", "content": "hi NEEDLE"}], "NEEDLE", context=40
        )[0]["snippet"]
        self.assertFalse(snip.startswith("…") or snip.endswith("…"))

    def test_max_snippets_cap(self):
        msgs = [{"role": "user", "content": "match here"} for _ in range(5)]
        self.assertEqual(len(search_session_messages(msgs, "match", max_snippets=3)), 3)

    def test_non_string_content_skipped(self):
        msgs = [
            {"role": "user"},
            {"role": "bot", "content": None},
            {"role": "user", "content": "has match"},
        ]
        r = search_session_messages(msgs, "match")
        self.assertEqual(len(r), 1)
        self.assertEqual(r[0]["index"], 2)


if __name__ == "__main__":
    unittest.main()
