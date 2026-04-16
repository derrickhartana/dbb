const initCorrectLoading = () => {
    const loader = document.getElementById('loader');
    const content = document.getElementById('page-content');
    const navLogo = document.querySelector('.navbar-brand');
    const navSearch = document.getElementById('searchGroup');
    const allImgs = document.querySelectorAll('img');

    const isReload = performance.getEntriesByType("navigation")[0]?.type === "reload";
    const hasLoadedBefore = sessionStorage.getItem('hasLoaded');

    // --- LOGIKA INSTAN JIKA SKIP LOADER ---
    if (hasLoadedBefore && !isReload) {
        if (loader) loader.style.display = 'none';
        
        // Langsung paksa visible tanpa delay
        if (navLogo) navLogo.classList.add('nav-visible');
        if (navSearch) navSearch.classList.add('nav-visible');
        if (content) content.classList.add('page-visible');
        
        if (typeof window.initScrollAnimations === "function") {
            window.initScrollAnimations();
        }
        return; 
    }

    // === LOGIKA JIKA PAKAI LOADER (First Visit / Refresh) ===
    if (isReload) sessionStorage.removeItem('hasLoaded');

    let loadedCount = 0;
    let minTimePassed = false;
    let assetsReady = false;

    setTimeout(() => {
        minTimePassed = true;
        attemptFinish();
    }, 1000);

    if (allImgs.length === 0) {
        assetsReady = true;
        attemptFinish();
    } else {
        allImgs.forEach(img => {
            if (img.complete) incrementCount();
            else {
                img.addEventListener('load', incrementCount);
                img.addEventListener('error', incrementCount);
            }
        });
    }

    function incrementCount() {
        loadedCount++;
        if (loadedCount >= allImgs.length) {
            assetsReady = true;
            attemptFinish();
        }
    }

    function attemptFinish() {
        if (minTimePassed && assetsReady) finishAction();
    }

    function finishAction() {
        sessionStorage.setItem('hasLoaded', 'true');
        if (loader) loader.classList.add('fade-out');

        setTimeout(() => {
            if (loader) loader.remove();
            
            if (navLogo) navLogo.classList.add('nav-visible');
            if (navSearch) navSearch.classList.add('nav-visible');

            if (content) {
                // Pastikan bersih dari sisa zoom
                content.style.transform = 'none'; 
                content.classList.add('page-visible');
            }
            
            if (typeof window.initScrollAnimations === "function") {
                window.initScrollAnimations();
            }
        }, 600);
    }
};

initCorrectLoading();