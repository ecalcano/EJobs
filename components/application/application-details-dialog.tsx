"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ApplicationDetailsDialogProps {
  application: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApplicationDetailsDialog({
  application,
  open,
  onOpenChange,
}: ApplicationDetailsDialogProps) {
  if (!application) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Application Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1">
          <div className="space-y-6 py-4">
            {/* Personal Information */}
            <Section title="Personal Information">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Name" value={`${application.first_name} ${application.last_name}`} />
                <Field label="Email" value={application.email} />
                <Field label="Phone" value={application.phone} />
                <div className="space-y-1">
                  <Field label="Status" value={
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        application.status === 'approved' 
                          ? 'default' 
                          : application.status === 'rejected' 
                          ? 'destructive' 
                          : 'secondary'
                      }>
                        {application.status}
                      </Badge>
                      {application.status_date && (
                        <span className="text-sm text-muted-foreground">
                          {new Date(application.status_date).toLocaleDateString()} by {application.status_by || 'admin'}
                        </span>
                      )}
                    </div>
                  } />
                </div>
              </div>
              <div className="mt-2">
                <Field 
                  label="Address" 
                  value={`${application.address}, ${application.city}, ${application.state} ${application.zip_code}`} 
                />
              </div>
            </Section>

            {/* Employment Details */}
            <Section title="Employment Details">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Employment Type" value={application.employment_type} />
                <Field label="Job Applied For" value={application.job_title} />
                <Field label="Location" value={application.job_location} />
              </div>
            </Section>

            {/* Eligibility */}
            <Section title="Employment Eligibility">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Under 18" value={application.is_under_18 ? "Yes" : "No"} />
                <Field label="Has Work Permit" value={application.has_work_permit ? "Yes" : "No"} />
                <Field label="Eligible to Work" value={application.is_eligible_to_work ? "Yes" : "No"} />
                <Field label="Can Provide Proof" value={application.can_provide_proof ? "Yes" : "No"} />
                <Field label="Has Felony" value={application.has_felony ? "Yes" : "No"} />
                <Field label="Previously Employed" value={application.previously_employed ? "Yes" : "No"} />
              </div>
              {application.previously_employed && application.previous_employment && (
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <Field label="Previous Location" value={application.previous_employment.location} />
                  <Field label="Previous Position" value={application.previous_employment.position} />
                </div>
              )}
            </Section>

            {/* Education */}
            <Section title="Education">
              {application.high_school && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2">High School</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="School Name" value={application.high_school.name} />
                    <Field label="Address" value={application.high_school.address} />
                    <Field label="Graduated" value={application.high_school.graduated ? "Yes" : "No"} />
                  </div>
                </div>
              )}
              {application.college && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2">College</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="College Name" value={application.college.name} />
                    <Field label="Address" value={application.college.address} />
                    <Field label="Degree" value={application.college.degree} />
                    <Field label="Graduated" value={application.college.graduated ? "Yes" : "No"} />
                  </div>
                </div>
              )}
              {application.other_education && (
                <div>
                  <h4 className="font-medium mb-2">Other Education</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Institution Name" value={application.other_education.name} />
                    <Field label="Address" value={application.other_education.address} />
                    <Field label="Degree/Certification" value={application.other_education.degree} />
                    <Field label="Graduated" value={application.other_education.graduated ? "Yes" : "No"} />
                  </div>
                </div>
              )}
            </Section>

            {/* Skills & Preferences */}
            <Section title="Skills & Preferences">
              <div className="space-y-4">
                {/* Computer Skills */}
                <div>
                  <h4 className="font-medium mb-2">Computer Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {application.computer_skills && application.computer_skills.length > 0 ? (
                      application.computer_skills.map((skill: string) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">No computer skills selected</span>
                    )}
                  </div>
                </div>

                {/* Equipment Skills */}
                <div>
                  <h4 className="font-medium mb-2">Equipment Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {application.equipment_skills && application.equipment_skills.length > 0 ? (
                      application.equipment_skills.map((skill: string) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">No equipment skills selected</span>
                    )}
                  </div>
                </div>

                {/* Position Preferences */}
                <div>
                  <h4 className="font-medium mb-2">Position Preferences</h4>
                  <div className="flex flex-wrap gap-2">
                    {application.position_preferences && application.position_preferences.length > 0 ? (
                      application.position_preferences.map((position: string) => (
                        <Badge key={position} variant="secondary">
                          {position}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">No positions selected</span>
                    )}
                  </div>
                </div>

                {/* Department Preferences */}
                {application.department_preferences && application.department_preferences.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Department Preferences</h4>
                    <div className="flex flex-wrap gap-2">
                      {application.department_preferences.map((dept: string) => (
                        <Badge key={dept} variant="secondary">
                          {dept}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Other Skills */}
                {application.other_skills && (
                  <div>
                    <h4 className="font-medium mb-2">Other Skills</h4>
                    <p className="text-sm">{application.other_skills}</p>
                  </div>
                )}
              </div>
            </Section>

            {/* References */}
            {application.references && (
              <Section title="References">
                {application.references.map((reference: any, index: number) => (
                  <div key={index} className="mb-4 last:mb-0">
                    <h4 className="font-medium mb-2">Reference {index + 1}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Name" value={reference.name} />
                      <Field label="Email" value={reference.email} />
                      <Field label="Phone" value={reference.phone} />
                      <Field 
                        label="Address" 
                        value={reference.address ? `${reference.address}, ${reference.city}, ${reference.state} ${reference.zipCode}` : ''} 
                      />
                    </div>
                  </div>
                ))}
              </Section>
            )}

            {/* Resume */}
            {application.resume_url && (
              <Section title="Resume">
                <a
                  href={application.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View Resume
                </a>
              </Section>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-sm font-medium text-muted-foreground">{label}</div>
      <div className="mt-1">{value || '-'}</div>
    </div>
  );
}