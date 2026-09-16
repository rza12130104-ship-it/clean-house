#!/usr/bin/env node
// REPL driver for the clean-house static site(s). Run under Node with
// NODE_PATH set to the global node_modules dir (see SKILL.md) so the
// globally-installed `playwright` package resolves.
// Designed for agents: wrap in tmux, send-keys commands, capture-pane output.
'use strict';

const { chromium } = require('playwright');
const readline = require('node:readline');
const fs = require('node:fs');
const path = require('node:path');

const SHOT_DIR = process.env.SCREENSHOT_DIR || '/tmp/shots';
fs.mkdirSync(SHOT_DIR, { recursive: true });

let browser = null;
let page = null;
let consoleErrors = [];

const COMMANDS = {
  async launch() {
    if (browser) return console.log('already launched');
    browser = await chromium.launch({ args: ['--no-sandbox'] });
    const context = await browser.newContext();
    page = await context.newPage();
    consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => consoleErrors.push(String(err)));
    console.log('launched.');
  },

  async nav(url) {
    if (!page) return console.log('ERROR: launch first');
    await page.goto(url, { waitUntil: 'load', timeout: 30_000 });
    console.log('nav ->', url, 'title:', await page.title());
  },

  async ss(name) {
    if (!page) return console.log('ERROR: launch first');
    const f = path.join(SHOT_DIR, (name || `ss-${Date.now()}`) + '.png');
    await page.screenshot({ path: f, fullPage: true });
    console.log('screenshot:', f);
  },

  async click(sel) {
    if (!page) return console.log('ERROR: launch first');
    try {
      await page.locator(sel).first().click({ timeout: 10_000 });
      console.log('click', sel, '-> OK');
    } catch (e) {
      console.log('click', sel, '-> ERROR:', e.message.split('\n')[0]);
    }
  },

  async fill(args) {
    if (!page) return console.log('ERROR: launch first');
    const sp = args.indexOf(' ');
    const sel = sp === -1 ? args : args.slice(0, sp);
    const text = sp === -1 ? '' : args.slice(sp + 1);
    try {
      await page.locator(sel).first().fill(text, { timeout: 10_000 });
      console.log('fill', sel, '->', JSON.stringify(text));
    } catch (e) {
      console.log('fill', sel, '-> ERROR:', e.message.split('\n')[0]);
    }
  },

  async press(key) {
    if (!page) return console.log('ERROR: launch first');
    await page.keyboard.press(key);
    console.log('press', key);
  },

  async wait(sel) {
    if (!page) return console.log('ERROR: launch first');
    try {
      await page.waitForSelector(sel, { timeout: 10_000 });
      console.log('found:', sel);
    } catch {
      console.log('TIMEOUT:', sel);
    }
  },

  async 'wait-hidden'(sel) {
    if (!page) return console.log('ERROR: launch first');
    try {
      await page.waitForSelector(sel, { state: 'hidden', timeout: 10_000 });
      console.log('hidden:', sel);
    } catch {
      console.log('TIMEOUT:', sel);
    }
  },

  async eval(expr) {
    if (!page) return console.log('ERROR: launch first');
    try {
      console.log(JSON.stringify(await page.evaluate(expr)));
    } catch (e) {
      console.log('ERROR:', e.message);
    }
  },

  async text(sel) {
    if (!page) return console.log('ERROR: launch first');
    console.log(
      await page.evaluate(
        (s) => (s ? document.querySelector(s) : document.body)?.innerText ?? '(null)',
        sel || null,
      ),
    );
  },

  async console() {
    if (consoleErrors.length === 0) return console.log('console: no errors');
    console.log('console errors:');
    for (const e of consoleErrors) console.log(' -', e);
  },

  async quit() {
    if (browser) await browser.close().catch(() => {});
    browser = null;
    page = null;
  },

  help() {
    console.log('commands:', Object.keys(COMMANDS).join(', '));
  },
};

const stdin = fs.createReadStream(null, { fd: fs.openSync('/dev/stdin', 'r') });
const rl = readline.createInterface({ input: stdin, output: process.stdout, prompt: 'driver> ' });

rl.on('line', async (line) => {
  const trimmed = line.trim();
  const sp = trimmed.indexOf(' ');
  const cmd = sp === -1 ? trimmed : trimmed.slice(0, sp);
  const rest = sp === -1 ? '' : trimmed.slice(sp + 1);
  if (!cmd) return rl.prompt();
  const fn = COMMANDS[cmd];
  if (!fn) {
    console.log('unknown:', cmd, '- try: help');
    return rl.prompt();
  }
  try {
    await fn(rest);
  } catch (e) {
    console.log('ERROR:', e.message);
  }
  if (cmd === 'quit') {
    rl.close();
    process.exit(0);
  }
  rl.prompt();
});
rl.on('close', async () => {
  await COMMANDS.quit();
  process.exit(0);
});

console.log('clean-house driver - "help" for commands, "launch" to start');
rl.prompt();
