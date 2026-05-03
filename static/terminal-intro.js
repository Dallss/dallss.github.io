function initHomeContent() {
   const profileMount = document.getElementById("github-profile");
   if (profileMount) {
      loadGitHubProfile("dallss", "github-profile");
   }

   const mdEl = document.getElementById("markdown");
   if (mdEl && typeof marked !== "undefined") {
      const readmeUrl =
          "https://raw.githubusercontent.com/Dallss/Dallss/refs/heads/main/README.md";
      fetch(readmeUrl)
          .then((res) => res.text())
          .then((md) => {
             mdEl.innerHTML = marked.parse(md);
          })
          .catch(() => {});
   }

   const slider = document.getElementById("slider");
   if (!slider) return;

   const sitems = slider.children;
   let index = 0;
   const total = sitems.length;
   if (total <= 1) return;

   function getSlideHeight() {
      const firstItem = sitems[0];
      if (firstItem) return firstItem.offsetHeight;
      if (window.innerWidth <= 375) return 32;
      if (window.innerWidth <= 480) return 35.2;
      return 44.8;
   }

   setInterval(() => {
      index = (index + 1) % total;
      const slideHeight = getSlideHeight();
      slider.style.transform = `translateY(-${index * slideHeight}px)`;
   }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
   initHomeContent();
});
