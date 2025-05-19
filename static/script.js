// Functions
function runTerminalSimulation(commands) {
    const container = document.getElementById("here");
    container.innerHTML = "";

    let cursor = document.createElement("span");
    cursor.className = "cursor";
    container.appendChild(cursor);

    // Start typing the first line after a short delay
    setTimeout(() => typeLineHeader(commands, container, cursor), 2000);
}
async function typeLineHeader(commands, container, cursor) {
    for (const { lineHeader, line } of commands) {
        // Create lineHeader element and add it to the container
        const lineHeaderElement = document.createElement("span");
        lineHeaderElement.className = "lineHeader";
        lineHeaderElement.textContent = lineHeader;
        container.insertBefore(lineHeaderElement, cursor);

        await typeLine(line, container, cursor);

        // Add a break after the line is typed
        container.insertBefore(document.createElement("br"), cursor);
    }

    // After all lines are typed, show the server message
    setTimeout(() => {
        const serverMessage = document.createElement("span");
        serverMessage.textContent = "Server starting ...";
        container.insertBefore(serverMessage, cursor);
        container.insertBefore(document.createElement("br"), cursor);

        // Simulate hiding the splash screen after a short delay
        setTimeout(() => {
            document.getElementById("splash").style.display = "none";
            document.getElementById("main-content").style.display = "block";

            runAfterTerminalSimulation();
        }, 2000);
    }, 1000);
}
async function typeLine(line, container, cursor) {
    return new Promise(resolve => {
        let charIndex = 0;

        const intervalId = setInterval(() => {
            if (charIndex < line.length) {
                cursor.insertAdjacentText("beforebegin", line[charIndex]);
                charIndex++;
            } else {
                clearInterval(intervalId);
                resolve();
            }
        }, 100); // Typing speed interval
    });
}
function runAfterTerminalSimulation() {
    const items = document.getElementsByClassName('car-item');
    if (items[0]) {
        items[0].click()
    }

    const slider = document.getElementById('slider');
    const sitems = slider.children;
    let index = 0;
    const total = sitems.length;
    setInterval(() => {
      index = (index + 1) % total;
      slider.style.transform = `translateY(-${index * 2.8}rem)`;
    }, 3000); // change every 3 seconds
}
function loadMoreProjects() {
    const track = document.getElementById('carousel-track');
    if (!track) return;

    const projects = [
        { label: 'Snake Game in C++', bg: "url('./static/images/snake.png')", link: 'https://github.com/Dallss/Snake-Game' },
        { label: 'Upload (under dev)', bg: "url('./static/images/upload.png')", link: 'https://github.com/ctrlsolutions/upload' },
        { label: 'Laymans-Law (under dev)', bg: "url('./static/images/laymans.png')", link: 'https://github.com/ctrlsolutions/laymans-law' },
        { label: '9 Mazes of Hell', bg: "url('./static/images/mazesofhell.png')", link: 'https://github.com/DaRainFlavor/9-Mazes-of-Hell' },
        { label: 'Budget-Co', bg: "url('./static/images/budgetco.png')", link: 'https://budget-co.up.railway.app/' },
        { label: 'Connect-4', bg: "url('./static/images/connect.png')", link: 'https://dallss.github.io/Minimax-Applications/connect-4' },
        { label: 'Chain-Reaction', bg: "url('./static/images/chain.png')", link: 'https://dallss.github.io/Minimax-Applications/chain-reaction' }
    ];

    // Clear existing content
    track.innerHTML = '';

    // Create and append each project element
    projects.forEach(({ label, bg, link }) => {
        const anchor = document.createElement('a');
        anchor.href = link;
        anchor.target = '_blank'; // Open in new tab
        anchor.rel = 'noopener noreferrer';
        anchor.className = 'project-link';
      
        const project = document.createElement('div');
        project.className = 'project';
        project.style.backgroundImage = bg;
        project.style.borderRadius = '30px';
        project.style.opacity = 0.5;
      
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
      
        const projectName = document.createElement('span');
        projectName.textContent = label;
      
        overlay.appendChild(projectName);
        project.appendChild(overlay);
        anchor.appendChild(project);
        track.appendChild(anchor);
      });

    // Clone for infinite effect
    const items = Array.from(track.children);
    items.forEach(item => {
        const clone = item.cloneNode(true);
        track.appendChild(clone);
    });

    let scrollAmount = 0;
    let animationId;

    function scrollCarousel() {
        scrollAmount += 1.1;
        if (scrollAmount >= track.scrollWidth / 2) {
        scrollAmount = 0;
        }
        track.style.transform = `translateX(-${scrollAmount}px)`;
        animationId = requestAnimationFrame(scrollCarousel);
    }

    function pauseCarousel() {
        cancelAnimationFrame(animationId);
    }

    function resumeCarousel() {
        animationId = requestAnimationFrame(scrollCarousel);
    }

    const wrapper = document.querySelector('.carousel-wrapper');
    wrapper.addEventListener('mouseenter', pauseCarousel);
    wrapper.addEventListener('mouseleave', resumeCarousel);

    resumeCarousel();
}
  

