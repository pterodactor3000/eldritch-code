---
title: "The curse of the n-th survivor"
date: 2026-06-29
tags: [javascript, algorithms, performance, fenwick-tree, linked-list]
category: algorithms
---

I needed to sever the **n-th remaining element** from a growing host — repeatedly, in order, without dragging the tail along on every cut. `splice` reads like the obvious rite on paper. At scale it becomes a slow ritual of copies, each one paid in full.

## Known unknowns

When the first implementation called `Array.prototype.splice`, I assumed the runtime would stay tractable. It didn't.

The trap is not correctness. Every approach below yields the same survivors. The trap is **shifting**: each removal slides every element after the cut one slot left. Perform that rite hundreds of thousands of times on a host that stays large, and you summon work that never needed to touch most of the data at all.

## The immutable truths

Given an input array, process each element in order:

| Sigil | Rite |
|-------|------|
| **n < 0** | Bind the value into `result` |
| **n > 0** | Sever the **n-th remaining** survivor from `result` (1-indexed), if still in bounds |
| **n = 0** | Pass in silence |

Each severance rewrites what "2nd" or "3rd" means for the next invocation. That shifting semantics is the whole curse.

```
Input:  [-3,  5, -1,  2, -4]
         │       │       │
Phase 1: gather the bound (negatives)
Result: [-3, -1, -4]     positions:  1   2   3

Phase 2: apply the severance sigils (positives) in order
  5 → only 3 survivors → skip
  2 → sever 2nd → [-3, -4]
```

## The curse!

Naive `splice` on a dense array. Every severance copies the tail.

```
SPLICE on array:
[-3, -1, -4, -7, -2]
      ↑ sever index 1
[-3, -4, -7, -2]     ← every element after index 1 DRAGGED left

× many removals × large N = a quadratic toll in practice
```

What the complexity oracle whispered — no fixture required, only the shape of the work:

| Approach | Per severance | Accumulated toll (rough) |
|----------|---------------|--------------------------|
| `splice` on array | O(N) tail copy | O(removals × N) — punishing when both stay large |
| Linked chain | O(k) walk + O(1) cut | O(removals × avg k) — gentle when k stays small |
| Fenwick tally tree | O(log N) find + O(log N) update | O(removals × log N) — steady even when k grows |

Same survivors. Different price. The naive rite is correct until the host grows vast enough to notice.

## Cause of our demise

| Item | Detail |
|------|--------|
| **Operation** | Sever the k-th *remaining* survivor from a live collection |
| **Naive rite** | `result.splice(k - 1, 1)` on a JavaScript array |
| **Per-severance cost** | O(N) — every trailing element shifts left |
| **At scale** | Removals × average host length → quadratic or worse in practice |
| **What we actually need** | Locate the k-th survivor and banish it **without moving the rest** |

Two structures answer that summons. Same goal. Different temperament.

---

## Recommended way of making us whole — the chain of survivors

**Idea:** Store the bound values as nodes in a doubly-linked chain. Each node remembers its neighbors. Severing a node is repointing two pointers — no array shifting, no tail dragged through the void.

```
Initial host:    [-3] ←→ [-1] ←→ [-4]
                  head              tail
Position:          1      2      3

Severance n=2: walk 2 links from head → reach [-1] → unlink

After:           [-3] ←→ [-4]
                  head    tail
Position:          1      2
```

**Unlinking** (O(1) — two pointers rewired):

```
Before:   ... ←→ [A] ←→ [B] ←→ [C] ←→ ...
Sever B:  ... ←→ [A] ←→ [C] ←→ ...
              A.next = C
              C.prev = A
```

| Step | Action | Cost |
|------|--------|------|
| Find k-th | Walk k links from head | O(k) |
| Sever | Rewire prev/next | O(1) |

**Good when:** k stays small on average. Easier to inscribe and to read.

---

## Recommended way of making us whole — the tally tree

**Idea:** Keep values in fixed slots that never move. A Binary Indexed Tree (Fenwick tree) tracks **how many survivors** live in each prefix. Data stays put — only alive flags and counts change.

```
Original slots:  [0]  [1]  [2]  [3]  [4]   ← fixed indices, eternal
Values:          -3   -1   -4   -7   -2
Alive?             ✓    ✓    ✓    ✗    ✓

Prefix counts (survivors up to index i):
  index:     0  1  2  3  4
  alive:     1  2  3  3  4
```

**Find 2nd alive:** binary search on the tree — "where does the prefix count first reach 2?"

```
Want k=2 (2nd survivor):

  "First half holds ≥2 alive?" → yes, descend left
  "First quarter holds ≥2?"    → no, descend right
  ...

  Answer: slot [1] holds -1   ← O(log N) steps through the tally
```

**Banish slot [1]:** subtract 1 from every tree cell that covers index 1. The next `findKth` query reads the updated counts automatically.

**Tree structure (conceptual):** each index `i` contributes its count to tree cells at `i, i+2, i+4, ...` (the `i & -i` pattern):

```
Array indices:  1   2   3   4   5   6   7   8
                 │   │   │   │   │   │   │   │
Tree covers:     └─1─┘   └─3─┘   └─5─┘   └─7─┘
                     └─2─┘           └─6─┘
                         └────4────┘       └─8─┘
                             └────────8────────┘
```

| Operation | What it does | Cost |
|-----------|--------------|------|
| `findKth(k)` | Binary lift on prefix sums | O(log N) |
| `add(i, -1)` | Decrement counts for index i | O(log N) |
| Build final array | One pass, skip the banished | O(N) |

**Good when:** k can land anywhere and you need predictable speed as N grows.

---

## From different works, from libraries far and wide

Both paths refuse the `splice` trap. Neither drags trailing elements on severance.

