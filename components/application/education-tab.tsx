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
      <div className="p-6 border rounded-lg bg-white shadow-sm">
        <h3 className="font-semibold mb-4">{t.highSchool}</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="highSchool.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.schoolName}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="highSchool.address"
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
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
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
      <div className="p-6 border rounded-lg bg-white shadow-sm">
        <h3 className="font-semibold mb-4">{t.college}</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="college.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.collegeName}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="college.address"
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
          </div>
          <div className="flex items-center gap-4">
            <FormField
              control={form.control}
              name="college.degree"
              render={({ field }) => (
                <FormItem className="w-1/3">
                  <FormLabel>{t.degree}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="college.graduated"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 self-end mb-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
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
      <div className="p-6 border rounded-lg bg-white shadow-sm">
        <h3 className="font-semibold mb-4">{t.otherEducation}</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="otherEducation.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.otherInstitutionName}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="otherEducation.address"
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
          </div>
          <div className="flex items-center gap-4">
            <FormField
              control={form.control}
              name="otherEducation.degree"
              render={({ field }) => (
                <FormItem className="w-1/3">
                  <FormLabel>{t.degreeCertification}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="otherEducation.graduated"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 self-end mb-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
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
        <div key={index} className="p-6 border rounded-lg bg-white shadow-sm">
          <h3 className="font-semibold mb-4">{t.references}</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={`references.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.referenceName}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`references.${index}.email`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.referenceEmail}</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={`references.${index}.phone`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{common.phone}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`references.${index}.address`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{common.address}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name={`references.${index}.city`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{common.city}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`references.${index}.state`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{common.state}</FormLabel>
                    <FormControl>
                      <Input maxLength={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`references.${index}.zipCode`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{common.zipCode}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
