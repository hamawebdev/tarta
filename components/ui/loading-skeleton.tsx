'use client';

import React from 'react';

export function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/20 to-muted/10 p-4 md:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex items-center mb-8 md:mb-10">
          <div className="w-20 h-10 bg-white/20 rounded-md animate-pulse mr-4 md:mr-6"></div>
          <div className="w-64 h-8 bg-white/20 rounded-md animate-pulse"></div>
        </div>

        {/* Card Skeleton */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/30">
          <div className="px-6 md:px-8 py-6 border-b border-gray-100">
            <div className="w-48 h-6 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
          
          <div className="px-6 md:px-8 pb-8 pt-6">
            <div className="space-y-8">
              {/* Product Selection Skeleton */}
              <div className="space-y-3">
                <div className="w-32 h-5 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center space-x-4 p-4 rounded-lg border-2 border-gray-200 bg-white">
                      <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-16 h-16 bg-gray-200 rounded-xl animate-pulse"></div>
                      <div className="flex-1">
                        <div className="w-32 h-5 bg-gray-200 rounded-md animate-pulse"></div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="w-20 h-10 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Fields Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-full h-24 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>

              <div className="space-y-3">
                <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Submit Button Skeleton */}
              <div className="pt-4">
                <div className="w-full h-14 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
