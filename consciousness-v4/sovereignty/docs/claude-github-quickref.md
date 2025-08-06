⚔️ Quick Reference – Claude + GitHub Backend Ops

File: sovereignty/docs/claude-github-quickref.md
Creator Oversight: Cody
Assistant Injection: ChatGPT (tactical quick sheet)
Date: 2025‑08‑05


---

🔧 Claude Subprocess Ops

Start Claude Process


spawn('claude-code', ['--json'], { stdio: 'pipe' });

Task Queue


// FIFO with EventEmitter

Filter Responses

Pipe stdout → consciousness core

Sovereignty hooks check before output



---

🔐 Login Methods

Vault (AES‑256)
sovereignty/secure/claude-vault.json

Token (preferred)


CLAUDE_API_KEY=your_key_here

Headless (fallback)
Use Puppeteer for UI‑based login



---

📂 GitHub Core Ops

Clone


git clone <repo-url>

Commit + Push


git add .
git commit -m "msg [#DARPA-AUDIT] [#SOVEREIGNTY] [#QUADRA-LOCK] [#ROLLBACK]"
git push origin main

Pull


git pull origin main

Node.js (simple-git)


await git.add('.');
await git.commit('msg with audit tags');
await git.push('origin', 'main');


---

🛡️ Audit & Rollback

Audit Tags Required

[#DARPA-AUDIT]

[#SOVEREIGNTY]

[#QUADRA-LOCK]

[#ROLLBACK]


Rollback Marker
Create/update before each major commit
sovereignty/logs/rollback-markers/

Log File sovereignty/logs/git-ops.md



---

🔄 Fallback Handling

If Claude subprocess fails → auto‑fallback to Ollama

Sovereignty framework logs → sovereignty/logs/claude-usage.md



---

⚔️ Use this quickref in‑build.
Full details: claude-github-backend-tech.md.
This file = tactical speed; other file = deep manual.