// window.onload = function () {
//     // Array of objects containing lineHeader and line
//     const commands = [
//         { lineHeader: "randall@Randalls-MacBook ~ % ", line: "cd ./randall" },
//         { lineHeader: "randall@Randalls-MacBook/randall ~ % ", line: "ls -la" },
//         { lineHeader: "randall@Randalls-MacBook/randall~ % ", line: "npm start" }
//     ];

//     const container = document.getElementById("here");
//     let cursor = document.createElement("span");
//     cursor.className = "cursor";
//     container.appendChild(cursor);

//     let commandIndex = 0;
//     let charIndex = 0;

//     function typeLineHeader() {
//         const { lineHeader, line } = commands[commandIndex];
//         const lineHeaderElement = document.createElement("span");
//         lineHeaderElement.className = "lineHeader";  // Apply the green color here
//         lineHeaderElement.textContent = lineHeader;
//         container.insertBefore(lineHeaderElement, cursor);
//         setTimeout(() => typeLine(line), 1500); // Wait a bit before typing the line
//     }

//     function typeLine(line) {
//         if (charIndex < line.length) {
//         cursor.insertAdjacentText("beforebegin", line[charIndex]);
//         charIndex++;
//         setTimeout(() => typeLine(line), 100);
//         } else {
//         container.insertBefore(document.createElement("br"), cursor);
//         commandIndex++;
//         charIndex = 0;

//         if (commandIndex < commands.length) {
//             setTimeout(typeLineHeader, 300); // After typing a line, add the lineHeader again before the next line
//         } else {
//             setTimeout(() => {
//             // Add "Server starting ..." message without the lineHeader and stay for 2 seconds
//             const serverMessage = document.createElement("span");
//             serverMessage.textContent = "Server starting ...";
//             container.insertBefore(serverMessage, cursor);
//             container.insertBefore(document.createElement("br"), cursor); // Add a line break after message
//             setTimeout(() => {
//                 // After 2 seconds, hide the splash screen and show the content
//                 document.getElementById("splash").style.display = "none";
//                 document.getElementById("main-content").style.display = "block";
//             }, 2000); 
//             }, 1000);
//         }
//         }
//     }

//     typeLineHeader(); // Start typing the first lineHeader immediately
// };



   const carousel = document.getElementById('carousel');
   console.log(carousel)
    let isScrolling = false;
    let scrollTimeout;

    let itemCount = 0;
    
    const items = document.getElementsByClassName('car-item')
    let currentExpandedItem = items[0];

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