# 🏛️ Project Vista – Design System & Product Guide

---

## 1. 🧠 Philosophy & Product Direction

### 1.1. Guiding Principles

Project Vista is a platform for deliberate, self-directed knowledge acquisition. Our design must reflect this core purpose. The user experience should feel **calm, focused, and scholarly**, yet **modern and motivating**.

-   **Clarity over Clutter:** The UI must prioritize content and readability. Every element should serve a purpose. We are building a library, not a social media feed.
-   **Structured & Serene:** The user journey is about building knowledge methodically. The design should feel organized, predictable, and tranquil, reducing cognitive load so the user can focus on learning.
-   **Motivating & Empowering:** While the aesthetic is clean, the experience should guide and encourage users. Progress indicators, clear calls-to-action, and a sense of accomplishment are key.
-   **Academic Meets Accessible:** The aesthetic draws inspiration from academic sources (quality typography, clear hierarchy) but is presented in a friendly, accessible, and digitally native way.

### 1.2. Product Direction Summary (from PRD)

The goal is to create a platform for building structured learning journeys ("Tracks") from Wikipedia articles.

-   **Phase 0 (MVP):** Users can create private tracks, which are collections of Wikipedia links. The core is creating, viewing, and organizing these tracks.
-   **Phase 1 (Reader & Progress):** An in-app reader is introduced to keep users focused. The ability to "Mark as Completed" adds the first layer of progress tracking.
-   **Phase 2 (AI-Assisted Curation):** "Magic Track Creation" allows users to generate a full learning track from a simple topic prompt, using AI to select articles and provide summaries.
-   **Future Phases:** The app will evolve to include public tracks, social learning, stats, quizzes, and intelligent suggestions, transforming it into a dynamic knowledge graph.

---

## 2. 🎨 Visual Identity & Design System

### 2.1. Color Palette

The palette is designed to be professional, trustworthy, and easy on the eyes for long reading sessions. It uses a strong primary color for actions, neutrals for the UI, and semantic colors for feedback.

| Role        | Usage                                               | Color         | Hex        | Tailwind Class     |
|-------------|-----------------------------------------------------|---------------|------------|--------------------|
| **Primary** | CTAs, links, active states, highlights              | `Vista Blue`  | `#3B82F6`  | `blue-500`         |
| **Primary (Hover)** | Hover states for primary elements          | `Vista Blue Dark`| `#2563EB`  | `blue-600`         |
| **Background**| Main app background                                 | `Cloud`       | `#F9FAFB`  | `gray-50`          |
| **Surface**   | Card backgrounds, modals, inputs                    | `White`       | `#FFFFFF`  | `white`            |
| **Border**    | Subtle borders, dividers, outlines                  | `Mist`        | `#E5E7EB`  | `gray-200`         |
| **Text (Primary)** | Body copy, standard text                       | `Ink`         | `#1F2937`  | `gray-800`         |
| **Text (Secondary)**| Subheadings, descriptions, placeholder text     | `Graphite`    | `#6B7280`  | `gray-500`         |
| **Text (Tertiary)**| Disabled text, subtle metadata                  | `Ash`         | `#9CA3AF`  | `gray-400`         |
| **Success**   | Confirmation, validation, success toasts            | `Mint`        | `#10B981`  | `emerald-500`      |
| **Warning**   | Gentle warnings, work-in-progress notes             | `Amber`       | `#F59E0B`  | `amber-500`        |
| **Error**     | Errors, destructive actions, failure notifications  | `Crimson`     | `#EF4444`  | `red-500`          |


### 2.2. Typography

We use two primary fonts: a versatile sans-serif for UI and a highly-readable serif for long-form article content.

-   **UI Font:** `Inter` (or a high-quality system sans-serif like SF Pro, Segoe UI, Roboto)
-   **Content Font:** `Lora` (or a similar readable serif like Source Serif Pro)

#### Type Scale (Tailwind CSS)

