import { Suspense } from "react";
import CallbackContent from "./CallbackContent";

export default function CallbackPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center"><p className="text-sm text-gray-400">Signing you in…</p></div>}>
      <CallbackContent />
    </Suspense>
  );
}
