"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BriefcaseIcon, Loader2, ArrowLeft, CheckCircle2, Globe, ChevronRight, UserIcon, GraduationCapIcon, WrenchIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PersonalInfoTab } from "@/components/application/personal-info-tab";
import { EducationTab } from "@/components/application/education-tab";
import { TechnicalSkillsTab } from "@/components/application/technical-skills-tab";
import { ThankYouDialog } from "@/components/application/thank-you-dialog";
import { translations, Language } from "@/lib/translations";
import { Logo } from "@/components/ui/logo";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const formSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .transform((val) => val.replace(/\D/g, "")),

  // Address
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),

  // Employment Eligibility
  isUnder18: z.enum(["yes", "no"]),
  hasWorkPermit: z.enum(["yes", "no"]),
  isEligibleToWork: z.enum(["yes", "no"]),
  canProvideProof: z.enum(["yes", "no"]),
  hasFelony: z.enum(["yes", "no"]),
  previouslyEmployed: z.enum(["yes", "no"]),

  // Previous Employment
  previousEmployment: z
    .object({
      location: z.string().optional(),
      position: z.string().optional(),
    })
    .optional(),

  // Employment Type
  employmentType: z.enum(["Full Time", "Part Time", "Temporary"]),

  // Education & Training
  highSchool: z
    .object({
      name: z.string().optional(),
      address: z.string().optional(),
      graduated: z.boolean().optional(),
    })
    .optional(),
  college: z
    .object({
      name: z.string().optional(),
      address: z.string().optional(),
      degree: z.string().optional(),
      graduated: z.boolean().optional(),
    })
    .optional(),
  otherEducation: z
    .object({
      name: z.string().optional(),
      address: z.string().optional(),
      degree: z.string().optional(),
      graduated: z.boolean().optional(),
    })
    .optional(),
  references: z
    .array(
      z.object({
        name: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
      })
    )
    .optional()
    .default([{}, {}]),

  // Technical Skills
  computerSkills: z.array(z.string()),
  equipmentSkills: z.array(z.string()),
  positionPreferences: z.array(z.string()),
  departmentPreferences: z.array(z.string()).optional(),
  otherSkills: z.string().optional(),

  // File Upload
  resume: z
    .any()
    .optional()
    .refine((file) => {
      if (!file) return true;
      return file instanceof File && file.size <= MAX_FILE_SIZE;
    }, "Max file size is 5MB")
    .refine((file) => {
      if (!file) return true;
      return file instanceof File && ACCEPTED_FILE_TYPES.includes(file.type);
    }, "Only .pdf, .doc, and .docx files are accepted"),

  // Hidden fields
  jobTitle: z.string().optional(),
  jobLocation: z.string().optional(),
});

