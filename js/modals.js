// ==================================================
// modal.js - Handling all popup modals
// ==================================================

document.addEventListener("DOMContentLoaded", () => {

  // ------------------------
  // 1. Data Source for Achievements Modal
  // ------------------------
  const achvData = {
    "eyantra": {
        img: "images/team/team10.jpg",
        html: `
            <h2>Idea Festival 2025 (Startup Bihar / Startup India platform</h2>
            <p><strong>Year:</strong> 2025</p>
            <p><strong>Prize:</strong> 2nd Prize among 25,000+ teams</p>
            <p><strong>Team:</strong>  Adarsh Aarav (lead)
                                       Sonu Kumar
                                       Kumar Shourya
                                       Aditya Kumar</p>
            <p>
                Recognized for an AI-powered VTOL-UAV concept
            </p>
        `
    },

    "apple-pie": {
        img: "images/projects/project1.jpg",
        html: `
            <h2>Participation & Representation at National Robotics Competitions</h2>
            <p><strong>Year:</strong> 2024</p>
            <p><strong>Prize:</strong> Winner</p>
            <p><strong>Team:</strong> Embedded Systems Group</p>
            <p>
                Designed and implemented an autonomous robotics system
                under national-level competition constraints.
            </p>
        `
    },
    "choco-pie": {
        img: "images/projects/project1.jpg",
        html: `
            <h2>Wingardiam LEVI choco-pie </h2>
            <p><strong>Year:</strong> 2024</p>
            <p><strong>Prize:</strong> Winner</p>
            <p><strong>Team:</strong> Embedded Systems Group</p>
            <p>
                Designed and implemented an autonomous robotics system
                under national-level competition constraints.
            </p>
        `
    },
    "otto-pie": {
        img: "images/projects/project1.jpg",
        html: `
            <h2>Wingardiam LEVI otto </h2>
            <p><strong>Year:</strong> 2024</p>
            <p><strong>Prize:</strong> Winner</p>
            <p><strong>Team:</strong> Embedded Systems Group</p>
            <p>
                Designed and implemented an autonomous robotics system
                under national-level competition constraints.
            </p>
        `
    },

    "dst-grant": {
        img: "images/projects/project2.jpg",
        html: `
            <h2>DST Innovation Grant</h2>
            <p><strong>Year:</strong> 2023</p>
            <p><strong>Grant Amount:</strong> ₹5,00,000</p>
            <p>
                Awarded for research in AI-driven medical robotics
                focusing on assistive healthcare solutions.
            </p>
        `
    }
  };

  // ------------------------
  // 2. Achievements Modal Logic
  // ------------------------
  const achvModal = document.getElementById("achvModal");
  if (achvModal) {
    const achvModalImg = document.getElementById("achvModalImg");
    const achvModalText = document.getElementById("achvModalText");
    const closeBtn = achvModal.querySelector(".achv-modal-close");

    document.querySelector(".achv-section").addEventListener("click", e => {
      const card = e.target.closest(".achv-log-item.neumorphism");
      if (!card) return;
      
      const id = card.dataset.achv;
      const data = achvData[id];
      if (!data) return;

      achvModalImg.src = data.img;
      achvModalText.innerHTML = data.html;
      achvModal.classList.add("achv-active");
      document.body.style.overflow = "hidden";
    });

    const closeAchv = () => {
      achvModal.classList.remove("achv-active");
      document.body.style.overflow = "auto";
    };

    closeBtn.addEventListener("click", closeAchv);
    achvModal.addEventListener("click", e => { if (e.target === achvModal) closeAchv(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeAchv(); });
  }

  // ------------------------
  // 3. News Modal Logic
  // ------------------------
  document.querySelectorAll('.read-more').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.dataset.modal;
      const modal = document.getElementById(modalId);
      if (modal) modal.style.display = 'block';
    });
  });

  document.querySelectorAll('.close').forEach(span => {
    span.addEventListener('click', () => {
      const modal = span.closest('.modal');
      if (modal) modal.style.display = 'none';
    });
  });

  window.addEventListener('click', e => {
    if (e.target.classList.contains('modal')) {
      e.target.style.display = 'none';
    }
  });

  // ------------------------
  // 4. Events Gallery Modal Logic
  // ------------------------
  const evtModal = document.getElementById("evtModal");
  if (evtModal) {
    const modalImg = evtModal.querySelector(".evt-modal-img");
    const modalTitle = evtModal.querySelector(".evt-modal-title");
    const modalDate = evtModal.querySelector(".evt-modal-date");
    const modalDesc = evtModal.querySelector(".evt-modal-desc");
    const nextBtn = evtModal.querySelector(".evt-next");
    const prevBtn = evtModal.querySelector(".evt-prev");
    const closeBtn = evtModal.querySelector(".evt-modal-close");

    const thumbnails = Array.from(document.querySelectorAll(".evt-thumb"));
    let currentIndex = 0;

    function updateEvtModal(index) {
      const img = thumbnails[index];
      modalImg.src = img.src;
      modalTitle.textContent = img.dataset.title || "";
      modalDate.textContent = img.dataset.date || "";
      modalDesc.textContent = img.dataset.desc || "";
    }

    thumbnails.forEach((img, index) => {
      img.addEventListener("click", () => {
        currentIndex = index;
        evtModal.style.display = "flex";
        document.body.style.overflow = "hidden";
        updateEvtModal(currentIndex);
      });
    });

    const showNext = () => {
      currentIndex = (currentIndex + 1) % thumbnails.length;
      updateEvtModal(currentIndex);
    };

    const showPrev = () => {
      currentIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
      updateEvtModal(currentIndex);
    };

    nextBtn.addEventListener("click", (e) => { e.stopPropagation(); showNext(); });
    prevBtn.addEventListener("click", (e) => { e.stopPropagation(); showPrev(); });
    
    const closeEvt = () => {
      evtModal.style.display = "none";
      document.body.style.overflow = "";
    };

    closeBtn.addEventListener("click", closeEvt);
    evtModal.addEventListener("click", e => {
      if (e.target === evtModal) closeEvt(); 
    });

    document.addEventListener("keydown", e => {
      if (evtModal.style.display === "flex") {
        if (e.key === "Escape") closeEvt();
        if (e.key === "ArrowRight") showNext();
        if (e.key === "ArrowLeft") showPrev();
      }
    });
  }
});