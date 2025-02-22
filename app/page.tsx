"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BriefcaseIcon, Loader2, ArrowLeft } from "lucide-react";
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

      setShowThankYouDialog(true);
      form.reset();

      // Add a slight delay before redirecting to ensure the dialog is seen
      setTimeout(() => {
        router.push("/jobs");
      }, 2000);
    } catch (error: any) {
      console.error("Error submitting application:", error);
      toast.error(
        error.message || "Failed to submit application. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <ThankYouDialog
        open={showThankYouDialog}
        onOpenChange={setShowThankYouDialog}
      />

      <div className="container mx-auto py-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <Logo className="h-16" />
            <Button
              variant="outline"
              onClick={() => setLanguage(language === "en" ? "es" : "en")}
              className="text-sm"
            >
              {language === "en" ? "Español" : "English"}
            </Button>
          </div>

          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => router.push("/jobs")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backToJobs}
          </Button>

          <Card className="application-card">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center mb-2">
                <BriefcaseIcon className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-3xl font-bold">
                {t.jobApplication}
              </CardTitle>
              {selectedJob && (
                <p className="text-muted-foreground mt-2">
                  {t.applyingFor} {selectedJob.title} ({selectedJob.location})
                </p>
              )}
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <Tabs defaultValue="personal" className="w-full">
                    <TabsList className="w-full tabs-list flex">
                      <TabsTrigger
                        value="personal"
                        className="tab data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        <span className="hidden md:inline">
                          {t.personalInfo}
                        </span>
                        <span className="md:hidden">{t.personalInfoShort}</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="education"
                        className="tab data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        <span className="hidden md:inline">
                          {t.educationTraining}
                        </span>
                        <span className="md:hidden">
                          {t.educationTrainingShort}
                        </span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="skills"
                        className="tab data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        <span className="hidden md:inline">
                          {t.technicalSkills}
                        </span>
                        <span className="md:hidden">
                          {t.technicalSkillsShort}
                        </span>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="personal" className="mt-6">
                      <PersonalInfoTab form={form} language={language} />
                    </TabsContent>

                    <TabsContent value="education" className="mt-6">
                      <EducationTab form={form} language={language} />
                    </TabsContent>

                    <TabsContent value="skills" className="mt-6">
                      <TechnicalSkillsTab form={form} language={language} />
                    </TabsContent>
                  </Tabs>

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

                  <div className="flex justify-end pt-2">
                    <Button
                      type="submit"
                      className="w-full sm:w-auto submit-button"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t.submitting}
                        </>
                      ) : (
                        t.submit
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