function loadFeaturedProjects() {
    const carouselItems = [
        { label: 'Budget-Co', bg: "url('./static/images/budgetco.png')", link: 'https://budget-co.up.railway.app/' },
        { label: 'RUBIKZ', bg: "url('./static/images/rubikz.png')", link: 'https://rubikz-i5pj.vercel.app/' },
        { label: 'Connect-4', bg: "url('./static/images/connect.png')", link: 'https://dallss.github.io/Minimax-Applications/connect-4' },
        { label: 'Chain-Reaction', bg: "url('./static/images/chain.png')", link: 'https://dallss.github.io/Minimax-Applications/chain-reaction' }
    ];
    
    const carousel = document.getElementById('carousel');
    let currentExpandedItem = null;

    carouselItems.forEach(({ label, bg, link }) => {
        const item = document.createElement('div');
        item.classList.add('car-item');

        // Create background overlay div
        const bgOverlay = document.createElement('div');
        bgOverlay.classList.add('bg-overlay');
        bgOverlay.style.backgroundImage = bg;

        // Create the anchor element
        const anchor = document.createElement('a');
        anchor.textContent = label;
        anchor.href = link;
        anchor.target = '_blank';
        anchor.style.color = 'inherit';
        anchor.style.textDecoration = 'none';

        item.appendChild(bgOverlay);
        item.appendChild(anchor);

        item.addEventListener('click', (e) => {
            if (e.target.tagName.toLowerCase() === 'a') return;

            if (item.classList.contains('expanded')) {
                item.classList.remove('expanded');
                bgOverlay.style.opacity = '';
                currentExpandedItem = null;
            } else {
                if (currentExpandedItem) {
                    currentExpandedItem.classList.remove('expanded');
                    currentExpandedItem.querySelector('.bg-overlay').style.opacity = '';
                }
                item.classList.add('expanded');
                bgOverlay.style.opacity = '0.3';
                currentExpandedItem = item;
            }
        });

        carousel.appendChild(item);
    });
}


document.addEventListener("DOMContentLoaded", function () {
    const commands = [
        { lineHeader: "randall@Randalls-MacBook ~ % ", line: "cd ./personal-website" },
        { lineHeader: "randall@Randalls-MacBook/randall ~ % ", line: "ls -la" },
        { lineHeader: "randall@Randalls-MacBook/randall~ % ", line: "npm run dev" }
    ];

    if (!localStorage.getItem('terminalSimulationCalled')) {
        // Call the function the first time the page is loaded
        runTerminalSimulation(commands);
    
        // Store a flag in localStorage so it doesn't run again
        localStorage.setItem('terminalSimulationCalled', 'false');
    } else {
        document.getElementById("splash").style.display = "none";
        document.getElementById("main-content").style.display = "block";
        setTimeout(()=>{
            runAfterTerminalSimulation();
        },500)
    }
    
    loadMoreProjects();
    loadFeaturedProjects();
});