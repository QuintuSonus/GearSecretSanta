// 1. CHECK IF USER IS VISITING A SHARED LINK
const params = new URLSearchParams(window.location.search);
const encodedData = params.get('data');

const adminView = document.getElementById('admin-view');
const revealView = document.getElementById('reveal-view');
const gearLoader = document.getElementById('gear-loader');
const finalCard = document.getElementById('final-card');
const targetNameDisplay = document.getElementById('target-name');


if (encodedData) {
    // --- REVEAL SEQUENCE STARTS ---
    adminView.classList.add('hidden');
    revealView.classList.remove('hidden');
    
    // Ensure final card is hidden initially
    finalCard.classList.add('hidden'); 
    // Ensure gears are showing initially
    gearLoader.classList.remove('hidden');

    let decodedName = "";
    try {
        decodedName = atob(encodedData);
    } catch (e) {
        decodedName = "INVALID LINK DATA";
    }

    // Set the name in the background while gears spin
    targetNameDisplay.innerText = decodedName;

    // WAIT 3 SECONDS, THEN SHOW RESULT
    setTimeout(() => {
        // Hide gears
        gearLoader.classList.add('hidden');
        // Show final card container
        finalCard.classList.remove('hidden');
        // Trigger CSS Fade In animation
        setTimeout(() => {
             finalCard.classList.add('fade-in-active');
        }, 50); // Tiny delay to ensure CSS registers the state change
       
    }, 3000 /* 3000ms = 3 seconds wait */);


} else {
    // SHOW ADMIN VIEW
    revealView.classList.add('hidden');
    adminView.classList.remove('hidden');
}

// 2. ADMIN GENERATOR LOGIC (Unchanged from before)
function generateLinks() {
    const input = document.getElementById('names-input').value;
    let names = input.split(',').map(name => name.trim()).filter(n => n);
    
    if (names.length < 2) {
        alert("Need at least 2 operatives to engage protocol!");
        return;
    }

    let shuffled = [...names].sort(() => Math.random() - 0.5);
    let linksHTML = "<ul>";
    const baseUrl = window.location.href.split('?')[0];

    for (let i = 0; i < shuffled.length; i++) {
        let giver = shuffled[i];
        let receiver = shuffled[(i + 1) % shuffled.length];
        let secretCode = btoa(receiver);
        let uniqueLink = `${baseUrl}?data=${secretCode}`;

        linksHTML += `<li><strong>Link for ${giver}:</strong> <br> <input type="text" value="${uniqueLink}" readonly></li>`;
    }
    linksHTML += "</ul>";
    document.getElementById('links-output').innerHTML = linksHTML;
}
