"use client";

type Props = {
  title: string;
  setTitle: (v: string) => void;

  description: string;
  setDescription: (v: string) => void;

  onBack: () => void;
  onNext: () => void;
};

export default function DescriptionStep({
  title,
  setTitle,
  description,
  setDescription,
  onBack,
  onNext,
}: Props) {

  const input =
    "w-full rounded-2xl border border-[#E8D9A8] p-4 text-[#111111] outline-none focus:border-[#C9A227]";

  return (
    <div className="rounded-[32px] border border-[#E8D9A8] bg-white p-10 shadow-xl">

      <h2 className="text-4xl font-black text-center text-[#111111]">
        Describe your property
      </h2>

      <p className="mt-3 mb-10 text-center text-[#555555]">
        Give buyers or tenants a reason to choose your property.
      </p>

      <div className="space-y-8">

        <div>

          <label className="mb-2 block font-semibold text-[#111111]">
            Listing Title
          </label>

          <input
            className={input}
            placeholder="Modern 3 Bedroom House in Roodepoort"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
          />

        </div>

        <div>

          <label className="mb-2 block font-semibold text-[#111111]">
            Description
          </label>

          <textarea
            rows={10}
            className={input}
            placeholder="Describe your property..."
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
          />

        </div>

      </div>

      <div className="mt-10 flex justify-between">

        <button
          onClick={onBack}
          className="rounded-2xl border border-[#C9A227] px-8 py-4 font-semibold text-[#C9A227]"
        >
          ← Back
        </button>

        <button
          disabled={!title || !description}
          onClick={onNext}
          className="rounded-2xl bg-[#C9A227] px-8 py-4 font-semibold text-white disabled:opacity-40 hover:bg-[#A67C00]"
        >
          Continue →
        </button>

      </div>

    </div>
  );
}