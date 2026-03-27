import { Suspense } from "react";
import BrowseContent from "./BrowseContent";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Browse Ideas · Criticast" };

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-400 text-sm">Loading…</div>}>
      <BrowseContent />
    </Suspense>
  );
}
