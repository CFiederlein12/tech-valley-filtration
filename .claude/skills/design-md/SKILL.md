---
name: design-md
description: Library of 84 DESIGN.md design-system references (colors, typography, spacing, components, layout rules) inspired by well-known websites such as Stripe, Linear, Apple, Vercel, Notion, Airbnb, Tesla and more. Use when building or restyling a web page, landing page, or UI component and the user wants it to "look like" a known brand or style, asks for a design direction, or wants a consistent visual system for the Tech Valley Filtration site.
---

# DESIGN.md library

Source: https://github.com/VoltAgent/awesome-design-md (MIT, see `LICENSE`).

Each file in `designs/` is a plain-markdown design system: YAML front matter with
color, typography, radius and spacing tokens, followed by written rules for layout,
components, imagery and do/don't guidance.

## How to use

1. Pick the reference that matches the requested look. If the user names a brand,
   use `designs/<brand>.md`. If they describe a mood instead, choose from the guide
   below and say which one you picked.
2. Read the whole file before writing any CSS or HTML.
3. Apply its tokens (colors, type scale, radii, spacing) and component rules
   to the page. Treat it as a style reference only:
   - Do not copy the brand's name, logo, trademarks, proprietary fonts or copy.
     Use the listed fallback font stacks or a similar free Google Font.
   - Keep Tech Valley Filtration's own content, branding and logo.
4. You can mix: e.g. take the type scale from one file and the palette from another,
   but keep one consistent system across the site.

## Quick picker

- **Clean SaaS / developer:** stripe, linear.app, vercel, resend, supabase, raycast, cursor, mintlify, sentry, posthog, warp, hashicorp, clickhouse, mongodb
- **Friendly / productivity:** notion, airtable, miro, cal, intercom, slack, zapier, webflow, framer, figma, superhuman
- **Premium / product-led:** apple, tesla, spacex, dji, oura, nike, bmw, bmw-m, ferrari, lamborghini, bugatti, renault
- **Enterprise / industrial:** ibm, oracle, sap, dell-1996, hp, nvidia, vodafone
- **Finance:** mercury, wise, revolut, coinbase, kraken, binance, mastercard, nerdwallet
- **Consumer / media:** airbnb, spotify, pinterest, uber, starbucks, theverge, wired, aljazeera, playstation, nintendo-2001
- **AI companies:** claude, cohere, mistral.ai, elevenlabs, runwayml, replicate, together.ai, ollama, minimax, x.ai, lovable, opencode.ai, voltagent, composio, clay

List all available files with `ls .claude/skills/design-md/designs/`.
