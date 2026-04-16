document.addEventListener("DOMContentLoaded", () => {
    const dateElement = document.getElementById('current-date');
    
    if (dateElement) {
        const today = new Date();
        
        // Format: 16 April 2026
        const options = { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        };
        
        const formattedDate = today.toLocaleDateString('id-ID', options);
        dateElement.innerText = formattedDate;
    }
});