---
name: Fazley Rabbi — Modern Homepage
description: Compact, modern engineering portfolio with real work within easy reach.
colors:
  light-base: "#fafbfc"
  light-surface: "#f0f3f5"
  light-card: "#ffffff"
  light-text: "#111c25"
  light-secondary: "#4f606e"
  light-muted: "#596b7a"
  light-border: "#dce3e8"
  light-accent: "#0d6970"
  light-accent-hover: "#09585e"
  dark-base: "#12191e"
  dark-surface: "#1d272e"
  dark-card: "#182128"
  dark-text: "#eef3f6"
  dark-secondary: "#b3c1cb"
  dark-muted: "#a0b2bf"
  dark-border: "#33424d"
  dark-accent: "#59c6b6"
  dark-accent-hover: "#79d5c7"
  dark-action-text: "#102522"
typography:
  display: { fontFamily: 'DM Sans, system-ui, -apple-system, sans-serif', fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 700, lineHeight: 1.06, letterSpacing: '-0.03em' }
  headline: { fontFamily: 'DM Sans, system-ui, -apple-system, sans-serif', fontSize: '24px', fontWeight: 600 }
  intro: { fontFamily: 'DM Sans, system-ui, -apple-system, sans-serif', fontSize: '19px', lineHeight: 1.55 }
  project-body: { fontFamily: 'DM Sans, system-ui, -apple-system, sans-serif', fontSize: '14px', lineHeight: 1.65 }
  action: { fontFamily: 'DM Sans, system-ui, -apple-system, sans-serif', fontSize: '14px', fontWeight: 600 }
rounded: { action: '10px', imagery: '14px', image-inner: '7px', panel: '16px' }
spacing: { action-gap: '12px', compact: '24px', grid-column: '24px', grid-row: '32px', section: '48px', hero-gap: '48px' }
components:
  button-primary-light: { backgroundColor: '{colors.light-accent}', textColor: '{colors.light-card}', typography: '{typography.action}', rounded: '{rounded.action}', padding: '12px 20px' }
  button-primary-dark: { backgroundColor: '{colors.dark-accent}', textColor: '{colors.dark-action-text}', typography: '{typography.action}', rounded: '{rounded.action}', padding: '12px 20px' }
  button-ghost: { backgroundColor: 'transparent', typography: '{typography.action}', rounded: '{rounded.action}', padding: '12px 20px' }
  skills-panel-light: { backgroundColor: '{colors.light-card}', rounded: '{rounded.panel}' }
  skills-panel-dark: { backgroundColor: '{colors.dark-card}', rounded: '{rounded.panel}' }
---
# Design System: Fazley Rabbi — Modern Homepage

