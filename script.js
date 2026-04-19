// ========== MENU TOGGLE (Toolbar "=") ==========
function initMenuToggle() {
    const menuToggle = document.getElementById('menuToggle');
    const menuDropdown = document.getElementById('menuDropdown');
    const menuIcon = document.getElementById('menuIcon');
    
    if (menuToggle && menuDropdown) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = menuDropdown.classList.contains('hidden');
            if (isHidden) {
                menuDropdown.classList.remove('hidden');
                if (menuIcon) menuIcon.classList.replace('fa-bars', 'fa-times');
            } else {
                menuDropdown.classList.add('hidden');
                if (menuIcon) menuIcon.classList.replace('fa-times', 'fa-bars');
            }
        });
        
        // Tutup menu klik di luar
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !menuDropdown.contains(e.target)) {
                menuDropdown.classList.add('hidden');
                if (menuIcon) menuIcon.classList.replace('fa-times', 'fa-bars');
            }
        });
    }
}

// ========== JAM & KALENDER ==========
function updateClock() {
    const now = new Date();
    const clockEl = document.getElementById('clock');
    const dateEl = document.getElementById('date');
    
    if (clockEl) {
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        clockEl.textContent = `${hours}:${minutes}:${seconds}`;
    }
    
    if (dateEl) {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const day = days[now.getDay()];
        const date = now.getDate();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        dateEl.textContent = `${day}, ${date}/${month}/${year}`;
    }
}
setInterval(updateClock, 1000);
updateClock();

// ========== MUSIK BACKGROUND ==========
let isMusicPlaying = false;
let audio = null;

function initMusic() {
    audio = new Audio('https://mp3tourl.com/audio/1776552569609-4f24e83a-d138-4a5a-96da-f62001504988.mp3');
    audio.loop = true;
    audio.volume = 0.2;
}

const musicBtn = document.getElementById('musicToggle');
const musicIcon = document.getElementById('musicIcon');

if (musicBtn) {
    initMusic();
    musicBtn.addEventListener('click', () => {
        if (!isMusicPlaying) {
            audio.play().catch(e => console.log('Autoplay blocked'));
            if (musicIcon) {
                musicIcon.classList.remove('fa-music');
                musicIcon.classList.add('fa-pause');
            }
            isMusicPlaying = true;
        } else {
            audio.pause();
            if (musicIcon) {
                musicIcon.classList.remove('fa-pause');
                musicIcon.classList.add('fa-music');
            }
            isMusicPlaying = false;
        }
    });
}

// ========== PARTIKEL ==========
function createParticles() {
    const particlesDiv = document.getElementById('particles');
    if (!particlesDiv) return;
    
    for (let i = 0; i < 40; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${Math.random() * 10 + 5}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particlesDiv.appendChild(particle);
    }
}
createParticles();

