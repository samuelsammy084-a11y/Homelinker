"use client";

type Props = {
  images: File[];
  setImages: (files: File[]) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function PhotosStep({
  images,
  setImages,
  onBack,
  onNext,
}: Props) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;

    setImages(Array.from(e.target.files));
  }

  return (
    <div className="rounded-3xl border border-[#E8D9A8] bg-white p-10 shadow-xl">

      <h2 className="text-center text-4xl font-black text-[#111111]">
        Upload Photos
      </h2>

      <p className="mt-3 text-center text-[#555555]">
        Upload clear, high-quality photos of your property.
      </p>

      <div className="mt-10 rounded-2xl border-2 border-dashed border-[#E8D9A8] bg-[#FFF9E8] p-8">

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="
            block
            w-full
            text-[#111111]
            file:mr-4
            file:rounded-xl
            file:border-0
            file:bg-[#C9A227]
            file:px-5
            file:py-3
            file:font-semibold
            file:text-white
            hover:file:bg-[#A67C00]
          "
        />

        {images.length > 0 && (
          <div className="mt-8">

            <p className="font-bold text-[#111111]">
              {images.length} photo(s) selected
            </p>

            <ul className="mt-4 space-y-2 list-disc pl-6 text-[#111111]">

              {images.map((image, index) => (

                <li key={index}>
                  {image.name}
                </li>

              ))}

            </ul>

          </div>
        )}

      </div>

      <div className="mt-10 flex justify-between">

        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border-2 border-[#C9A227] px-6 py-3 font-semibold text-[#C9A227] transition hover:bg-[#FFF6D8]"
        >
          ← Back
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={images.length === 0}
          className="rounded-xl bg-[#C9A227] px-6 py-3 font-semibold text-white transition hover:bg-[#A67C00] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue →
        </button>

      </div>

    </div>
  );
}