import React from 'react';

interface SkeletonLoaderProps {
  count?: number; // Number of skeleton items to display
  width?: string; // Width of the skeleton elements
  height?: string; // Height of the skeleton elements
  circle?: boolean; // Whether the skeleton should be circular (e.g., for avatars)
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  count = 1,
  width = 'w-full',
  height = 'h-6',
  circle = false,
}) => {
  const skeletonItems = Array(count).fill(0); // Create an array with the specified count to render multiple skeletons

  return (
    <div>
      {skeletonItems.map((_, index) => (
        <div key={index} className="mb-4">
          {circle ? (
            <div
              className={`${height} ${height} rounded-full bg-gray-300 animate-pulse`}
            />
          ) : (
            <div
              className={`${width} ${height} bg-gray-300 animate-pulse`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
