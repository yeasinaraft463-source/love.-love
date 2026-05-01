// Global Variables
let currentStyle = '';
let uploadedPhotos = [];
let uploadedAudio = null;
let currentSlide = 0;
let userData = {
    yourName: '',
    partnerName: '',
    photos: [],
    audio: null
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    createFloatingHearts();
});

// Setup Event Listeners
function setupEventListeners() {
    const inputForm = document.getElementById('inputForm');
    inputForm.addEventListener('submit', handleFormSubmit);

    const photoUpload = document.getElementById('photoUpload');
    photoUpload.addEventListener('change', handlePhotoUpload);

    const audioUpload = document.getElementById('audioUpload');
    audioUpload.addEventListener('change', handleAudioUpload);

    // Share and QR buttons
    const shareBtn = document.getElementById('shareBtn');
    const qrBtn = document.getElementById('qrBtn');
    const shareBtn2 = document.getElementById('shareBtn2');
    const qrBtn2 = document.getElementById('qrBtn2');

    if (shareBtn) shareBtn.addEventListener('click', generateShareLink);
    if (qrBtn) qrBtn.addEventListener('click', generateQRCode);
    if (shareBtn2) shareBtn2.addEventListener('click', generateShareLink);
    if (qrBtn2) qrBtn2.addEventListener('click', generateQRCode);

    // Modal close
    window.addEventListener('click', function(event) {
        const modal = event.target;
        if (modal.classList && modal.classList.contains('modal')) {
            closeModal();
        }
    });
}

// Handle Photo Upload
function handlePhotoUpload(event) {
    const files = event.target.files;
    uploadedPhotos = [];
    const preview = document.getElementById('photoPreview');
    preview.innerHTML = '';

    if (files.length === 0) {
        return;
    }

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = function(e) {
            uploadedPhotos.push(e.target.result);

            // Create preview
            const previewDiv = document.createElement('div');
            previewDiv.className = 'preview-item';
            const img = document.createElement('img');
            img.src = e.target.result;
            previewDiv.appendChild(img);
            preview.appendChild(previewDiv);
        };

        reader.readAsDataURL(file);
    }
}

