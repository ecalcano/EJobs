"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { BriefcaseIcon, MapPinIcon, BuildingIcon, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  salary_range: string;
  active: boolean;
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const searchParams = useSearchParams();
  const jobId = searchParams.get('job');

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching jobs:', error);
      return;
    }

    setJobs(data);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="relative bg-primary/5 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-6 sm:py-32 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Join Our Team at{" "}
              <span className="text-primary">Gala Foods</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
              Be part of a dynamic team dedicated to providing quality food and exceptional service to our community.
            </p>
            <div className="mt-10 flex gap-6 justify-center">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-primary" />
                <span className="text-gray-700">Competitive Pay</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-primary" />
                <span className="text-gray-700">Growth Opportunities</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-primary" />
                <span className="text-gray-700">Flexible Schedules</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Why Work With Us?</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            At Gala Foods, we believe in creating an environment where our employees can thrive. 
            We offer competitive benefits, opportunities for advancement, and a supportive work culture.
          </p>
        </div>

        {/* Job Listings */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BriefcaseIcon className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-bold text-gray-900">Open Positions</h2>
            </div>
            <Badge variant="secondary" className="text-base py-1.5">
              {jobs.length} {jobs.length === 1 ? 'Position' : 'Positions'} Available
            </Badge>
          </div>

          <div className="grid gap-6">
            {jobs.map((job) => (
              <Card 
                key={job.id} 
                id={job.id}
                className={`group transition-all duration-200 hover:shadow-lg border-2 ${
                  jobId === job.id ? 'border-primary ring-1 ring-primary/20' : 'border-transparent'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="space-y-3">
                      <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-primary transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <BuildingIcon className="h-4 w-4 text-gray-400" />
                          <span>{job.department}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPinIcon className="h-4 w-4 text-gray-400" />
                          <span>{job.location}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-sm">
                          {job.type}
                        </Badge>
                        {job.salary_range && (
                          <Badge variant="outline" className="text-sm">
                            {job.salary_range}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Link href={`/?job=${job.id}`}>
                        <Button className="group/button">
                          Apply Now
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/button:translate-x-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-600 line-clamp-3">
                        {job.description}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Requirements</h4>
                      <p className="text-gray-600 line-clamp-3">
                        {job.requirements}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {jobs.length === 0 && (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-gray-500">
                    <p className="text-lg font-medium">No open positions at the moment.</p>
                    <p className="mt-1">Please check back later for new opportunities.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-24">
        <div className="max-w-7xl mx-auto py-12 px-6 lg:px-8">
          <div className="text-center text-gray-600">
            <p>© 2025 Gala Foods. All rights reserved.</p>
            <p className="mt-2">Questions? Contact our HR department at careers@galafoods.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}