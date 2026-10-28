#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""deploy_gh.py — 把本项目推上 GitHub Pages（用 REST API 做【单次提交】）

★ 为什么不用 git push：本沙箱到 github.com:443 不通，但 api.github.com 通。
★ 为什么用 Git Trees API 一次提交而不是逐文件 PUT：只触发 1 次 Pages 构建，
  且切换是原子的，站点上不会出现「新 JS + 旧 HTML」的混合态。

用法:
  GITHUB_KEY=xxx python3 tools/deploy_gh.py                # 默认 hubiqi/pelican-test
  GITHUB_KEY=xxx python3 tools/deploy_gh.py owner/repo
"""
import base64
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

KEY = os.environ.get("GITHUB_KEY")
if not KEY:
    sys.exit("缺少 GITHUB_KEY")
API = "https://api.github.com"

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO = sys.argv[1] if len(sys.argv) > 1 else "hubiqi/pelican-test"
BRANCH = "main"
SKIP_DIRS = {".git", "node_modules", "frames", "out", "__pycache__", ".cache"}
SKIP_EXT = {".mp4", ".mov", ".log"}


def req(method, path, body=None, ok404=False, ok=()):
    url = API + path
    data = json.dumps(body).encode() if body is not None else None
    r = urllib.request.Request(url, data=data, method=method)
    r.add_header("Authorization", "token " + KEY)
    r.add_header("Accept", "application/vnd.github+json")
    if data:
        r.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(r, timeout=120) as resp:
            raw = resp.read()
            return resp.status, (json.loads(raw) if raw else {})
    except urllib.error.HTTPError as e:
        raw = e.read()
        if ok404 and e.code == 404:
            return 404, {}
        if e.code in ok:
            return e.code, {}
        print(f"!! {method} {path} -> {e.code}\n{raw[:600].decode('utf-8', 'replace')}", file=sys.stderr)
        raise


def collect():
    out = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for fn in filenames:
            if fn == ".DS_Store":
                continue
            ext = os.path.splitext(fn)[1].lower()
            if ext in SKIP_EXT:
                continue
            full = os.path.join(dirpath, fn)
            rel = os.path.relpath(full, ROOT).replace(os.sep, "/")
            with open(full, "rb") as f:
                out.append((rel, f.read()))
    out.sort()
    return out


def main():
    files = collect()
    print(f"本地 {len(files)} 个文件，目标 {REPO}:{BRANCH}")

    # 1. 仓库
    st, _ = req("GET", f"/repos/{REPO}", ok404=True)
    if st == 404:
        owner, name = REPO.split("/")
        me = req("GET", "/user")[1]["login"]
        if owner != me:
            sys.exit(f"仓库不存在，且当前的 token 属于 {me}，无法在 {owner} 下创建")
        req("POST", "/user/repos", {
            "name": name,
            "description": "《鹈鹕测试》— 一只骑自行车的鹈鹕，穿过 20 种艺术风格（程序生成短片）",
            "private": False, "auto_init": False,
        })
        print("✓ 已创建仓库", REPO)

    # 1.5 空仓库要先种一个初始提交（Git Data API 在空仓库上会 409）
    st, _ = req("GET", f"/repos/{REPO}/git/ref/heads/{BRANCH}", ok404=True, ok=(409,))
    if st in (404, 409):
        req("PUT", f"/repos/{REPO}/contents/README.md", {
            "message": "init", "content": base64.b64encode("# pelican-test\n".encode()).decode(),
        })
        print("✓ 种下初始提交（空仓库）")

    # 2. blobs
    tree = []
    for rel, data in files:
        _, r = req("POST", f"/repos/{REPO}/git/blobs", {
            "content": base64.b64encode(data).decode("ascii"),
            "encoding": "base64",
        })
        tree.append({"path": rel, "mode": "100644", "type": "blob", "sha": r["sha"]})
    print(f"✓ 上传 {len(tree)} 个 blob")

    # 3. tree
    _, t = req("POST", f"/repos/{REPO}/git/trees", {"tree": tree})
    print("✓ 建 tree", t["sha"][:10])

    # 4. commit
    st, ref = req("GET", f"/repos/{REPO}/git/ref/heads/{BRANCH}", ok404=True)
    parents = [ref["object"]["sha"]] if st == 200 else []
    msg = time.strftime("deploy: %Y-%m-%d %H:%M")
    _, c = req("POST", f"/repos/{REPO}/git/commits", {
        "message": msg, "tree": t["sha"], "parents": parents,
    })
    if parents:
        req("PATCH", f"/repos/{REPO}/git/refs/heads/{BRANCH}", {"sha": c["sha"], "force": False})
    else:
        req("POST", f"/repos/{REPO}/git/refs", {"ref": f"refs/heads/{BRANCH}", "sha": c["sha"]})
    print("✓ 提交", c["sha"][:10], msg)

    # 5. Pages（开启或重建）
    st, _ = req("GET", f"/repos/{REPO}/pages", ok404=True)
    if st == 404:
        req("POST", f"/repos/{REPO}/pages", {"source": {"branch": BRANCH, "path": "/"}})
        print("✓ 已开启 GitHub Pages")
    else:
        try:
            req("PUT", f"/repos/{REPO}/pages", {"source": {"branch": BRANCH, "path": "/"}})
            print("✓ Pages 已指向", BRANCH, "/")
        except Exception:
            print("· Pages 已是目标分支")

    owner, name = REPO.split("/")
    print(f"→ https://{owner}.github.io/{name}/public/index.html")
    print(f"→ 接触表 https://{owner}.github.io/{name}/public/sheet.html")


if __name__ == "__main__":
    main()
