---
name: run-clean-house
description: Build, run, and drive the clean-house static site(s) (index.html - the universoul.ai landing page). Use when asked to start the site, take a screenshot of it, test the contact form, or interact with its UI.
---

This repo has no build step and no dev server framework — `index.html` is a
self-contained static page. "Running" it means serving the repo over plain
HTTP and driving a headless Chromium against it. `chromium-cli` is not
available in this container, so drive it via the Playwright REPL at
`.claude/skills/run-clean-house/driver.cjs` instead.

All paths below are relative to the repo root (`clean-house/`).

## Prerequisites

Already satisfied in this container — `node`, `python3`, `tmux`, and a
pre-installed Chromium for Playwright (`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`)
are all present, and `playwright` is installed globally (`npm ls -g playwright`).
Nothing to install.

On a machine without that global install:

```bash
npm install -g playwright
npx playwright install --with-deps chromium
```

## Build

None — static HTML/CSS/JS, no compile step.

## Run (agent path)

1. Serve the repo root over HTTP (kill any stale listener on the port first):

```bash
lsof -ti:8080 -sTCP:LISTEN | xargs -r kill
python3 -m http.server 8080 >/tmp/clean-house-server.log 2>&1 &
disown
timeout 15 bash -c 'until curl -sf http://localhost:8080/index.html >/dev/null; do sleep 0.5; done'
```

2. Launch the driver. It's CommonJS (`.cjs`), not ESM — Node's ESM resolver
   ignores `NODE_PATH`, so `require('playwright')` only resolves against the
   global install if you export `NODE_PATH` first (see Gotchas):

```bash
tmux new-session -d -s app -x 200 -y 50
tmux send-keys -t app 'cd /home/user/clean-house && NODE_PATH="$(npm root -g)" node .claude/skills/run-clean-house/driver.cjs' Enter
timeout 20 bash -c 'until tmux capture-pane -t app -p | grep -q "driver>"; do sleep 0.2; done'
tmux send-keys -t app 'launch' Enter
timeout 30 bash -c 'until tmux capture-pane -t app -p | grep -q "launched"; do sleep 0.2; done'
tmux send-keys -t app 'nav http://localhost:8080/index.html' Enter
timeout 20 bash -c 'until tmux capture-pane -t app -p | grep -q "nav ->"; do sleep 0.2; done'
tmux send-keys -t app 'ss 01-landing' Enter
timeout 10 bash -c 'until tmux capture-pane -t app -p | grep -q "screenshot:"; do sleep 0.2; done'
tmux capture-pane -t app -p
```

Screenshots land in `/tmp/shots/` (override with `SCREENSHOT_DIR`).

Stop when done:

```bash
tmux send-keys -t app 'quit' Enter
tmux kill-session -t app
lsof -ti:8080 -sTCP:LISTEN | xargs -r kill
```

### Driver commands

| command | what it does |
|---|---|
| `launch` | launch headless Chromium |
| `nav <url>` | navigate, prints page title |
| `ss [name]` | full-page screenshot -> `/tmp/shots/<name>.png` |
| `click <css-sel>` | click the first matching element |
| `fill <css-sel> <text>` | fill an input/textarea |
| `press <key>` | keyboard press (e.g. `Enter`) |
| `wait <css-sel>` | wait up to 10s for element to be visible |
| `wait-hidden <css-sel>` | wait up to 10s for element to become hidden |
| `eval <js-expr>` | evaluate JS in the page, print JSON result |
| `text [css-sel]` | print `innerText` of selector (or whole body) |
| `console` | print collected `console.error`/`pageerror` messages |
| `quit` | close the browser |

### Verified interaction (contact form)

This is the one real interactive flow on the site — filling and submitting
the "Book a free discovery call" form:

```
fill #fname Alex
fill #lname Johnson
fill #email alex@example.com
fill #biz Test Co
eval document.querySelector('#interest').value='AI Content Systems'
ss 02-filled
click button[type=submit]
ss 03-after-submit
console
```

`console` reported no errors. See Gotchas below for what the post-submit
screenshot actually shows.

## Run (human path)

```bash
python3 -m http.server 8080   # then open http://localhost:8080/index.html
```

Ctrl-C to stop. `sneaker-souk.html` is a 1-byte stub — currently empty,
nothing to view or drive there.

## Test

No test suite in this repo (no `package.json`, no CI config).

## Gotchas

- **`chromium-cli` isn't installed in this container** — confirmed with
  `command -v chromium-cli` (not found, nothing under `/`). `driver.cjs`
  drives Chromium directly via the globally-installed `playwright` package
  instead.
- **The driver must be CommonJS, not ESM.** An `.mjs` version fails with
  `ERR_MODULE_NOT_FOUND ... Did you mean to import "playwright/index.js"`
  because Node's ESM resolver ignores `NODE_PATH`. CJS `require()` does
  respect it — confirmed both ways in this container. Always
  `export NODE_PATH="$(npm root -g)"` (or inline it) before launching.
- **The success message never actually appears — this is a real bug in
  `index.html`, not the driver.** `#successMsg` is nested *inside*
  `<form id="contactForm">`. `handleSubmit()` sets `contactForm.style.display
  = 'none'` and `successMsg.style.display = 'block'`, but since a
  `display:none` ancestor hides its whole subtree, the success message is
  hidden along with the form it's inside. `wait #successMsg` times out even
  though `eval` confirms `successMsg.style.display === "block"` — and
  `ss 03-after-submit` shows the entire contact card go blank instead of a
  success banner. To actually fix it, `successMsg` needs to be a sibling of
  `contactForm`, not a child.
- **Stale port 8080 listener.** If a previous server run wasn't killed, the
  new `python3 -m http.server` either fails to bind or the `curl` poll hits
  old content. Always `lsof -ti:8080 -sTCP:LISTEN | xargs -r kill` before
  starting.

## Troubleshooting

- **`Cannot find module 'playwright'`**: `NODE_PATH` wasn't exported before
  launching `driver.cjs`. Run `export NODE_PATH="$(npm root -g)"` in the
  same shell/tmux pane first.
- **`curl` poll never succeeds**: the `python3 -m http.server` background
  job didn't start — check `/tmp/clean-house-server.log` and that port 8080
  wasn't already bound by something else.
