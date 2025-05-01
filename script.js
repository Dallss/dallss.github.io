window.onload = function() {
    
    console.log('loaded')

    const text = "cd randall/"
    const div = document.getElementById('here');

    const cursor = document.createElement("span");
    cursor.className = 'cursor';

    div.appendChild(cursor);

    let i=0;
    function typeChar() {
        if(i<text.length){

            cursor.insertAdjacentText('beforebegin', text[i]);
            i++
            setTimeout(typeChar, 100);
        }
    }

    

    typeChar();
    
};