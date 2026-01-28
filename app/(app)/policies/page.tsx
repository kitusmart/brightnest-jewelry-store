import { ShieldCheck, Truck, RefreshCcw, Clock } from "lucide-react";

export default function PolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-24">
      <h1 className="text-4xl font-bold text-zinc-900 mb-4">Store Policies</h1>
      <p className="text-zinc-500 mb-12">Transparency is our priority. Here is how we handle your jewelry orders.</p>

      <div className="grid gap-12">
        {/* Shipping Policy */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-[#D4AF37]">
            <Truck className="h-6 w-6" />
            <h2 className="text-xl font-bold uppercase tracking-wider">Shipping Policy</h2>
          </div>
          <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-100 text-zinc-600 leading-relaxed">
            <ul className="list-disc pl-5 space-y-2">
              <li>Orders are processed within 24-48 hours.</li>
              <li>Standard shipping takes 3-7 business days across India.</li>
              <li>Free shipping is available on all prepaid orders.</li>
              <li>You will receive a tracking number via email once your jewelry is dispatched.</li>
            </ul>
          </div>
        </section>

        {/* Refund & Return Policy */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-[#D4AF37]">
            <RefreshCcw className="h-6 w-6" />
            <h2 className="text-xl font-bold uppercase tracking-wider">Refund & Returns</h2>
          </div>
          <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-100 text-zinc-600 leading-relaxed">
            <p className="mb-4">We want you to love your shine. If you aren't satisfied, we are here to help.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>We offer a 7-day return policy from the date of delivery.</li>
              <li>Jewelry must be unworn, in its original packaging, with all tags intact.</li>
              <li>For hygiene reasons, earrings are not eligible for return unless defective.</li>
              <li>Refunds are processed within 5-7 business days after we receive the return.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}