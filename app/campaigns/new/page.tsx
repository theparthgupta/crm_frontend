"use client";

import { ProtectedRoute } from '@/components/protected-route';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api, { Segment, endpoints } from '@/lib/api';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

interface Rule {
  field: string;
  operator: string;
  value: string | number;
}

export default function NewCampaignPage() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [schedule, setSchedule] = useState<Date>();
  const [segments, setSegments] = useState<Segment[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSegment) return;

    setSubmitting(true);
    try {
      const campaignData = {
        name,
        message,
        segmentId: selectedSegment,
        schedule: schedule ? schedule.toISOString() : undefined,
      };

      await api.post(endpoints.campaigns.create, campaignData);
      router.push('/campaigns');
    } catch (error) {
      console.error('Failed to create campaign:', error);
    } finally {
      setSubmitting(false);
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
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
              Create New Campaign
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Campaign Name
                    </label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="segment"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Target Segment
                    </label>
                    <select
                      id="segment"
                      value={selectedSegment}
                      onChange={(e) => setSelectedSegment(e.target.value)}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">Select a segment</option>
                      {segments.map((segment) => (
                        <option key={segment._id} value={segment._id}>
                          {segment.name} ({segment.audienceSize} customers)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Campaign Message
                    </label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      className="mt-1"
                      rows={4}
                    />
                  </div>

                  {/* AI Message Suggestions Section */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      AI Message Suggestions (Optional)
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        // TODO: Call backend AI endpoint to get suggestions
                        console.log('Fetching AI message suggestions...');
                      }}
                    >
                      Get Suggestions
                    </Button>
                    {/* Placeholder for displaying suggestions */}
                    {/* You would map through a state variable holding suggestions here */}
                    <div className="mt-2 p-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-md text-sm text-gray-500 dark:text-gray-400">
                      AI suggestions will appear here.
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="schedule"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Schedule (Optional)
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="mt-1 w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {schedule ? (
                            format(schedule, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={schedule}
                          onSelect={setSchedule}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/campaigns')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Creating...' : 'Create Campaign'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
