// Helper to format frame numbers (001, 002, ..., 103)
const pad = (num, size) => {
  let s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
};

// Global Configuration & State
let TOTAL_FRAMES = 103;
let IMG_PREFIX = "ezgif-frame-";
let IMG_EXT = ".jpg";
let imagesLoadedCount = 0;
let currentActiveIndex = 0;
let customizerSettings = {};

// Default theme configuration datasets
const themeData = [
  {
    themeIndex: "01",
    brandFirst: "Pratham",
    brandSecond: "Singh",
    welcome: "Welcome to",
    subtitle: "Full Stack Developer, Generative AI & Freelancer",
    desc: "Full Stack Developer, Generative AI Engineer & Freelancer focused on building innovative digital experiences. From web applications and AI automation to deployment and optimization, I create scalable solutions that deliver real business value.",
    accent: "#ff5722",
    accentRGB: "255, 87, 34",
    highlights: ["Full Stack Developer", "Generative AI", "Basic DevOps", "Freelancer"]
  },
  {
    themeIndex: "02",
    brandFirst: "Generative",
    brandSecond: "AI Solutions",
    welcome: "Intelligence Integrated",
    subtitle: "SaaS Architect & Agentic AI Specialist",
    desc: "Engineering next-generation SaaS architectures using Large Language Models (LLMs) and advanced agent frameworks. I construct custom interfaces that reason, automate decisions, and create personalized business value.",
    accent: "#00bcd4",
    accentRGB: "0, 188, 212",
    highlights: ["LLM Orchestration", "Gemini / OpenAI", "Agentic Systems", "Vector Databases"]
  },
  {
    themeIndex: "03",
    brandFirst: "AI Automation",
    brandSecond: "Systems",
    welcome: "Maximize Efficiency",
    subtitle: "Workflow Automation Specialist & Integrator",
    desc: "Designing and deploying custom autonomous pipelines that connect CRMs, databases, email, and messaging platforms. Save time and eliminate errors with automated triggers, processors, and reporting agents.",
    accent: "#9c27b0",
    accentRGB: "156, 39, 176",
    highlights: ["API Automation", "Autonomous Agents", "Custom Scripts", "Process Audits"]
  },
  {
    themeIndex: "04",
    brandFirst: "DevOps &",
    brandSecond: "Cloud",
    welcome: "Resilient & Scalable",
    subtitle: "Cloud Infrastructure & DevOps Specialist",
    desc: "Deploying high-performance containerized SaaS products on AWS and Cloudflare. I specialize in CI/CD pipeline automation, load balancing, SSL security layers, container clustering, and database replication.",
    accent: "#4caf50",
    accentRGB: "76, 175, 80",
    highlights: ["Docker & Kubernetes", "CI/CD Pipelines", "AWS / Cloudflare", "Infrastructure Ops"]
  }
];

// Load Customizer Settings from localStorage (if any)
function loadSettings() {
  const saved = localStorage.getItem("pratham_portfolio_customizer");
  if (saved) {
    try {
      customizerSettings = JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse saved settings:", e);
      customizerSettings = {};
    }
  } else {
    customizerSettings = {};
  }
  
  TOTAL_FRAMES = parseInt(customizerSettings.totalFrames, 10) || 103;
  IMG_PREFIX = customizerSettings.imgPrefix || "ezgif-frame-";
  IMG_EXT = customizerSettings.imgExt || ".jpg";
}

