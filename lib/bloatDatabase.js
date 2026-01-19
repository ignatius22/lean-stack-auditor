export const BLOAT_DATABASE = {
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
  }
  
  // Clone Deep
  function cloneDeep(obj) {
    return JSON.parse(JSON.stringify(obj));
  }`,
    priority: "HIGH",
    estimatedUsage: 15, // % of library typically used
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
  // Output: "December 25, 2023"
  
  // Relative time
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  rtf.format(-1, 'day');  // "yesterday"
  rtf.format(2, 'week');  // "in 2 weeks"
  
  // Time ago
  function timeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return \`\${interval} \${unit}\${interval > 1 ? 's' : ''} ago\`;
      }
    }
    return 'just now';
  }`,
    priority: "CRITICAL",
    estimatedUsage: 20,
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
  }).then(res => res.json());
  
  // With error handling
  try {
    const response = await fetch('/api/users');
    if (!response.ok) throw new Error('Request failed');
    const data = await response.json();
  } catch (error) {
    console.error('Error:', error);
  }
  
  // Interceptor pattern (like axios)
  function createFetch(baseURL, defaultHeaders = {}) {
    return async (endpoint, options = {}) => {
      const url = \`\${baseURL}\${endpoint}\`;
      const config = {
        ...options,
        headers: { ...defaultHeaders, ...options.headers }
      };
      const response = await fetch(url, config);
      return response.json();
    };
  }
  
  const api = createFetch('https://api.example.com', {
    'Authorization': 'Bearer token'
  });`,
    priority: "MEDIUM",
    estimatedUsage: 30,
  },

  jquery: {
    name: "jQuery",
    reason: "Modern browsers support all jQuery features natively",
    commonUsage: "DOM manipulation, events, AJAX",
    alternative: "Native DOM APIs",
    vanillaCode: `
  // Selectors
  $('.class')          → document.querySelectorAll('.class')
  $('#id')             → document.getElementById('id')
  $('div')             → document.querySelectorAll('div')
  
  // Manipulation
  $(el).addClass('active')    → el.classList.add('active')
  $(el).removeClass('active') → el.classList.remove('active')
  $(el).toggleClass('active') → el.classList.toggle('active')
  $(el).html(content)         → el.innerHTML = content
  $(el).text(content)         → el.textContent = content
  
  // Events
  $(el).on('click', fn)  → el.addEventListener('click', fn)
  $(el).off('click', fn) → el.removeEventListener('click', fn)
  
  // AJAX
  $.ajax({ url, method, data }) → fetch(url, { method, body: data })
  
  // Ready
  $(document).ready(fn) → document.addEventListener('DOMContentLoaded', fn)`,
    priority: "HIGH",
    estimatedUsage: 25,
  },

  underscore: {
    name: "underscore",
    reason: "Similar to Lodash, rarely fully utilized. ES6+ has most features.",
    commonUsage: "Array and object utilities",
    alternative: "Native ES6+ array methods",
    vanillaCode: `
  // Array methods are native
  _.map(arr, fn)           → arr.map(fn)
  _.filter(arr, fn)        → arr.filter(fn)
  _.reduce(arr, fn, init)  → arr.reduce(fn, init)
  _.find(arr, fn)          → arr.find(fn)
  _.every(arr, fn)         → arr.every(fn)
  _.some(arr, fn)          → arr.some(fn)
  
  // Object methods
  _.keys(obj)              → Object.keys(obj)
  _.values(obj)            → Object.values(obj)
  _.entries(obj)           → Object.entries(obj)
  _.assign(target, source) → Object.assign(target, source)
  
  // Unique array
  _.uniq(arr)              → [...new Set(arr)]`,
    priority: "HIGH",
    estimatedUsage: 20,
  },

  classnames: {
    name: "classnames",
    reason: "Simple utility that can be replaced with template literals",
    commonUsage: "Conditional CSS class names",
    alternative: "Template literals or array join",
    vanillaCode: `
  // Simple conditional
  classNames('foo', { bar: true })
  → \`foo \${condition ? 'bar' : ''}\`
  
  // Multiple conditions
  classNames('foo', { bar: isBar, baz: isBaz })
  → ['foo', isBar && 'bar', isBaz && 'baz'].filter(Boolean).join(' ')
  
  // Reusable function
  function classNames(...args) {
    return args
      .flat()
      .filter(x => typeof x === 'string' || typeof x === 'number')
      .join(' ');
  }`,
    priority: "LOW",
    estimatedUsage: 100, // Usually use 100% of this tiny lib
  },

  uuid: {
    name: "uuid",
    reason: "crypto.randomUUID() is now native in browsers and Node 14+",
    commonUsage: "Generate unique IDs",
    alternative: "crypto.randomUUID() (native)",
    vanillaCode: `
  // Generate UUID v4
  import { v4 as uuidv4 } from 'uuid';
  uuidv4();
  
  // Native alternative
  crypto.randomUUID();
  // Output: "36b8f84d-df4e-4d49-b662-bcde71a8764f"
  
  // For older environments, polyfill:
  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }`,
    priority: "MEDIUM",
    estimatedUsage: 50,
  },

  validator: {
    name: "validator",
    reason: "Most validations can be done with regex or native methods",
    commonUsage: "Email, URL, number validation",
    alternative: "Regex patterns and native checks",
    vanillaCode: `
  // Email validation
  function isEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  // URL validation
  function isURL(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
  
  // Number validation
  function isNumeric(str) {
    return !isNaN(str) && !isNaN(parseFloat(str));
  }
  
  // Credit card validation (Luhn algorithm)
  function isCreditCard(number) {
    const digits = number.replace(/\D/g, '');
    let sum = 0;
    let isEven = false;
    
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i]);
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  }`,
    priority: "MEDIUM",
    estimatedUsage: 30,
  },

  request: {
    name: "request",
    reason: "Deprecated library, no longer maintained since 2020",
    commonUsage: "HTTP requests",
    alternative: "node-fetch or native fetch (Node 18+)",
    vanillaCode: `
  // Old: request
  const request = require('request');
  request('http://www.google.com', (error, response, body) => {
    console.log(body);
  });
  
  // New: native fetch (Node 18+)
  const response = await fetch('http://www.google.com');
  const body = await response.text();
  console.log(body);
  
  // With options
  const response = await fetch('https://api.example.com/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'value' })
  });`,
    priority: "CRITICAL",
    estimatedUsage: 40,
  },

  "date-fns": {
    name: "date-fns",
    reason: "Many date-fns functions can be replaced with Intl APIs",
    commonUsage: "Date formatting and manipulation",
    alternative: "Intl.DateTimeFormat and native Date methods",
    vanillaCode: `
  // Format date
  import { format } from 'date-fns';
  format(new Date(), 'yyyy-MM-dd');
  
  // Native alternative
  const date = new Date();
  date.toISOString().split('T')[0];  // "2023-12-25"
  
  // Or with Intl
  new Intl.DateTimeFormat('en-CA').format(date);  // "2023-12-25"
  
  // Format with custom pattern
  new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);  // "December 25, 2023"
  
  // Add days
  function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }`,
    priority: "MEDIUM",
    estimatedUsage: 35,
  },
  "styled-components": {
    name: "styled-components",
    reason: "Heavy runtime CSS-in-JS. Vanilla CSS or CSS Modules are lighter.",
    commonUsage: "Styling React components",
    alternative: "CSS Modules, vanilla CSS-in-JS, or Tailwind",
    vanillaCode: `
// styled-components
const Button = styled.button\`
  background: blue;
  color: white;
\`;

// Vanilla CSS-in-JS (no library needed)
function Button({ children, ...props }) {
  return (
    <button 
      {...props}
      style={{
        background: 'blue',
        color: 'white'
      }}
    >
      {children}
    </button>
  );
}

// Or CSS Modules (0KB runtime)
import styles from './Button.module.css';
function Button({ children }) {
  return <button className={styles.button}>{children}</button>;
}`,
    priority: "MEDIUM",
    estimatedUsage: 40,
  },

  "@emotion/react": {
    name: "@emotion/react",
    reason: "Similar to styled-components, adds runtime overhead",
    commonUsage: "CSS-in-JS for React",
    alternative: "CSS Modules or vanilla CSS-in-JS",
    vanillaCode: `
// Emotion
import { css } from '@emotion/react';
const style = css\`
  background: blue;
  color: white;
\`;

// Vanilla alternative
const style = {
  background: 'blue',
  color: 'white'
};

// Or dynamic styles
function getButtonStyle(variant) {
  return {
    background: variant === 'primary' ? 'blue' : 'gray',
    color: 'white'
  };
}`,
    priority: "MEDIUM",
    estimatedUsage: 40,
  },

  "react-icons": {
    name: "react-icons",
    reason: "Bundles thousands of icons even if you use 5",
    commonUsage: "Icon components",
    alternative: "Inline SVGs or individual icon packages",
    vanillaCode: `
// react-icons (bundles everything)
import { FaHome, FaUser } from 'react-icons/fa';

// Vanilla SVG alternative
function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
  );
}

// Or use individual packages
npm install @iconify/react
import { Icon } from '@iconify/react';
<Icon icon="mdi:home" />

// Or lucide-react (tree-shakeable)
npm install lucide-react
import { Home } from 'lucide-react';`,
    priority: "MEDIUM",
    estimatedUsage: 5,
  },

  "chart.js": {
    name: "chart.js",
    reason: "Heavy charting library. Lighter alternatives exist.",
    commonUsage: "Data visualization",
    alternative: "Recharts, Victory, or vanilla Canvas/SVG",
    vanillaCode: `
// Simple bar chart with vanilla Canvas
function drawBarChart(data, canvas) {
  const ctx = canvas.getContext('2d');
  const max = Math.max(...data);
  const barWidth = canvas.width / data.length;
  
  data.forEach((value, i) => {
    const height = (value / max) * canvas.height;
    ctx.fillStyle = 'blue';
    ctx.fillRect(
      i * barWidth, 
      canvas.height - height,
      barWidth - 2, 
      height
    );
  });
}

// Or use lighter libraries
// Recharts: ~100KB (vs Chart.js ~250KB)
// Victory: ~150KB
// Plotly: Heavy but feature-rich`,
    priority: "LOW",
    estimatedUsage: 30,
  },

  "prop-types": {
    name: "prop-types",
    reason: "Runtime type checking. TypeScript does this at build time.",
    commonUsage: "React prop validation",
    alternative: "TypeScript or JSDoc",
    vanillaCode: `
// prop-types (runtime checking)
import PropTypes from 'prop-types';
Button.propTypes = {
  onClick: PropTypes.func.required,
  label: PropTypes.string
};

// TypeScript (build-time, 0 runtime cost)
interface ButtonProps {
  onClick: () => void;
  label?: string;
}

function Button({ onClick, label }: ButtonProps) {
  // TypeScript catches errors at compile time
}

// Or JSDoc (no build step, editor support)
/**
 * @param {Object} props
 * @param {() => void} props.onClick
 * @param {string} [props.label]
 */
function Button({ onClick, label }) {
  // VSCode will type-check this
}`,
    priority: "MEDIUM",
    estimatedUsage: 100,
  },
};
