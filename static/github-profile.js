async function loadGitHubProfile(username, containerId) {
   const container = document.getElementById(containerId);
   if (!container) return;
 
   const [userRes, orgRes] = await Promise.all([
     fetch(`https://api.github.com/users/${username}`),
     fetch(`https://api.github.com/users/${username}/orgs`)
   ]);
 
   const user = await userRes.json();
   const orgs = await orgRes.json();
 
   container.innerHTML = `
      <div class="gh-profile">
        <img class="gh-avatar" src="${user.avatar_url}" alt="" />

        <h2 class="gh-name">
          ${user.name || user.login}
        </h2>

        <p class="gh-meta">
          👥 <strong>${user.followers}</strong> followers · 
          <strong>${user.following}</strong> following
        </p>

        <hr class="gh-divider" />

        <h3 class="gh-org-title">Organizations</h3>

        <div class="gh-orgs">
          ${orgs.map(org => `
            <img class="gh-org-avatar"
                src="${org.avatar_url}"
                alt=""
                title="${org.login}" />
          `).join('')}
        </div>
      </div>
    `;
 }