type Job = {
  id: string;
  title: string;
  location: string;
};

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYouDialog, setShowThankYouDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [language, setLanguage] = useState<Language>("en");
  const [activeTab, setActiveTab] = useState("personal");
  const t = translations[language];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      isUnder18: "no",
      hasWorkPermit: "no",
      isEligibleToWork: "no",
      canProvideProof: "no",
      hasFelony: "no",
      previouslyEmployed: "no",
      previousEmployment: {
        location: "",
        position: "",
      },
      employmentType: "Full Time",
      highSchool: {
        name: "",
        address: "",
        graduated: false,
      },
      college: {
        name: "",
        address: "",
        degree: "",
        graduated: false,
      },
      otherEducation: {
        name: "",
        address: "",
        degree: "",
        graduated: false,
      },
      references: [
        {
          name: "",
          address: "",
          city: "",
          state: "",
          zipCode: "",
          phone: "",
          email: "",
        },
        {
          name: "",
          address: "",
          city: "",
          state: "",
          zipCode: "",
          phone: "",
          email: "",
        },
      ],
      computerSkills: [],
      equipmentSkills: [],
      positionPreferences: [],
      departmentPreferences: [],
      otherSkills: "",
      jobTitle: "",
      jobLocation: "",
    },
  });

  useEffect(() => {
    const jobId = searchParams.get("job");
    // Clean the job ID by removing any trailing segments
    const cleanJobId = jobId?.split("/")[0];
    if (cleanJobId) {
      fetchJob(cleanJobId);
    }
  }, [searchParams]);

  async function fetchJob(jobId: string) {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("id, title, location")
        .eq("id", jobId)
        .single();

      if (error) throw error;

      if (data) {
        setSelectedJob(data);
        form.setValue("jobTitle", data.title);
        form.setValue("jobLocation", data.location);
      }
    } catch (error) {
      console.error("Error fetching job:", error);
      toast.error("Failed to load job details");
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      let resume_url = null;

      if (values.resume instanceof File) {
        const file = values.resume;
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("resumes")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("resumes")
          .getPublicUrl(fileName);

        resume_url = urlData.publicUrl;
      }

      const { error: insertError } = await supabase
        .from("applications")
        .insert([
          {
            first_name: values.firstName,
            last_name: values.lastName,
            email: values.email,
            phone: values.phone,
            address: values.address,
            city: values.city,
            state: values.state,
            zip_code: values.zipCode,
            is_under_18: values.isUnder18 === "yes",
            has_work_permit: values.hasWorkPermit === "yes",
            is_eligible_to_work: values.isEligibleToWork === "yes",
            can_provide_proof: values.canProvideProof === "yes",
            has_felony: values.hasFelony === "yes",
            previously_employed: values.previouslyEmployed === "yes",
            previous_employment: values.previousEmployment,
            employment_type: values.employmentType,
            high_school: values.highSchool,
            college: values.college,
            other_education: values.otherEducation,
            references: values.references,
            computer_skills: values.computerSkills,
            equipment_skills: values.equipmentSkills,
            position_preferences: values.positionPreferences,
            department_preferences: values.departmentPreferences,
            other_skills: values.otherSkills,
            resume_url,
            status: "pending",
            job_title: values.jobTitle,
            job_location: values.jobLocation,
          },
        ]);

      if (insertError) throw insertError;

      // Success path
      setShowThankYouDialog(true);
      form.reset();

      // Add a slight delay before redirecting to ensure the dialog is seen
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error: any) {
      // Error handling path
      console.error("Error submitting application:", error);
      
      // Show error toast
      toast.error(
        error.message || "Failed to submit application. Please try again."
      );
      
      // Force navigation to the first tab
      console.log("Navigating to personal tab due to submission error");
      setTimeout(() => {
        setActiveTab("personal");
        
        // Scroll to the top of the form
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
        
        // Show another toast to confirm the tab change
        toast.info(
          language === "en" 
            ? "Please review your application starting from personal information" 
            : "Por favor revise su solicitud comenzando desde la información personal"
        );
      }, 500);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Validate personal info fields
  const validatePersonalInfo = () => {
    const personalFields = [
      "firstName", "lastName", "email", "phone", 
      "address", "city", "state", "zipCode",
      "isUnder18", "isEligibleToWork", "canProvideProof", "hasFelony"
    ];
    
    // Trigger validation for personal fields
    form.trigger(personalFields as any);
    
    // Check if there are any errors in the personal fields
    const hasErrors = personalFields.some(field => 
      form.formState.errors[field as keyof typeof form.formState.errors]
    );
    
    if (hasErrors) {
      toast.error(language === "en" 
        ? "Please complete all required personal information fields" 
        : "Por favor complete todos los campos requeridos de información personal");
      return false;
    }
    
    return true;
  };

  const handleTabChange = (value: string) => {
    // Always allow going back to previous tabs
    if (
      (activeTab === "education" && value === "personal") ||
      (activeTab === "skills" && (value === "education" || value === "personal"))
    ) {
      setActiveTab(value);
      return;
    }

    // If trying to navigate away from personal tab, validate first
    if (activeTab === "personal" && (value === "education" || value === "skills")) {
      if (!validatePersonalInfo()) {
        return; // Don't allow tab change if validation fails
      }
    }
    
    // If trying to navigate from education to skills, could add education validation here
    
    setActiveTab(value);
  };

  const handleNextTab = () => {
    if (activeTab === "personal") {
      if (!validatePersonalInfo()) {
        return;
      }
      setActiveTab("education");
    } else if (activeTab === "education") {
      setActiveTab("skills");
    }
  };

  const handlePrevTab = () => {
    if (activeTab === "skills") setActiveTab("education");
    else if (activeTab === "education") setActiveTab("personal");
  };

  const getProgressPercentage = () => {
    if (activeTab === "personal") return 33;
    if (activeTab === "education") return 66;
    if (activeTab === "skills") return 100;
    return 0;
  };

  // Function to get the appropriate icon based on active tab
  const getTabIcon = () => {
    switch (activeTab) {
      case "personal":
        return <UserIcon className="h-8 w-8 text-primary" />;
      case "education":
        return <GraduationCapIcon className="h-8 w-8 text-primary" />;
      case "skills":
        return <WrenchIcon className="h-8 w-8 text-primary" />;
      default:
        return <BriefcaseIcon className="h-8 w-8 text-primary" />;
    }
  };

  return (
    <>
      <ThankYouDialog
        open={showThankYouDialog}
        onOpenChange={setShowThankYouDialog}
      />

      <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-green-50/30">
        <div className="container mx-auto py-8 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
              <div className="flex items-center">
                <Logo className="h-16 filter drop-shadow-sm" />
                {selectedJob && (
                  <div className="hidden sm:block ml-6 pl-6 border-l border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-700">
                      {selectedJob.title}
                    </h2>
                    <p className="text-sm text-gray-500">{selectedJob.location}</p>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => router.push("/")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t.backToJobs}
                </Button>
                <div className="flex items-center space-x-2 border rounded-full px-3 py-1">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as Language)}
                    className="text-sm bg-transparent border-none focus:ring-0 cursor-pointer"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </div>
              </div>
            </div>

            {selectedJob && (
              <div className="sm:hidden mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-700">
                  {selectedJob.title}
                </h2>
                <p className="text-sm text-gray-500">{selectedJob.location}</p>
              </div>
            )}

            <Card className="shadow-lg border-0 overflow-hidden bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-green-500/5 border-b pb-8">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 transition-all duration-300">
                    {getTabIcon()}
                  </div>
                  <CardTitle className="text-3xl font-bold text-gray-800">
                    {t.jobApplication}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-2 max-w-md">
                    {selectedJob 
                      ? `${t.applyingFor} ${selectedJob.title} (${selectedJob.location})`
                      : t.generalApplication}
                  </CardDescription>
                </div>

                {/* Progress bar */}
                <div className="mt-8 max-w-md mx-auto w-full">
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-green-500 transition-all duration-500 ease-in-out"
                      style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <button 
                      type="button"
                      onClick={() => handleTabChange("personal")}
                      className={`${activeTab === "personal" ? "font-medium text-primary" : ""} focus:outline-none`}
                    >
                      Personal Info
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleTabChange("education")}
                      className={`${activeTab === "education" ? "font-medium text-primary" : ""} focus:outline-none`}
                    >
                      Education
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleTabChange("skills")}
                      className={`${activeTab === "skills" ? "font-medium text-primary" : ""} focus:outline-none`}
                    >
                      Skills & Preferences
                    </button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 sm:p-8">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="w-full">
                      {activeTab === "personal" && (
                        <div className="mt-6 space-y-6">
                          <PersonalInfoTab form={form} language={language} />
                          <div className="flex justify-end pt-4">
                            <Button 
                              type="button" 
                              onClick={handleNextTab}
                              className="bg-gradient-to-r from-primary to-primary/90 text-white hover:shadow-md hover:shadow-primary/20 transition-all duration-300"
                            >
                              {t.next}
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}

                      {activeTab === "education" && (
                        <div className="mt-6 space-y-6">
                          <EducationTab form={form} language={language} />
                          <div className="flex justify-between pt-4">
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={handlePrevTab}
                            >
                              <ArrowLeft className="mr-2 h-4 w-4" />
                              {t.previous}
                            </Button>
                            <Button 
                              type="button" 
                              onClick={handleNextTab}
                              className="bg-gradient-to-r from-primary to-primary/90 text-white hover:shadow-md hover:shadow-primary/20 transition-all duration-300"
                            >
                              {t.next}
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}

                      {activeTab === "skills" && (
                        <div className="mt-6 space-y-6">
                          <TechnicalSkillsTab form={form} language={language} />
                          <div className="flex justify-between pt-4">
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={handlePrevTab}
                            >
                              <ArrowLeft className="mr-2 h-4 w-4" />
                              {t.previous}
                            </Button>
                            <Button
                              type="button"
                              onClick={() => {
                                console.log("Submit button clicked");
                                
                                // Force validation of all fields
                                form.trigger().then(isValid => {
                                  console.log("Form validation result:", isValid);
                                  
                                  if (!isValid) {
                                    console.log("Form has errors:", form.formState.errors);
                                    
                                    // Show error toast
                                    toast.error(
                                      language === "en" 
                                        ? "Please complete all required fields before submitting" 
                                        : "Por favor complete todos los campos requeridos antes de enviar"
                                    );
                                    
                                    // Navigate back to personal tab
                                    console.log("Navigating to personal tab due to validation errors");
                                    setActiveTab("personal");
                                    
                                    // Scroll to top
                                    window.scrollTo({
                                      top: 0,
                                      behavior: "smooth"
                                    });
                                    
                                    // Show additional guidance toast
                                    setTimeout(() => {
                                      toast.info(
                                        language === "en" 
                                          ? "Please review your application starting from personal information" 
                                          : "Por favor revise su solicitud comenzando desde la información personal"
                                      );
                                    }, 500);
                                    
                                    return;
                                  }
                                  
                                  // If valid, proceed with submission
                                  console.log("Form is valid, submitting...");
                                  onSubmit(form.getValues());
                                });
                              }}
                              className="bg-gradient-to-r from-primary to-primary/90 text-white hover:shadow-md hover:shadow-primary/20 transition-all duration-300"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  {t.submitting}
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  {t.submit}
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Hidden fields for job details */}
                    <FormField
                      control={form.control}
                      name="jobTitle"
                      render={({ field }) => (
                        <FormControl>
                          <Input type="hidden" {...field} />
                        </FormControl>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="jobLocation"
                      render={({ field }) => (
                        <FormControl>
                          <Input type="hidden" {...field} />
                        </FormControl>
                      )}
                    />
                  </form>
                </Form>
              </CardContent>
            </Card>

            <div className="mt-8 text-center text-sm text-gray-500">
              <p>© 2025 Gala Foods. All rights reserved.</p>
              <p className="mt-1">
                {t.privacyNotice}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 