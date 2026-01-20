/**
 * Lean Stack Auditor - Landing Page Scripts
 */

document.addEventListener("DOMContentLoaded", () => {
  initCopyToClipboard();
  initSmoothScrolling();
  initStatsAnimation();
  initScrollAnimations();
});

/**
 * Copy to Clipboard functionality for install commands
 */
function initCopyToClipboard() {
  const installCmds = document.querySelectorAll(".install-cmd");

  installCmds.forEach((cmd) => {
    cmd.addEventListener("click", async () => {
      const text = cmd.textContent.trim();

      try {
        await navigator.clipboard.writeText(text);
        cmd.classList.add("copied");

        setTimeout(() => {
          cmd.classList.remove("copied");
        }, 2000);
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);

        cmd.classList.add("copied");
        setTimeout(() => {
          cmd.classList.remove("copied");
        }, 2000);
      }
    });

    // Add cursor pointer and title hint
    cmd.style.cursor = "pointer";
    cmd.title = "Click to copy";
  });
}

/**
 * Smooth scrolling for anchor links
 */
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));

      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

/**
 * Animate stats when they come into view
 */
function initStatsAnimation() {
  const stats = document.querySelectorAll(".stat");

  if (!stats.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger the animation
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, index * 100);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  stats.forEach((stat) => observer.observe(stat));
}

/**
 * General scroll animations for elements
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    ".feature, .problem-card, .libraries-table"
  );

  if (!animatedElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -30px 0px",
    }
  );

  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
}

/**
 * Typing effect for demo output (optional enhancement)
 */
function initTypingEffect() {
  const demoOutput = document.querySelector(".demo-output");
  if (!demoOutput) return;

  const content = demoOutput.innerHTML;
  demoOutput.innerHTML = "";

  let charIndex = 0;
  const typeSpeed = 5;

  function type() {
    if (charIndex < content.length) {
      // Handle HTML tags
      if (content[charIndex] === "<") {
        const tagEnd = content.indexOf(">", charIndex);
        demoOutput.innerHTML += content.slice(charIndex, tagEnd + 1);
        charIndex = tagEnd + 1;
      } else {
        demoOutput.innerHTML += content[charIndex];
        charIndex++;
      }
      setTimeout(type, typeSpeed);
    }
  }

  // Start typing when demo section is in view
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        type();
        observer.disconnect();
      }
    },
    { threshold: 0.5 }
  );

  observer.observe(demoOutput);
}
