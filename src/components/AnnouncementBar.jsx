import { useState } from "react";
import { X, Megaphone } from "lucide-react";
import { useSiteContent } from "../store/siteContentStore";

export default function AnnouncementBar() {
  const content = useSiteContent((s) => s.content);
  const announcement = content?.announcement;

  const [closed, setClosed] = useState(false);

  if (!announcement || !announcement.enabled || closed) return null;

  return (
    <div
      className="relative w-full py-2.5 px-4 text-center animate-slideIn"
      style={{
        background: announcement.bgColor || "#1e293b",
        color: announcement.textColor || "#ffffff",
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 px-6">
        <Megaphone size={14} className="shrink-0 hidden sm:block" />
        <p className="text-xs sm:text-sm font-medium leading-tight">
          {announcement.text || ""}
        </p>
      </div>

      {announcement.closable && (
        <button
          onClick={() => setClosed(true)}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition hover:scale-110 active:scale-95 cursor-pointer"
          style={{
            color: announcement.textColor || "#ffffff",
            background: `${announcement.textColor || "#ffffff"}20`,
          }}
          aria-label="Close"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}