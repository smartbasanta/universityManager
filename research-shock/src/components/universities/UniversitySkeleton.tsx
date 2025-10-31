// components/universities/UniversityCardSkeleton.tsx
export default function UniversityCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col animate-pulse">
      <div className="relative w-full h-48 bg-gray-300" />
      <div className="p-5 flex flex-col flex-grow space-y-3">
        <div className="h-6 bg-gray-300 rounded w-3/4" />
        <div className="h-4 bg-gray-300 rounded w-1/2" />
        <div className="h-4 bg-gray-300 rounded w-full" />
        <div className="h-4 bg-gray-300 rounded w-5/6" />
        <div className="h-10 bg-gray-300 rounded mt-auto" />
      </div>
    </div>
  );
}