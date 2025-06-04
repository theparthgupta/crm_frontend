'use client';

import { ProtectedRoute } from '@/components/protected-route';
import { useEffect, useState } from 'react';
import api, { Campaign, endpoints } from '@/lib/api';

interface DashboardStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalAudience: number;
  successRate: number;
  recentCampaigns: Campaign[];
}

// Define the structure of the backend response
interface BackendDashboardResponse {
  stats: {
    totalCampaigns: number;
    activeCampaigns: number;
    totalAudience: number;
    successRate: number;
    // totalDelivered is not present in the backend example
  };
  recentCampaigns: {
    name: string;
    status: string;
    messagesSent: number;
    successRate: number;
    audienceSize: number;
    scheduledDate: string | null;
    createdAt: string;
    // _id, segmentId, message are not present in the backend example for list items
  }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Use the backend response type for the API call
      const { data } = await api.get<BackendDashboardResponse>(endpoints.dashboard.stats);

      // Map the backend response structure to the frontend state structure (DashboardStats interface)
      setStats({
        totalCampaigns: data.stats.totalCampaigns,
        activeCampaigns: data.stats.activeCampaigns,
        totalAudience: data.stats.totalAudience,
        successRate: data.stats.successRate,
        recentCampaigns: data.recentCampaigns.map(campaign => ({
          // Map backend fields to frontend Campaign interface fields
          _id: '', // Backend does not provide, using placeholder
          name: campaign.name,
          segmentId: '', // Backend does not provide, using placeholder
          message: '', // Backend does not provide, using placeholder
          status: campaign.status as any, // Cast as any or define specific status types if needed
          schedule: campaign.scheduledDate ? new Date(campaign.scheduledDate) : undefined, // Convert string to Date
          stats: { // Create the nested stats object for frontend consistency
            totalAudience: campaign.audienceSize,
            sentCount: campaign.messagesSent,
            failedCount: 0, // Backend does not provide, using placeholder
            successRate: campaign.successRate,
          },
        })),
      });
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      setError('Failed to load dashboard data. Please try again later.');
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
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
              Dashboard
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Campaigns</dt>
                          <dd className="text-lg font-medium text-gray-900 dark:text-white">{stats?.totalCampaigns || 0}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Active Campaigns</dt>
                          <dd className="text-lg font-medium text-gray-900 dark:text-white">{stats?.activeCampaigns || 0}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Audience</dt>
                          <dd className="text-lg font-medium text-gray-900 dark:text-white">{stats?.totalAudience || 0}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Success Rate</dt>
                          <dd className="text-lg font-medium text-gray-900 dark:text-white">{stats?.successRate || 0}%</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Campaigns */}
              <div className="mt-8">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Campaigns</h2>
                <div className="mt-4 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {stats?.recentCampaigns.map((campaign, index) => (
                      <li key={campaign.name + index}>
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">
                                {campaign.name}
                              </p>
                              <div className="ml-2 flex-shrink-0 flex">
                                <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  campaign.status === 'COMPLETED' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                  campaign.status === 'RUNNING' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                  campaign.status === 'FAILED' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                  'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                }`}>
                                  {campaign.status}
                                </p>
                              </div>
                            </div>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {campaign.stats.sentCount} sent
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                Success Rate: {campaign.stats.successRate}%
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                              <p>
                                Audience: {campaign.stats.totalAudience}
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 