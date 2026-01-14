// ==================================================
// filters.js - Logic for filtering grids
// ==================================================

document.addEventListener("DOMContentLoaded", () => {

  // ------------------------
  // 1. Projects Page Filtering
  // ------------------------
  const yearFilter = document.getElementById("yearFilter");
  const typeFilter = document.getElementById("typeFilter");
  const projectCards = document.querySelectorAll(".project-card");

  if (yearFilter && typeFilter) {
    function applyProjectFilters() {
      const year = yearFilter.value;
      const type = typeFilter.value;

      // Reset specific card styles before filtering
      projectCards.forEach(card => {
        card.classList.remove("expanded", "dimmed");
      });

      projectCards.forEach(card => {
        const cardYear = card.dataset.year;
        const cardType = card.dataset.type;

        const yearMatch = year === "all" || cardYear === year;
        const typeMatch = type === "all" || cardType === type;

        if (yearMatch && typeMatch) {
          card.style.display = "block"; 
          card.classList.remove("filtered-out");
        } else {
          card.style.display = "none";
          card.classList.add("filtered-out");
        }
      });
    }

    yearFilter.addEventListener("change", applyProjectFilters);
    typeFilter.addEventListener("change", applyProjectFilters);
  }

  // ------------------------
  // 2. Events Page Filtering
  // ------------------------
  const evtButtons = document.querySelectorAll(".evt-filter button");
  const evtCards = document.querySelectorAll(".evt-card");

  if (evtButtons.length > 0) {
    evtButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;
        evtCards.forEach(card => {
          // Check if card is inside the Upcoming Events section
          if (card.closest('.evt-section').querySelector('h2').textContent.includes('Upcoming')) {
             if (filter === "all" || card.dataset.category === filter) {
                card.style.display = "block";
             } else {
                card.style.display = "none";
             }
          }
        });
      });
    });
  }

  // ------------------------
  // 3. News Page Filtering
  // ------------------------
  const newsButtons = document.querySelectorAll('.filter-btn');
  const newsCards = document.querySelectorAll('.news-card');

  if (newsButtons.length > 0) {
    newsButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelector('.filter-btn.active')?.classList.remove('active');
        btn.classList.add('active');

        const category = btn.dataset.category;
        newsCards.forEach(card => {
          card.style.display =
            category === 'all' || card.dataset.category === category
              ? 'block'
              : 'none';
        });
      });
    });
  }
});