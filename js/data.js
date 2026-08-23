/* ==========================================================================
   EDIT THIS FILE to update the landing page.
   Individual project pages are plain HTML in /projects/ — edit those files
   directly (see projects/quadcopter-frame.html, which doubles as the
   template: copy it, rename it, and fill in your own project).
   ========================================================================== */

// ---------------------------------------------------------------
// SITE / HEADER INFO — shown at the top of the landing page
// ---------------------------------------------------------------
const SITE = {
  name: "Misael Vargas",
  tagline: "Mechanical Engineering Student",
  intro: "I am driven by a hunger for human advancement and technical rigor. This portfolio showcases my hands-on engineering builds, highlighting full-lifecycle design across mechanical CAD, systems architecture, and UAV hardware integration.",
  email: "Misaelvgas875@gmail.com",
  github: "https://github.com/mvargas001",
  linkedin: "https://www.linkedin.com/in/misael-vargas-882817352",
  resumeUrl: "assets/resume.pdf"
};

// ---------------------------------------------------------------
// PROJECT CARDS — shown in the grid on the landing page.
// `href` points at that project's own page in /projects/.
//
// To add a project:
//   1. Copy projects/quadcopter-frame.html, rename it (e.g. projects/my-project.html),
//      and edit its content — see the comments inside that file.
//   2. Add a new object to this array pointing `href` at your new file.
// ---------------------------------------------------------------
const PROJECTS = [
  {
    id: "your-next-project",
    title: "Decurion",
    oneLiner: "One operator commanding multiple autonomous UAVs — that's the objective of Project Decurion.",
    heroImage: "assets/projects/drone/DSC01419.JPG",
    tags: ["SolidWorks", "FEA", "3D Printing"],
    href: "projects/quadcopter-frame.html"
  }

  // {
  //   id: "your-next-project",
  //   title: "Project Title",
  //   oneLiner: "One sentence describing what it is.",
  //   heroImage: "assets/projects/your-image.jpg",
  //   tags: ["SolidWorks", "Python", "Control Systems"],
  //   href: "projects/your-next-project.html"
  // },
];