| Element             | Tailwind Class        | Font Size / Line Height | Font Weight | Letter Spacing | Use Case                                  |
|---------------------|-----------------------|-------------------------|-------------|----------------|-------------------------------------------|
| **Display**         | `text-4xl`            | 36px / 40px             | `font-bold` | `tracking-tight` | "My Learning Tracks" page title             |
| **Heading 1 (h1)**  | `text-2xl`            | 24px / 32px             | `font-bold` | `tracking-tight` | Track titles, Modal titles                |
| **Heading 2 (h2)**  | `text-xl`             | 20px / 28px             | `font-semibold`| `tracking-tight`| Major section headings                    |
| **Heading 3 (h3)**  | `text-lg`             | 18px / 28px             | `font-medium` | `normal`       | Card titles                               |
| **Body (p)**        | `text-base`           | 16px / 24px             | `font-normal` | `normal`       | Standard paragraph text, descriptions     |
| **Body (Article)**  | `text-lg`             | 18px / 32px             | `font-normal` | `normal`       | For the in-app reader (`font-serif`)      |
| **Small**           | `text-sm`             | 14px / 20px             | `font-normal` | `normal`       | Metadata, helper text, captions         |
| **Micro**           | `text-xs`             | 12px / 16px             | `font-normal` | `normal`       | Fine-print, timestamps                    |

### 2.3. Layout & Spacing

