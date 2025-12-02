// 1. CHECK IF USER IS VISITING A SHARED LINK
const params = new URLSearchParams(window.location.search);
const encodedData = params.get('data');

if (encodedData) {
    // If there is data, show the REVEAL view
    document.getElementById('admin-view').classList.add('hidden');
    document.getElementById('reveal-view').classList.remove('hidden');
    
    // Decode the base64 string
    // Format is "ReceiverName"
    try {
        const targetName = atob(encodedData); 
        document.getElementById('target-name').innerText = targetName;
    } catch (e) {
        document.getElementById('target-name').innerText = "Invalid Link!";
    }

} else {
    // If no data, show the ADMIN view
    document.getElementById('reveal-view').classList.add('hidden');
}

// 2. ADMIN GENERATOR LOGIC
function generateLinks() {
    const input = document.getElementById('names-input').value;
    // Split names by comma and remove whitespace
    let names = input.split(',').map(name => name.trim()).filter(n => n);
    
    if (names.length < 2) {
        alert("Need at least 2 people!");
        return;
    }

    // Shuffle
    let shuffled = [...names].sort(() => Math.random() - 0.5);
    let linksHTML = "<ul>";

    const baseUrl = window.location.href.split('?')[0];

    for (let i = 0; i < shuffled.length; i++) {
        let giver = shuffled[i];
        let receiver = shuffled[(i + 1) % shuffled.length];

        // We encode the receiver's name into Base64 so it's not readable text in the URL
        let secretCode = btoa(receiver);
        let uniqueLink = `${baseUrl}?data=${secretCode}`;

        linksHTML += `<li><strong>Link for ${giver}:</strong> <br> <input type="text" value="${uniqueLink}" readonly></li>`;
    }

    linksHTML += "</ul>";
    document.getElementById('links-output').innerHTML = linksHTML;
}