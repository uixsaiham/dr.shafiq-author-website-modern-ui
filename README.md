# Dr. Mohammad Shafiq - Personal Website & Portfolio

A modern, responsive, and high-performance personal portfolio website for Dr. Mohammad Shafiq — Founder, Educator, and Entrepreneur.

## 🚀 Features

- **Responsive Design**: Tailored layout that looks stunning on mobile, tablet, and desktop screens.
- **Rich Aesthetics**: Custom-crafted dark & light themes with smooth transitions, gradients, and micro-animations.
- **Dynamic Portfolios**: Highlighting ventures, career journey, insights, and media achievements.
- **Interactive Contact**: Built-in booking consult options.

## 📂 Project Structure

- `index.html` - The default homepage (Dark Theme).
- `light.html` - The alternative version featuring the Light Theme.
- `styles.css` & `sections.css` - Custom styling rules for layout, grids, themes, and animations.
- `styles-light.css` & `sections-light.css` - Override stylesheets for the Light Theme.
- `app.js` - Main client-side scripts, navigation handling, and interactions.
- `image-slot.js` - Component logic for handling images.
- `uploads/` - Directory containing all the image assets.

## 🛠️ Local Development & Hosting

### 1. View Locally
To run and view the website on your local machine:
- Simply open `index.html` (for dark mode) or `light.html` (for light mode) in any modern web browser.
- Alternatively, run a local development server for live reloading:
  ```bash
  # Using Python (built-in)
  python -m http.server 8000

  # Using Node.js (via npx)
  npx serve .
  ```

### 2. Host on GitHub Pages
This project is configured out-of-the-box for **GitHub Pages**:
1. Push this codebase to a public GitHub repository.
2. Go to the repository **Settings** tab.
3. Scroll down or click **Pages** in the sidebar.
4. Set the Source to **Deploy from a branch**.
5. Choose your branch (e.g., `main`) and root folder (`/root`), then click **Save**.
6. Your website will be live in a few minutes at `https://<username>.github.io/<repository-name>/`.
