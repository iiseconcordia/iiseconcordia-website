document.addEventListener("DOMContentLoaded", () => {
   // === HERO SLIDES ===
   const slides = [{
      image: "assets/hero_indu-booth2.jpg",
      titleTop: "Industry Week",
      titleBottom: "2025",
      desc: "Competitions, Panels, Workshops, Plant/Office Tours, and Networking",
      cta: {
         text: "Learn more",
         href: "industry-week-2025.html"
      },
      wash: 0,
      position: 'center 100%'
   }];

   const hero = document.querySelector(".hero");
   if (hero) {
      let current = 0;
      let timer;

      const heroWash = document.querySelector(".hero-wash");
      const heroTitle = document.getElementById("heroTitle");
      const heroDesc = document.getElementById("heroDesc");
      const heroCta = document.getElementById("heroCta");
      const dotsWrap = document.getElementById("heroDots");

      const bgA = document.createElement("div");
      const bgB = document.createElement("div");
      bgA.className = "hero-bg";
      bgB.className = "hero-bg";
      hero.prepend(bgB);
      hero.prepend(bgA);

      let activeA = true;

      function setBG(el, slide) {
         el.style.backgroundImage = `url('${slide.image}')`;
         el.style.backgroundPosition = slide.position || 'center';
      }

      function updateText(s) {
         let html = `<span class="hero-title-line">${s.titleTop}</span>`;
         if (s.titleBottom && s.titleBottom.trim() !== "") {
            html += `<span class="hero-title-line hero-title-line--bottom">${s.titleBottom}</span>`;
         }
         heroTitle.innerHTML = html;
         heroDesc.textContent = s.desc;
         heroCta.textContent = s.cta.text;
         heroCta.href = s.cta.href;
         heroWash.style.opacity = s.wash ?? 0;
      }

      function markDots(idx) {
         [...dotsWrap.children].forEach((d, k) =>
            d.setAttribute("aria-current", String(k === idx))
         );
      }

      function go(next, byUser = false) {
         current = (next + slides.length) % slides.length;
         const s = slides[current];
         const top = activeA ? bgA : bgB;
         const back = activeA ? bgB : bgA;
         setBG(back, s);
         back.classList.add("is-active");
         top.classList.remove("is-active");
         activeA = !activeA;
         updateText(s);
         markDots(current);
         if (byUser) restart();
      }

      function next() {
         go(current + 1);
      }

      function start() {
         if (slides.length > 1) timer = setInterval(next, 7000);
      }

      function stop() {
         clearInterval(timer);
      }

      function restart() {
         stop();
         start();
      }

      function renderDots() {
         dotsWrap.innerHTML = "";
         if (slides.length > 1) {
            slides.forEach((_, idx) => {
               const b = document.createElement("button");
               b.type = "button";
               b.setAttribute("aria-label", `Go to slide ${idx + 1}`);
               b.addEventListener("click", () => go(idx, true));
               dotsWrap.appendChild(b);
            });
         }
      }

      // Init hero
      setBG(bgA, slides[0]);
      bgA.classList.add("is-active");
      updateText(slides[0]);
      renderDots();
      markDots(0);
      start();
   }

   // === OVERLAY MENU ===
   const overlay = document.querySelector(".overlay");
   const openBtn = document.getElementById("edgeMenuBtn");
   const closeBtn = document.querySelector(".overlay-close");

   function openOverlay() {
      overlay?.setAttribute("aria-hidden", "false");
      document.body.classList.add("nav-open");
   }

   function closeOverlay() {
      overlay?.setAttribute("aria-hidden", "true");
      document.body.classList.remove("nav-open");
   }

   openBtn?.addEventListener("click", openOverlay);
   closeBtn?.addEventListener("click", closeOverlay);

   overlay?.addEventListener("click", (e) => {
      if (e.target === overlay) closeOverlay();
   });

   document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeOverlay();
   });

   // === HEADER SCROLL ===
   const header = document.querySelector('.site-header');
   let lastScrollTop = 0;

   if (!document.body.classList.contains('light-header')) {
      window.addEventListener('scroll', () => {
         const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

         if (scrollTop === 0) {
            header.classList.remove('scrolled', 'hidden');
         } else {
            header.classList.add('scrolled');
            if (scrollTop > lastScrollTop) {
               header.classList.add('hidden');
            } else {
               header.classList.remove('hidden');
            }
         }

         lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
      });
   } else {
      header.classList.add('scrolled');
      header.classList.remove('hidden');
   }

   // === OVERLAY LINK HOVER ===
   const hoverBg = document.getElementById("overlayHoverBg");
   const hoverTint = document.getElementById("overlayTint");
   const menuLinks = document.querySelectorAll(".overlay-column a");

   menuLinks.forEach((link) => {
      link.addEventListener("mouseenter", () => {
         const bg = link.dataset.bg;
         if (bg && hoverBg && hoverTint) {
            hoverBg.style.backgroundImage = `url('${bg}')`;
            hoverTint.style.opacity = 1;
         }
      });

      link.addEventListener("mouseleave", () => {
         if (hoverBg && hoverTint) {
            hoverBg.style.backgroundImage = "none";
            hoverTint.style.opacity = 0;
         }
      });
   });

   // === EXECUTIVE TEAM ===
   const teamGrid = document.getElementById("teamGrid");
   const yearBtn = document.getElementById("yearToggleBtn");
   const dropdown = document.getElementById("yearDropdown");
   const yearItems = document.querySelectorAll(".year-item");

   // Load default team for 2024–2025
   if (teamGrid) {
      loadTeam("2024-2025");

      // Dropdown toggle
      yearBtn?.addEventListener("click", (e) => {
         e.stopPropagation();
         dropdown.classList.toggle("hidden");
         yearBtn.classList.toggle("active");
      });

      // Click outside to close dropdown
      document.addEventListener("click", (e) => {
         if (!dropdown.contains(e.target) && !yearBtn.contains(e.target)) {
            dropdown.classList.add("hidden");
            yearBtn.classList.remove("active");
         }
      });

      // Year switching logic
      yearItems.forEach((item) => {
         item.addEventListener("click", () => {
            const yearText = item.textContent.trim();
            const jsonFile = `data/team-${yearText.replace("–", "-")}.json`;

            yearBtn.innerHTML = `${yearText} <i class="fas fa-circle-chevron-down"></i>`;
            dropdown.classList.add("hidden");
            yearBtn.classList.remove("active");

            loadTeam(yearText.replace("–", "-"));
            window.scrollTo({
               top: 0,
               behavior: "smooth"
            });
         });
      });
   }

   function loadTeam(yearKey) {
      const filePath = `data/team-${yearKey}.json`;

      fetch(filePath)
         .then((res) => res.json())
         .then((data) => {
            teamGrid.innerHTML = "";
            data.forEach((member) => {
               const card = createMemberCard(member);
               teamGrid.appendChild(card);
            });
         })
         .catch((err) => {
            console.error("Failed to load team data:", err);
            teamGrid.innerHTML = `<p style="text-align:center;">Team not available for ${yearKey}</p>`;
         });
   }

   function createMemberCard(member) {
      const container = document.createElement("div");
      container.className = "member-card";

      const img = document.createElement("img");
      img.src = member.image;
      img.alt = member.name;
      img.className = "member-img";

      const bioText = document.createElement("div");
      bioText.className = "bio-text";
      bioText.textContent = member.bio;

      const imageWrapper = document.createElement("div");
      imageWrapper.className = "image-wrapper";
      imageWrapper.appendChild(img);
      imageWrapper.appendChild(bioText);
      container.appendChild(imageWrapper);

      const infoSection = document.createElement("div");
      infoSection.className = "info-section";

      const name = document.createElement("h3");
      name.className = "member-name";
      name.textContent = member.name;

      const title = document.createElement("p");
      title.className = "member-title";
      title.textContent = member.title;

      infoSection.appendChild(name);
      infoSection.appendChild(title);

      const bottomRow = document.createElement("div");
      bottomRow.className = "member-bottom-row";

      const iconWrap = document.createElement("div");
      iconWrap.className = "icon-wrap";

      if (member.linkedin) {
         const linkedinIcon = document.createElement("a");
         linkedinIcon.href = member.linkedin;
         linkedinIcon.target = "_blank";
         linkedinIcon.setAttribute("aria-label", "LinkedIn");
         linkedinIcon.innerHTML = `<i class="fab fa-linkedin"></i>`;
         iconWrap.appendChild(linkedinIcon);
      }

      if (member.email) {
         const emailIcon = document.createElement("a");
         emailIcon.href = `mailto:${member.email}`;
         emailIcon.setAttribute("aria-label", "Email");
         emailIcon.innerHTML = `<i class="fas fa-envelope"></i>`;
         iconWrap.appendChild(emailIcon);
      }

      const bioButton = document.createElement("button");
      bioButton.className = "bio-btn";
      bioButton.innerHTML = `<i class="fas fa-rotate fa-fw"></i> DESCRIPTION`;

      bottomRow.appendChild(iconWrap);
      bottomRow.appendChild(bioButton);
      infoSection.appendChild(bottomRow);
      container.appendChild(infoSection);

      let locked = false;

      imageWrapper.addEventListener("mouseenter", () => {
         if (!locked) bioText.classList.add("active");
      });

      imageWrapper.addEventListener("mouseleave", () => {
         if (!locked) bioText.classList.remove("active");
      });

      bioButton.addEventListener("click", () => {
         locked = !locked;
         if (locked) {
            bioText.classList.add("active");
            img.classList.add("dimmed");
         } else {
            bioText.classList.remove("active");
            img.classList.remove("dimmed");
         }
      });

      return container;
   }

   // === Animate on Scroll for Info Section ===
   const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
         if (entry.isIntersecting) {
            entry.target.classList.add('visible');
         }
      });
   }, {
      threshold: 0.5,
   });

   document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
   });

   // === INDUSTRY WEEK COUNTDOWN ===
   function updateIndustryCountdown() {
      const targetDate = new Date("2025-09-29T00:00:00");

      function update() {
         const now = new Date();
         const diff = targetDate - now;

         if (diff <= 0) {
            document.getElementById("days").textContent = "00";
            document.getElementById("hours").textContent = "00";
            document.getElementById("minutes").textContent = "00";
            document.getElementById("seconds").textContent = "00";
            clearInterval(timer); // ✅ stop updating
            return;
         }

         const days = Math.floor(diff / (1000 * 60 * 60 * 24));
         const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
         const minutes = Math.floor((diff / (1000 * 60)) % 60);
         const seconds = Math.floor((diff / 1000) % 60);

         document.getElementById("days").textContent = String(days).padStart(2, '0');
         document.getElementById("hours").textContent = String(hours).padStart(2, '0');
         document.getElementById("minutes").textContent = String(minutes).padStart(2, '0');
         document.getElementById("seconds").textContent = String(seconds).padStart(2, '0');
      }

      const timer = setInterval(update, 1000);
      update(); // initial call
   }

   updateIndustryCountdown();


   const podcastItems = document.querySelectorAll(".podcast-item");
   const contents = document.querySelectorAll(".accordion-content");

   podcastItems.forEach((item, idx) => {
      item.addEventListener("click", () => {
         const content = item.nextElementSibling;
         const isOpen = content.style.display === "block";

         // Close all
         contents.forEach(c => c.style.display = "none");

         // Open current if it was closed
         if (!isOpen) {
            content.style.display = "block";
         }
      });
   });


});