// Handle Audio Upload
function handleAudioUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        uploadedAudio = e.target.result;
        const audioPreview = document.getElementById('audioPreview');
        audioPreview.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span>🎵</span>
                <span>${file.name}</span>
                <span style="font-size: 0.8rem; color: #999;">${(file.size / 1024 / 1024).toFixed(2)}MB</span>
            </div>
        `;
    };
    reader.readAsDataURL(file);
}

// Handle Form Submit
function handleFormSubmit(event) {
    event.preventDefault();

    const yourName = document.getElementById('yourName').value;
    const partnerName = document.getElementById('partnerName').value;

    if (!yourName || !partnerName) {
        alert('Please fill in all fields');
        return;
    }

    if (uploadedPhotos.length === 0) {
        alert('Please upload at least one photo');
        return;
    }

    if (!uploadedAudio) {
        alert('Please upload a song');
        return;
    }

    // Save data
    userData = {
        yourName: yourName,
        partnerName: partnerName,
        photos: uploadedPhotos,
        audio: uploadedAudio
    };

    // Go to style selection
    goToPage(2);
}

// Select Style
function selectStyle(style) {
    currentStyle = style;
    goToPage(3); // Loading page
    
    // Simulate loading
    setTimeout(() => {
        if (style === 'birthday') {
            setupBirthdayPage();
            goToPage(4);
        } else if (style === 'romantic') {
            setupRomanticPage();
            goToPage(5);
        }
    }, 2000);
}

// Setup Birthday Page
function setupBirthdayPage() {
    const caption = document.getElementById('birthdayCaption');
    caption.textContent = `Happy Birthday My Love, ${userData.partnerName}! ❤️`;

    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.src = userData.audio;

    // Create floating hearts
    createFloatingHearts('floatingHeartsContainer');

    // Create confetti
    createConfetti();

    // Auto play audio
    audioPlayer.play().catch(err => console.log('Autoplay prevented:', err));
}

// Setup Romantic Page
function setupRomanticPage() {
    const audioPlayer = document.getElementById('audioPlayer2');
    audioPlayer.src = userData.audio;

    // Setup slideshow
    createSlideshow();

    // Auto play audio
    audioPlayer.play().catch(err => console.log('Autoplay prevented:', err));
}

// Create Slideshow
function createSlideshow() {
    const slideshowContainer = document.querySelector('.slideshow-container');
    slideshowContainer.innerHTML = '';

    userData.photos.forEach((photo, index) => {
        const slide = document.createElement('div');
        slide.className = 'slide fade';
        slide.id = `slide${index}`;
        const img = document.createElement('img');
        img.src = photo;
        img.className = 'slide-img';
        slide.appendChild(img);
        slideshowContainer.appendChild(slide);
    });

    // Create controls
    const controls = document.createElement('div');
    controls.className = 'slide-controls';
    controls.innerHTML = `
        <button class="btn btn-nav" onclick="changeSlide(-1)">❮</button>
        <span id="slideCounter">1 / ${userData.photos.length}</span>
        <button class="btn btn-nav" onclick="changeSlide(1)">❯</button>
    `;
    slideshowContainer.appendChild(controls);

    currentSlide = 0;
    showSlide(0);
}

// Change Slide
function changeSlide(n) {
    currentSlide += n;
    const slides = document.querySelectorAll('.slide');
    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }
    if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }
    showSlide(currentSlide);
}

// Show Slide
function showSlide(n) {
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        slide.style.display = 'none';
    });
    if (slides[n]) {
        slides[n].style.display = 'flex';
    }

    // Update counter
    const counter = document.getElementById('slideCounter');
    if (counter) {
        counter.textContent = `${n + 1} / ${slides.length}`;
    }
}

// Apply Caption
function applyCaption() {
    const captionInput = document.getElementById('customCaption');
    const captionDisplay = document.getElementById('captionDisplay');

    if (captionInput.value.trim()) {
        captionDisplay.textContent = `"${captionInput.value}"`;
        captionDisplay.style.animation = 'none';
        setTimeout(() => {
            captionDisplay.style.animation = 'fadeIn 0.8s ease-in';
        }, 10);
    } else {
        alert('Please write a caption');
    }
}

// Create Floating Hearts
function createFloatingHearts(containerId = null) {
    const container = containerId ? 
        document.getElementById(containerId) : 
        document.querySelector('.floating-hearts-bg');

    if (!container) return;

    const hearts = ['❤️', '💕', '💖', '💗', '💓'];
    
    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        
        const offsetX = Math.random() * 200 - 100;
        heart.style.setProperty('--offset-x', offsetX + 'px');
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 2 + 's';
        
        if (container.id === 'floatingHeartsContainer') {
            heart.style.position = 'absolute';
            heart.style.left = Math.random() * 80 + 10 + '%';
        }
        
        container.appendChild(heart);
    }
}

// Create Confetti
function createConfetti() {
    const container = document.getElementById('confettiContainer');
    if (!container) return;

    const confettiPieces = 50;
    
    for (let i = 0; i < confettiPieces; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.backgroundColor = ['#ff6b9d', '#ff1493', '#ff69b4', '#ffb3d9', '#ffd9e8'][Math.floor(Math.random() * 5)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        container.appendChild(confetti);
    }
}

// Generate Shareable Link
function generateShareLink() {
    // Create a simple ID for the story
    const storyId = 'love_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    // Save data to localStorage
    const storyData = {
        yourName: userData.yourName,
        partnerName: userData.partnerName,
        photos: userData.photos,
        audio: userData.audio,
        style: currentStyle,
        caption: document.getElementById('customCaption')?.value || ''
    };
    
    localStorage.setItem(storyId, JSON.stringify(storyData));
    
    // Generate shareable link
    const baseUrl = window.location.origin + window.location.pathname;
    const shareLink = `${baseUrl}?story=${storyId}`;
    
    // Show modal
    showShareModal(shareLink);
}

// Show Share Modal
function showShareModal(link) {
    const shareLink = document.getElementById('shareLink');
    shareLink.value = link;
    
    const shareModal = document.getElementById('shareModal');
    shareModal.classList.add('active');
}

// Copy to Clipboard
function copyToClipboard() {
    const shareLink = document.getElementById('shareLink');
    shareLink.select();
    document.execCommand('copy');
    
    alert('Link copied to clipboard!');
}

// Generate QR Code
function generateQRCode() {
    // Get the current share link
    const storyId = 'love_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    // Save data
    const storyData = {
        yourName: userData.yourName,
        partnerName: userData.partnerName,
        photos: userData.photos,
        audio: userData.audio,
        style: currentStyle,
        caption: document.getElementById('customCaption')?.value || ''
    };
    
    localStorage.setItem(storyId, JSON.stringify(storyData));
    
    // Generate link
    const baseUrl = window.location.origin + window.location.pathname;
    const qrLink = `${baseUrl}?story=${storyId}`;
    
    // Clear previous QR
    const qrContainer = document.getElementById('qrCodeContainer');
    qrContainer.innerHTML = '';
    
    // Generate QR code
    new QRCode(qrContainer, {
        text: qrLink,
        width: 300,
        height: 300,
        colorDark: '#ff6b9d',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });
    
    // Show modal
    const qrModal = document.getElementById('qrModal');
    qrModal.classList.add('active');
}

// Download QR Code
function downloadQR() {
    const qrCanvas = document.querySelector('#qrCodeContainer canvas');
    const link = document.createElement('a');
    link.href = qrCanvas.toDataURL('image/png');
    link.download = 'love-story-qr.png';
    link.click();
}

// Close Modal
function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('active');
    });
}

// Navigate to Page
function goToPage(pageNumber) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById('page' + pageNumber);
    if (targetPage) {
        targetPage.classList.add('active');
    }
}

// Go Back
function goBack() {
    // Reset everything
    currentStyle = '';
    currentSlide = 0;
    uploadedPhotos = [];
    uploadedAudio = null;
    
    // Clear form
    document.getElementById('inputForm').reset();
    document.getElementById('photoPreview').innerHTML = '';
    document.getElementById('audioPreview').innerHTML = '';
    
    // Go back to page 1
    goToPage(1);
}

// Check for shared story on page load
window.addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const storyId = urlParams.get('story');
    
    if (storyId) {
        const storyData = localStorage.getItem(storyId);
        if (storyData) {
            const story = JSON.parse(storyData);
            userData = story;
            
            // Set up the story
            if (story.style === 'birthday') {
                setupBirthdayPage();
                goToPage(4);
            } else if (story.style === 'romantic') {
                document.getElementById('customCaption').value = story.caption;
                setupRomanticPage();
                goToPage(5);
            }
        }
    }
});
