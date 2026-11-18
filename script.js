/* ==========================================================================
   POZzlePiece — Multi-Page Script (Modals, Q&A, Careers, Toast, Canvas)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Toast Helper
  const toastEl = document.getElementById("toast");
  let toastTimer;

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove("show");
    }, 3600);
  }

  // Mobile Menu Toggle
  const mobileToggle = document.getElementById("mobileToggle");
  const navLinks = document.getElementById("navLinks");
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
  }

  // Beta Waitlist Modal
  const betaModal = document.getElementById("betaModal");
  const closeBetaModal = document.getElementById("closeBetaModal");
  const betaForm = document.getElementById("betaForm");

  document.querySelectorAll("[data-open-beta]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (betaModal) {
        betaModal.classList.add("open");
        betaModal.setAttribute("aria-hidden", "false");
      }
    });
  });

  if (closeBetaModal && betaModal) {
    closeBetaModal.addEventListener("click", () => {
      betaModal.classList.remove("open");
      betaModal.setAttribute("aria-hidden", "true");
    });
  }

  if (betaForm && betaModal) {
    betaForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nameField = document.getElementById("betaName");
      const name = nameField ? nameField.value.trim() : "there";
      betaModal.classList.remove("open");
      betaModal.setAttribute("aria-hidden", "true");
      betaForm.reset();
      showToast(`Welcome to the waitlist, ${name}! We’ll be in touch soon.`);
    });
  }

  // Community Q&A Page Logic
  const qaListEl = document.getElementById("qaList");
  if (qaListEl) {
    const INITIAL_QA = [
      {
        id: 1,
        author: "Maya R.",
        category: "App & Features",
        question:
          "Is POZzlePiece strictly for dating, or can I join just to make friends and find community?",
        answer:
          "Both! While dating is at the heart of what we’re building, you can set your profile intent to Friendship, Community Circles, or Dating—so you connect on your own terms.",
        votes: 24,
        voted: false,
        time: "2 days ago",
      },
      {
        id: 2,
        author: "Devon K.",
        category: "Privacy & Safety",
        question:
          "How do you protect member privacy so people outside the community can’t browse profiles?",
        answer:
          "POZzlePiece is a closed, verified-member ecosystem. Profiles are never indexed on public search engines, screenshots are restricted in-app, and you control exactly who sees your photos.",
        votes: 31,
        voted: false,
        time: "4 days ago",
      },
      {
        id: 3,
        author: "Anonymous",
        category: "Beta & Launch",
        question:
          "When does the private beta roll out and how are testers selected?",
        answer:
          "We’re rolling out access in regional waves starting soon to ensure high match density and an amazing first experience. Join the beta list to lock in early access for your city.",
        votes: 18,
        voted: false,
        time: "1 week ago",
      },
    ];

    let qaItems = [...INITIAL_QA];
    let activeQaFilter = "All";
    const qaFiltersEl = document.getElementById("qaFilters");
    const qaForm = document.getElementById("qaForm");

    function renderQaList() {
      const filtered =
        activeQaFilter === "All"
          ? qaItems
          : qaItems.filter((item) => item.category === activeQaFilter);

      if (!filtered.length) {
        qaListEl.innerHTML = `<div class="qa-item"><p class="muted-sm">No questions in this category yet. Be the first to ask!</p></div>`;
        return;
      }

      qaListEl.innerHTML = filtered
        .map(
          (item) => `
        <article class="qa-item">
          <div class="qa-item-top">
            <span class="qa-badge">${escapeHtml(item.category)}</span>
            <span class="qa-meta">Asked by ${escapeHtml(item.author)} &bull; ${escapeHtml(item.time)}</span>
          </div>
          <div class="qa-question-text">${escapeHtml(item.question)}</div>
          ${
            item.answer
              ? `<div class="qa-answer"><strong>POZzlePiece Team:</strong> ${escapeHtml(item.answer)}</div>`
              : `<div class="qa-answer pending">Submitted to our team — an official response will appear here shortly.</div>`
          }
          <div class="qa-footer">
            <button class="upvote-btn ${item.voted ? "voted" : ""}" data-upvote="${item.id}">
              ▲ Helpful (${item.votes})
            </button>
          </div>
        </article>
      `,
        )
        .join("");
    }

    if (qaFiltersEl) {
      qaFiltersEl.addEventListener("click", (e) => {
        const btn = e.target.closest(".filter-chip");
        if (!btn) return;
        qaFiltersEl
          .querySelectorAll(".filter-chip")
          .forEach((c) => c.classList.remove("active"));
        btn.classList.add("active");
        activeQaFilter = btn.dataset.filter;
        renderQaList();
      });
    }

    qaListEl.addEventListener("click", (e) => {
      const upvoteBtn = e.target.closest("[data-upvote]");
      if (!upvoteBtn) return;
      const id = Number(upvoteBtn.dataset.upvote);
      const target = qaItems.find((q) => q.id === id);
      if (target) {
        target.voted = !target.voted;
        target.votes += target.voted ? 1 : -1;
        renderQaList();
      }
    });

    if (qaForm) {
      qaForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const author =
          document.getElementById("qaName").value.trim() || "Anonymous";
        const category = document.getElementById("qaCategory").value;
        const question = document.getElementById("qaQuestion").value.trim();
        if (!question) return;

        qaItems.unshift({
          id: Date.now(),
          author,
          category,
          question,
          answer: null,
          votes: 1,
          voted: true,
          time: "Just now",
        });

        qaForm.reset();
        activeQaFilter = "All";
        if (qaFiltersEl) {
          qaFiltersEl.querySelectorAll(".filter-chip").forEach((c) => {
            c.classList.toggle("active", c.dataset.filter === "All");
          });
        }
        renderQaList();
        showToast("Your question has been posted to the board!");
      });
    }

    renderQaList();
  }

  // Careers Page Logic
  const jobsListEl = document.getElementById("jobsList");
  if (jobsListEl) {
    const OPEN_ROLES = [];

    let activeDeptFilter = "All";
    const jobFiltersEl = document.getElementById("jobFilters");
    const applyModal = document.getElementById("applyModal");
    const closeApplyModal = document.getElementById("closeApplyModal");
    const applyForm = document.getElementById("applyForm");

    function renderJobs() {
      const filtered =
        activeDeptFilter === "All"
          ? OPEN_ROLES
          : OPEN_ROLES.filter((role) => role.department === activeDeptFilter);

      jobsListEl.innerHTML = filtered
        .map(
          (role) => `
        <article class="job-card" id="${role.id}">
          <div class="job-card-main">
            <div>
              <span class="job-dept-tag">${escapeHtml(role.department)}</span>
              <h3 class="job-title">${escapeHtml(role.title)}</h3>
              <div class="job-meta-tags">
                <span>📍 ${escapeHtml(role.location)}</span>
                <span>💼 ${escapeHtml(role.type)}</span>
              </div>
            </div>
            <div class="job-actions">
              <button class="btn btn-glass btn-sm" data-toggle-role="${role.id}">Details</button>
              <button class="btn btn-primary btn-sm" data-apply-role="${role.id}">Quick Apply</button>
            </div>
          </div>
          <div class="job-details-drawer">
            <p>${escapeHtml(role.summary)}</p>
            <ul>
              ${role.highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join("")}
            </ul>
          </div>
        </article>
      `,
        )
        .join("");
    }

    if (jobFiltersEl) {
      jobFiltersEl.addEventListener("click", (e) => {
        const btn = e.target.closest(".filter-chip");
        if (!btn) return;
        jobFiltersEl
          .querySelectorAll(".filter-chip")
          .forEach((c) => c.classList.remove("active"));
        btn.classList.add("active");
        activeDeptFilter = btn.dataset.dept;
        renderJobs();
      });
    }

    jobsListEl.addEventListener("click", (e) => {
      const toggleBtn = e.target.closest("[data-toggle-role]");
      if (toggleBtn) {
        const card = document.getElementById(toggleBtn.dataset.toggleRole);
        card.classList.toggle("expanded");
        toggleBtn.textContent = card.classList.contains("expanded")
          ? "Hide Details"
          : "Details";
        return;
      }

      const applyBtn = e.target.closest("[data-apply-role]");
      if (applyBtn && applyModal) {
        const role = OPEN_ROLES.find(
          (r) => r.id === applyBtn.dataset.applyRole,
        );
        if (!role) return;
        document.getElementById("applyRoleDept").textContent = role.department;
        document.getElementById("applyModalTitle").textContent = role.title;
        document.getElementById("applyRoleMeta").textContent =
          `${role.location} • ${role.type}`;
        document.getElementById("applyRoleTitleInput").value = role.title;
        applyModal.classList.add("open");
        applyModal.setAttribute("aria-hidden", "false");
      }
    });

    if (closeApplyModal && applyModal) {
      closeApplyModal.addEventListener("click", () => {
        applyModal.classList.remove("open");
        applyModal.setAttribute("aria-hidden", "true");
      });
    }

    if (applyForm) {
      applyForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const roleTitle = document.getElementById("applyRoleTitleInput").value;
        const name = document.getElementById("applicantName").value.trim();
        const email = document.getElementById("applicantEmail").value.trim();
        const linkedin = document
          .getElementById("applicantLinkedin")
          .value.trim();
        const note = document.getElementById("applicantNote").value.trim();

        const subject = encodeURIComponent(
          `Application: ${roleTitle} — ${name}`,
        );
        const body = encodeURIComponent(
          `Role: ${roleTitle}\nName: ${name}\nEmail: ${email}\nLinkedIn/Portfolio: ${linkedin || "N/A"}\n\nNote:\n${note}`,
        );

        window.location.href = `mailto:perfect.fit@pozzlepiece.com?subject=${subject}&body=${body}`;
        if (applyModal) applyModal.classList.remove("open");
        applyForm.reset();
        showToast(`Application prepared for ${roleTitle}!`);
      });
    }

    renderJobs();
  }

  // Contact Page Logic
  const copyEmailBtn = document.getElementById("copyEmailBtn");
  const copyBtnText = document.getElementById("copyBtnText");
  const contactForm = document.getElementById("contactForm");

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText("perfect.fit@pozzlepiece.com");
        if (copyBtnText) copyBtnText.textContent = "Copied!";
        showToast("Copied perfect.fit@pozzlepiece.com to clipboard");
        setTimeout(() => {
          if (copyBtnText) copyBtnText.textContent = "Copy";
        }, 2200);
      } catch {
        showToast("Email: perfect.fit@pozzlepiece.com");
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("senderName").value.trim();
      const org = document.getElementById("senderOrg").value.trim();
      const email = document.getElementById("senderEmail").value.trim();
      const topic = document.getElementById("inquiryTopic").value;
      const message = document.getElementById("senderMessage").value.trim();

      const subject = encodeURIComponent(
        `[POZzlePiece - ${topic}] From ${name}${org ? ` (${org})` : ""}`,
      );
      const body = encodeURIComponent(
        `Name: ${name}\nOrganization: ${org || "N/A"}\nReply Email: ${email}\nTopic: ${topic}\n\nMessage:\n${message}`,
      );

      window.location.href = `mailto:perfect.fit@pozzlepiece.com?subject=${subject}&body=${body}`;
      showToast("Opening your email client to message the CEO...");
    });
  }

  // Global Modal backdrop close handler
  [
    document.getElementById("betaModal"),
    document.getElementById("applyModal"),
  ].forEach((modal) => {
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("open");
          modal.setAttribute("aria-hidden", "true");
        }
      });
    }
  });

  // Scroll Reveal Observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  // Constellation Canvas on Home / About Page
  const canvas = document.getElementById("constellationCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width, height, particles;
    const mouse = { x: null, y: null };
    const palette = ["#D8388A", "#B824C9", "#6D38E0", "#FFA577"];

    function resizeCanvas() {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      const count = Math.min(55, Math.floor((width * height) / 18000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r: Math.random() * 2 + 1.2,
        color: palette[Math.floor(Math.random() * palette.length)],
      }));
    }

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    function animateCanvas() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(216, 56, 138, ${0.18 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        if (mouse.x !== null && mouse.y !== null) {
          const mDist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
          if (mDist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(109, 56, 224, ${0.28 * (1 - mDist / 150)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animateCanvas);
    }

    resizeCanvas();
    animateCanvas();
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
});
