// === DOM ELEMENTS ===
const adminView = document.getElementById('admin-view');
const revealView = document.getElementById('reveal-view');
const minigameContainer = document.getElementById('minigame-container');
const finalCard = document.getElementById('final-card');
const targetNameDisplay = document.getElementById('target-name');

const santaGear = document.getElementById('santa-unit-gear');
const dropZone = document.getElementById('drop-zone');
const engageBtn = document.getElementById('engage-btn');
const driveGear = document.querySelector('.drive-gear');
const progressFill = document.getElementById('progress-fill');

// === GAME CONFIGURATION ===
const totalTicksRequired = 8; 
const rotationDuration = 1000; // 1 second per full rotation
const impactDelay = 0;       // Optional: Delay the "tick" so it matches when the tooth hits the side (25% of 1000ms)

// === GAME STATE ===
let isGearPlaced = false;
let currentTicks = 0;

// === 1. INITIALIZATION (Keep existing code) ===
const params = new URLSearchParams(window.location.search);
const encodedData = params.get('data');
let finalTargetName = "ERROR";

if (encodedData) {
    adminView.classList.add('hidden');
    revealView.classList.remove('hidden');
    try { finalTargetName = atob(encodedData); } 
    catch (e) { finalTargetName = "INVALID LINK"; }
} else {
    revealView.classList.add('hidden');
    adminView.classList.remove('hidden');
}

// === 2. DRAG AND DROP (Keep existing code) ===
santaGear.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', 'santa');
    setTimeout(() => santaGear.classList.add('dragging'), 0);
});
santaGear.addEventListener('dragend', () => santaGear.classList.remove('dragging'));

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    if(!isGearPlaced) dropZone.classList.add('drag-hover');
});
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-hover'));

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-hover');
    const draggedId = e.dataTransfer.getData('text/plain');
    if (draggedId === 'santa' && !isGearPlaced) {
        dropZone.innerHTML = ""; 
        dropZone.appendChild(santaGear);
        dropZone.classList.remove('empty-slot');
        santaGear.setAttribute('draggable', 'false');
        santaGear.style.cursor = 'default';
        isGearPlaced = true;
        engageBtn.classList.remove('disabled');
        engageBtn.disabled = false;
    }
});

// === 3. UPDATED MINI-GAME MECHANICS ===

engageBtn.addEventListener('click', startGame);

function startGame() {
    engageBtn.classList.add('disabled');
    engageBtn.disabled = true;
    engageBtn.innerText = "CHARGING...";

    // 1. Set the CSS variable so animation matches JS timer exactly
    driveGear.style.setProperty('--spin-speed', `${rotationDuration}ms`);
    
    // 2. Start the continuous smooth spin of the Drive gear
    driveGear.classList.add('spinning-continuous');
    
    // 3. Prepare the Unit gear for snap transitions
    santaGear.classList.add('snap-rotate');

    let unitGearRotation = 0;

    // 4. Wait for the tooth to reach the contact point (Visual Polish)
    // If tooth is at top (0deg) and gear is at right (90deg), wait 1/4 of duration
    setTimeout(() => {
        
        // Start the Loop that runs once per Rotation
        const gameInterval = setInterval(() => {
            currentTicks++;

            // --- THE MECHANICAL SNAP ---
            // Calculate one "notch" of movement
            const rotationStep = 360 / totalTicksRequired;
            unitGearRotation -= rotationStep;
            
            // Apply rotation. Because of CSS .snap-rotate, this will "jump" fast then stop.
            santaGear.style.transform = `rotate(${unitGearRotation}deg)`;

            // Update Progress Bar
            const progressPct = (currentTicks / totalTicksRequired) * 100;
            progressFill.style.width = `${progressPct}%`;

            // Check Win
            if (currentTicks >= totalTicksRequired) {
                clearInterval(gameInterval);
                endGame();
            }

        }, rotationDuration); // Run exactly when drive gear finishes a loop

    }, impactDelay); 
}

function endGame() {
    // Wait for the final snap animation to finish
    setTimeout(() => {
        driveGear.classList.remove('spinning-continuous');
        engageBtn.innerText = "COMPLETE!";
        
        // Hide game, show card
        setTimeout(() => {
            minigameContainer.classList.add('hidden');
            targetNameDisplay.innerText = finalTargetName;
            finalCard.classList.remove('hidden');
        }, 500);
        
    }, 500);
}

// === 4. ADMIN LOGIC (Keep existing code) ===
function generateLinks() {
    const input = document.getElementById('names-input').value;
    let names = input.split(',').map(e => e.trim()).filter(e => e);
    if (names.length < 2) { alert("Need at least 2 players!"); return; }
    let shuffled = [...names].sort(() => Math.random() - 0.5);
    let linksHTML = "<ul>";
    const baseUrl = window.location.href.split('?')[0];
    for (let i = 0; i < shuffled.length; i++) {
        let giver = shuffled[i];
        let receiver = shuffled[(i + 1) % shuffled.length];
        let secretCode = btoa(receiver);
        let uniqueLink = `${baseUrl}?data=${secretCode}`;
        linksHTML += `<li><strong>${giver} receives link:</strong> <br> <input type="text" value="${uniqueLink}" readonly onclick="this.select()"></li>`;
    }
    linksHTML += "</ul>";
    document.getElementById('links-output').innerHTML = linksHTML;
}