// ========== LOAD ANIME DARI JSON (Khusus Saya) ==========
async function loadMyAnime() {
    const container = document.getElementById('myAnimeGrid');
    if (!container) return;
    
    try {
        const response = await fetch('myAnime.json');
        const animeList = await response.json();
        
        container.innerHTML = animeList.map(anime => `
            <div class="anime-card group relative overflow-hidden rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-105">
                <div class="relative h-48 md:h-56 overflow-hidden">
                    <img src="${anime.gambar}" alt="${anime.judul}" class="w-full h-full object-cover transition duration-500 group-hover:scale-110" onerror="this.src='https://placehold.co/400x300?text=No+Image'">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                </div>
                <div class="p-4 md:p-5">
                    <h3 class="text-lg md:text-xl font-bold text-white">${anime.judul}</h3>
                    <p class="text-purple-300 text-xs md:text-sm mt-1"><i class="fas fa-user mr-1"></i> MC: ${anime.mc}</p>
                    <div class="flex flex-wrap gap-1 md:gap-2 mt-2">
                        ${anime.genre.map(g => `<span class="px-2 py-0.5 md:py-1 text-xs rounded-full bg-purple-500/30 text-purple-200">${g}</span>`).join('')}
                    </div>
                    <div class="mt-3 p-2 md:p-3 rounded-lg bg-black/30">
                        <p class="text-white/80 text-xs md:text-sm"><i class="fas fa-comment mr-1"></i> Pendapat: ${anime.pendapat}</p>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Gagal load anime:', error);
        container.innerHTML = '<div class="col-span-full text-center text-white py-10">Gagal memuat data anime</div>';
    }
}

// ========== LOCALSTORAGE UNTUK ANIME PUBLIK ==========
function loadUserAnime() {
    const stored = localStorage.getItem('userAnimeList');
    return stored ? JSON.parse(stored) : [];
}

function saveUserAnime(animeList) {
    localStorage.setItem('userAnimeList', JSON.stringify(animeList));
}

// Tambah anime baru (dari modal)
function initAddAnimeForm() {
    const form = document.getElementById('addAnimeForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = document.getElementById('animeTitle').value.trim();
        const mc = document.getElementById('animeMc').value.trim();
        const genre = document.getElementById('animeGenre').value.trim();
        const imageUrl = document.getElementById('animeImage').value.trim();
        const review = document.getElementById('animeReview').value.trim();
        
        if (!title || !mc || !genre || !imageUrl) {
            alert('Harap isi semua field yang diperlukan!');
            return;
        }
        
        const animeList = loadUserAnime();
        animeList.unshift({
            id: Date.now(),
            title: title,
            mc: mc,
            genre: genre.split(',').map(g => g.trim()),
            imageUrl: imageUrl,
            review: review || 'Tidak ada pendapat'
        });
        
        saveUserAnime(animeList);
        alert('Berhasil menambahkan anime!');
        form.reset();
        closeModal();
        
        if (window.location.pathname.includes('page2.html')) {
            displayUserAnime();
        }
    });
}

// Modal handlers
function openModal() {
    const modal = document.getElementById('addModal');
    if (modal) modal.classList.remove('hidden');
}

function closeModal() {
    const modal = document.getElementById('addModal');
    if (modal) modal.classList.add('hidden');
}

// Tampilkan di page2
function displayUserAnime() {
    const container = document.getElementById('userAnimeList');
    const emptyState = document.getElementById('emptyState');
    const animeList = loadUserAnime();
    
    if (!container) return;
    
    if (animeList.length === 0) {
        container.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }
    
    if (emptyState) emptyState.classList.add('hidden');
    container.innerHTML = animeList.map(anime => `
        <div class="anime-card group relative overflow-hidden rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-105">
            <div class="relative h-48 md:h-56 overflow-hidden">
                <img src="${anime.imageUrl}" alt="${anime.title}" class="w-full h-full object-cover transition duration-500 group-hover:scale-110" onerror="this.src='https://placehold.co/400x300?text=No+Image'">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            </div>
            <div class="p-4 md:p-5">
                <h3 class="text-lg md:text-xl font-bold text-white">${escapeHtml(anime.title)}</h3>
                <p class="text-purple-300 text-xs md:text-sm mt-1"><i class="fas fa-user mr-1"></i> MC: ${escapeHtml(anime.mc)}</p>
                <div class="flex flex-wrap gap-1 md:gap-2 mt-2">
                    ${anime.genre.map(g => `<span class="px-2 py-0.5 md:py-1 text-xs rounded-full bg-purple-500/30 text-purple-200">${escapeHtml(g)}</span>`).join('')}
                </div>
                <div class="mt-3 p-2 md:p-3 rounded-lg bg-black/30">
                    <p class="text-white/80 text-xs md:text-sm"><i class="fas fa-comment mr-1"></i> Pendapat: ${escapeHtml(anime.review)}</p>
                </div>
                <button onclick="deleteAnime(${anime.id})" class="mt-3 w-full py-1 md:py-1.5 rounded-lg bg-red-500/30 text-red-200 text-xs md:text-sm hover:bg-red-500/50 transition">
                    <i class="fas fa-trash"></i> Hapus
                </button>
            </div>
        </div>
    `).join('');
}

function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

window.deleteAnime = function(id) {
    if (confirm('Hapus anime dari koleksi?')) {
        let animeList = loadUserAnime();
        animeList = animeList.filter(anime => anime.id !== id);
        saveUserAnime(animeList);
        displayUserAnime();
    }
};

// ========== INIT SEMUA FITUR ==========
document.addEventListener('DOMContentLoaded', () => {
    initMenuToggle();
    initAddAnimeForm();
    loadMyAnime();
    
    // Modal button handlers
    const openBtn = document.getElementById('openAddModalBtn');
    const closeBtn = document.getElementById('closeModal');
    
    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    
    // Close modal klik di luar
    const modal = document.getElementById('addModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
    
    // Jika di page2, tampilkan data
    if (window.location.pathname.includes('page2.html')) {
        displayUserAnime();
    }
});