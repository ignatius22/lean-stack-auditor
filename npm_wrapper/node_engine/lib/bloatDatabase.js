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
  "node-fetch": {
    name: "node-fetch",
    reason: "Not needed in Node.js 18+, fetch is now native",
    commonUsage: "HTTP requests in Node.js",
    alternative: "Native fetch (Node 18+)",
    vanillaCode: `
// node-fetch (only needed in Node < 18)
import fetch from 'node-fetch';
const response = await fetch('https://api.example.com');

// Native fetch (Node 18+)
const response = await fetch('https://api.example.com');
const data = await response.json();

// No import needed, works out of the box
// Check Node version: node --version
// If >= 18, remove node-fetch entirely`,
    priority: "HIGH",
    estimatedUsage: 100,
  },

  "@babel/polyfill": {
    name: "@babel/polyfill",
    reason: "Deprecated since Babel 7.4, use core-js directly",
    commonUsage: "ES6+ polyfills",
    alternative: "core-js with targeted polyfills",
    vanillaCode: `
// Old (deprecated)
import '@babel/polyfill';

// New approach - import only what you need
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// Or even better - use browserslist + core-js 3
// In babel.config.js:
{
  "presets": [
    ["@babel/preset-env", {
      "useBuiltIns": "usage",
      "corejs": 3
    }]
  ]
}

// This only includes polyfills your code actually uses`,
    priority: "CRITICAL",
    estimatedUsage: 100,
  },

  "left-pad": {
    name: "left-pad",
    reason: "Famous npm incident. Native padStart does this.",
    commonUsage: "String padding",
    alternative: "String.prototype.padStart (native)",
    vanillaCode: `
// left-pad
const leftPad = require('left-pad');
leftPad('foo', 5);        // "  foo"
leftPad('foobar', 6);     // "foobar"
leftPad(1, 2, '0');       // "01"

// Native alternative
'foo'.padStart(5);        // "  foo"
'foobar'.padStart(6);     // "foobar"
'1'.padStart(2, '0');     // "01"

// Also available: padEnd
'foo'.padEnd(5);          // "foo  "
'1'.padEnd(2, '0');       // "10"`,
    priority: "MEDIUM",
    estimatedUsage: 100,
  },

  isarray: {
    name: "isarray",
    reason: "Array.isArray is native since ES5",
    commonUsage: "Check if value is array",
    alternative: "Array.isArray (native)",
    vanillaCode: `
// isarray package
const isArray = require('isarray');
isArray([]);              // true
isArray({});              // false

// Native alternative
Array.isArray([]);        // true
Array.isArray({});        // false
Array.isArray('string');  // false
Array.isArray(null);      // false

// Works everywhere, even IE9+
// No package needed`,
    priority: "MEDIUM",
    estimatedUsage: 100,
  },

  "object-assign": {
    name: "object-assign",
    reason: "Object.assign is native since ES6",
    commonUsage: "Merge objects",
    alternative: "Object.assign or spread operator (native)",
    vanillaCode: `
// object-assign package
const assign = require('object-assign');
assign({}, obj1, obj2);

// Native alternatives

// Option 1: Object.assign
Object.assign({}, obj1, obj2);

// Option 2: Spread operator (more modern)
const merged = { ...obj1, ...obj2 };

// Deep merge (if needed)
const deepMerge = (target, source) => {
  Object.keys(source).forEach(key => {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], deepMerge(target[key], source[key]));
    }
  });
  return { ...target, ...source };
};`,
    priority: "MEDIUM",
    estimatedUsage: 100,
  },

  "is-promise": {
    name: "is-promise",
    reason: "Simple check that can be done natively",
    commonUsage: "Check if value is a Promise",
    alternative: "Manual check (2 lines)",
    vanillaCode: `
// is-promise package
const isPromise = require('is-promise');
isPromise(value);

// Native alternative
function isPromise(value) {
  return value && typeof value.then === 'function';
}

// Or more robust
function isPromise(value) {
  return Promise.resolve(value) === value;
}

// Usage
isPromise(fetch('/api'));           // true
isPromise(Promise.resolve(5));      // true
isPromise('not a promise');         // false`,
    priority: "LOW",
    estimatedUsage: 100,
  },

  qs: {
    name: "qs",
    reason: "URLSearchParams is native for most use cases",
    commonUsage: "Query string parsing",
    alternative: "URLSearchParams (native)",
    vanillaCode: `
// qs package
const qs = require('qs');
const params = qs.parse('foo=bar&baz=qux');

// Native alternative
const params = new URLSearchParams('foo=bar&baz=qux');
params.get('foo');        // "bar"
params.get('baz');        // "qux"

// Building query strings
const query = new URLSearchParams({
  foo: 'bar',
  baz: 'qux'
});
query.toString();         // "foo=bar&baz=qux"

// From object to URL
const url = 'https://api.example.com?' + 
  new URLSearchParams({ page: 1, limit: 10 });

// Note: qs handles nested objects better
// For complex nesting, qs might still be needed`,
    priority: "MEDIUM",
    estimatedUsage: 70,
  },

  "query-string": {
    name: "query-string",
    reason: "URLSearchParams is native",
    commonUsage: "Parse and stringify URL query strings",
    alternative: "URLSearchParams (native)",
    vanillaCode: `
// query-string package
import queryString from 'query-string';
queryString.parse('?foo=bar');

// Native alternative
const params = new URLSearchParams(window.location.search);
params.get('foo');

// Parse custom query string
const customParams = new URLSearchParams('foo=bar&baz=qux');

// Stringify object
const query = new URLSearchParams({ foo: 'bar', baz: 'qux' });
query.toString();         // "foo=bar&baz=qux"

// Get all values
Object.fromEntries(params);  // { foo: 'bar', baz: 'qux' }`,
    priority: "MEDIUM",
    estimatedUsage: 80,
  },

  "promise-polyfill": {
    name: "promise-polyfill",
    reason: "Promises are native in all modern browsers",
    commonUsage: "Promise support in old browsers",
    alternative: "Native Promise (or async/await)",
    vanillaCode: `
// promise-polyfill (only needed for IE11 and below)
import Promise from 'promise-polyfill';

// Native Promise (works in all modern browsers)
const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => resolve('Done!'), 1000);
});

myPromise.then(result => console.log(result));

// Async/await (even more modern)
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

// Only use promise-polyfill if you need IE11 support`,
    priority: "MEDIUM",
    estimatedUsage: 100,
  },

  deepmerge: {
    name: "deepmerge",
    reason: "Can be implemented in vanilla JS for most cases",
    commonUsage: "Deep merge objects",
    alternative: "Custom function or structuredClone",
    vanillaCode: `
// deepmerge package
const merge = require('deepmerge');
const merged = merge(obj1, obj2);

// Vanilla JS alternative (simple cases)
function deepMerge(target, source) {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }
  
  return output;
}

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

// For deep cloning
const cloned = structuredClone(obj);  // Modern browsers`,
    priority: "LOW",
    estimatedUsage: 60,
  },
};
