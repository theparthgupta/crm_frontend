'use client';

import { ProtectedRoute } from '@/components/protected-route';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api, { Segment, endpoints } from '@/lib/api';

export default function SegmentsPage() {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchSegments();
  }, []);

  const fetchSegments = async () => {
    try {
      const response = await api.get(endpoints.segments.list);
      setSegments(response.data as Segment[]);
    } catch (error) {
      console.error('Failed to fetch segments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
                Segments
              </h1>
              <Button onClick={() => router.push('/segments/new')}>
                Create Segment
              </Button>
            </div>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="overflow-hidden bg-white dark:bg-gray-800 shadow sm:rounded-md">
                <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                  {segments.map((segment) => (
                    <li key={segment._id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                              {segment.name}
                            </p>
                            <div className="ml-2 flex flex-shrink-0">
                              <p className="inline-flex rounded-full bg-blue-100 dark:bg-blue-900 px-2 text-xs font-semibold leading-5 text-blue-800 dark:text-blue-200">
                                {segment.audienceSize} customers
                              </p>
                            </div>
                          </div>
                          <div className="ml-2 flex flex-shrink-0">
                            <Button
                              variant="ghost"
                              onClick={() => router.push(`/segments/${segment._id}`)}
                            >
                              View
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {JSON.stringify(segment.rules, null, 2)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 