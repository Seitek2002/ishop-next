import { ArrowUpRight } from "lucide-react";
import ui from "../ui.module.scss";

// Label that rolls to a copy of itself when its button is hovered.
export function Roll({ children }: { children: string }) {
  return (
    <span className={ui.roll}>
      <span>{children}</span>
    </span>
  );
}

// Circular arrow badge: on hover one arrow leaves and another arrives.
export function ArrowBadge() {
  return (
    <span className={ui.btnIcon} aria-hidden>
      <ArrowUpRight strokeWidth={2.2} />
      <ArrowUpRight strokeWidth={2.2} />
    </span>
  );
}