| | Chain of Survivors | Tally Tree |
|---|-------------------|------------|
| **Mental model** | Beads on a cord — follow links to the k-th, then snip | Fixed slots + a counter tree — leap to the k-th alive index |
| **Data movement** | None (repoint pointers) | None (flip flags, update counts) |
| **Find k-th alive** | Walk k links from head | Binary search on prefix sums |
| **Sever** | Rewire prev/next | Mark banished + decrement tree |
| **Cost per severance** | O(k) | O(log N) |
| **Inscription complexity** | Lower | Higher (tree class) |
| **Best for** | Small average k | Large k, predictable performance at scale |

Side by side:

```
CHAIN                               TALLY TREE
─────                               ──────────

[-3]→[-1]→[-4]                      slots: 0  1  2
  │                                  alive: ✓  ✓  ✓
  walk 2 links                       counts in tree
  ↓                                  ↓
[-3]→[-4]                            findKth(2) → index 1
                                     mark banished, update counts

Motion: follow pointers             Motion: jump using tree sums
Cost per severance: O(k)            Cost per severance: O(log N)
Simpler inscription                 Steadier at scale
```

```
CHAIN:        repoint 2 pointers          → no copy
TALLY TREE:   flip a flag + update counts → no copy
```

---

## Worked traces

### Example 1 — a small host

**Input:** `[-10, 2, -20, 1, -30]`

**Phase 1 — gather the bound:**

```
Result: [-10, -20, -30]
         pos 1   2     3
```

**Severance sigils to apply (in order):** `2`, `1`

#### Chain trace

Initial cord (fixed slots, pointer links):

```
head → [0:-10] → [1:-20] → [2:-30]
        pos 1      pos 2      pos 3
```

| Step | Sigil | Action | Chain after |
|------|-------|--------|-------------|
| 1 | `2` | Walk 2 links: `0→1`, unlink slot 1 (`-20`) | `[0:-10] → [2:-30]` |
| 2 | `1` | Walk 1 link: slot 0, unlink (`-10`) | `[2:-30]` |

**Final survivors:** `[-30]`

#### Tally tree trace

Fixed slots with alive flags (data never moves):

```
slot:   0      1       2
value: -10   -20    -30
alive:  ✓      ✓      ✓     aliveCount = 3
```

| Step | Sigil | Action | Alive after |
|------|-------|--------|-------------|
| 1 | `2` | `findKth(2)` → slot 1 (`-20`), mark banished | slots 0, 2 alive → `[-10, -30]` |
| 2 | `1` | `findKth(1)` → slot 0 (`-10`), mark banished | slot 2 alive → `[-30]` |

**Final survivors:** `[-30]`

### Example 2 — severance sigils out of reach

**Input:** `[-3, 5, -1, 2, -4, 1, -7]`

**Phase 1 — gather the bound:**

```
Result: [-3, -1, -4, -7]
         pos 1   2   3   4
```

**Severance sigils to apply (in order):** `5`, `2`, `1`

#### Chain trace

Initial cord:

```
head → [0:-3] → [1:-1] → [2:-4] → [3:-7]
        pos 1     pos 2     pos 3     pos 4
```

| Step | Sigil | Action | Chain after |
|------|-------|--------|-------------|
| 1 | `5` | Skip — position ≥ length (4) | unchanged |
| 2 | `2` | Walk 2 links: `0→1`, unlink slot 1 (`-1`) | `[0:-3] → [2:-4] → [3:-7]` |
| 3 | `1` | Walk 1 link: slot 0, unlink (`-3`) | `[2:-4] → [3:-7]` |

**Final survivors:** `[-4, -7]`

#### Tally tree trace

```
slot:   0     1     2     3
value: -3    -1    -4    -7
alive:  ✓     ✓     ✓     ✓     aliveCount = 4
```

| Step | Sigil | Action | Alive after |
|------|-------|--------|-------------|
| 1 | `5` | Skip — position ≥ alive count (4) | unchanged |
| 2 | `2` | `findKth(2)` → slot 1 (`-1`), mark banished | slots 0, 2, 3 → `[-3, -4, -7]` |
| 3 | `1` | `findKth(1)` → slot 0 (`-3`), mark banished | slots 2, 3 → `[-4, -7]` |

**Final survivors:** `[-4, -7]`

---

## Why would this way work?

| Approach | Find k-th survivor | Sever | When it wins |
|----------|-------------------|-------|--------------|
| `splice` on array | O(1) index access | O(N) tail copy | Never at this scale |
| Chain of survivors | O(k) walk from head | O(1) pointer rewire | Small average k; simpler inscription |
| Tally tree | O(log N) prefix search | O(log N) count update | Large k; predictable bounds as N grows |

The chain is the readable default — the first rite I inscribe when k tends to stay modest. The tally tree is the one I reach for when severance sigils can land anywhere in a host that refuses to shrink — same survivors, but the toll stays logarithmic instead of linear in N.

## Beware of the unseen

- **1-indexed k.** The spec counts survivors from 1, not 0. Off-by-one here silently corrupts the host.
- **Out-of-bounds sigils.** If k exceeds the current survivor count, skip — do not wrap or clamp.
- **Phase order matters.** Gather all negatives first, then apply positives in input order. Reversing the phases changes the answer entirely.
- **Tally tree overhead.** Inscribing and maintaining the tree class costs more lines than a chain. Only worth the effort when k or N forces your hand.

## Grimoires and scrolls used in esoteric research

- Peter Fenwick, *A New Data Structure for Cumulative Frequency Tables* (1994) — the tally tree / Binary Indexed Tree for O(log N) prefix queries and point updates.
- Doubly-linked list — the chain of survivors; pointer rewire as O(1) severance without array shifting.
