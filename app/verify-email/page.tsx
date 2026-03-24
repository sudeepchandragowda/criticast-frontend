import { Suspense } from "react";
import VerifyEmailContent from "./VerifyEmailContent";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-400 text-sm">Verifying…</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
