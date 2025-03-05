"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import {
  BriefcaseIcon,
  MapPinIcon,
  BuildingIcon,
  ArrowRight,
  CheckCircle2,
  SearchIcon,
  FilterIcon,
  ClockIcon,
  DollarSignIcon,
  UsersIcon,
  HeartIcon,
  StarIcon,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

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
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );
  const searchParams = useSearchParams();
  const jobId = searchParams.get("job");

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (jobs.length > 0) {
      let results = [...jobs];

      if (searchTerm) {
        results = results.filter(
          (job) =>
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (selectedDepartment) {
        results = results.filter(
          (job) => job.department === selectedDepartment
        );
      }

      setFilteredJobs(results);
    }
  }, [jobs, searchTerm, selectedDepartment]);

  async function fetchJobs() {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching jobs:", error);
      return;
    }

    setJobs(data);
    setFilteredJobs(data);
  }
  // Get unique departments for filtering
  const departments = Array.from(new Set(jobs.map((job) => job.department)));

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section with Modern Produce Background */}
      <div className="relative overflow-hidden bg-white min-h-[600px] lg:min-h-[500px]">
        {/* Produce Background Pattern */}
        <div className="absolute inset-0 produce-pattern opacity-[1.10]"></div>

        {/* Enhanced Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/70 via-white to-blue-50/70"></div>

        {/* Colorful Top Border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex">
          <div className="w-1/5 h-full bg-[#e73c3e]"></div>
          <div className="w-1/5 h-full bg-[#f8b042]"></div>
          <div className="w-1/5 h-full bg-[#599044]"></div>
          <div className="w-1/5 h-full bg-[#4573a7]"></div>
          <div className="w-1/5 h-full bg-[#955ba5]"></div>
        </div>

        {/* Decorative Produce Elements */}
        {/* <div className="absolute top-[10%] right-[5%] w-32 h-32 bg-contain bg-no-repeat bg-center opacity-15 produce-apple animate-float-slow"></div>
        <div className="absolute bottom-[15%] left-[8%] w-28 h-28 bg-contain bg-no-repeat bg-center opacity-15 produce-carrot animate-float-slow-reverse"></div>
        <div className="absolute top-[40%] right-[15%] w-24 h-24 bg-contain bg-no-repeat bg-center opacity-15 produce-broccoli animate-float-medium"></div>
        <div className="absolute bottom-[2%] right-[5%] w-20 h-20 bg-contain bg-no-repeat bg-center opacity-15 produce-orange animate-float-medium-reverse"></div> */}

        {/* Additional Produce Elements - Positioned to avoid text overlap */}
        {/* <div className="absolute top-[15%] left-[5%] w-20 h-20 bg-contain bg-no-repeat bg-center opacity-15 produce-tomato animate-float-medium"></div>
        <div className="absolute top-[60%] right-[8%] w-24 h-24 bg-contain bg-no-repeat bg-center opacity-15 produce-banana animate-float-slow"></div>
        <div className="absolute bottom-[40%] left-[15%] w-16 h-16 bg-contain bg-no-repeat bg-center opacity-15 produce-grapes animate-float-medium-reverse"></div>
        <div className="absolute bottom-[12%] right-[21%] w-16 h-16 bg-contain bg-no-repeat bg-center opacity-15 produce-strawberry animate-float-medium"></div>
        <div className="absolute top-[5%] right-[16%] w-16 h-16 bg-contain bg-no-repeat bg-center opacity-15 produce-corn animate-float-medium-reverse"></div> */}

        {/* New Produce Elements */}
        {/* <div className="absolute top-[8%] left-[20%] w-14 h-14 bg-contain bg-no-repeat bg-center opacity-15 produce-avocado animate-float-slow-reverse"></div>
        <div className="absolute bottom-[45%] right-[5%] w-14 h-14 bg-contain bg-no-repeat bg-center opacity-15 produce-cucumber animate-float-medium-reverse"></div> */}

        {/* Content Container */}
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center lg:items-start pt-12 lg:pt-20 pb-24 px-6">
            {/* Logo Container */}
            <div className="w-[280px] sm:w-[350px] lg:w-[450px] xl:w-[500px] mb-12 lg:mb-0 transition-all duration-500 hover:scale-105">
              <Logo className="filter drop-shadow-xl" />
            </div>

            {/* Content Area */}
            <div className="flex-1 text-center lg:text-left lg:pl-12 xl:pl-16">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl bg-white/90 inline-block px-6 py-3 rounded-lg shadow-sm backdrop-blur-sm">
                Join Our Team at{" "}
                <span className="text-primary">Compare Foods</span>
              </h1>

              <p className="mt-6 text-xl text-gray-600 max-w-2xl lg:max-w-none mx-auto lg:mx-0 bg-white/90 p-3 rounded-lg shadow-sm">
                Be part of a dynamic team dedicated to providing{" "}
                <span className="text-green-600 font-medium">
                  fresh quality food
                </span>{" "}
                and exceptional service to our community.
              </p>

              {/* Benefits Section with Modern Cards */}
              <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-4">
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-white shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:border-primary/20">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <DollarSignIcon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    Competitive Pay
                  </span>
                </div>
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-white shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:border-primary/20">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                    <UsersIcon className="h-4 w-4 text-green-500" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    Growth Opportunities
                  </span>
                </div>
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-white shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:border-primary/20">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <ClockIcon className="h-4 w-4 text-blue-500" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    Flexible Schedules
                  </span>
                </div>
              </div>

              {/* General Application Button */}
              <div className="mt-12 flex justify-center lg:justify-start">
                <Link href="/application">
                  <Button
                    size="lg"
                    className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
                  >
                    Apply Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS for produce patterns and animations */}
      <style jsx>{`
        .produce-pattern {
          background-color: #ffffff;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23599044' fill-opacity='0.1'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40zm0-40h2l-2 2V0zm0 4l4-4h2l-6 6V4zm0 4l8-8h2L40 10V8zm0 4L52 0h2L40 14v-2zm0 4L56 0h2L40 18v-2zm0 4L60 0h2L40 22v-2zm0 4L64 0h2L40 26v-2zm0 4L68 0h2L40 30v-2zm0 4L72 0h2L40 34v-2zm0 4L76 0h2L40 38v-2zm0 4L80 0v2L42 40h-2zm4 0L80 4v2L46 40h-2zm4 0L80 8v2L50 40h-2zm4 0l28-28v2L54 40h-2zm4 0l24-24v2L58 40h-2zm4 0l20-20v2L62 40h-2zm4 0l16-16v2L66 40h-2zm4 0l12-12v2L70 40h-2zm4 0l8-8v2l-6 6h-2zm4 0l4-4v2l-2 2h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }

        .produce-apple {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23e73c3e' d='M50,80c-20,0-30-25-30-40c0-15,10-20,30-20c20,0,30,5,30,20C80,55,70,80,50,80z'/%3E%3Cpath fill='%23599044' d='M50,20c0,0,0-15,5-15c5,0,5,5,5,5C60,10,55,15,50,20z'/%3E%3C/svg%3E");
        }

        .produce-carrot {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23f8b042' d='M40,20c0,0,40,40,40,60c-20,0-60-40-60-40C20,20,40,20,40,20z'/%3E%3Cpath fill='%23599044' d='M40,20c0,0,5-10,0-15c-5-5-15,0-15,0C25,5,30,15,40,20z'/%3E%3C/svg%3E");
        }

        .produce-broccoli {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23599044' d='M50,30c-10,0-20,10-20,20c0,10,30,30,40,30c10,0,10-10,0-20C60,50,60,30,50,30z'/%3E%3Cpath fill='%23a67c52' d='M50,30c0,0,0-10,0-20c0-10-10,0-10,10C40,30,50,30,50,30z'/%3E%3C/svg%3E");
        }

        .produce-orange {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle fill='%23f8b042' cx='50' cy='50' r='40'/%3E%3Cpath fill='%23599044' d='M50,10c0,0,0-5,5-5c5,0,5,5,5,5C60,10,55,10,50,10z'/%3E%3C/svg%3E");
        }

        .produce-tomato {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle fill='%23e73c3e' cx='50' cy='55' r='35'/%3E%3Cpath fill='%23599044' d='M50,20c0,0,0-10,5-10s5,5,5,5c0,0-5,5-10,5c-5,0-10-5-10-5c0,0,0-5,5-5S50,20,50,20z'/%3E%3C/svg%3E");
        }

        .produce-banana {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23f8b042' d='M20,20c0,0,0,20,20,40s40,20,40,20s10-10,0-20S40,20,20,20z'/%3E%3Cpath fill='%23599044' d='M20,20c0,0-5-5,0-10s10,0,10,0S25,15,20,20z'/%3E%3C/svg%3E");
        }

        .produce-grapes {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle fill='%23955ba5' cx='40' cy='50' r='10'/%3E%3Ccircle fill='%23955ba5' cx='60' cy='50' r='10'/%3E%3Ccircle fill='%23955ba5' cx='50' cy='35' r='10'/%3E%3Ccircle fill='%23955ba5' cx='50' cy='65' r='10'/%3E%3Ccircle fill='%23955ba5' cx='35' cy='65' r='10'/%3E%3Ccircle fill='%23955ba5' cx='65' cy='65' r='10'/%3E%3Cpath fill='%23599044' d='M50,25c0,0,0-15,5-15s5,5,5,5S55,20,50,25z'/%3E%3C/svg%3E");
        }

        .produce-strawberry {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23e73c3e' d='M50,30c-15,0-25,10-25,30c0,20,25,30,25,30s25-10,25-30C75,40,65,30,50,30z'/%3E%3Ccircle fill='%23ffffff' cx='40' cy='45' r='3'/%3E%3Ccircle fill='%23ffffff' cx='60' cy='45' r='3'/%3E%3Ccircle fill='%23ffffff' cx='50' cy='60' r='3'/%3E%3Ccircle fill='%23ffffff' cx='35' cy='60' r='3'/%3E%3Ccircle fill='%23ffffff' cx='65' cy='60' r='3'/%3E%3Ccircle fill='%23ffffff' cx='42' cy='75' r='3'/%3E%3Ccircle fill='%23ffffff' cx='58' cy='75' r='3'/%3E%3Cpath fill='%23599044' d='M50,30c0,0,5-10,0-15c-5-5-10,0-10,0s5,5,10,15z'/%3E%3C/svg%3E");
        }

        .produce-lettuce {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23599044' d='M50,20c-20,0-30,10-30,30s30,30,30,30s30-10,30-30S70,20,50,20z'/%3E%3Cpath fill='%2387c540' d='M50,30c-15,0-20,10-20,20s20,20,20,20s20-10,20-20S65,30,50,30z'/%3E%3Cpath fill='%23c5e8a5' d='M50,40c-10,0-10,10-10,10s10,10,10,10s10-10,10-10S60,40,50,40z'/%3E%3C/svg%3E");
        }

        .produce-corn {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23f8b042' d='M40,20c-5,0-10,5-10,10v40c0,5,5,10,10,10h20c5,0,10-5,10-10V30c0-5-5-10-10-10H40z'/%3E%3Cpath fill='%23ffffff' d='M45,25c-2.5,0-5,2.5-5,5v40c0,2.5,2.5,5,5,5s5-2.5,5-5V30c0-2.5-2.5-5-5-5z'/%3E%3Cpath fill='%23ffffff' d='M55,25c-2.5,0-5,2.5-5,5v40c0,2.5,2.5,5,5,5s5-2.5,5-5V30c0-2.5-2.5-5-5-5z'/%3E%3Cpath fill='%23599044' d='M50,20c0,0,0-10,5-10s5-5,0-10s-10,5-5,10S50,20,50,20z'/%3E%3C/svg%3E");
        }

        /* New Produce SVGs */
        .produce-pear {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23a4c64e' d='M50,85c-15,0-25-15-25-35c0-10,5-20,10-25c5-5,10-5,15-5s10,0,15,5c5,5,10,15,10,25C75,70,65,85,50,85z'/%3E%3Cpath fill='%23599044' d='M50,20c0,0,0-10,5-10s5,5,5,5c0,0-5,5-10,5z'/%3E%3C/svg%3E");
        }

        .produce-watermelon {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23e73c3e' d='M85,85c-20,20-50,20-70,0s-20-50,0-70L85,85z'/%3E%3Cpath fill='%23ffffff' d='M75,75c-15,15-35,15-50,0s-15-35,0-50L75,75z'/%3E%3Cpath fill='%23599044' d='M15,15L5,5c0,0,10-5,15,0S15,15,15,15z'/%3E%3Ccircle fill='%23333333' cx='30' cy='50' r='3'/%3E%3Ccircle fill='%23333333' cx='45' cy='65' r='3'/%3E%3Ccircle fill='%23333333' cx='60' cy='50' r='3'/%3E%3Ccircle fill='%23333333' cx='45' cy='35' r='3'/%3E%3C/svg%3E");
        }

        .produce-bell-pepper {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23e73c3e' d='M50,20c-15,0-25,10-25,25c0,15,5,35,25,35s25-20,25-35C75,30,65,20,50,20z'/%3E%3Cpath fill='%23599044' d='M50,20c0,0,0-10,5-10s5,5,5,5S55,20,50,20z'/%3E%3Cpath fill='%23599044' d='M50,20c0,0,0-10-5-10s-5,5-5,5S45,20,50,20z'/%3E%3C/svg%3E");
        }

        .produce-avocado {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23599044' d='M50,85c-15,0-25-15-25-35s10-35,25-35s25,15,25,35S65,85,50,85z'/%3E%3Ccircle fill='%23a67c52' cx='50' cy='50' r='15'/%3E%3Ccircle fill='%23ffffff' cx='50' cy='50' r='5'/%3E%3C/svg%3E");
        }

        .produce-pineapple {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23f8b042' d='M50,30c-10,0-20,5-20,20v30c0,5,10,10,20,10s20-5,20-10V50C70,35,60,30,50,30z'/%3E%3Cpath fill='%23a67c52' d='M50,30c0,0,0-5,5-5s5,5,5,5H50z'/%3E%3Cpath fill='%23a67c52' d='M50,30c0,0,0-5-5-5s-5,5-5,5H50z'/%3E%3Cpath fill='%23599044' d='M50,30c0,0,0-10,5-10s5-5,0-10s-10,5-5,10S50,30,50,30z'/%3E%3Cpath fill='%23599044' d='M50,30c0,0,0-10-5-10s-5-5,0-10s10,5,5,10S50,30,50,30z'/%3E%3C/svg%3E");
        }

        .produce-eggplant {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23955ba5' d='M40,30c-5,0-10,5-10,15c0,20,10,35,20,35s20-15,20-35c0-10-5-15-10-15H40z'/%3E%3Cpath fill='%23599044' d='M50,30c0,0,0-10,5-10s5,5,5,5S55,30,50,30z'/%3E%3Cpath fill='%23599044' d='M50,30c0,0,0-10-5-10s-5,5-5,5S45,30,50,30z'/%3E%3C/svg%3E");
        }

        .produce-cucumber {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%2387c540' d='M20,20c-5,5-5,15,0,20l40,40c5,5,15,5,20,0s5-15,0-20L40,20C35,15,25,15,20,20z'/%3E%3Ccircle fill='%23ffffff' cx='30' cy='30' r='2'/%3E%3Ccircle fill='%23ffffff' cx='40' cy='40' r='2'/%3E%3Ccircle fill='%23ffffff' cx='50' cy='50' r='2'/%3E%3Ccircle fill='%23ffffff' cx='60' cy='60' r='2'/%3E%3Ccircle fill='%23ffffff' cx='70' cy='70' r='2'/%3E%3C/svg%3E");
        }

        .produce-mushroom {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23a67c52' d='M40,50h20v30c0,5-5,10-10,10s-10-5-10-10V50z'/%3E%3Cpath fill='%23f5f5f5' d='M50,20c-15,0-25,10-25,20c0,5,5,10,10,10h30c5,0,10-5,10-10C75,30,65,20,50,20z'/%3E%3Ccircle fill='%23e73c3e' cx='40' cy='30' r='3'/%3E%3Ccircle fill='%23e73c3e' cx='60' cy='35' r='4'/%3E%3Ccircle fill='%23e73c3e' cx='45' cy='40' r='2'/%3E%3C/svg%3E");
        }

        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes float-slow-reverse {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(15px);
          }
        }

        @keyframes float-medium {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes float-medium-reverse {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(10px);
          }
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        .animate-float-slow-reverse {
          animation: float-slow-reverse 9s ease-in-out infinite;
        }

        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }

        .animate-float-medium-reverse {
          animation: float-medium-reverse 7s ease-in-out infinite;
        }
      `}</style>

      {/* Job Listings Section with Search and Filters */}
      <div className="max-w-7xl mx-auto py-20 px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <BriefcaseIcon className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-bold text-gray-900">
                Open Positions
              </h2>
              <Badge variant="secondary" className="text-base py-1.5 ml-2">
                {filteredJobs.length}{" "}
                {filteredJobs.length === 1 ? "Position" : "Positions"}
              </Badge>
            </div>

            <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search positions..."
                  className="pl-10 py-2 w-full sm:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                <Button
                  variant={selectedDepartment === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDepartment(null)}
                  className="whitespace-nowrap"
                >
                  All Departments
                </Button>
                {departments.map((dept) => (
                  <Button
                    key={dept}
                    variant={
                      selectedDepartment === dept ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedDepartment(dept)}
                    className="whitespace-nowrap"
                  >
                    {dept}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <Separator className="mb-4" />

          <div className="grid gap-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <Card
                  key={job.id}
                  id={job.id}
                  className={`group transition-all duration-300 hover:shadow-lg border-2 ${
                    jobId === job.id
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-gray-200 hover:border-primary/50"
                  } relative overflow-hidden`}
                >
                  <CardContent className="p-0 flex flex-row">
                    <div className="flex-1 p-4">
                      <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            <Badge
                              variant="secondary"
                              className="text-sm font-medium"
                            >
                              {job.type}
                            </Badge>
                            {job.salary_range && (
                              <Badge
                                variant="outline"
                                className="text-sm font-medium"
                              >
                                {job.salary_range}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-full">
                            <BuildingIcon className="h-3.5 w-3.5 text-gray-500" />
                            <span className="font-medium">
                              {job.department}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-full">
                            <MapPinIcon className="h-3.5 w-3.5 text-gray-500" />
                            <span className="font-medium">{job.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <h4 className="text-sm font-medium text-gray-900">
                              Description
                            </h4>
                            <div className="flex-grow h-px bg-gray-100"></div>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-3 hover:line-clamp-none transition-all duration-200">
                            {job.description}
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <h4 className="text-sm font-medium text-gray-900">
                              Requirements
                            </h4>
                            <div className="flex-grow h-px bg-gray-100"></div>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-3 hover:line-clamp-none transition-all duration-200">
                            {job.requirements}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="w-[150px] flex-shrink-0 flex items-center justify-center p-4">
                      <Link
                        href={`/application?job=${job.id}`}
                        className="block w-full"
                      >
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-primary to-primary/90 text-white hover:shadow-md hover:shadow-primary/20 transition-all duration-300 w-full px-2 py-2 h-auto"
                        >
                          <span className="flex items-center justify-center gap-1 whitespace-nowrap text-sm">
                            <span>Apply Now</span>
                            <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform duration-300" />
                          </span>
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-dashed border-2 border-gray-200">
                <CardContent className="py-12">
                  <div className="text-center text-gray-500">
                    <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <SearchIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-lg font-medium">
                      {jobs.length === 0
                        ? "No open positions at the moment."
                        : "No matching positions found."}
                    </p>
                    <p className="mt-2">
                      {jobs.length === 0
                        ? "Please check back later for new opportunities."
                        : "Try adjusting your search or filter criteria."}
                    </p>

                    {jobs.length > 0 && searchTerm && (
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedDepartment(null);
                        }}
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Why Work With Us Section - Enhanced */}
      <div className="max-w-7xl mx-auto py-20 px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 relative inline-block">
            Why Work With Us?
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary rounded-full"></div>
          </h2>
          <p className="mt-8 text-lg text-gray-600 max-w-3xl mx-auto">
            At Compare Foods, we believe in creating an environment where our
            employees can thrive. We offer competitive benefits, opportunities
            for advancement, and a supportive work culture.
          </p>
        </div>

        {/* Benefits Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg hover:border-primary/20 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <HeartIcon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Health & Wellness</h3>
            <p className="text-gray-600">
              Comprehensive health insurance, wellness programs, and mental
              health support for you and your family.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg hover:border-primary/20 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
              <StarIcon className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Career Development</h3>
            <p className="text-gray-600">
              Training programs, tuition assistance, and clear pathways for
              advancement within our organization.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg hover:border-primary/20 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
              <UsersIcon className="h-8 w-8 text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Inclusive Culture</h3>
            <p className="text-gray-600">
              A diverse and inclusive workplace where all employees feel valued,
              respected, and empowered to contribute.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section - New */}
      <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Don&apos;t See the Right Fit?
              </h2>
              <p className="text-lg text-gray-600">
                We&apos;re always looking for talented individuals to join our
                team. Submit a general application and we&apos;ll keep your
                resume on file for future opportunities.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link href="/application">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-[#599044] hover:bg-[#599044]/90 shadow-lg hover:shadow-[#599044]/20 transition-all duration-300"
                >
                  Submit General Application
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Enhanced */}
      <footer className="bg-gray-900 text-white mt-24">
        <div className="max-w-7xl mx-auto py-12 px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <Logo className="w-[180px] sm:w-[200px] filter brightness-0 invert opacity-90 mb-4" />
              <p className="text-gray-400 max-w-md">
                Join our team and be part of a company that values innovation,
                quality, and community.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-end text-center md:text-right border-t md:border-t-0 pt-6 md:pt-0 mt-4 md:mt-0">
              <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
              <p className="text-gray-400">
                Questions about careers? Email us at{" "}
                <a
                  href="mailto:careers@comparefoods.com"
                  className="text-primary hover:underline"
                >
                  careers@comparefoods.com
                </a>
              </p>
              <p className="text-gray-400 mt-4">
                © 2025 Media Link Tech. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