We use an **8px grid system**. All padding, margins, and gaps should be multiples of 8px (`2` in Tailwind's spacing scale).

-   **Base Unit:** `8px` (`p-2`, `m-2`, `gap-2`)
-   **Standard Gaps:** `16px` (`gap-4`), `24px` (`gap-6`), `32px` (`gap-8`)
-   **Page Padding:** Main content areas should have horizontal padding of `24px` (`px-6`) on mobile and `32px` (`px-8`) or more on desktop.
-   **Container Width:** Main content should be centered with a max-width of `1280px` (`max-w-7xl`).

### 2.4. Borders & Shadows

-   **Border Radius:**
    -   `rounded-md` (6px): Inputs, small buttons.
    -   `rounded-lg` (8px): **Default.** Cards, Modals, Primary Buttons.
    -   `rounded-xl` (12px): Larger container elements where a softer look is desired.
-   **Shadows:**
    -   **`shadow-sm`:** For interactive elements on hover (e.g., track cards).
    -   **`shadow`:** **Default.** Used for resting state of cards and floating elements.
    -   **`shadow-md`:** For elevated elements like open dropdowns or modals to signify higher z-index.

### 2.5. Iconography

-   **Library:** [Lucide React](https://lucide.dev/). It provides clean, consistent, and highly-customizable line icons.
-   **Style:** Use the default stroke width (`2px`).
-   **Standard Size:** `16px` or `20px` (`h-4 w-4` or `h-5 w-5`) for icons inside buttons or next to text. Larger icons for illustrative purposes can be `24px` (`h-6 w-6`).

---

## 3. 🧩 Component Library

This section defines the visual and behavioral rules for the core components of Project Vista.

### 3.1. Buttons

-   **Primary CTA (`<Button>`):**
    -   **Style:** Solid background (`bg-blue-500`), white text (`text-white`).
    -   **States:** Darken on hover (`hover:bg-blue-600`), subtle inset shadow on active.
    -   **Usage:** The single most important action on a page (e.g., "Create Track", "Save").
-   **Secondary (`<Button variant="secondary">`):**
    -   **Style:** Light gray background (`bg-gray-100`), dark text (`text-gray-800`).
    -   **States:** Darken background on hover (`hover:bg-gray-200`).
    -   **Usage:** Secondary actions (e.g., "Cancel", "View Details").
-   **Ghost / Link (`<Button variant="ghost">`):**
    -   **Style:** No background, primary color text (`text-blue-500`).
    -   **States:** Underlined on hover.
    -   **Usage:** Low-priority actions, links within text, or icon-only buttons.

### 3.2. Cards (`<Card>`)

-   **Track Card (as seen in screenshot):**
    -   **Container:** `bg-white`, `rounded-lg`, `shadow`, `border border-gray-200`. Add `transition-shadow` and `hover:shadow-sm`.
    -   **Padding:** `p-6` (24px).
    -   **Header:** `flex justify-between items-center`. Contains the track title (`h3`) and an external link/open icon (`<ArrowUpRight>`).
    -   **Metadata:** A section with `text-sm text-gray-500`. Use icons (`<FileText>`, `<Calendar>`) for clarity. Example: "1 article", "Created 6/23/2025".
    -   **Preview:** An optional section for AI-generated previews or the first few items. Use an ordered list (`<ol>`) with `list-decimal list-inside`.
    -   **Interaction:** The entire card is clickable and should navigate to the track's detail view.

### 3.3. Forms & Inputs

-   **`<Input>`:**
    -   **Style:** `bg-white`, `rounded-md`, `border border-gray-200`.
    -   **States:** Blue focus ring (`focus:ring-2 focus:ring-blue-500`).
    -   **Text:** Placeholder text is `text-gray-500`.
-   **Search Bar:**
    -   An `<Input>` component with a search icon from Lucide (`<Search>`) positioned inside on the left.

### 3.4. Modals (`<Dialog>`)

-   **Overlay:** A semi-transparent black overlay (`bg-black/40`).
-   **Content:** `bg-white`, `rounded-lg`, `shadow-md`, `p-6`.
-   **Structure:**
    -   **`<DialogHeader>`:** Contains `<DialogTitle>` (`h2` style) and `<DialogDescription>` (`p` style, `text-gray-500`).
    -   **`<DialogContent>`:** Main form or content area.
    -   **`<DialogFooter>`:** Contains action buttons (e.g., a primary "Save" and a secondary "Cancel").

### 3.5. Toasts (`<Toast>`)

-   **Position:** Bottom-right of the screen.
-   **Style:** `bg-white`, `rounded-lg`, `shadow-md`, `border`.
-   **Content:** Contains a title, a description, and an optional close button. Semantic colors should be used for the border or an icon to indicate status (success, error, info).

---

## 4. 🗺️ App Structure & UX Patterns

### 4.1. Main Layout

-   **Header:** A simple, clean bar at the top.
    -   **Left:** "ProjectVista" logo/wordmark.
    -   **Right:** User information ("Welcome, Demo User") and a "Sign Out" link.
-   **Content:** A main content area with vertical padding (`py-8`) and horizontal padding (`px-6` or `px-8`). The content is horizontally centered with `max-w-7xl mx-auto`.

### 4.2. Page-Specific UX

-   **My Learning Tracks (Home Page):**
    -   **Header:** A large page title ("My Learning Tracks") and a subtitle ("Create and organize...").
    -   **Actions:** A primary "Create Track" button and a Search Bar are the main interactive elements.
    -   **Content:** A grid of `TrackCard` components. Use a responsive grid (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`).
-   **Track View Page (Future):**
    -   This will be the dedicated page for a single track.
    -   **Layout:** A two-column layout is recommended on desktop.
        -   **Left column:** A list of all articles ("Items") in the track, with checkmarks for completed ones. The current item is highlighted.
        -   **Right column:** The in-app reader displaying the content of the selected article.
    -   **Header:** The track title, description, and a progress bar/indicator.
-   **Create/Edit Track Modal:**
    -   A focused modal experience.
    -   **Fields:** Title (text input), Description (textarea), and a dynamic list of Wikipedia articles.
    -   **Adding Articles:** Users should be able to search for Wikipedia articles via a type-ahead input and add them to an ordered list. They should also be able to re-order and remove items.

---

## 5. 🤖 Guidelines for AI Assistants

1.  **Adhere to the System:** Always use the defined color palette, typography scale, and spacing units from this document. Do not introduce new styles. Use Tailwind CSS classes directly.
2.  **Component First:** When asked to build a new UI element, first check if it can be composed from the existing components (`Button`, `Card`, `Input`, `Dialog`). Create new components only when necessary.
3.  **Use Lucide Icons:** For all iconography, use the `lucide-react` library. Ensure icons are used purposefully and consistently.
4.  **Prioritize Clarity:** Write simple, readable code. The UI should be self-explanatory. Add helper text or tooltips if an action is complex.
5.  **Obvious Intent Rule:** When the intent of an icon or visual element is very obvious from context, avoid redundant text labels. Examples: external link icons don't need "Read on Wikipedia" text, sparkles icons don't need "Auto" labels when indicating auto-generated content.
6.  **Responsive by Default:** All layouts and components must be responsive and work seamlessly on both mobile and desktop screens. Use flexbox, grid, and Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`).
7.  **Accessibility is Key:** Use semantic HTML (`<main>`, `<nav>`, `<section>`). Ensure all interactive elements are keyboard-navigable and have proper focus states. Use `aria-*` attributes where appropriate.
