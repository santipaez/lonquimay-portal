import React from 'react';

interface NewsSkeletonProps {
  count?: number;
}

export default function NewsSkeleton({ count = 3 }: NewsSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <article
          key={idx}
          className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
        >
          {/* Image Skeleton */}
          <div className="h-48 bg-gray-200 animate-pulse relative">
            {/* Badge skeletons */}
            <div className="absolute top-4 left-4 w-20 h-6 bg-gray-300 rounded-full"></div>
            <div className="absolute top-4 right-4 w-24 h-6 bg-gray-300 rounded-full"></div>
          </div>
          
          {/* Content Skeleton */}
          <div className="p-6">
            {/* Title Skeleton */}
            <div className="h-6 bg-gray-200 rounded animate-pulse mb-3 w-3/4"></div>
            {/* Snippet Skeleton */}
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
            </div>
            {/* Link Skeleton */}
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
          </div>
        </article>
      ))}
    </>
  );
}

