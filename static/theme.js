const root = document.documentElement;

function applyTheme() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    root.classList.toggle("dark", savedTheme === "dark");
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", prefersDark);
  }
}

function updateIcon() {
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;
  toggle.textContent = root.classList.contains("dark") ? "☾" : "☼";
}

document.addEventListener("DOMContentLoaded", () => {
  applyTheme();
  updateIcon();

  const toggle = document.getElementById("theme-toggle");

  if (toggle) {
    toggle.addEventListener("click", () => {
      const isDark = root.classList.toggle("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      updateIcon();
    });
  }
});

// keyboard shortcut (global)
document.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j") {
    const isDark = root.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    updateIcon();
  }
});