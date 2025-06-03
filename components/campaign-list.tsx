"use client"

import { useState, useEffect } from "react"
import React from 'react'; // Explicitly import React
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import api from '@/lib/api'; // Import your API utility
import Cookies from 'js-cookie';

// Define the type for a campaign based on your backend API response
type Campaign = {
  id: string;
  name: string;
  segment: {
    name: string;
    audienceSize: number;
  };
  stats: {
    sent: number;
    failed: number;
  };
  status: "Completed" | "Running" | "Draft" | "Failed"; // Adjust based on your backend statuses
  createdAt: string;
  performance?: string; // Assuming performance summary is optional
};

export function CampaignList() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCampaign, setExpandedCampaign] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setError(null);
        setLoading(true);
         const authToken = Cookies.get('authToken');
         if (!authToken) {
           // Handle unauthenticated state, maybe redirect to login
           console.error("No authentication token found.");
           // Depending on your auth strategy, you might redirect here
           // router.push('/login');
           setLoading(false);
           return;
         }
        // Assuming your API utility handles sending the auth token
        const response = await api.get<Campaign[]>('/api/campaigns');
        // Assuming the API returns an array of campaigns directly
        setCampaigns(response.data); // Adjust if your API response structure is different
      } catch (err) {
        console.error("Error fetching campaigns:", err);
        setError("Failed to load campaigns.");
        setCampaigns([]); // Clear existing campaigns on error
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []); // Empty dependency array means this runs once on mount

  const toggleExpand = (id: string) => {
    setExpandedCampaign(expandedCampaign === id ? null : id);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return "Invalid Date";
    }
  };

  const getStatusColor = (status: Campaign['status']): "default" | "destructive" | "secondary" | "outline" => {
    switch (status) {
      case "Completed":
        return "default"; // Using default for completed
      case "Running":
        return "secondary"; // Using secondary for running
      case "Draft":
        return "outline"; // Using outline for draft
      case "Failed":
        return "destructive";
      default:
        return "default";
    }
  };

  if (loading) {
    return <p>Loading campaigns...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (campaigns.length === 0) {
    return <p>No campaigns found.</p>;
  }

  // Sort campaigns by createdAt descending (most recent first)
  const sortedCampaigns = [...campaigns].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Campaign Name</TableHead>
            <TableHead>Segment</TableHead>
            <TableHead>Delivery Stats</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedCampaigns.map((campaign) => (
            <React.Fragment key={campaign.id}>
              <TableRow>
                <TableCell className="font-medium">{campaign.name}</TableCell>
                <TableCell>
                  <div>{campaign.segment.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {campaign.segment.audienceSize.toLocaleString()} customers
                  </div>
                </TableCell>
                <TableCell>
                  <div>Sent: {campaign.stats.sent.toLocaleString()}</div>
                  <div>Failed: {campaign.stats.failed.toLocaleString()}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                </TableCell>
                <TableCell>{formatDate(campaign.createdAt)}</TableCell>
                <TableCell>
                  {campaign.performance && (
                    <Button variant="ghost" size="icon" onClick={() => toggleExpand(campaign.id)}>
                      {expandedCampaign === campaign.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
              {expandedCampaign === campaign.id && campaign.performance && (
                <TableRow>
                  <TableCell colSpan={6} className="bg-muted/50">
                    <div className="p-2">
                      <h4 className="font-medium mb-1">AI-Generated Performance Summary</h4>
                      <p className="text-sm">{campaign.performance}</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
