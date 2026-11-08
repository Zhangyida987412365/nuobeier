#!/usr/bin/env python3
"""Validate editorial content and generate the browser's offline-friendly data bundle."""
import argparse
import json
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent.parent
CATEGORIES = {"金融市场", "宏观政策", "计量方法", "博弈与制度", "增长与发展", "行为与决策"}
FINANCE = {"直接相关", "研究工具", "理解背景"}
EXPECTED_NAMES = [2, 1, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 2, 3, 1, 2, 2, 1, 1, 2, 3, 2, 2, 2, 2, 1, 3, 1, 2, 3, 2, 2, 3, 1, 1, 2, 1, 2, 3, 2, 3, 3, 1, 3, 3, 2]


def validate(data):
    assert len(data) == 58, f"Expected 58 awards, got {len(data)}"
    assert [a["year"] for a in data] == list(range(1969, 2027)), "Missing or duplicate years"
    names = []
    for item, count in zip(data, EXPECTED_NAMES):
        year = item["year"]
        for field in ("title", "award", "question", "intuition", "example"):
            assert isinstance(item[field], str) and item[field].strip(), f"{year}: empty {field}"
        assert item["category"] in CATEGORIES
        assert item["finance"] in FINANCE
        assert len(item["names"]) == count, f"{year}: expected {count} laureates"
        names.extend(item["names"])
        for field, n in (("applications", 3), ("limits", 2), ("keywords", 4)):
            assert len(item[field]) == n and all(isinstance(x, str) and x.strip() for x in item[field]), f"{year}: invalid {field}"
        assert item["exercise"]["question"].strip() and item["exercise"]["answer"].strip()
        assert len(item["sources"]) >= 2
        for source in item["sources"]:
            assert source["label"].strip()
            assert urlparse(source["url"]).scheme == "https", f"{year}: invalid source"
            assert any(host in urlparse(source["url"]).netloc for host in ("nobelprize.org", "kva.se", "riksbank.se")), f"{year}: non-primary source"
        assert not any(token in item["intuition"] for token in ("TODO", "待补充", "占位")), f"{year}: placeholder"
    assert len(names) == 101, f"Expected 101 laureates, got {len(names)}"
    return len(names)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--research-dir", type=Path)
    args = parser.parse_args()
    if args.research_dir:
        data = []
        for filename in ("content-1969-1989.json", "content-1990-2009.json", "content-2010-2026.json"):
            data.extend(json.loads((args.research_dir / filename).read_text(encoding="utf-8")))
        data.sort(key=lambda item: item["year"])
    else:
        data = json.loads((ROOT / "content.json").read_text(encoding="utf-8"))
    names = validate(data)
    (ROOT / "content.json").write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    payload = json.dumps(data, ensure_ascii=False, separators=(",", ":")).replace("<", "\\u003c").replace("\u2028", "\\u2028").replace("\u2029", "\\u2029")
    (ROOT / "data.js").write_text("window.ECON_DATA = " + payload + ";\n", encoding="utf-8")
    print(json.dumps({"awards": len(data), "laureates": names, "years": [data[0]["year"], data[-1]["year"]], "sections_per_award": 7, "interactive_labs": 4, "bundle_bytes": (ROOT / "data.js").stat().st_size}, ensure_ascii=False))


if __name__ == "__main__":
    main()
