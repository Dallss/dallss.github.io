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
     <div style=" color: #c9d1d9; font-family: sans-serif;">
       <img src="${user.avatar_url}" style="width: 100%; border-radius: 50%; border: 2px solid #30363d;" />
       <h2 style="margin-top: 0.5rem;">${user.name || user.login}</h2>
       <p>
         👥 <strong>${user.followers}</strong> followers · <strong>${user.following}</strong> following
       </p>
 
       <hr style="border: 1px solid #30363d; margin: 1rem 0;" />
 
       <h3 style="text-align: left;">Organizations</h3>
       <div style="display: flex; gap: 8px; flex-wrap: wrap;">
         ${orgs.map(org => `
           <img src="${org.avatar_url}" title="${org.login}" width="40" height="40" style="border-radius: 8px;" />
         `).join('')}
       </div>
     </div>
   `;
 }
 