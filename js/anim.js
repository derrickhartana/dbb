document.addEventListener("DOMContentLoaded", () => {
  const headerCard    = document.getElementById('headerCard');
  const expandSection = document.getElementById('expandSection');
  const stickySubtext = document.getElementById('stickySubtext');
  const content       = document.getElementById('page-content');

  // --- 1. ANIMASI MASUK (Untuk Navigasi Internal) ---
  if (sessionStorage.getItem('hasLoaded')) {
    if (content) {
      // Pastikan bersih dari state keluar
      content.classList.remove('page-leaving');
      // Jalankan blur-in
      requestAnimationFrame(() => {
        content.classList.add('page-visible');
      });
    }
    initFadeUpBlur();
  }

  function initFadeUpBlur() {
    const fadeItems = Array.from(document.querySelectorAll('.fade-up-blur'));
  
    // Sort elemen berdasarkan posisi vertikal (atas ke bawah)
    fadeItems.sort((a, b) => {
      return a.getBoundingClientRect().top - b.getBoundingClientRect().top;
    });
  
    let firstBatchTriggered = false;
  
    const obs = new IntersectionObserver((entries) => {
      // Filter hanya entri yang sedang masuk viewport
      const intersectingEntries = entries.filter(entry => entry.isIntersecting);
  
      if (intersectingEntries.length > 0) {
        intersectingEntries.forEach((entry) => {
          if (!entry.target.classList.contains('show')) {
            
            if (!firstBatchTriggered) {
              // --- GRUP PERTAMA (Setelah Load) ---
              // Cari indeksnya di array yang sudah disort untuk urutan top-to-bottom
              const sortedIndex = fadeItems.indexOf(entry.target);
              entry.target.style.transitionDelay = `${sortedIndex * 0.25}s`;
            } else {
              // --- GRUP BERIKUTNYA (Saat Scroll) ---
              // Hapus delay agar muncul instan saat discroll
              entry.target.style.transitionDelay = '0s';
            }
  
            entry.target.classList.add('show');
          }
        });
  
        // Setelah iterasi pertama selesai, set flag ke true
        // sehingga deteksi scroll berikutnya tidak pakai delay lagi
        firstBatchTriggered = true;
      }
    }, { 
      threshold: 0.1 
    });
  
    fadeItems.forEach(el => obs.observe(el));
  }
  
  // Pastikan fungsi ini dipanggil di dalam startPageEnter() dan DOMContentLoaded
  window.initScrollAnimations = initFadeUpBlur;

// --- 3. NAVBAR STICKY (SINKRON: BLUR & COLLAPSE BERSAMAAN) ---
  if (headerCard && expandSection && stickySubtext) {
    const navObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          // SAAT MUNCUL (Expand)
          expandSection.style.maxHeight = '50px';
          // Teks kecil muncul (class 'show' mengandung filter blur: 0)
          stickySubtext.classList.add('show');
        } else {
          // SAAT HILANG (Collapse) - Keduanya dipicu di baris yang sama
          stickySubtext.classList.remove('show'); // Blur Out
          expandSection.style.maxHeight = '0';    // Collapse Down
        }
      });
    }, { 
      rootMargin: '0px 0px -100px 0px', 
      threshold: 0 
    });
    navObs.observe(headerCard);
  }

  // --- 4. EFEK KELUAR (50% Collapse -> Blur Out Tanpa Zoom) ---
  document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (this.closest('.nav-pills')) return;

      if (href && href.includes('.html') && !href.startsWith('#')) {
        e.preventDefault();

        // A. Tutup Navbar
        if (stickySubtext && expandSection) {
          stickySubtext.classList.remove('show');
          expandSection.style.maxHeight = '0';
        }

        // B. Blur Out Page (Jeda 200ms agar sinkron dengan navbar)
        setTimeout(() => {
          if (content) {
            content.classList.remove('page-visible');
            content.classList.add('page-leaving');
          }
        }, 200);

        // C. Pindah Halaman
        setTimeout(() => { window.location.href = href; }, 700);
      }
    });
  });
});