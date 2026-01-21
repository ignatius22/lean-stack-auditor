/**
 * Size Analyzer - Uses accurate minified+gzipped bundle sizes
 *
 * These sizes represent the actual impact on your users' downloads,
 * sourced from bundlephobia.com and package documentation.
 */

// Accurate bundle sizes (minified + gzipped) in KB
const BUNDLE_SIZES = {
  // Utility libraries
  lodash: 25,
  underscore: 6,
  ramda: 12,
  classnames: 1,
  clsx: 0.5,
  deepmerge: 1,
  "lodash-es": 25,

  // Date/Time
  moment: 72,
  "moment-timezone": 95,
  "date-fns": 13,
  dayjs: 3,
  luxon: 23,

  // HTTP clients
  axios: 13,
  "node-fetch": 5,
  "isomorphic-fetch": 3,
  request: 50,
  superagent: 18,
  got: 25,

  // DOM manipulation
  jquery: 30,
  zepto: 10,
  cheerio: 25,

  // Validation
  validator: 18,
  joi: 35,
  yup: 15,
  zod: 12,

  // UUID/ID generation
  uuid: 3,
  nanoid: 0.5,
  "short-uuid": 2,
  cuid: 1,

  // React ecosystem
  react: 6,
  "react-dom": 42,
  "prop-types": 3,
  "react-icons": 10,
  "styled-components": 16,
  "@emotion/react": 8,
  "@emotion/styled": 5,
  "react-query": 13,
  redux: 2,
  "react-redux": 5,
  mobx: 16,
  "mobx-react": 5,

  // Vue ecosystem
  vue: 23,
  vuex: 4,
  "vue-router": 9,

  // Charts
  "chart.js": 58,
  d3: 75,
  recharts: 45,
  "victory-chart": 35,
  apexcharts: 140,
  highcharts: 100,

  // Polyfills & legacy
  "@babel/polyfill": 89,
  "core-js": 30,
  "regenerator-runtime": 2,
  "promise-polyfill": 1,

  // Tiny utilities (often unnecessary)
  "left-pad": 0.1,
  isarray: 0.1,
  "is-array": 0.1,
  "object-assign": 0.5,
  "is-promise": 0.1,
  "is-buffer": 0.1,
  "is-number": 0.1,
  "is-string": 0.1,
  "is-function": 0.1,

  // Query strings
  qs: 8,
  "query-string": 3,
  querystring: 2,

  // Animation
  gsap: 24,
  animejs: 7,
  "framer-motion": 45,
  "react-spring": 18,

  // Misc
  bluebird: 18,
  async: 7,
  rxjs: 30,
  immer: 5,
  immutable: 16,
};

// Dev dependencies that don't affect bundle size
const DEV_DEPENDENCIES = [
  "eslint",
  "prettier",
  "webpack",
  "babel",
  "jest",
  "mocha",
  "chai",
  "sinon",
  "cypress",
  "playwright",
  "typescript",
  "ts-node",
  "@types/",
  "nodemon",
  "concurrently",
  "husky",
  "lint-staged",
  "commitlint",
  "rollup",
  "vite",
  "esbuild",
  "parcel",
  "turbo",
];

/**
 * Check if a dependency is a dev-only tool (doesn't add to bundle)
 */
function isDevDependency(depName) {
  return DEV_DEPENDENCIES.some(
    (dev) => depName === dev || depName.startsWith(dev) || depName.includes(dev)
  );
}

/**
 * Get the bundle size for a dependency
 * Returns minified+gzipped size in KB
 */
export function estimateDependencySize(depName) {
  // Dev dependencies don't add to bundle
  if (isDevDependency(depName)) {
    return 0;
  }

  // Check for exact match
  if (BUNDLE_SIZES[depName] !== undefined) {
    return BUNDLE_SIZES[depName];
  }

  // Check for scoped packages (e.g., @babel/core -> babel)
  const unscoped = depName.replace(/^@[^/]+\//, "");
  if (BUNDLE_SIZES[unscoped] !== undefined) {
    return BUNDLE_SIZES[unscoped];
  }

  // Default estimate for unknown packages
  // Most small utility packages are 1-5KB gzipped
  return 5;
}

/**
 * Analyze all dependencies and add size information
 */
export function analyzeDependencies(dependencies) {
  return dependencies
    .map((dep) => {
      const sizeKB = estimateDependencySize(dep.name);

      return {
        ...dep,
        sizeKB,
        sizeMB: (sizeKB / 1024).toFixed(2),
      };
    })
    .filter((dep) => dep.sizeKB > 0) // Filter out dev dependencies
    .sort((a, b) => b.sizeKB - a.sizeKB); // Sort by size descending
}

/**
 * Format size for display
 */
export function formatSize(sizeKB) {
  if (sizeKB >= 1000) {
    return `${(sizeKB / 1024).toFixed(1)}MB`;
  }
  if (sizeKB >= 10) {
    return `${Math.round(sizeKB)}KB`;
  }
  return `${sizeKB.toFixed(1)}KB`;
}

/**
 * Get all known bundle sizes (for reference)
 */
export function getKnownSizes() {
  return { ...BUNDLE_SIZES };
}
