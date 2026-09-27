import { useState } from "react";

const LENGTHS = [
  { id: "short", label: "Short" },
  { id: "medium", label: "Medium" },
  { id: "detailed", label: "Detailed" },
];

export default function SummaryTab() {
  const [length, setLength] = useState("medium");

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex rounded-lg border border-rule bg-white p-1">
          {LENGTHS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLength(l.id)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                ${length === l.id ? "bg-ink text-white" : "text-ink-soft hover:text-ink"}`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <button className="text-sm text-ink-soft hover:text-ink transition-colors">
          Regenerate
        </button>
      </div>

      <article className="bg-white border border-rule rounded-xl p-8">
        <h2 className="font-serif text-2xl font-semibold text-ink mb-3">Overview</h2>
        <p className="text-ink leading-relaxed mb-6">
          This document specifies a ticketing platform for tournaments, covering FIFA
          formats (Pro Clubs, Box, 1v1, LAN) alongside general event ticketing, user
          roles, payments, and the database design needed for an MVP.
        </p>

        <h2 className="font-serif text-2xl font-semibold text-ink mb-3">Key points</h2>
        <ul className="list-disc list-inside text-ink leading-relaxed space-y-1.5 mb-6">
          <li>Three user types: Super Admin, Event Organizer, Attendee (page 1)</li>
          <li>Four tournament formats, each with its own required fields (page 8)</li>
          <li>Orders move through Pending, Paid, Cancelled, Refunded (page 4)</li>
          <li>Nepal gateways (eSewa, Khalti, FonePay) plus Stripe and PayPal globally (page 5)</li>
          <li>MVP covers 10 core tables; reviews and coupons are Phase 2 (page 16)</li>
        </ul>

        <h2 className="font-serif text-2xl font-semibold text-ink mb-3">Important terms</h2>
        <ul className="list-disc list-inside text-ink leading-relaxed space-y-1.5">
          <li><span className="font-medium">Box Tournament</span>: a team-based format bought by a captain</li>
          <li><span className="font-medium">MVP</span>: the minimum feature set for version 1</li>
        </ul>
      </article>
    </div>
  );
}