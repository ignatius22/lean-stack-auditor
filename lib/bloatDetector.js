// Known bloated libraries and their vanilla alternatives
const BLOAT_PATTERNS = {
  lodash: {
    name: "lodash",
    reason: "Most projects use only 3-5 functions from Lodash",
    commonUsage: "debounce, throttle, cloneDeep, merge, pick",
    alternative: "Vanilla JS implementations (15-20 lines per function)",
    vanillaCode: `
  // Debounce
  function debounce(fn, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  }
  
  // Throttle
  function throttle(fn, delay) {
    let lastCall = 0;
    return (...args) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        fn(...args);
      }
    };
  }`,
    priority: "HIGH",
  },
  moment: {
    name: "moment.js",
    reason: "Moment is deprecated and very heavy. Modern alternatives exist.",
    commonUsage: "Date formatting and manipulation",
    alternative: "Intl.DateTimeFormat (native) or date-fns/dayjs (lighter)",
    vanillaCode: `
  // Format date
  const formatted = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date());
  
  // Relative time
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  rtf.format(-1, 'day'); // "yesterday"`,
    priority: "CRITICAL",
  },
  axios: {
    name: "axios",
    reason: "fetch API is now native in all modern browsers and Node 18+",
    commonUsage: "HTTP requests (GET, POST)",
    alternative: "fetch API (native)",
    vanillaCode: `
  // GET request
  const data = await fetch('/api/users')
    .then(res => res.json());
  
  // POST request
  const result = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'John' })
  }).then(res => res.json());`,
    priority: "MEDIUM",
  },
  jquery: {
    name: "jQuery",
    reason: "Modern browsers support all jQuery features natively",
    commonUsage: "DOM manipulation, events, AJAX",
    alternative: "Native DOM APIs",
    vanillaCode: `
  // jQuery: $('.class')
  document.querySelectorAll('.class')
  
  // jQuery: $('#id')
  document.getElementById('id')
  
  // jQuery: $(el).addClass('active')
  el.classList.add('active')
  
  // jQuery: $.ajax()
  fetch('/api/endpoint')`,
    priority: "HIGH",
  },
  underscore: {
    name: "underscore",
    reason: "Similar to Lodash, rarely fully utilized",
    commonUsage: "Array and object utilities",
    alternative: "Native ES6+ array methods",
    vanillaCode: `
  // map, filter, reduce are native
  arr.map(x => x * 2)
  arr.filter(x => x > 5)
  arr.reduce((sum, x) => sum + x, 0)`,
    priority: "HIGH",
  },
  request: {
    name: "request",
    reason: "Deprecated library, no longer maintained",
    commonUsage: "HTTP requests",
    alternative: "node-fetch or native fetch (Node 18+)",
    vanillaCode: `
  // Native fetch in Node 18+
  const response = await fetch('https://api.example.com');
  const data = await response.json();`,
    priority: "CRITICAL",
  },
};

export function detectBloat(dependencies) {
  const bloatedDeps = [];

  for (const dep of dependencies) {
    const pattern = BLOAT_PATTERNS[dep.name];

    if (pattern) {
      bloatedDeps.push({
        ...dep,
        ...pattern,
        savings: dep.sizeKB,
        savingsPercent: 100, // Full replacement
      });
    }
  }

  return bloatedDeps.sort((a, b) => {
    // Sort by priority first, then size
    const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];

    if (priorityDiff !== 0) return priorityDiff;
    return b.savings - a.savings;
  });
}
