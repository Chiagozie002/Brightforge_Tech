# BrightForge — Chiagozie Bright's Developer Portfolio

A frontend developer portfolio and lightweight admin CMS, built as a
production-styled frontend ready to connect to a PHP/MySQL backend.

> **Status: Phase 1 and Phase 2 complete.** Both the public website and the
> `cpanel/` admin area are fully built. No real PHP/MySQL backend exists yet
> — every `ajax/*.php` file is a frontend-ready stub with `BACKEND TODO`
> comments describing exactly what to implement.

## Tech stack

- HTML5, CSS3, vanilla JavaScript (ES6+)
- Bootstrap 5.3 (CDN) — grid, Offcanvas, modals
- Font Awesome 7 (CDN) — icons
- Google Fonts — Inter

No frameworks (React/Vue/Angular), no Tailwind, no jQuery.

## Folder structure

```text
portfolio/
├── index.html / about.html / projects.html / contact.html   Public site
│
├── cpanel/
│   ├── login.html              Glassmorphism login + twinkling particles
│   ├── forgot-password.html    Email entry → triggers OTP
│   ├── verify-otp.html         6-box OTP, auto-focus, paste, resend countdown
│   ├── reset-password.html     New password + strength meter + requirements
│   ├── index.html               Dashboard — sidebar/topbar shell, stat cards, recent activity
│   │                            (named index.html so /cpanel/ opens it directly)
│   ├── projects.html           Project table, search, pagination UI, delete modal
│   ├── add-project.html        Dedicated add-project page with image preview
│   ├── profile.html            Profile info, password change, CV upload
│   └── settings.html           Social links + portfolio display settings
│
├── ajax/                       12 endpoint stubs, each with BACKEND TODO comments
│   ├── admin_login.php / logout.php
│   ├── forgot_password.php / verify_otp.php / resend_otp.php / reset_password.php
│   ├── add_project.php / update_project.php / delete_project.php
│   ├── update_profile.php / change_password.php / upload_cv.php
│   └── send_message.php
│
├── assets/
│   ├── css/
│   │   ├── style.css         Base layout, typography, components, auth + admin shell
│   │   ├── responsive.css    ALL custom media queries (centralized)
│   │   ├── theme.css         Dark/light CSS variables + theme switching
│   │   ├── scrollbar.css     Custom scrollbar
│   │   └── toast.css         Toast notification system
│   ├── js/
│   │   ├── main.js           Footer year, CV-download guard
│   │   ├── theme.js          Theme toggle + persistence
│   │   ├── navigation.js     Active nav detection (public nav + admin sidebar), offcanvas
│   │   ├── preloader.js      Preloader progress (real readiness signals)
│   │   ├── toast.js          showToast(message, type) global API
│   │   ├── animations.js     IntersectionObserver scroll-reveal
│   │   ├── validation.js     Shared form-validation helpers
│   │   ├── contact.js        Contact form validation + AJAX submit
│   │   ├── projects.js       Public project demo data, rendering, filtering
│   │   └── admin.js          All cpanel interactivity (see below)
│   └── images/
│       ├── logo-mark.png            Icon-only mark (favicon)
│       ├── logo-full-dark.png       Icon + wordmark, for dark theme (white "Bright")
│       ├── logo-full-light.png      Icon + wordmark, for light theme (navy "Bright")
│       ├── profile-hero.svg / profile-about.svg
│       └── projects/project-01.svg … project-06.svg
│
└── README.md
```

## Running it

Static frontend, no build step:

```bash
cd portfolio
python3 -m http.server 8000
```

Open `http://localhost:8000`. For cpanel pages, since AJAX stubs just
return a hardcoded JSON success response, every admin form will behave as
if the backend succeeded (login redirects to the dashboard, OTP accepts
any 6 digits, etc.) — that's expected until the real PHP/MySQL logic is
implemented.

## What admin.js handles

One file, several independent init functions that each check for their
own page's DOM hooks before running (so it's safe to include on every
cpanel page):

- Password show/hide toggles, auth background particles
- Login, forgot-password, OTP (navigation/paste/resend countdown), and
  reset-password form flows
- Password strength meter + live requirements checklist (shared by
  reset-password.html and profile.html)
- Profile dropdown (click-outside, Escape to close) and logout
- Dashboard recent-projects/recent-messages demo rendering
- Projects table: skeleton → render, live search filter, delete
  confirmation modal
- Add-project: image preview, file validation, character counter, URL
  validation
- Profile page: info form, password change, CV upload
- Settings form

## What's static/demo right now

- **Public project data** (`assets/js/projects.js`) and **admin dashboard
  stats / recent activity / project table data** (`assets/js/admin.js`)
  are realistic placeholder content, clearly commented as demo data and
  marked with a "Demo data" badge in the admin UI. Both are structured so
  a real `fetch()` call can replace the static arrays without touching
  the rendering/filtering code.
- **Every `ajax/*.php` file** always returns a success JSON stub — see
  the `BACKEND TODO` comments in each file for exactly what server-side
  logic (validation, MySQL queries, password hashing, OTP generation,
  session handling, file uploads) needs to be added.
- **CV download** (`about.html`) checks whether a real file exists at
  `assets/cv/chiagozie-bright-cv.pdf` before navigating, and shows a
  toast instead of a broken download if it's missing.

## Where to replace things

- **Logo:** `assets/images/logo-mark.png` (icon only) and `logo-full-dark.png` /
  `logo-full-light.png` (icon + wordmark — `theme.js` swaps between these two
  automatically, so edit both if you replace the logo later)
- **Profile photos:** `assets/images/profile-hero.svg`, `profile-about.svg`
  (public site) — the admin profile photo and dropdown avatar currently
  reuse `profile-about.svg` too.
- **Social links:** every `href="#"` next to a GitHub/LinkedIn/X icon,
  marked with `<!-- TODO -->` comments.
- **Contact details:** email/phone in footers and `contact.html`.
- **Map:** `contact.html`'s placeholder OpenStreetMap embed, commented
  `CONTACT MAP - PLACEHOLDER`.
- **Admin credentials shown in the UI:** `admin@brightforge.dev` appears
  as placeholder text in the topbar/dropdown — this is cosmetic only
  until real auth exists.

## Future PHP migration

Every repeated component (public navbar/footer, admin sidebar/topbar) is
marked with `REPEATED COMPONENT ... START/END` comments so each can be
lifted into:

```text
includes/navbar.php
includes/footer.php
includes/admin-sidebar.php
includes/admin-navbar.php
```

without redesigning anything.

## What's NOT built (by design)

No real PHP/MySQL backend — database schema, authentication, sessions,
OTP generation/expiry, password hashing, file storage, and email sending
are all documented as `BACKEND TODO`s in the relevant `ajax/*.php` files,
per the project brief's explicit backend boundary.
