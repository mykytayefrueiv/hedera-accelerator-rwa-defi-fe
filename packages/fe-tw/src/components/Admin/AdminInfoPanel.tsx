"use client";

export function AdminInfoPanel() {
  return (
    <div className="bg-purple-50 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">What You Can Do</h2>
      <p className="text-sm sm:text-base text-gray-700">
        This interface allows you to manage buildings by adding new ones to the platform,
        and also add liquidity to their token pairs.
      </p>
      <p className="mt-4 text-sm sm:text-base text-gray-700">
        Filling in the building form creates a new building (mocked or real).
        Adding liquidity ensures there's an actual token pair for trading.
      </p>
    </div>
  );
}