// Apply settings to the DOM
function applyCustomizations() {
  loadSettings();
  
  // Custom Brand Name
  if (customizerSettings.brandName) {
    const parts = customizerSettings.brandName.split(" ");
    const first = parts[0] || "Pratham";
    const second = parts.slice(1).join(" ") || "Singh";
    
    // Update Hero Title
    const brandTitle = document.getElementById("field-brand");
    if (brandTitle) {
      brandTitle.innerHTML = `${first}<br><span>${second}</span>`;
    }
    // Update footer logo and copyright
    const footerLogo = document.getElementById("footer-logo-brand");
    if (footerLogo) footerLogo.textContent = first;
    const footerCopy = document.getElementById("footer-copy-brand");
    if (footerCopy) footerCopy.textContent = customizerSettings.brandName;
  }
  
  // Custom Tagline
  if (customizerSettings.welcomeTagline) {
    const welcome = document.getElementById("field-welcome");
    if (welcome) welcome.textContent = customizerSettings.welcomeTagline;
  }
  
  // Custom Subtitle
  if (customizerSettings.subtitle) {
    const subheadline = document.getElementById("field-subtitle");
    if (subheadline) subheadline.textContent = customizerSettings.subtitle;
  }
  
  // Custom Description
  if (customizerSettings.description) {
    const desc = document.getElementById("field-desc");
    if (desc) desc.textContent = customizerSettings.description;
  }
  
  // Custom Accent Color
  if (customizerSettings.accentColor) {
    document.documentElement.style.setProperty("--accent-color", customizerSettings.accentColor);
    
    // Convert Hex to RGB for glow variables
    const rgb = hexToRgb(customizerSettings.accentColor);
    if (rgb) {
      document.documentElement.style.setProperty("--accent-color-rgb", `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    }
  }
  
  // Custom Theme Mode
  if (customizerSettings.themeMode) {
    applyThemeMode(customizerSettings.themeMode);
  }
}

// Convert Hex to RGB helper
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Apply Dark/Charcoal theme mode styles
function applyThemeMode(mode) {
  if (mode === "coal") {
    document.documentElement.style.setProperty("--bg-primary", "#0d0d11");
    document.documentElement.style.setProperty("--bg-secondary", "#15151e");
    document.documentElement.style.setProperty("--bg-card", "rgba(28, 28, 38, 0.7)");
    document.documentElement.style.setProperty("--border-color", "rgba(255, 255, 255, 0.05)");
  } else {
    // Default cinematic dark
    document.documentElement.style.setProperty("--bg-primary", "#030303");
    document.documentElement.style.setProperty("--bg-secondary", "#0c0c0f");
    document.documentElement.style.setProperty("--bg-card", "rgba(18, 18, 22, 0.65)");
    document.documentElement.style.setProperty("--border-color", "rgba(255, 255, 255, 0.08)");
  }
}

// Initialize Customizer Inputs with values
function initCustomizerInputs() {
  const brandNameInput = document.getElementById("input-brand");
  const welcomeInput = document.getElementById("input-welcome");
  const subtitleInput = document.getElementById("input-subtitle");
  const descInput = document.getElementById("input-desc");
  const colorPicker = document.getElementById("input-color-picker");
  const imgPrefixInput = document.getElementById("input-img-prefix");
  const imgExtInput = document.getElementById("input-img-ext");
  const imgFramesInput = document.getElementById("input-img-frames");
  
  if (brandNameInput) brandNameInput.value = customizerSettings.brandName || "Pratham Singh";
  if (welcomeInput) welcomeInput.value = customizerSettings.welcomeTagline || "Welcome to";
  if (subtitleInput) subtitleInput.value = customizerSettings.subtitle || "Full Stack Developer, Generative AI & Freelancer";
  
  const defaultDesc = `Full Stack Developer, Generative AI Engineer & Freelancer focused on building innovative digital experiences. From web applications and AI automation to deployment and optimization, I create scalable solutions that deliver real business value.`;
  if (descInput) descInput.value = customizerSettings.description || defaultDesc;
  
  if (colorPicker) colorPicker.value = customizerSettings.accentColor || "#ff5722";
  
  if (imgPrefixInput) imgPrefixInput.value = customizerSettings.imgPrefix || "ezgif-frame-";
  if (imgExtInput) imgExtInput.value = customizerSettings.imgExt || ".jpg";
  if (imgFramesInput) imgFramesInput.value = customizerSettings.totalFrames || 103;
  
  // Set theme active button
  const themeMode = customizerSettings.themeMode || "dark";
  document.querySelectorAll(".theme-mode-btn").forEach(btn => {
    if (btn.getAttribute("data-theme-mode") === themeMode) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Set color active button
  const color = customizerSettings.accentColor || "#ff5722";
  document.querySelectorAll(".custom-color-btn").forEach(btn => {
    if (btn.getAttribute("data-color") === color) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

// Preload background frames in exact correct order
function preloadBackgroundFrames() {
  const container = document.getElementById("bg-sequence");
  const progressBar = document.getElementById("loader-bar");
  const progressText = document.getElementById("loader-percentage");
  
  if (!container) return;
  container.innerHTML = ""; // Clear existing images
  imagesLoadedCount = 0; // Reset loaded images count

  // 1. Create img tags in the DOM in numerical order immediately
  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const img = document.createElement("img");
    img.className = "hero-bg-frame";
    img.setAttribute("data-index", i - 1);
    container.appendChild(img);
  }

  // 2. Query the created frames so we have them in exact order
  const frames = container.querySelectorAll(".hero-bg-frame");

  // 3. Initiate loads and assign src on completion to preserve order
  frames.forEach((imgElement, index) => {
    const frameIndex = index + 1;
    const frameNum = pad(frameIndex, 3);
    const tempImg = new Image();
    
    tempImg.onload = () => {
      imgElement.src = tempImg.src;
      imagesLoadedCount++;
      const percent = Math.floor((imagesLoadedCount / TOTAL_FRAMES) * 100);
      
      if (progressBar) progressBar.style.width = `${percent}%`;
      if (progressText) progressText.innerText = `${percent}%`;
      
      if (imagesLoadedCount === TOTAL_FRAMES) {
        revealSite();
      }
    };
    
    tempImg.onerror = () => {
      // Gracefully handle error
      imgElement.src = `${IMG_PREFIX}${frameNum}${IMG_EXT}`;
      imagesLoadedCount++;
      const percent = Math.floor((imagesLoadedCount / TOTAL_FRAMES) * 100);
      if (progressBar) progressBar.style.width = `${percent}%`;
      if (progressText) progressText.innerText = `${percent}%`;
      if (imagesLoadedCount === TOTAL_FRAMES) {
        revealSite();
      }
    };

    // Trigger load
    tempImg.src = `${IMG_PREFIX}${frameNum}${IMG_EXT}`;
  });
}

// Hide preloader and reveal hero section
function revealSite() {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    preloader.classList.add("fade-out");
    setTimeout(() => {
      preloader.style.display = "none";
    }, 800);
  }
  
  // Set first frame active
  const frames = document.querySelectorAll(".hero-bg-frame");
  if (frames.length > 0) {
    frames[0].classList.add("active");
  }
}

let isScrollTicking = false;

// Update parallax frames based on scroll (throttled via requestAnimationFrame)
function handleParallaxScroll() {
  if (!isScrollTicking) {
    window.requestAnimationFrame(() => {
      updateParallaxFrame();
      isScrollTicking = false;
    });
    isScrollTicking = true;
  }
}

function updateParallaxFrame() {
  const heroZone = document.getElementById("hero-zone");
  if (!heroZone) return;

  const rect = heroZone.getBoundingClientRect();
  const startScroll = window.scrollY + rect.top;
  const scrollRange = rect.height - window.innerHeight;
  
  if (scrollRange <= 0) return;

  // Calculate current progress (0 to 1)
  let progress = (window.scrollY - startScroll) / scrollRange;
  progress = Math.max(0, Math.min(1, progress));

  // Determine frame index
  const frameIndex = Math.floor(progress * (TOTAL_FRAMES - 1));

  // Check if frame index changed to prevent redundant updates
  if (frameIndex !== currentActiveIndex) {
    const frames = document.querySelectorAll(".hero-bg-frame");
    if (frames.length > 0) {
      if (frames[currentActiveIndex]) {
        frames[currentActiveIndex].classList.remove("active");
      }
      if (frames[frameIndex]) {
        frames[frameIndex].classList.add("active");
      }
      currentActiveIndex = frameIndex;
    }
  }
}

// Handle Service Theme Switcher
function switchServiceTheme(themeIdx) {
  const theme = themeData[themeIdx];
  if (!theme) return;

  const loader = document.getElementById("theme-loader");
  if (loader) loader.classList.add("active");

  // Elements to fade out
  const brandTitle = document.getElementById("field-brand");
  const welcomeText = document.getElementById("field-welcome");
  const subtitleText = document.getElementById("field-subtitle");
  const descText = document.getElementById("field-desc");
  const highlightLabels = [
    document.getElementById("hl-1"),
    document.getElementById("hl-2"),
    document.getElementById("hl-3"),
    document.getElementById("hl-4")
  ];

  const fadeElements = [brandTitle, welcomeText, subtitleText, descText, ...highlightLabels].filter(Boolean);

  // Apply transition styles to elements if they aren't already set
  fadeElements.forEach(el => {
    el.style.transition = "opacity 0.3s ease";
    el.style.opacity = "0";
  });

  setTimeout(() => {
    // Dynamic updates
    if (welcomeText) welcomeText.textContent = theme.welcome;
    if (brandTitle) brandTitle.innerHTML = `${theme.brandFirst}<br><span>${theme.brandSecond}</span>`;
    if (subtitleText) subtitleText.textContent = theme.subtitle;
    if (descText) descText.textContent = theme.desc;

    // Highlights update
    highlightLabels.forEach((label, i) => {
      if (label && theme.highlights[i]) {
        label.textContent = theme.highlights[i];
      }
    });

    // Accent colors (unless overriden by Customizer)
    if (!customizerSettings.accentColor) {
      document.documentElement.style.setProperty("--accent-color", theme.accent);
      document.documentElement.style.setProperty("--accent-color-rgb", theme.accentRGB);
    }

    // Fade elements back in
    fadeElements.forEach(el => {
      el.style.opacity = "1";
    });

    if (loader) {
      setTimeout(() => {
        loader.classList.remove("active");
      }, 300);
    }
  }, 350);
}

// Document Ready Initialization
document.addEventListener("DOMContentLoaded", () => {
  // 1. Apply customizations
  applyCustomizations();
  
  // 2. Preload parallax backgrounds
  preloadBackgroundFrames();

  // 3. Current year in footer
  const footerYear = document.getElementById("footer-year");
  if (footerYear) footerYear.textContent = new Date().getFullYear();

  // 4. Scroll Listener for parallax
  window.addEventListener("scroll", handleParallaxScroll, { passive: true });

  // 5. Service Theme Navigation triggers
  const themeNavItems = document.querySelectorAll(".theme-nav-item");
  themeNavItems.forEach(item => {
    item.addEventListener("click", () => {
      themeNavItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      
      const themeIndex = parseInt(item.getAttribute("data-theme"), 10);
      switchServiceTheme(themeIndex);
    });
  });

  // 6. Accordion toggle logic for FAQ
  const faqTriggers = document.querySelectorAll(".faq-trigger");
  faqTriggers.forEach(trigger => {
    trigger.addEventListener("click", () => {
      const parent = trigger.parentElement;
      const content = trigger.nextElementSibling;
      const isActive = parent.classList.contains("active");

      // Close all other FAQ items
      document.querySelectorAll(".faq-item").forEach(item => {
        item.classList.remove("active");
        const itemContent = item.querySelector(".faq-content");
        if (itemContent) itemContent.style.maxHeight = null;
      });

      // Toggle current FAQ item
      if (!isActive) {
        parent.classList.add("active");
        if (content) content.style.maxHeight = `${content.scrollHeight}px`;
      }
    });
  });

  // 7. Customizer Panel Interactions
  const customizerToggle = document.getElementById("customizer-toggle");
  const customizerDrawer = document.getElementById("customizer-drawer");
  const customizerClose = document.getElementById("customizer-close");

  // Show customizer only if URL contains ?edit=true
  const urlParams = new URLSearchParams(window.location.search);
  const showCustomizer = urlParams.get("edit") === "true";
  
  if (showCustomizer && customizerToggle) {
    customizerToggle.style.display = "flex";
  }

  // Keyboard shortcut Ctrl+Shift+C to toggle customizer button visibility
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "c") {
      e.preventDefault();
      if (customizerToggle) {
        const isHidden = window.getComputedStyle(customizerToggle).display === "none";
        customizerToggle.style.display = isHidden ? "flex" : "none";
        if (isHidden && customizerDrawer) {
          customizerDrawer.classList.add("open");
          initCustomizerInputs();
        }
      }
    }
  });

  if (customizerToggle && customizerDrawer) {
    customizerToggle.addEventListener("click", () => {
      customizerDrawer.classList.toggle("open");
      initCustomizerInputs();
    });
  }

  if (customizerClose && customizerDrawer) {
    customizerClose.addEventListener("click", () => {
      customizerDrawer.classList.remove("open");
    });
  }

  // Accent Color Picker logic
  const colorBtns = document.querySelectorAll(".custom-color-btn");
  const hexColorPicker = document.getElementById("input-color-picker");

  colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      colorBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const color = btn.getAttribute("data-color");
      if (hexColorPicker) hexColorPicker.value = color;
      
      // Update DOM instantly
      document.documentElement.style.setProperty("--accent-color", color);
      const rgb = hexToRgb(color);
      if (rgb) {
        document.documentElement.style.setProperty("--accent-color-rgb", `${rgb.r}, ${rgb.g}, ${rgb.b}`);
      }
    });
  });

  if (hexColorPicker) {
    hexColorPicker.addEventListener("input", (e) => {
      const color = e.target.value;
      colorBtns.forEach(b => b.classList.remove("active"));
      
      document.documentElement.style.setProperty("--accent-color", color);
      const rgb = hexToRgb(color);
      if (rgb) {
        document.documentElement.style.setProperty("--accent-color-rgb", `${rgb.r}, ${rgb.g}, ${rgb.b}`);
      }
    });
  }

  // Theme style selector buttons
  const themeModeBtns = document.querySelectorAll(".theme-mode-btn");
  themeModeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      themeModeBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const mode = btn.getAttribute("data-theme-mode");
      applyThemeMode(mode);
    });
  });

  // Apply customizations save button
  const saveBtn = document.getElementById("btn-customizer-save");
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const activeThemeModeBtn = document.querySelector(".theme-mode-btn.active");
      const activeColorBtn = document.querySelector(".custom-color-btn.active");
      
      const settings = {
        brandName: document.getElementById("input-brand")?.value.trim() || "Pratham Singh",
        welcomeTagline: document.getElementById("input-welcome")?.value.trim() || "Welcome to",
        subtitle: document.getElementById("input-subtitle")?.value.trim() || "",
        description: document.getElementById("input-desc")?.value.trim() || "",
        accentColor: hexColorPicker ? hexColorPicker.value : "#ff5722",
        themeMode: activeThemeModeBtn ? activeThemeModeBtn.getAttribute("data-theme-mode") : "dark",
        imgPrefix: document.getElementById("input-img-prefix")?.value.trim() || "ezgif-frame-",
        imgExt: document.getElementById("input-img-ext")?.value.trim() || ".jpg",
        totalFrames: parseInt(document.getElementById("input-img-frames")?.value, 10) || 103
      };

      localStorage.setItem("pratham_portfolio_customizer", JSON.stringify(settings));
      customizerSettings = settings;

      // Close drawer and apply
      if (customizerDrawer) customizerDrawer.classList.remove("open");
      applyCustomizations();
      
      // Re-trigger preloader view
      const preloader = document.getElementById("preloader");
      if (preloader) {
        preloader.style.display = "flex";
        preloader.classList.remove("fade-out");
        const progressBar = document.getElementById("loader-bar");
        const progressText = document.getElementById("loader-percentage");
        if (progressBar) progressBar.style.width = "0%";
        if (progressText) progressText.innerText = "0%";
      }
      preloadBackgroundFrames();
      
      alert("Settings saved and applied successfully!");
    });
  }

  // Reset Customizer settings button
  const resetBtn = document.getElementById("btn-customizer-reset");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("Reset website customizations to original defaults?")) {
        localStorage.removeItem("pratham_portfolio_customizer");
        customizerSettings = {};
        
        // Reset accents
        document.documentElement.style.removeProperty("--accent-color");
        document.documentElement.style.removeProperty("--accent-color-rgb");
        applyThemeMode("dark");

        // Reload the page elements
        const activeThemeNav = document.querySelector(".theme-nav-item.active");
        if (activeThemeNav) {
          const themeIdx = parseInt(activeThemeNav.getAttribute("data-theme"), 10);
          switchServiceTheme(themeIdx);
        } else {
          switchServiceTheme(0);
        }
        
        if (customizerDrawer) customizerDrawer.classList.remove("open");
        alert("Defaults restored successfully!");
        window.location.reload();
      }
    });
  }

});
