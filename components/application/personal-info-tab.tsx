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
import { EnhancedFormField } from "./enhanced-form-field";
import { Mail, Phone, User, MapPin, Home, Building, Hash } from "lucide-react";

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
  const common = translations[language];
  const watchPreviouslyEmployed = form.watch("previouslyEmployed");

  return (
    <div className="space-y-3">
      {/* Personal Information */}
      <div className="p-3 sm:p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300">
        <h3 className="font-semibold mb-2 text-base sm:text-lg text-gray-800 flex items-center">
          <User className="mr-2 h-4 w-4 text-primary" />
          {common.personalInfo}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <EnhancedFormField
            form={form}
            name="firstName"
            label={t.firstName}
            placeholder={t.firstName}
            required
          />
          <EnhancedFormField
            form={form}
            name="lastName"
            label={t.lastName}
            placeholder={t.lastName}
            required
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          <EnhancedFormField
            form={form}
            name="email"
            label={t.email}
            placeholder="email@example.com"
            type="email"
            icon={<Mail className="h-4 w-4 text-gray-500" />}
            required
          />
          <EnhancedFormField
            form={form}
            name="phone"
            label={t.phone}
            placeholder="(123) 456-7890"
            icon={<Phone className="h-4 w-4 text-gray-500" />}
            required
          />
        </div>
      </div>

      {/* Address */}
      <div className="p-3 sm:p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300">
        <h3 className="font-semibold mb-2 text-base sm:text-lg text-gray-800 flex items-center">
          <MapPin className="mr-2 h-4 w-4 text-primary" />
          {common.address}
        </h3>
        <div className="grid grid-cols-1 gap-3">
          <EnhancedFormField
            form={form}
            name="address"
            label={t.address}
            placeholder={t.address}
            icon={<Home className="h-4 w-4 text-gray-500" />}
            required
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
          <EnhancedFormField
            form={form}
            name="city"
            label={t.city}
            placeholder={t.city}
            icon={<Building className="h-4 w-4 text-gray-500" />}
            required
          />
          <EnhancedFormField
            form={form}
            name="state"
            label={t.state}
            placeholder={t.state}
            required
          />
          <EnhancedFormField
            form={form}
            name="zipCode"
            label={t.zipCode}
            placeholder={t.zipCode}
            icon={<Hash className="h-4 w-4 text-gray-500" />}
            required
          />
        </div>
      </div>

      {/* Employment Eligibility */}
      <div className="space-y-4 p-6 border rounded-lg bg-gray-50/50 shadow-sm transition-all duration-300 hover:shadow-md">
        <h3 className="font-semibold text-lg text-gray-800">{t.employmentEligibility}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <FormLabel htmlFor="isUnder18-yes" className="cursor-pointer">{t.yes}</FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="isUnder18-no" />
                      <FormLabel htmlFor="isUnder18-no" className="cursor-pointer">{t.no}</FormLabel>
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
                      <FormLabel htmlFor="hasWorkPermit-yes" className="cursor-pointer">{t.yes}</FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="hasWorkPermit-no" />
                      <FormLabel htmlFor="hasWorkPermit-no" className="cursor-pointer">{t.no}</FormLabel>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <FormLabel htmlFor="isEligibleToWork-yes" className="cursor-pointer">{t.yes}</FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="isEligibleToWork-no" />
                      <FormLabel htmlFor="isEligibleToWork-no" className="cursor-pointer">{t.no}</FormLabel>
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
                      <FormLabel htmlFor="canProvideProof-yes" className="cursor-pointer">{t.yes}</FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="canProvideProof-no" />
                      <FormLabel htmlFor="canProvideProof-no" className="cursor-pointer">{t.no}</FormLabel>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <FormLabel htmlFor="hasFelony-yes" className="cursor-pointer">{t.yes}</FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="hasFelony-no" />
                      <FormLabel htmlFor="hasFelony-no" className="cursor-pointer">{t.no}</FormLabel>
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
                      <FormLabel htmlFor="previouslyEmployed-yes" className="cursor-pointer">{t.yes}</FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="previouslyEmployed-no" />
                      <FormLabel htmlFor="previouslyEmployed-no" className="cursor-pointer">{t.no}</FormLabel>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Previous Employment */}
      {watchPreviouslyEmployed === "yes" && (
        <div className="p-4 border rounded-lg animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="font-semibold mb-4">{t.previouslyEmployed}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EnhancedFormField
              form={form}
              name="previousEmployment.location"
              label={t.location}
              placeholder={language === "en" ? "Location" : "Ubicación"}
              icon={<MapPin className="h-4 w-4" />}
              showInputStatusMessage={false}
            />
            <EnhancedFormField
              form={form}
              name="previousEmployment.position"
              label={t.position}
              placeholder={language === "en" ? "Position" : "Posición"}
              icon={<Building className="h-4 w-4" />}
              showInputStatusMessage={false}
            />
          </div>
        </div>
      )}

      {/* Employment Type */}
      <div className="space-y-2">
        <FormField
          control={form.control}
          name="employmentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.employmentType}</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Full Time" id="employmentType-fullTime" />
                    <FormLabel htmlFor="employmentType-fullTime" className="cursor-pointer">{t.fullTime}</FormLabel>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Part Time" id="employmentType-partTime" />
                    <FormLabel htmlFor="employmentType-partTime" className="cursor-pointer">{t.partTime}</FormLabel>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Temporary" id="employmentType-temporary" />
                    <FormLabel htmlFor="employmentType-temporary" className="cursor-pointer">{t.temporary}</FormLabel>
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
