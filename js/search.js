document.addEventListener('DOMContentLoaded', (event) => {
    let availableKeywords = [
        '<a class="text-decoration-none nav-link-search" href="komputergen1.html">↗ &nbsp;&nbsp;&nbsp; Sejarah Komputer - Generasi Pertama (1940-1956)</a>',
        '<a class="text-decoration-none nav-link-search" href="komputergen2.html">↗ &nbsp;&nbsp;&nbsp; Sejarah Komputer - Generasi Kedua (1956-1963)</a>',
    ];

    const resultBox = document.querySelector('.resultBox');
    const inputBox = document.getElementById('inputBox');
    const searchIcon = document.getElementById('searchIcon');
    const resultGroup = document.getElementById('resultGroup');
    const contentWrap = document.getElementById('page-content');
    const expandSection = document.getElementById('expandSection');
    const stickySubtext = document.getElementById('stickySubtext');

    // --- FUNGSI TRANSISI KELUAR (Website) ---
    function handlePageLeave(href) {
        if (stickySubtext && expandSection) {
            stickySubtext.classList.remove('show');
            expandSection.style.maxHeight = "0";
        }

        // Jalankan animasi keluar untuk resultBox
        if (resultGroup) {
            resultGroup.classList.remove('show-box');
        }

        setTimeout(() => {
            if (contentWrap) {
                contentWrap.classList.remove('page-visible');
                contentWrap.classList.add('page-leaving');
            }
        }, 100);

        setTimeout(() => {
            window.location.href = href;
        }, 650);
    }

// --- LOGIKA SEARCH ONKEYUP ---
inputBox.onkeyup = function() {
    let result = [];
    let input = inputBox.value.trim();

    if (input.length > 0) {
        result = availableKeywords.filter((keyword) => {
            return keyword.toLowerCase().includes(input.toLowerCase());
        });

        if (result.length > 0) {
            display(result);
            cornerRadius(); // Sudut jadi tajam
            resultGroup.style.display = 'block';
            requestAnimationFrame(() => {
                resultGroup.classList.add('show-box');
            });
        } else {
            // Keyword salah -> Sembunyikan box & Bulatkan sudut
            hideResultBox();
        }
    } else {
        // Input kosong -> Sembunyikan box & Bulatkan sudut
        hideResultBox();
    }
}

function hideResultBox() {
    resultGroup.classList.remove('show-box');
    restoreCornerRadius(); // Sudut jadi bulat kembali
    setTimeout(() => {
        if (!resultGroup.classList.contains('show-box')) {
            resultGroup.style.display = 'none';
        }
    }, 500);
}

// Fungsi pembantu agar kode lebih rapi
function hideResultBox() {
    resultGroup.classList.remove('show-box');
    restoreCornerRadius();
    setTimeout(() => {
        // Cek lagi apakah benar-benar masih harus sembunyi
        if (!resultGroup.classList.contains('show-box')) {
            resultGroup.style.display = 'none';
            resultBox.innerHTML = '';
        }
    }, 500);
}

// Close search on click outside
document.addEventListener('click', function(e) {
    const searchGroup = document.getElementById('searchGroup');
    if (searchGroup && !searchGroup.contains(e.target)) {
        resultGroup.classList.remove('show-box');
        restoreCornerRadius();
        
        setTimeout(() => {
            if (!resultGroup.classList.contains('show-box')) {
                resultGroup.style.display = 'none';
            }
        }, 500);
    }
});
function display(result) {
    if (!result.length) {
        resultBox.innerHTML = '';
        return;
    }

    const content = result.map((list) => {
        // Pastikan class nav-link-search ada di sini
        return '<li class="list-group-item border-0 list-group-item-action bg-transparent resultList fade-up-blur">' + list + "</li>";
    });

    resultBox.innerHTML = '<ul class="list-group list-group-flush m-0 p-0 text-start">' + content.join('') + "</ul>";

    // Animasi list items
    const listItems = resultBox.querySelectorAll('.resultList');
    setTimeout(() => {
        listItems.forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.05}s`;
            item.classList.add('show');
        });
    }, 10);

    // Listener untuk handlePageLeave (Animasi keluar website)
    const searchLinks = resultBox.querySelectorAll('a');
    searchLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');

            if (resultGroup) resultGroup.classList.remove('show-box');

            handlePageLeave(href);
        });
    });
}
// Fungsi saat Hasil Pencarian Muncul (Corner Jadi Siku)
function cornerRadius() {
    // Hilangkan radius bawah, pertahankan radius atas
    searchIcon.style.borderRadius = "0.375rem 0 0 0"; 
    inputBox.style.borderRadius = "0 0.375rem 0 0";
    
    // Opsional: Jika kamu menggunakan class Bootstrap, ganti dengan style langsung agar transisi CSS jalan
    searchIcon.classList.remove('rounded-start');
    inputBox.classList.remove('rounded-end');
}

// Fungsi saat Hasil Pencarian Hilang (Corner Kembali Bulat)
function restoreCornerRadius() {
    // Kembalikan ke radius semula (0.375rem)
    searchIcon.style.borderRadius = "0.375rem 0 0 0.375rem";
    inputBox.style.borderRadius = "0 0.375rem 0.375rem 0";
    
    // Kembalikan class default jika diperlukan
    setTimeout(() => {
        searchIcon.classList.add('rounded-start');
        inputBox.classList.add('rounded-end');
    }, 400); // Sesuai durasi transisi CSS
}

    // Close search on click outside dengan animasi
    document.addEventListener('click', function(e) {
        if (!document.getElementById('searchGroup').contains(e.target)) {
            resultGroup.classList.remove('show-box');
            setTimeout(() => {
                if (!resultGroup.classList.contains('show-box')) {
                    resultGroup.style.display = 'none';
                }
            }, 500);
            restoreCornerRadius();
        }
    });
});