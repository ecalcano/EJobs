"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { Language, translations } from "@/lib/translations";
import { EnhancedFormField } from "./enhanced-form-field";
import { Building, BookOpen, GraduationCap, Mail, Phone, MapPin } from "lucide-react";

interface EducationTabProps {
  form: UseFormReturn<any>;
  language: Language;
}

export function EducationTab({ form, language }: EducationTabProps) {
  const t = translations[language].education;
  const common = translations[language];

  return (
    <div className="space-y-6">
      {/* High School */}
      <div className="p-6 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300">
        <h3 className="font-semibold mb-4 text-lg text-gray-800">{t.highSchool}</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EnhancedFormField
              form={form}
              name="highSchool.name"
              label={t.schoolName}
              placeholder={language === "en" ? "Enter high school name" : "Ingrese el nombre de la escuela"}
              icon={<BookOpen className="h-4 w-4" />}
              showInputStatusMessage={false}
            />
            <EnhancedFormField
              form={form}
              name="highSchool.address"
              label={t.address}
              placeholder={language === "en" ? "Enter school address" : "Ingrese la dirección de la escuela"}
              icon={<MapPin className="h-4 w-4" />}
              showInputStatusMessage={false}
            />
          </div>
          <div className="flex items-center">
            <FormField
              control={form.control}
              name="highSchool.graduated"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal cursor-pointer">
                    {t.graduated}
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      {/* College */}
      <div className="p-6 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300">
        <h3 className="font-semibold mb-4 text-lg text-gray-800">{t.college}</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EnhancedFormField
              form={form}
              name="college.name"
              label={t.collegeName}
              placeholder={language === "en" ? "Enter college name" : "Ingrese el nombre de la universidad"}
              icon={<GraduationCap className="h-4 w-4" />}
              showInputStatusMessage={false}
            />
            <EnhancedFormField
              form={form}
              name="college.address"
              label={t.address}
              placeholder={language === "en" ? "Enter college address" : "Ingrese la dirección de la universidad"}
              icon={<MapPin className="h-4 w-4" />}
              showInputStatusMessage={false}
            />
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="w-full md:w-1/3">
              <EnhancedFormField
                form={form}
                name="college.degree"
                label={t.degree}
                placeholder={language === "en" ? "Enter degree" : "Ingrese el título"}
                icon={<BookOpen className="h-4 w-4" />}
                showInputStatusMessage={false}
              />
            </div>
            <FormField
              control={form.control}
              name="college.graduated"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 self-end mb-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal cursor-pointer">
                    {t.graduated}
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      {/* Other Education */}
      <div className="p-6 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300">
        <h3 className="font-semibold mb-4 text-lg text-gray-800">{t.otherEducation}</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EnhancedFormField
              form={form}
              name="otherEducation.name"
              label={t.otherInstitutionName}
              placeholder={language === "en" ? "Enter institution name" : "Ingrese el nombre de la institución"}
              icon={<Building className="h-4 w-4" />}
              showInputStatusMessage={false}
            />
            <EnhancedFormField
              form={form}
              name="otherEducation.address"
              label={t.address}
              placeholder={language === "en" ? "Enter institution address" : "Ingrese la dirección de la institución"}
              icon={<MapPin className="h-4 w-4" />}
              showInputStatusMessage={false}
            />
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="w-full md:w-1/3">
              <EnhancedFormField
                form={form}
                name="otherEducation.degree"
                label={t.degreeCertification}
                placeholder={language === "en" ? "Enter certification" : "Ingrese la certificación"}
                icon={<BookOpen className="h-4 w-4" />}
                showInputStatusMessage={false}
              />
            </div>
            <FormField
              control={form.control}
              name="otherEducation.graduated"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 self-end mb-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal cursor-pointer">
                    {t.graduated}
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      {/* References */}
      {[0, 1].map((index) => (
        <div key={index} className="p-6 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300">
          <h3 className="font-semibold mb-4 text-lg text-gray-800">{t.references} #{index + 1}</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EnhancedFormField
                form={form}
                name={`references.${index}.name`}
                label={t.referenceName}
                placeholder={language === "en" ? "Enter reference name" : "Ingrese el nombre de la referencia"}
                icon={<GraduationCap className="h-4 w-4" />}
                showInputStatusMessage={false}
              />
              <EnhancedFormField
                form={form}
                name={`references.${index}.email`}
                label={t.referenceEmail}
                type="email"
                placeholder={language === "en" ? "Enter reference email" : "Ingrese el correo de la referencia"}
                icon={<Mail className="h-4 w-4" />}
                showInputStatusMessage={false}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EnhancedFormField
                form={form}
                name={`references.${index}.phone`}
                label={common.phone}
                type="tel"
                placeholder={language === "en" ? "Enter reference phone" : "Ingrese el teléfono de la referencia"}
                icon={<Phone className="h-4 w-4" />}
                showInputStatusMessage={false}
              />
              <EnhancedFormField
                form={form}
                name={`references.${index}.address`}
                label={common.address}
                placeholder={language === "en" ? "Enter reference address" : "Ingrese la dirección de la referencia"}
                icon={<MapPin className="h-4 w-4" />}
                showInputStatusMessage={false}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <EnhancedFormField
                form={form}
                name={`references.${index}.city`}
                label={common.city}
                placeholder={language === "en" ? "City" : "Ciudad"}
                icon={<Building className="h-4 w-4" />}
                showInputStatusMessage={false}
              />
              <EnhancedFormField
                form={form}
                name={`references.${index}.state`}
                label={common.state}
                placeholder={language === "en" ? "State" : "Estado"}
                icon={<MapPin className="h-4 w-4" />}
                showInputStatusMessage={false}
              />
              <EnhancedFormField
                form={form}
                name={`references.${index}.zipCode`}
                label={common.zipCode}
                placeholder={language === "en" ? "Zip Code" : "Código Postal"}
                icon={<MapPin className="h-4 w-4" />}
                showInputStatusMessage={false}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
