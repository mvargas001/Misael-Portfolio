# Engineering Portfolio

A no-build, plain HTML/CSS/JS portfolio site made to run on GitHub Pages.

- **Landing page** (`index.html`) — short header (name, tagline, brief intro) and a
  scannable grid of project cards. Each card links to that project's own page.
- **Project pages** (`projects/*.html`) — one plain HTML file per project, all following
  the same template: Overview, The Problem, Approach, Build & Code, Engineering Log,
  Photo Gallery, Skills & Tags. Each project owns its own log and gallery.

No React, no build step, no npm install, no JS data file to wrestle with for project
content — every project page is just HTML you edit directly.

## 1. Quick start (view locally)

You can just open `index.html` in a browser, but it's more reliable to serve it (some
browsers restrict local file requests):

```bash
cd portfolio-site
python3 -m http.server 8000
# then open http://localhost:8000
```

Even better for day-to-day editing: open the folder in VS Code and use the "Live Server"
extension — it auto-refreshes the browser every time you save.

## 2. Put this on GitHub Pages

1. Create a new repo on GitHub, e.g. `yourusername.github.io` (for a root domain) or any
   name like `portfolio` (for `yourusername.github.io/portfolio`).
2. Push this folder's contents to the repo root:
   ```bash
   cd portfolio-site
   git init
   git add .
   git commit -m "Initial portfolio site"
   git branch -M main
   git remote add origin https://github.com/yourusername/YOUR-REPO.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   branch `main`, folder `/ (root)`. Save.
4. Your site goes live at `https://yourusername.github.io/YOUR-REPO/` (or
   `https://yourusername.github.io/` if you used the special repo name) within a minute or two.

## 3. Adding a new project

1. Copy `projects/quadcopter-frame.html` to `projects/your-project-slug.html`.
2. Open it and work top to bottom — each of the 7 sections is marked with an HTML
   comment. Replace the title, tags, hero image, body text, code snippets, timeline
   entries, gallery images/captions, and skill tags. Keep the section order and the
   `id`s on each `<section class="project-section" id="...">` as-is (the sticky jump-nav
   links to them), but everything else is yours to change.
3. Open `js/data.js` and add one entry to the `PROJECTS` array pointing at your new file:
   ```js
   {
     id: "your-project-slug",
     title: "Project Title",
     oneLiner: "One sentence describing what it is.",
     heroImage: "assets/projects/your-image.jpg",
     tags: ["SolidWorks", "Python", "Control Systems"],
     href: "projects/your-project-slug.html"
   }
   ```
   That's the only JS you touch — it's just what powers the card on the landing page.

## 4. Editing the landing page header

Open `js/data.js` and edit the `SITE` object at the top (name, tagline, intro, resume/
GitHub/LinkedIn/email links). Keep the intro to 2–3 sentences — the landing page is meant
to be scannable, with the real detail living on each project's own page.

## 5. Adding your own photos and CAD files

- **Project photos**: each project's gallery images live in
  `assets/projects/<project-slug>/`. Drop your real photos in there (replacing the
  placeholder `.svg` files) and update the `<img src="...">` paths and `<div class="cap">`
  captions inside that project's HTML file, in the Photo Gallery section.
- **Hero images**: same idea — swap the image referenced in each project's Overview
  section, and the `heroImage` path in that project's card entry in `js/data.js`.
- **CAD files**: put your `.SLDPRT` / `.SLDASM` / `.STEP` files in `assets/models/` and
  link them from the `download-list` in a project's Build & Code section. GitHub Pages
  serves these as downloadable files (browsers can't open SolidWorks files directly, but
  visitors can download and open them locally, or view them in SolidWorks eDrawings).

### Showing a live 3D model in the browser

Each project page has a commented-out [`<model-viewer>`](https://modelviewer.dev) element
in its Build & Code section for displaying a `.glb`/`.gltf` file with drag-to-rotate.
SolidWorks doesn't export glTF natively, so the usual path is:

1. In SolidWorks: **File → Save As → STL** (or export to STEP).
2. Convert STL/STEP → glTF/GLB using a free tool:
   - [Blender](https://www.blender.org/) (import STL/STEP with a plugin, export as glTF 2.0)
   - Online converters such as [Aspose 3D Converter](https://products.aspose.app/3d/conversion) or [AnyConv](https://anyconv.com/stl-to-gltf-converter/)
3. Drop the resulting `.glb` into `assets/models/`, then in that project's HTML file
   uncomment the `<script type="module" src="...model-viewer...">` tag in `<head>` and the
   `<model-viewer src="...">` element in the Build & Code section, pointing at your file.

If you skip this, the section just shows the code/spec/download content instead — totally
fine, and less setup.

### Large files

GitHub has a 100 MB per-file limit (and repos get unwieldy past ~1 GB). For big CAD
assemblies or lots of photos, consider [Git LFS](https://git-lfs.com/), or host large files
elsewhere (Google Drive, Dropbox) and just link to them from the download list.

## 6. File structure

```
portfolio-site/
├── index.html                     Landing page: header + project grid
├── projects/
│   └── quadcopter-frame.html        Example project — also the template to duplicate
├── css/style.css                  All styling — one file, easy to re-theme
├── js/data.js                      EDIT THIS — landing page header + project card list
├── js/main.js                       Theme toggle, gallery lightbox, section-nav — shouldn't need to touch
└── assets/
    ├── projects/
    │   ├── project-0X.svg            Spare thumbnail placeholders for new project cards
    │   └── quadcopter-frame/           This project's own gallery photos
    └── models/                       SolidWorks/STEP/glTF files (empty — add your own)
```

## 7. Customizing the look

Colors, fonts, and spacing are all CSS variables at the top of `css/style.css`
(`--bg`, `--accent`, `--accent-2`, `--sans`, `--mono`, etc.) — change those to re-theme the
whole site without touching individual rules. The site also ships with a light/dark toggle
(top-right of the nav) that remembers the visitor's choice.

## 8. Custom domain (optional)

If you have your own domain, add a `CNAME` file to the repo root containing just your
domain (e.g. `yourname.com`), then point your domain's DNS at GitHub Pages per
[GitHub's custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).
