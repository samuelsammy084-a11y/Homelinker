export default function PostPropertyPage() {
  return (
    <main className="min-h-screen bg-[#F8F6F1] px-6 py-16">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-10">

        <h1 className="text-4xl font-bold mb-8">
          Post a Property
        </h1>

        <form className="space-y-6">

          <input
            type="text"
            placeholder="Property Title"
            className="w-full border rounded-xl p-4 text-black"
          />

          <input
            type="number"
            placeholder="Monthly Rent"
            className="w-full border rounded-xl p-4 text-black"
          />

          <input
            type="text"
            placeholder="City"
            className="w-full border rounded-xl p-4 text-black"
          />

          <input
            type="text"
            placeholder="Province"
            className="w-full border rounded-xl p-4 text-black"
          />

          <textarea
            placeholder="Description"
            rows={6}
            className="w-full border rounded-xl p-4 text-black"
          />

          <button
            className="bg-[#C9A227] text-white px-10 py-4 rounded-xl font-bold"
          >
            Continue
          </button>

        </form>

      </div>
    </main>
  );
}