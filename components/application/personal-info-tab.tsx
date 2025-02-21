"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { Language, translations } from "@/lib/translations";

const localTranslations: Record<Language, { [key: string]: string }> = {
  en: {
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    phone: "Phone",
    address: "Address",
    city: "City",
    state: "State",
    zipCode: "Zip Code",
    employmentEligibility: "Employment Eligibility",
    isUnder18: "Are you under 18?",
    hasWorkPermit: "Do you have a work permit?",
    isEligibleToWork: "Are you eligible to work in the US?",
    canProvideProof: "Can you provide proof of eligibility?",
    hasFelony: "Have you ever been convicted of a felony?",
    previouslyEmployed: "Have you previously been employed by us?",
    location: "Location",
    position: "Position",
    employmentType: "Employment Type",
    fullTime: "Full Time",
    partTime: "Part Time",
    temporary: "Temporary",
    resume: "Upload Resume",
    resumeHint: "Accepted formats: .pdf, .doc, .docx",
    technicalSkills: "Technical Skills",
    yes: "Yes",
    no: "No",
  },
  es: {
    firstName: "Nombre",
    lastName: "Apellido",
    email: "Correo Electrónico",
    phone: "Teléfono",
    address: "Dirección",
    city: "Ciudad",
    state: "Estado",
    zipCode: "Código Postal",
    employmentEligibility: "Elegibilidad de Empleo",
    isUnder18: "¿Tienes menos de 18 años?",
    hasWorkPermit: "¿Tienes un permiso de trabajo?",
    isEligibleToWork: "¿Eres elegible para trabajar en los EE.UU.?",
    canProvideProof: "¿Puedes proporcionar prueba de elegibilidad?",
    hasFelony: "¿Alguna vez has sido condenado por un delito grave?",
    previouslyEmployed: "¿Has trabajado anteriormente con nosotros?",
    location: "Ubicación",
    position: "Posición",
    employmentType: "Tipo de Empleo",
    fullTime: "Tiempo Completo",
    partTime: "Medio Tiempo",
    temporary: "Temporal",
    resume: "Subir Currículum",
    resumeHint: "Formatos aceptados: .pdf, .doc, .docx",
    technicalSkills: "Habilidades Técnicas",
    yes: "Sí",
    no: "No",
  },
};

export { translations };

interface PersonalInfoTabProps {
  form: UseFormReturn<any>;
  language: Language;
}

export function PersonalInfoTab({ form, language }: PersonalInfoTabProps) {
  const t = localTranslations[language];
  const watchPreviouslyEmployed = form.watch("previouslyEmployed");

  return (
    <div className="space-y-6">
      {/* Name */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.firstName}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.lastName}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Contact */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.email}</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.phone}</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Address */}
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.address}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.city}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.state}</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={2} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.zipCode}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Employment Eligibility */}
      <div className="space-y-4 p-4 border rounded-lg">
        <h3 className="font-semibold">{t.employmentEligibility}</h3>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="isUnder18"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>{t.isUnder18}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="isUnder18-yes" />
                      <FormLabel htmlFor="isUnder18-yes">{t.yes}</FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="isUnder18-no" />
                      <FormLabel htmlFor="isUnder18-no">{t.no}</FormLabel>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hasWorkPermit"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>{t.hasWorkPermit}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="hasWorkPermit-yes" />
                      <FormLabel htmlFor="hasWorkPermit-yes">{t.yes}</FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="hasWorkPermit-no" />
                      <FormLabel htmlFor="hasWorkPermit-no">{t.no}</FormLabel>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="isEligibleToWork"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>{t.isEligibleToWork}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="isEligibleToWork-yes" />
                      <FormLabel htmlFor="isEligibleToWork-yes">
                        {t.yes}
                      </FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="isEligibleToWork-no" />
                      <FormLabel htmlFor="isEligibleToWork-no">
                        {t.no}
                      </FormLabel>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="canProvideProof"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>{t.canProvideProof}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="canProvideProof-yes" />
                      <FormLabel htmlFor="canProvideProof-yes">
                        {t.yes}
                      </FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="canProvideProof-no" />
                      <FormLabel htmlFor="canProvideProof-no">{t.no}</FormLabel>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="hasFelony"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>{t.hasFelony}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="hasFelony-yes" />
                      <FormLabel htmlFor="hasFelony-yes">{t.yes}</FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="hasFelony-no" />
                      <FormLabel htmlFor="hasFelony-no">{t.no}</FormLabel>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="previouslyEmployed"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>{t.previouslyEmployed}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="previouslyEmployed-yes" />
                      <FormLabel htmlFor="previouslyEmployed-yes">
                        {t.yes}
                      </FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="previouslyEmployed-no" />
                      <FormLabel htmlFor="previouslyEmployed-no">
                        {t.no}
                      </FormLabel>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {watchPreviouslyEmployed === "yes" && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <FormField
              control={form.control}
              name="previousEmployment.location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.location}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="previousEmployment.position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.position}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </div>

      {/* Employment Type */}
      <div className="space-y-4 p-4 border rounded-lg">
        <h3 className="font-semibold">{t.employmentType}</h3>

        <FormField
          control={form.control}
          name="employmentType"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Full Time" id="full-time" />
                    <FormLabel htmlFor="full-time">{t.fullTime}</FormLabel>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Part Time" id="part-time" />
                    <FormLabel htmlFor="part-time">{t.partTime}</FormLabel>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Temporary" id="temporary" />
                    <FormLabel htmlFor="temporary">{t.temporary}</FormLabel>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Resume Upload */}
      <FormField
        control={form.control}
        name="resume"
        render={({ field: { value, onChange, ...field } }) => (
          <FormItem>
            <FormLabel>{t.resume}</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  onChange(file);
                }}
                {...field}
              />
            </FormControl>
            <p className="text-sm text-muted-foreground">{t.resumeHint}</p>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
