---
title: "The curse of Linear-Cursor MCP connection"
date: 2026-06-15
tags: [linear, cursor, mcp, oauth, linux, workaround]
category: configuration
---

I needed Linear in Cursor on Linux. The OAuth flow almost works, which is worse than it cleanly failing.

## Known unknowns

When the official Linear MCP plugin OAuth flow fails to complete, I assumed I’d misconfigured something. I hadn’t.

Originally encountered on an Arch-based system, but this is a **known, Cursor-staff-confirmed Linux bug** that also reproduces on Ubuntu, Debian, and Fedora across `.deb`, `.rpm`, and `.AppImage` installs.

## The immutable truths

| Step | Detail |
|------|--------|
| Cursor | Installed as an `.AppImage` on an Arch-based distribution |
| Linear account | Required for integration |
| Linear plugin | Installed in Cursor (Settings → MCP) |

## The curse!

Official Linear MCP tool uses browser OAuth. On Linux, that goes wrong fast. The sequence:

1. **Settings → MCP → Linear → Connect**.
2. Browser opens; you approve.
3. Browser asks to hand the `cursor://` URL back to Cursor - allow it
4. A second Cursor appears. No memory of the flow you just finished.

The handler fires. The other Cursor wakes up. Auth never lands. From the UI it looks like you never authorized, even though you did.

Even given that, the curse not only makes the Linear MCP tools lose their minds. Notion breaks the same way. Same `cursor://` redirect. _Same new window._

## Cause of our demise

The scheme handler exists. The failure is that the callback is delivered to a **fresh body**. And that body knows not of the handshake in motion.

| Item | Detail |
|------|--------|
| **Flow** | Browser-based OAuth → `cursor://` deep-link callback |
| **Expected behavior** | Callback attaches auth to the existing Cursor instance |
| **Actual behavior** | Callback spawns a fresh Cursor window with no MCP auth state |
| **Scheme handler** | `x-scheme-handler/cursor` is registered - not a missing-handler issue |
| **Impact** | Official plugin **Connect** button cannot finish authorization |

Notes from the forum:

| Command | Result |
|---------|--------|
| `xdg-open 'cursor://test'` | Opens a **new** window |
| `gio open 'cursor://test'` | Opens a **new** window |
| `/usr/share/cursor/cursor --open-url 'cursor://test'` | Does **not** open a new window (routes to the existing instance) |

What the logs said:

```text
OAuth provider needs auth callback during connection
Connect failed after auth_required; returning needsAuth
```

## Recommended way of making us whole

The API key route sidesteps the browser entirely. No callback, no twin window.

### 1. Remove the problem

In **Settings → MCP**, remove or disable the Linear plugin.

### 2. Create your own connection

Click **Add custom MCP** and copy the following:

```json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.linear.app/mcp"],
      "env": {
        "LINEAR_API_KEY": "<API_KEY>"
      }
    }
  }
}
```

Replace `<API_KEY>` with a personal API key from Linear:

**Linear → Settings → Security & access → New personal API key**

As per other forum posts:

> **Alternative server command.** Cursor staff suggested the local Linear server package instead of the `mcp-remote` proxy. Either works; pick one:
>
> ```json
> "args": ["-y", "@linear/mcp-server"]
> ```

### 3. Revive the Cursor

Restart Cursor if need be. Then confirm the Linear MCP sigils show as connected in **Settings → MCP**.

## From different works, from libraries far and wide

If you want to keep OAuth, the browser has to hand `cursor://` to the running Cursor, not spawn another. AppImage installs often lack a handler that does that. Register one with `--open-url`:

1. Create `~/.local/share/applications/cursor-url-handler.desktop`:

```ini
[Desktop Entry]
Name=Cursor URL Handler
Exec=/path/to/cursor --open-url %U
Type=Application
NoDisplay=true
MimeType=x-scheme-handler/cursor;
```

Replace `/path/to/cursor` with your AppImage path (or `/usr/share/cursor/cursor` for `.deb`/`.rpm` installs).

2. Acknowledge the scheme:

```bash
xdg-mime default cursor-url-handler.desktop 'x-scheme-handler/cursor'
```

> **Caveat.** Some browsers (e.g. Edge) do not invoke `xdg-open` the same way, so this workaround is not fully reliable. The API-key approach above avoids the callback altogether and is the more robust fix.

## Why would this way work?

| Approach | Auth method | Linux deep-link impact |
|----------|-------------|------------------------|
| Official plugin | OAuth via browser + `cursor://` callback | Broken - callback opens a new window and loses context |
| Custom MCP + API key | `LINEAR_API_KEY` in env | No browser redirect; works regardless of how Cursor is launched |

## Beware of the unseen

I keep MCP keys out of repos. If one leaks, I revoke it and rebind - same as any other token.

## Grimoires and scrolls used in esoteric research

- [MCP OAuth not completing on Ubuntu (cursor:// callback opens new window) - Cursor Community Forum](https://forum.cursor.com/t/mcp-oauth-not-completing-on-ubuntu-cursor-callback-opens-new-window/158832) Forum thread, confirmed new-window behavior on Ubuntu/Debian; staff pointed to the API-key path.
- [OAuth MCP login fails - Cursor Community Forum](https://forum.cursor.com/t/oauth-mcp-login-fails/135488/18) Second thread, Fedora/KDE + AppImage; documents the `--open-url` desktop entry.
