"use client";

type Props = {
  title: string;
  setTitle: (v: string) => void;

  description: string;
  setDescription: (v: string) => void;

  phoneNumber: string;
  setPhoneNumber: (v: string) => void;

  onBack: () => void;
  onNext: () => void;
};

export default function DescriptionStep({
  title,
  setTitle,
  description,
  setDescription,
  phoneNumber,
  setPhoneNumber,
  onBack,
  onNext,
}: Props) {
  const input =
    "w-full rounded-2xl border border-[#E8D9A8] p-4 text-[#111111] outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20";

  const cleanPhone = phoneNumber.replace(/\D/g, "");

  const isPhoneValid =
    cleanPhone.length >= 10 && cleanPhone.length <= 15;

  const canContinue =
    title.trim() !== "" &&
    description.trim() !== "" &&
    isPhoneValid;

  return (
    <div className="rounded-[32px] border border-[#E8D9A8] bg-white p-10 shadow-xl">
      <h2 className="text-center text-4xl font-black text-[#111111]">
        Describe your property
      </h2>

      <p className="mb-10 mt-3 text-center text-[#555555]">
        Give buyers or tenants a reason to choose your property.
      </p>

      <div className="space-y-8">
        {/* LISTING TITLE */}
        <div>
          <label className="mb-2 block font-semibold text-[#111111]">
            Listing Title
          </label>

          <input
            className={input}
            placeholder="Modern 3 Bedroom House in Roodepoort"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="mb-2 block font-semibold text-[#111111]">
            Description
          </label>

          <textarea
            rows={10}
            className={input}
            placeholder="Describe your property..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* PHONE NUMBER */}
        <div>
          <label className="mb-2 block font-semibold text-[#111111]">
            WhatsApp / Phone Number
          </label>

          <p className="mb-3 text-sm text-[#666666]">
            This number will be used to create the WhatsApp button on
            your property listing.
          </p>

          <input
            type="tel"
            inputMode="tel"
            className={input}
            placeholder="e.g. 082 123 4567"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          {phoneNumber.length > 0 && !isPhoneValid && (
            <p className="mt-2 text-sm font-medium text-red-600">
              Please enter a valid phone number.
            </p>
          )}

          {isPhoneValid && (
            <p className="mt-2 text-sm font-medium text-green-600">
              ✓ WhatsApp contact number looks good.
            </p>
          )}
        </div>
      </div>

      <div className="mt-10 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-2xl border border-[#C9A227] px-8 py-4 font-semibold text-[#C9A227] transition hover:bg-[#FFF6D8]"
        >
          ← Back
        </button>

        <button
          type="button"
          disabled={!canContinue}
          onClick={onNext}
          className="rounded-2xl bg-[#C9A227] px-8 py-4 font-semibold text-white transition hover:bg-[#A67C00] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}