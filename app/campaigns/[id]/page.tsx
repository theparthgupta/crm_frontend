'use client';

import { ProtectedRoute } from '@/components/protected-route';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api, { Campaign, endpoints } from '@/lib/api';
import { format } from 'date-fns';
import Link from 'next/link';

export default function CampaignDetailsPage() {
  const params = useParams();
  const campaignId = params.id as string;
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (campaignId) {
      fetchCampaignDetails(campaignId);
    }
  }, [campaignId]);

  const fetchCampaignDetails = async (id: string) => {
    try {
      setLoading(true);
      const response = await api.get(`${endpoints.campaigns.list}/${id}`);
      setCampaign(response.data as Campaign);
    } catch (err) {
      console.error('Failed to fetch campaign details:', err);
      setError('Failed to load campaign details.');
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

  if (error) {
    return (
      <ProtectedRoute>
        <div className="py-10 text-center text-red-600">{error}</div>
      </ProtectedRoute>
    );
  }

  if (!campaign) {
    return (
      <ProtectedRoute>
        <div className="py-10 text-center text-gray-500">Campaign not found.</div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
              {campaign.name}
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="overflow-hidden bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-0">
                  <dl className="sm:divide-y sm:divide-gray-200 dark:sm:divide-gray-700">
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
                        <span className="inline-flex rounded-full bg-green-100 dark:bg-green-900 px-2 text-xs font-semibold leading-5 text-green-800 dark:text-green-200">
                          {campaign.status}
                        </span>
                      </dd>
                    </div>
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Scheduled Date</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
                        {campaign.schedule ? format(new Date(campaign.schedule), 'MMM d, yyyy h:mm a') : 'Not scheduled'}
                      </dd>
                    </div>
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Target Segment</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
                         {/* Link to segment details page if available */}
                        {campaign.segment ? (
                          <Link href={`/segments/${campaign.segment._id}`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600">
                             {campaign.segment.name} ({campaign.segment.audienceSize} customers)
                           </Link>
                        ) : (
                           <span>Segment details not available</span>
                        )}
                      </dd>
                    </div>
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Message</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
                        {campaign.message}
                      </dd>
                    </div>
                    {/* Displaying basic stats, can be expanded */}
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Audience Size</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
                        {campaign.stats?.totalAudience ?? 'N/A'}
                      </dd>
                    </div>
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Sent</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
                        {campaign.stats?.sentCount ?? 'N/A'}
                      </dd>
                    </div>
                     <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Failed</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
                        {campaign.stats?.failedCount ?? 'N/A'}
                      </dd>
                    </div>
                    {/* AI-generated summary */}
                    {campaign.aiSummary && (
                       <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5 bg-gray-50 dark:bg-gray-700">
                        <dt className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Performance Summary</dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
                          {campaign.aiSummary}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 