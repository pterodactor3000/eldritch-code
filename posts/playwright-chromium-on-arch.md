---
title: "The curse of Playwright CLI and Chromium on Arch"
date: 2026-06-06
tags: [playwright, chromium, cursor, ai, linux, arch, cachyos]
category: configuration
---

I needed `playwright-cli` for agent browser automation on CachyOS. It failed immediately, not because Chromium was missing. It was looking in the _wrong place_...

## Known unknowns

When `playwright-cli open` refused to launch a browser, I assumed the install was broken. It wasn't.

The global `@playwright/cli` agent tool defaults to the **`chrome` channel**, real Google Chrome at `/opt/google/chrome/chrome`. On Arch that path is usually empty. Most of us run system Chromium from `/usr/bin/chromium` instead. First noticed on CachyOS. The behavior is **by design**, not a local misconfiguration.

## The immutable truths

| Step | Detail |
|------|--------|
| System | Arch-based distribution (CachyOS) |
| Shell | Fish (default on CachyOS) |
| System Chromium | `/usr/bin/chromium` - installed via package manager |
| Google Chrome | *not installed* - expected by default `chrome` channel |
| Agent tool | Global `@playwright/cli` v0.1.13 - separate from project E2E config |

## The curse!

The agent CLI asks for Google Chrome. On Arch, that goes wrong fast. The steps:

1. `playwright-cli open https://example.com`
2. CLI reaches for the **`chrome` channel**, not system Chromium
3. It checks `/opt/google/chrome/chrome`
4. Nothing there. No window opens.

What the logs said:

```text
Error: Chromium distribution 'chrome' is not found at /opt/google/chrome/chrome
Run "npx playwright install chrome"
```

The path is wrong. Chromium is elsewhere. The daemon gives up.

The curse is narrow, at least. The project's `playwright.config.ts` was **never touched**. E2E tests already aim at `/usr/bin/chromium` and Vivaldi through `launchOptions.executablePath`. The **global agent CLI** (`playwright-cli`) suffers here. But not as much as I did.

## Cause of our demise

The default channel is hard-coded. The CLI expects Google Chrome. Arch ships Chromium. _Same binary family, wrong path._

| Item | Detail |
|------|--------|
| **Source** | Global `@playwright/cli` v0.1.13 - not the project's Playwright test config |
| **Default behavior** | Tries to launch the **`chrome` channel** (real Google Chrome) |
| **Expected path** | `/opt/google/chrome/chrome` |
| **Typical Arch setup** | System Chromium at `/usr/bin/chromium`, no Google Chrome installed |
| **Impact** | Agent CLI **cannot launch any browser** without explicit configuration |

### Browsers available on this system

| Browser | Path | Notes |
|---------|------|-------|
| Chromium (system) | `/usr/bin/chromium` | Installed via package manager |
| Vivaldi | `/usr/bin/vivaldi-stable` → `/opt/vivaldi/vivaldi` | Chromium-based |
| Google Chrome | *not installed* | Expected by default `chrome` channel |
| Playwright bundled | `~/.cache/ms-playwright/chromium-1223/` | Downloaded by `npx playwright install` |

What I tried:

| Approach | Result |
|----------|--------|
| `--browser=chromium` | Failed - CLI expects `chrome-for-testing`, not the bundled Playwright Chromium |
| `PLAYWRIGHT_MCP_EXECUTABLE_PATH=/usr/bin/chromium` | **Works** - launches system Chromium with no download |
| `source ~/.zshrc` in fish | Failed - fish cannot parse zsh syntax (see below) |

## Recommended way of making us whole

Point the CLI at system Chromium. Set `PLAYWRIGHT_MCP_EXECUTABLE_PATH` and the default channel lookup never fires.

### 1. Bind the path in Fish

A universal exported variable survives every new fish session:

```fish
set -Ux PLAYWRIGHT_MCP_EXECUTABLE_PATH /usr/bin/chromium
```

Verify:

```fish
echo $PLAYWRIGHT_MCP_EXECUTABLE_PATH
playwright-cli open https://example.com
```

Remove later if needed:

```fish
set -Ue PLAYWRIGHT_MCP_EXECUTABLE_PATH
```

### 2. Bind the path in Zsh or Bash

Add to `~/.zshrc` or `~/.bashrc`:

```bash
export PLAYWRIGHT_MCP_EXECUTABLE_PATH=/usr/bin/chromium
```

One-off, any shell:

```bash
PLAYWRIGHT_MCP_EXECUTABLE_PATH=/usr/bin/chromium playwright-cli open https://example.com
```

### 3. Resurrect the daemon

Open a fresh terminal, then run `playwright-cli open` once more. The page should load.

## From different works, from libraries far and wide

If you prefer not to set the env var, three other paths remain, each with a cost:

| Option | Command | When to use |
|--------|---------|-------------|
| **System Chromium** (chosen) | `set -Ux PLAYWRIGHT_MCP_EXECUTABLE_PATH /usr/bin/chromium` | No download; uses existing package |
| **Chrome-for-testing** | `playwright-cli install-browser chrome-for-testing` | Playwright-managed browser for the CLI |
| **Google Chrome** | `npx playwright install chrome` | Makes the default `chrome` channel work as-is |

### Project E2E config (unchanged)

The project's `playwright.config.ts` already names its browsers explicitly and never depended on the `chrome` channel:

```ts
projects: [
  {
    name: 'chromium',
    use: {
      ...devices['Desktop Chrome'],
      launchOptions: { executablePath: '/usr/bin/chromium' },
    },
  },
  {
    name: 'vivaldi',
    use: {
      launchOptions: { executablePath: '/usr/bin/vivaldi-stable' },
    },
  },
],
```

Run E2E tests with:

```bash
npx playwright test
```

That uses the project's local `@playwright/test` dependency, separate from the global `@playwright/cli` agent tool.

## Why would this way work?

| Approach | Browser source | Arch / CachyOS impact |
|----------|----------------|----------------------|
| Default `chrome` channel | Google Chrome at `/opt/google/chrome/chrome` | Broken - Chrome not installed on typical Arch setups |
| `PLAYWRIGHT_MCP_EXECUTABLE_PATH` | System Chromium at `/usr/bin/chromium` | Works - no download; uses existing package |
| `chrome-for-testing` install | Playwright-managed browser | Works - but requires a separate download |
| Project `playwright.config.ts` | Explicit `executablePath` per project | Unaffected - already configured correctly |

## Beware of the unseen

- **Do not source `~/.zshrc` from fish.** I made that mistake once. Fish cannot parse zsh syntax:

  ```text
  Unsupported use of '='. In fish, please use 'set DISABLE_MAGIC_FUNCTIONS "true"'.
  ```

  Use the fish universal variable above instead.

- The global `@playwright/cli` and the project's `@playwright/test` are separate tools. Fixing one does not fix the other. In my case, only the CLI needed attention.

## Grimoires and scrolls used in esoteric research

- [@playwright/cli npm package](https://www.npmjs.com/package/@playwright/cli) - documents the global agent CLI and its default browser channels.
- [Playwright browser channels documentation](https://playwright.dev/docs/browsers) - distinguishes `chromium`, `chrome`, and `chrome-for-testing`.
