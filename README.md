# LoopLab Community Website

A modern, responsive community website created as a small project for LoopLab. This README covers a short overview, setup steps, and useful notes for development and customization.

## 🚀 Overview

LoopLab is a simple multi-page site (Home, About, Events, Projects, Contributors, Contact) built with HTML, CSS, Bootstrap 5 and vanilla JavaScript. It includes interactive components such as counters, project filters, event registration, and an EmailJS-ready contact form.

## 🔧 Quick Setup

1. Clone or copy the project into a local folder (e.g. `c:\Users\Muushi\Desktop\LoopLabTask`).
2. Open `index.html` in your browser for a quick preview. No build step is required.
3. Place your `logo.png` next to `index.html` (same folder) if you want the site brand to use it:
   - Path: `c:\Users\Muushi\Desktop\LoopLabTask\logo.png`
4. For Email sending via EmailJS:
   - Create an account at https://www.emailjs.com/
   - Replace placeholders in `js/script.js`: `YOUR_PUBLIC_KEY`, `YOUR_SERVICE_ID`, `YOUR_TEMPLATE_ID`
   - Keep the EmailJS SDK include in `contact.html` (already added).

## ⚙️ Features

- Responsive layout with Bootstrap 5
- Theme toggle (light/dark) persisted in localStorage
- Animated counters that start when visible
- Projects filter UI with simple show/hide transitions
- Event registration saved to `localStorage` with notifications
- Contact form with client-side validation and optional EmailJS integration
- Loading states for buttons and small UI animations

## 📁 Project Structure (important files)

- `index.html` — Home
- `about.html`, `events.html`, `projects.html`, `contributors.html`, `contact.html` — Pages
- `css/style.css` — Main stylesheet (animations added)
- `js/script.js` — All front-end JS (initializers for features)
- `logo.png` — Optional brand image (place beside `index.html`)
- `css/README.md` — This README

## ⚠️ Notes & Tips

- JS initializers are defensive: they check for required DOM nodes before running (safe to include site-wide).
- If EmailJS is not available (offline), the contact form falls back to a friendly notification.
- To change stats targets, edit the `data-target` attributes in the counters section of the relevant HTML pages.
- To add more projects and enable filtering, add `data-category="web|mobile|ai"` to `.project-card` elements.

## 🤝 Contributing

Small fixes and UI improvements are welcome. Keep changes minimal and consistent with the existing Bootstrap-based layout.

## 📄 License

Use and modify as you like. Add a license file if you intend to publish or distribute widely.
