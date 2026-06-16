---
title: "The curse of Linear-Cursor MCP connection"
date: 2026-06-15
tags: [linear, cursor, ai, linux, arch]
category: configuration
---

In this scroll I record findings from connecting Linear to Cursor on Linux.

## Known unknowns

When the official Linear MCP plugin OAuth flow fails to complete, the cosmic realm writhes with pleasure. Originally encountered on an Arch-based system, but this is a **known, Cursor-staff-confirmed Linux bug** that also reproduces on Ubuntu, Debian, and Fedora across `.deb`, `.rpm`, and `.AppImage` installs.

## The immutable truths

| Step | Detail |
|------|--------|
| Cursor | Installed as an `.AppImage` on an Arch-based distribution |
| Linear account | Required for integration |
| Linear plugin | Installed in Cursor (Settings → MCP) |

## The curse!

Usage of official tools, like official Linear MCP artefact, uses an OAuth spell that does not bode well for Linux users. Presented as follows:

1. Navigate through the corridors of settings to **Settings → MCP → Linear**
2. With your dominating hand use your pointing device and click **Connect**
3. When the page of your esoteric browser opens, accept the authorization contract
4. You might be asked additional questions, if you allow the outer agent of esoterica to open the `cursor://(...)` callback URL in Cursor
5. As the magic happens, the application opens with a **new body**, that has no memory, no knowledge of your existing authorization contract context

That bewilders the ghost in the machine, and your authorization contract is never completed. The Linear MCP tool never receives the responses from the cosmic flow, and that makes it think you still need to authorize yourself within the depths.

Even given that, the curse not only makes the Linear MCP tools lose their wits in the dark. Other MCP server applications, like Notion, also feel the pain of `cursor://` redirect.

---

## Cause of our demise

The `cursor://` URL scheme handler **is** registered correctly. The failure is that the callback is delivered to a **new Cursor process/window** instead of being routed to the already-running instance that started the OAuth flow, so the in-flight auth session never receives the callback.

Handling rituals for `cursor://` scheme is being correctly registered. What fails is the response is being received by a **new** Cursor process, not the one that already dreams. This makes the dreamer stuck in the nightmare of no response.

| Item | Detail |
|------|--------|
| **Flow** | Browser-based OAuth → `cursor://` deep-link callback |
| **Expected behavior** | Callback attaches auth to the existing Cursor instance |
| **Actual behavior** | Callback spawns a fresh Cursor window with no MCP auth state |
| **Scheme handler** | `x-scheme-handler/cursor` is registered - not a missing-handler issue |
| **Impact** | Official plugin **Connect** button cannot finish authorization |

What other scholars in the unknown have found:

| Command | Result |
|---------|--------|
| `xdg-open 'cursor://test'` | Opens a **new** window |
| `gio open 'cursor://test'` | Opens a **new** window |
| `/usr/share/cursor/cursor --open-url 'cursor://test'` | Does **not** open a new window (routes correctly through the cosmos) |

What the tool creature itself records:

```text
OAuth provider needs auth callback during connection
Connect failed after auth_required; returning needsAuth
```

---

## Recommended way of making us whole

Get rid of the Linear curse from the affected Cursor tool. Following, create a **custom MCP** scroll with your personal API key bound. This will completely miss the browser interruptions, so the base curse is never being applied.

### 1. Purge the problematic parts

In **Settings → MCP**, remove or disable the Linear plugin.

### 2. Create your own connection scroll

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

As per other scholarly works:

> **Alternative server command.** Cursor staff suggested the local Linear server package instead of the `mcp-remote` proxy. Either works; pick one:
>
> ```json
> "args": ["-y", "@linear/mcp-server"]
> ```

### 3. Revive the Cursor

Restart Cursor if need be, then confirm the Linear MCP sigils show as connected in **Settings → MCP**.

## From different works, from libraries far and wide

If you would rather keep the OAuth flow contract, the underlying issue is that your browser doesn't command `cursor://` to the existing being. AppImage creations themselves in particular often lack a proper URL handler knowledge. Provide one that uses `--open-url`:

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

Though it does come with warnings from practitioners:

> **Caveat.** Some browsers (e.g. Edge) do not invoke `xdg-open` the same way, so this workaround is not fully reliable. The API-key approach above avoids the callback altogether and is the more robust fix.

## Why would this way work?

| Approach | Auth method | Linux deep-link impact |
|----------|-------------|------------------------|
| Official plugin | OAuth via browser + `cursor://` callback | Broken - callback opens a new window and loses context |
| Custom MCP + API key | `LINEAR_API_KEY` in env | No browser redirect; works regardless of how Cursor is launched |

The custom setup proxies Linear's hosted MCP endpoint (or runs the local server) and authenticates with a static API key, bypassing the broken deep-link callback entirely.
Your own customization of Linear's proxied existence and authentication with a statically written API key moves unseen by the deep-link callback prowlers.

---

## Beware of the unseen

- Treat the personal API key like the most valued of your possessions, make sure no one sees it and knows about it.
- If anybody sees your deepest secret, change its shape, form, or value! Whatever it takes, so your enemies know nothing!

---

## Grimoires and scrolls used in esoteric research

- [MCP OAuth not completing on Ubuntu (cursor:// callback opens new window) - Cursor Community Forum](https://forum.cursor.com/t/mcp-oauth-not-completing-on-ubuntu-cursor-callback-opens-new-window/158832) - confirms the new-window/new-process callback bug on Ubuntu and Debian; Cursor staff suggest the API-key workaround.
- [OAuth MCP login fails - Cursor Community Forum](https://forum.cursor.com/t/oauth-mcp-login-fails/135488/18) - AppImage/`.rpm` reproduction on Fedora/KDE; details the `cursor-url-handler.desktop` (`--open-url %U`) scheme-registration workaround.
