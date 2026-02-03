import { isArrayTransform } from "./isarray.js";
import { objectAssignTransform } from "./objectAssign.js";
import { promisePolyfillTransform } from "./promisePolyfill.js";

export const transforms = {
  "isarray": isArrayTransform,
  "object-assign": objectAssignTransform,
  "promise-polyfill": promisePolyfillTransform
};
