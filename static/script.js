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



    const carousel = document.getElementById('carousel');
    let isScrolling = false;
    let scrollTimeout;

    let itemCount = 0;
    
    const items = document.getElementsByClassName('car-item')

    for( let item of items) {

        item.addEventListener('click', function() {

            // TODO: fix broken bring into focus.
            // if (!item.classList.contains('expanded')){
            //     const childOffsetLeft = item.offsetLeft - carousel.offsetLeft;
            //     const scrollX = childOffsetLeft;
            //     if(scrollX > 0)
            //     carousel.scrollTo({ left: scrollX, behavior: 'smooth' });
                
            // }
          // if (isScrolling) return;
            
            // If this item is already expanded, collapse it
            if (item.classList.contains('expanded')) {
                item.classList.remove('expanded');
                currentExpandedItem = null;
            } else {
                // Collapse any currently expanded item
                if (currentExpandedItem) {
                currentExpandedItem.classList.remove('expanded');
                }
                item.classList.add('expanded');
                currentExpandedItem = item;
            }
        });
    }

    // carousel.addEventListener('scroll', ()=>{
    //     isScrolling = true;
      
    //   // Collapse any expanded item
    //   if (currentExpandedItem) {
    //     currentExpandedItem.classList.remove('expanded');
    //     currentExpandedItem = null;
    //   }
      
    //   // Clear previous timeout
    //   clearTimeout(scrollTimeout);
      
    //   // Set timeout to reset scrolling flag
    //   scrollTimeout = setTimeout(function() {
    //     isScrolling = false;
    //   }, 100);
    // })


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

