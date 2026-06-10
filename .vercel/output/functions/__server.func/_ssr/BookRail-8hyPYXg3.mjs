import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as BookCardSkeleton, a as BookCard } from "./BookCard-Ok4mHVHo.mjs";
function SectionHeader({
  title,
  href,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between px-5 mb-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[20px] font-display font-semibold tracking-tight", children: title }),
    href ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: href,
        className: "font-mono text-[11px] uppercase tracking-wider text-gold",
        children: "See all →"
      }
    ) : children
  ] });
}
function BookRail({ books, loading }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto no-scrollbar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 px-5 pb-2", children: loading ? Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(BookCardSkeleton, {}, i)) : books.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsx(BookCard, { book: b }, b.id)) }) });
}
export {
  BookRail as B,
  SectionHeader as S
};
