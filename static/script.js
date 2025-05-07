window.onload = function () {
    // Array of objects containing lineHeader and line
    const commands = [
        { lineHeader: "randall@Randalls-MacBook ~ % ", line: "cd ./randall" },
        { lineHeader: "randall@Randalls-MacBook/randall ~ % ", line: "ls -la" },
        { lineHeader: "randall@Randalls-MacBook/randall~ % ", line: "npm start" }
    ];

    const container = document.getElementById("here");
    let cursor = document.createElement("span");
    cursor.className = "cursor";
    container.appendChild(cursor);

    let commandIndex = 0;
    let charIndex = 0;

    function typeLineHeader() {
        const { lineHeader, line } = commands[commandIndex];
        const lineHeaderElement = document.createElement("span");
        lineHeaderElement.className = "lineHeader";  // Apply the green color here
        lineHeaderElement.textContent = lineHeader;
        container.insertBefore(lineHeaderElement, cursor);
        setTimeout(() => typeLine(line), 1500); // Wait a bit before typing the line
    }

    function typeLine(line) {
        if (charIndex < line.length) {
        cursor.insertAdjacentText("beforebegin", line[charIndex]);
        charIndex++;
        setTimeout(() => typeLine(line), 100);
        } else {
        container.insertBefore(document.createElement("br"), cursor);
        commandIndex++;
        charIndex = 0;

        if (commandIndex < commands.length) {
            setTimeout(typeLineHeader, 300); // After typing a line, add the lineHeader again before the next line
        } else {
            setTimeout(() => {
            // Add "Server starting ..." message without the lineHeader and stay for 2 seconds
            const serverMessage = document.createElement("span");
            serverMessage.textContent = "Server starting ...";
            container.insertBefore(serverMessage, cursor);
            container.insertBefore(document.createElement("br"), cursor); // Add a line break after message
            setTimeout(() => {
                // After 2 seconds, hide the splash screen and show the content
                document.getElementById("splash").style.display = "none";
                document.getElementById("main-content").style.display = "block";
            }, 2000); 
            }, 1000);
        }
        }
    }

    setTimeout(()=>{

        const items = document.getElementsByClassName('car-item')

        items[0].classList.add('expanded');
        currentExpandedItem = items[0];
        console.log('irpinted');

    }, 11500)
    typeLineHeader(); // Start typing the first lineHeader immediately
};


const carouselItems = [
    { label: 'RUBIKZ', bg: '', link: 'https://rubikz-i5pj.vercel.app/' },
    { label: 'Budget-Co', bg: 'url(budget.jpg)', link: 'https://budget-co.up.railway.app/' },
    { label: 'Connect-4', bg: '', link: 'https://dallss.github.io/Minimax-Applications/connect-4' },
    { label: 'Chain-Reaction', bg: 'url(chain.jpg)', link: 'https://dallss.github.io/Minimax-Applications/chain-reaction' }
  ];
  
  const carousel = document.getElementById('carousel');
  let currentExpandedItem = null;
  
  carouselItems.forEach(({ label, bg, link }) => {
    const item = document.createElement('div');
    item.classList.add('car-item');
  
    // Create the anchor element
    const anchor = document.createElement('a');
    anchor.textContent = label;
    anchor.href = link;
    anchor.target = '_blank'; // optional: opens in new tab
    anchor.style.color = 'inherit'; // optional: preserve text color
    anchor.style.textDecoration = 'none';
  
    item.appendChild(anchor);
  
    if (bg) {
      item.style.backgroundImage = bg;
      item.style.backgroundSize = 'cover';
      item.style.backgroundPosition = 'center';
    }
  
    item.addEventListener('click', (e) => {
      // Avoid expanding when clicking the link
      if (e.target.tagName.toLowerCase() === 'a') return;
  
      if (item.classList.contains('expanded')) {
        item.classList.remove('expanded');
        currentExpandedItem = null;
      } else {
        if (currentExpandedItem) {
          currentExpandedItem.classList.remove('expanded');
        }
        item.classList.add('expanded');
        currentExpandedItem = item;
      }
    });
  
    carousel.appendChild(item);
  });
  
  


document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('carousel-track');

    if (!track) return;

    // Clone all project items
    const cloneItems = () => {
        const items = Array.from(track.children);
        items.forEach(item => {
        const clone = item.cloneNode(true);
        track.appendChild(clone);
        });
    };

    cloneItems();

    let scrollAmount = 0;
    let animationId;

    function scrollCarousel() {
        scrollAmount += 1;
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

    // Start scrolling
    resumeCarousel();
    });
    

  document.addEventListener("DOMContentLoaded", function() {
    const slider = document.getElementById('slider');
    const items = slider.children;
    let index = 0;
    const total = items.length;

    setInterval(() => {
      index = (index + 1) % total;
      slider.style.transform = `translateY(-${index * 2.8}rem)`;
    }, 3000); // change every 3 seconds
  });

