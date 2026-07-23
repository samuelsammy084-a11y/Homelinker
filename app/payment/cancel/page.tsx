export default function PaymentCancelPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F8F6F1]">
      <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-lg">
        <h1 className="text-4xl font-bold text-red-600">
          Payment Cancelled
        </h1>

        <p className="mt-4 text-gray-600">
          Your payment was cancelled. No charges were made.
        </p>

        <a
          href="/pricing"
          className="inline-block mt-8 bg-[#C9A227] text-white px-8 py-4 rounded-xl font-bold"
        >
          Back to Pricing
        </a>
      </div>
    </main>
  );
}