## Overview
**Creative North Star: "Work Within Easy Reach"**
A compact modern portfolio makes the engineer and his actual projects easy to assess. Cool surfaces, confident DM Sans, restrained teal actions, and real imagery establish a clear, approachable technical identity. The approved reference synthesis combines compact portfolio composition (#1), fine system rules (#2), and charcoal depth (#7).
This document governs **only `/` and `/bn/`**, through the homepage body scope. Other routes retain their incumbent design.
**Key Characteristics:** Compact introduction; real imagery and flat captions; paired themes; restrained interaction motion.

## Colors
Sea teal identifies actions in light mode; bright mint teal with dark action text serves dark mode. Cool white/pale gray and charcoal/blue-gray supply corresponding base, surface, and card roles. Text and border tokens preserve hierarchy in each theme.
**The Theme Pair Rule.** Use homepage semantic CSS variables so every surface, text role, and action adapts together.

## Typography
DM Sans supplies display and body voice: a bold tightly tracked greeting, medium-weight section headings, 18px project titles, subordinate metadata. Intro width caps at 42ch. IBM Plex Mono remains in the existing request terminal and utilities; retain Bengali language support and natural wrapping.
**The Short Intro Rule.** Keep the hero concise; let actual projects supply detail rather than adding narrative paragraphs.

## Layout
Canvas: 900px maximum with 24px side gutters. Desktop hero: flexible greeting/copy plus a prominent 260×286px portrait alongside, 48px gap, 56px/48px vertical padding. Four projects use two columns with 24px horizontal/32px vertical gaps. A fine rule starts the work section. After 48px, capabilities occupy their own bordered card: plain skills in two columns above the functional request demo. Compact career rows and up to four latest published articles follow at 48px intervals; contact is left aligned beneath a rule.
At 640px, gutters become 20px; projects/skills use one column and career dates stack. Portrait is 140×154px (124×136px at <=480px), rounded 16px. Portrait captions are hidden. At 560px, the header is 104px with navigation on a second row; post dates stack at 480px.

## Elevation & Depth
Captions have no shadows. Actions are keycaps: a 3px solid lip in a darker tone of the key plus one soft ambient shadow; press travels the full 3px and the lip closes. Tonal imagery frames, fine rules, and the bordered capabilities card create separation; the existing request terminal retains functional chrome.
**The Flat Caption Rule.** Frame the project image, not the whole project; keep its information on the page background.

## Shapes
Use action, imagery, image-inner, and panel radii from the tokens. Mobile portrait corners are 12px. Career and article rows remain open with fine separators.

## Components
Actions: teal primary ‘Let’s talk’ links to email; outlined Resume links to the localized resume. Hover lifts 1px, press sinks 3px onto the lip in 60ms. Preserve 2px accent focus outlines with 2px offset. Fixed navigation is 72px high on desktop, with Work/Writing/About/Resume in a pill and a sliding highlight responding to hover, focus, and section visibility. Theme/language controls remain; mobile shows the same links on a second row without a hamburger.
Projects: real thumbnails with 18px frame inset and 1.8 aspect ratio; frame hover lifts 3px and image scales to 1.025. Captions retain case study/live/repository links. Capabilities use plain text skills under small headings, fine group-top rules, and 28px inner gutters; the request demo sits inside the same card on a tonal lower surface. Career and writing remain ruled lists; retain writing's empty state. Preserve request/cache/rate-limit behavior and paired status colors.
Hero copy arrives once with transform-only 12px movement over 700ms so mobile text is never clipped; the portrait retains subtle clipping over 900ms. Theme changes take 260ms; action states 180ms; frames 280ms; navigation highlight slides over 300ms and project-link arrows move 4px over 220ms. Repeated scroll entrances are removed.
Tactile layer: the hero-to-work rule is a request path (client, api, queue, db in IBM Plex Mono 11px); a 72px accent packet crosses it once on arrival and again when ‘Let’s talk’ is hovered or focused. The portrait leans up to 7° toward a fine pointer with a soft glare and settles over 520ms. The career list carries a 1px rail with 9px diamond markers (filled accent for current roles); its accent fill follows scroll position. A line-art Chattogram quay closes the page above the footer rule: scroll brings the ship in and lowers the crane load. Scroll-linked pieces use CSS view timelines and rest in their end state without support. No looping or pulsing indicators anywhere.
Site-wide exception to the homepage scope: keycap actions (`.btn-primary`, `.btn-ghost`, `.btn-secondary`, `.submit-btn`, `.journey-card-btn`, `.action-btn--*`, `.filter-chip`) and the 6px list-row lean live in the unlayered block at the end of `styles/global.css` and apply on every route. A selected filter chip stays pressed. Reduced-motion disables animations/transitions, smooth scrolling, and image movement.

## Do's and Don'ts
- **Do** scope this world to the English and Bengali homepages.
- **Do** use semantic theme variables and maintain visible keyboard focus.
- **Do** preserve the real portrait, four project thumbnails, and factual content.
- **Do** keep captions flat and capabilities in a separate spacious panel.
- **Don't** extend this redesign to other routes without a new request.
- **Don't** add pulsing dots, status blinkers, or any looping attention indicator.
- **Don't** restore full-height intros, repeated scroll reveals, or nested project cards.
- **Don't** ship generated mockup imagery as portrait or project evidence.
- **Don't** replace simple career and writing lists with decorative dashboards.
Asset provenance: `.impeccable/review/assets.json`. `/me.webp` and the four `/projects/` thumbnails are existing repository assets; generated comps are review references only.
