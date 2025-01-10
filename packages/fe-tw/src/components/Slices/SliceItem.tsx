"use client";

type Slice = {
  name: string;
  imageUrl: string;
  description: string;
};

export function SliceItem({ slice }: { slice: Slice }) {
  return (
    <div
      className="flex flex-col items-center justify-between p-4 rounded-md bg-white"
      style={{ width: "250px", height: "300px" }}
    >
      {/* Rectangular Image */}
      <img
        src={slice.imageUrl ?? "/default-slice.jpg"}
        alt={slice.name}
        className="w-full h-32 object-cover rounded-md mb-3"
      />
      <h3 className="text-lg font-semibold text-center">{slice.name}</h3>
      <p className="text-sm text-gray-600 text-center line-clamp-3">
        {slice.description}
      </p>
    </div>
  );
}
