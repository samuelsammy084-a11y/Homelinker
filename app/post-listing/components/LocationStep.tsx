"use client";

type Props = {
  province: string;
  setProvince: (v: string) => void;
  city: string;
  setCity: (v: string) => void;
  suburb: string;
  setSuburb: (v: string) => void;
  address: string;
  setAddress: (v: string) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function LocationStep({
  province,
  setProvince,
  city,
  setCity,
  suburb,
  setSuburb,
  address,
  setAddress,
  onBack,
  onNext,
}: Props) {
  const input =
    "w-full rounded-2xl border border-[#E8D9A8] p-4 text-black outline-none focus:border-[#C9A227]";

  return (
    <div className="rounded-[32px] border border-[#E8D9A8] bg-white p-10 shadow-xl">

      <h2 className="text-4xl font-black text-center text-[#111111]">
        Property Location
      </h2>

      <p className="text-center text-[#555555] mt-3 mb-10">
        Tell us where your property is located.
      </p>

      <div className="grid gap-6 md:grid-cols-2">

        <select
          className={input}
          value={province}
          onChange={(e) => setProvince(e.target.value)}
        >
          <option value="">Province</option>
          <option>Gauteng</option>
          <option>Western Cape</option>
          <option>KwaZulu-Natal</option>
          <option>Eastern Cape</option>
          <option>Free State</option>
          <option>Limpopo</option>
          <option>Mpumalanga</option>
          <option>North West</option>
          <option>Northern Cape</option>
        </select>

        <input
          className={input}
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <input
          className={input}
          placeholder="Suburb"
          value={suburb}
          onChange={(e) => setSuburb(e.target.value)}
        />

        <input
          className={input}
          placeholder="Street Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

      </div>

      <div className="mt-10 h-80 rounded-3xl border-2 border-dashed border-[#E8D9A8] flex items-center justify-center text-[#555555] text-xl">
        🗺 Map Coming Next
      </div>

      <div className="mt-10 flex justify-between">

        <button
          onClick={onBack}
          className="rounded-2xl border border-[#C9A227] px-8 py-4 text-[#C9A227]"
        >
          ← Back
        </button>

        <button
          onClick={onNext}
          disabled={!province || !city || !suburb || !address}
          className="rounded-2xl bg-[#C9A227] px-8 py-4 text-white disabled:opacity-40"
        >
          Continue →
        </button>

      </div>

    </div>
  );
}