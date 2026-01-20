# I Built a CLI That Found $72/Year of Wasted Bandwidth in 10 Seconds

_How I turned years of frustration into a tool that helps developers ship faster_

---

I've been writing about vanilla JavaScript for years. My Medium articles reach 50,000+ developers monthly, all hungry for one thing: **how to write better code without framework dependencies.**

But there was a pattern I kept seeing. A problem nobody was solving.

## The Problem: Bundle Bloat is Everywhere

Every Next.js project I reviewed had the same disease.

Not the "oh no, 10KB extra" kind of bloat. The **"why are we shipping 500KB of JavaScript to format a date"** kind.

- Moment.js (288KB) to format dates
- Lodash (72KB) for a single debounce function
- jQuery (87KB) in 2026
- Axios (14KB) when fetch is native

The pattern was everywhere:

Junior developers npm installing solutions without checking if native APIs could handle it. Senior developers inheriting codebases and not questioning the dependencies. Teams shipping bloated bundles because "it works."

And here's the thing: **the tools to find this bloat existed.**

- webpack-bundle-analyzer shows you a pretty treemap
- Bundlephobia tells you package sizes
- Lighthouse screams about JavaScript execution time

But they all had the same fatal flaw:

**They showed you the problem. Not the solution.**

## What Was Missing

I'd spend hours helping developers optimize their bundles:

"Replace moment with `Intl.DateTimeFormat`"  
"Here's vanilla fetch instead of axios"  
"You don't need lodash for debounce, here's 8 lines of code"

Every. Single. Time.

The vanilla JS alternatives existed. The knowledge was there. MDN had the docs. But developers didn't know:

- Which libraries were bloatable
- What to replace them with
- How to write the vanilla code

**I was doing manual work that should be automated.**

That's when I realized: I could build this.

## What I Built

**Lean Stack Auditor** is a CLI that does what I was doing manually:

1. **Analyzes** your package.json
2. **Detects** bloated libraries
3. **Shows** vanilla JS alternatives with actual code
4. **Calculates** real cost savings

No more Googling. No more StackOverflow. No more "how do I replace X?"

Just: `npx lean-stack-auditor`

## A Real Example

To test it, I created a project with 8 dependencies developers commonly use:

```bash

```
