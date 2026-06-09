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
function resolveCover(book) {
  if (book.cover && book.cover.startsWith("http")) {
    if (book.cover.includes("covers.openlibrary.org") && !book.cover.includes("default=false")) {
      return `${book.cover}${book.cover.includes("?") ? "&" : "?"}default=false`;
    }
    return book.cover;
  }
  if (book.gutendexId) {
    return `https://covers.openlibrary.org/b/olid/OL${book.gutendexId}W-L.jpg?default=false`;
  }
  const seed = book.id ?? book.gutendexId ?? "book";
  return `https://picsum.photos/seed/${seed}/200/300`;
}
export {
  Wordmark as W,
  cn as c,
  resolveCover as r
};
