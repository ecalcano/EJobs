"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  FileText, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  Calendar,
  Clock
} from "lucide-react";

type Application = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: string;
  resume_url: string;
  created_at: string;
  job_title: string;
  job_location: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  computer_skills?: string[];
  equipment_skills?: string[];
  position_preferences?: string[];
  department_preferences?: string[];
  other_skills?: string;
  status_date?: string;
  status_by?: string;
  high_school?: any;
  college?: any;
  other_education?: any;
  references?: any[];
  [key: string]: any;
};

export default function ApplicationDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
    if (!isAuthenticated) {
      router.push('/admin/login');
      return;
    }

    if (!application || application.id !== params.id) {
      console.log("Fetching application with ID:", params.id);
      fetchApplication();
    }
  }, [params.id]);

  async function fetchApplication() {
    if (!loading) {
      setLoading(true);
    }
    
    console.log("Fetching application data...", params.id);
    
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        console.error("Error fetching application:", error);
        toast.error("Failed to fetch application details");
        setLoading(false);
        return;
      }

      console.log("Application data retrieved successfully");
      
      setApplication(data);
      setLoading(false);
    } catch (err) {
      console.error("Exception in fetchApplication:", err);
      toast.error("An error occurred while loading application details");
      setLoading(false);
    }
  }

  async function updateStatus(status: string) {
    if (!application) return;
    
    if (status === 'approved') {
      setApproveLoading(true);
    } else if (status === 'rejected') {
      setRejectLoading(true);
    }

    try {
      const { error } = await supabase
        .from('applications')
        .update({ 
          status,
          status_by: localStorage.getItem('adminUsername') || 'admin',
          status_date: new Date().toISOString()
        })
        .eq('id', application.id);

      if (error) {
        toast.error("Failed to update status");
        return;
      }

      toast.success("Status updated successfully");
      
      setApplication({
        ...application,
        status,
        status_by: localStorage.getItem('adminUsername') || 'admin',
        status_date: new Date().toISOString()
      });
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("An error occurred while updating status");
    } finally {
      setApproveLoading(false);
      setRejectLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#f8f8f8] bg-opacity-80 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="animate-spin h-8 w-8 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-red-600 font-semibold mb-3">Loading application details...</p>
          <Button 
            variant="outline"
            onClick={() => router.push('/admin')}
            className="mt-2"
          >
            Return to Admin Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center">
        <div className="text-red-600 font-semibold">
          <p>Application not found or error loading data</p>
          <Button 
            variant="outline"
            onClick={() => router.push('/admin')}
            className="mt-4"
          >
            Return to Admin Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => router.push('/admin')}
              className="h-10 w-10 rounded-full border-gray-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Application Details</h1>
              <p className="text-gray-500 mt-1">Review application information</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge
              variant={
                application.status === 'approved' 
                  ? 'default' 
                  : application.status === 'rejected' 
                  ? 'destructive' 
                  : 'secondary'
              }
              className={application.status === 'approved' ? "bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1" : "text-sm px-3 py-1"}
            >
              {application.status === 'approved' && <CheckCircle className="h-3.5 w-3.5 mr-1.5" />}
              {application.status === 'rejected' && <XCircle className="h-3.5 w-3.5 mr-1.5" />}
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </Badge>
            
            <Button
              variant="outline"
              onClick={() => updateStatus('approved')}
              disabled={application.status === 'approved' || approveLoading || rejectLoading}
              className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
            >
              {approveLoading ? (
                <div className="h-4 w-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Approve
            </Button>
            <Button
              variant="outline"
              onClick={() => updateStatus('rejected')}
              disabled={application.status === 'rejected' || approveLoading || rejectLoading}
              className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              {rejectLoading ? (
                <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              Reject
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Personal Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white shadow-md border-0 overflow-hidden">
              <CardHeader className="bg-black text-white pb-4">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col items-center mb-6">
                  <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center mb-3">
                    <span className="text-2xl font-bold text-red-600">
                      {application.first_name?.charAt(0) || '?'}{application.last_name?.charAt(0) || '?'}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {application.first_name || 'Unknown'} {application.last_name || ''}
                  </h2>
                  <p className="text-gray-500">{application.job_title || 'No position specified'}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{application.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{application.phone}</p>
                    </div>
                  </div>
                  
                  {(application.address || application.city || application.state) && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium">
                          {application.address && <span>{application.address}<br /></span>}
                          {application.city && application.state && (
                            <span>
                              {application.city}, {application.state} {application.zip_code}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Applied On</p>
                      <p className="font-medium">
                        {new Date(application.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {application.resume_url && (
                    <div className="mt-6">
                      <a
                        href={application.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full p-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        <FileText className="h-5 w-5" />
                        View Resume
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Status Information */}
            {application.status_date && (
              <Card className="bg-white shadow-md border-0 overflow-hidden">
                <CardHeader className="bg-black text-white pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Status Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Current Status</p>
                      <Badge
                        variant={
                          application.status === 'approved' 
                            ? 'default' 
                            : application.status === 'rejected' 
                            ? 'destructive' 
                            : 'secondary'
                        }
                        className={application.status === 'approved' ? "bg-green-500 hover:bg-green-600 text-white mt-1" : "mt-1"}
                      >
                        {application.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {application.status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </Badge>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p className="font-medium">
                        {new Date(application.status_date).toLocaleString()}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Updated By</p>
                      <p className="font-medium">{application.status_by}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right column - Application Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Information */}
            <Card className="bg-white shadow-md border-0 overflow-hidden">
              <CardHeader className="bg-black text-white pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Job Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Position Applied For</p>
                    <p className="font-medium text-lg">{application.job_title || 'Not specified'}</p>
                  </div>
                  
                  {application.job_location && (
                    <div>
                      <p className="text-sm text-gray-500">Job Location</p>
                      <p className="font-medium">{application.job_location}</p>
                    </div>
                  )}
                  
                  {/* Safe rendering for arrays */}
                  {Array.isArray(application.position_preferences) && application.position_preferences.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500">Position Preferences</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {application.position_preferences.map((pref: any, i: number) => (
                          <Badge key={i} variant="outline" className="bg-gray-50">
                            {typeof pref === 'string' ? pref : JSON.stringify(pref)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {Array.isArray(application.department_preferences) && application.department_preferences.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500">Department Preferences</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {application.department_preferences.map((dept: any, i: number) => (
                          <Badge key={i} variant="outline" className="bg-gray-50">
                            {typeof dept === 'string' ? dept : JSON.stringify(dept)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="bg-white shadow-md border-0 overflow-hidden">
              <CardHeader className="bg-black text-white pb-4">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Skills & Qualifications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {Array.isArray(application.computer_skills) && application.computer_skills.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Computer Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {application.computer_skills.map((skill: any, i: number) => (
                          <Badge key={i} variant="outline" className="bg-gray-50">
                            {typeof skill === 'string' ? skill : JSON.stringify(skill)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {Array.isArray(application.equipment_skills) && application.equipment_skills.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Equipment Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {application.equipment_skills.map((skill: any, i: number) => (
                          <Badge key={i} variant="outline" className="bg-gray-50">
                            {typeof skill === 'string' ? skill : JSON.stringify(skill)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {application.other_skills && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Other Skills</h3>
                      <p className="text-gray-700 whitespace-pre-line">{application.other_skills}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="bg-white shadow-md border-0 overflow-hidden">
              <CardHeader className="bg-black text-white pb-4">
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Simplified High School Section */}
                  {application.high_school && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">High School</h3>
                      {typeof application.high_school === 'string' ? (
                        <p className="font-medium">{application.high_school}</p>
                      ) : (
                        <div>
                          <p className="font-medium">
                            {application.high_school?.name || 'Name not provided'}
                          </p>
                          {application.high_school?.graduation_year && (
                            <p className="text-gray-500">
                              Graduated: {application.high_school.graduation_year}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Simplified College Section */}
                  {application.college && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">College</h3>
                      {typeof application.college === 'string' ? (
                        <p className="font-medium">{application.college}</p>
                      ) : (
                        <div>
                          <p className="font-medium">
                            {application.college?.name || 'Name not provided'}
                          </p>
                          {application.college?.degree && (
                            <p className="text-gray-700">{application.college.degree}</p>
                          )}
                          {application.college?.address && (
                            <p className="text-gray-700">{application.college.address}</p>
                          )}
                          {(application.college?.graduation_year || application.college?.graduated) && (
                            <p className="text-gray-500">
                              Graduated: {application.college.graduation_year || application.college.graduated}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Simplified Other Education Section */}
                  {application.other_education && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Other Education</h3>
                      {typeof application.other_education === 'string' ? (
                        <p className="text-gray-700 whitespace-pre-line">{application.other_education}</p>
                      ) : (
                        <p className="text-gray-700">
                          {JSON.stringify(application.other_education, null, 2)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* References - Simplified */}
            {application.references && Array.isArray(application.references) && application.references.length > 0 && (
              <Card className="bg-white shadow-md border-0 overflow-hidden">
                <CardHeader className="bg-black text-white pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    References
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {application.references.map((reference: any, index: number) => {
                      if (!reference) return null;
                      
                      return (
                        <div key={index} className={index > 0 ? "pt-4 border-t border-gray-100" : ""}>
                          <p className="font-medium">
                            {reference?.name || 'Name not provided'}
                          </p>
                          <p className="text-gray-700">
                            {reference?.relationship || 'Relationship not specified'}
                          </p>
                          <div className="mt-1 text-gray-500">
                            {reference?.phone && <p>{reference.phone}</p>}
                            {reference?.email && <p>{reference.email}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 