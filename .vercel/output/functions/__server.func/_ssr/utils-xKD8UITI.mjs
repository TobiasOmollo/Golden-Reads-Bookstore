import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
function Wordmark({ className = "" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `font-display font-semibold tracking-wide text-gold ${className}`,
      style: { letterSpacing: "0.08em" },
      children: "GOLDEN READS"
    }
  );
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const safeCoverUrl = (url) => url?.replace("http://", "https://") ?? "";
export {
  Wordmark as W,
  cn as c,
  safeCoverUrl as s
};
