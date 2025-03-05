"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { Language, translations } from "@/lib/translations";
import { Monitor, Wrench, Briefcase, PenTool } from "lucide-react";

// Add a type for the skill translations
type SkillTranslations = {
  [key: string]: string;
};

interface TechnicalSkillsTabProps {
  form: UseFormReturn<any>;
  language: Language; // Make sure this prop is required
}

const computerSkillsList = [
  "Computer",
  "Microsoft Excel",
  "Microsoft Word",
  "Quick Books",
  "Data Entry",
];

const equipmentSkillsList = [
  "Cash Register",
  "Inventory Clerk",
  "Delivery",
  "Pallet Jack",
  "Fork Lift",
  "Maintenance",
  "Security",
  "Technology",
  "Multimedia",
];

const positionsList = [
  "Cashier",
  "Stock Clerk",
  "Produce Clerk",
  "Deli Clerk",
  "Bakery Clerk",
  "Meat Cutter/Butcher",
  "Seafood Clerk",
  "Grocery Clerk",
  "Customer Service",
  "Bagger",
  "Floral Clerk",
  "Janitor/Custodian",
  "Department Manager",
];

const skillTranslations: Record<Language, SkillTranslations> = {
  en: {
    Computer: "Computer",
    "Microsoft Excel": "Microsoft Excel",
    "Microsoft Word": "Microsoft Word",
    "Quick Books": "Quick Books",
    "Data Entry": "Data Entry",
    "Cash Register": "Cash Register",
    "Inventory Clerk": "Inventory Clerk",
    Delivery: "Delivery",
    "Pallet Jack": "Pallet Jack",
    "Fork Lift": "Fork Lift",
    Maintenance: "Maintenance",
    Security: "Security",
    Technology: "Technology",
    Multimedia: "Multimedia",
    Cashier: "Cashier",
    "Stock Clerk": "Stock Clerk",
    "Produce Clerk": "Produce Clerk",
    "Deli Clerk": "Deli Clerk",
    "Bakery Clerk": "Bakery Clerk",
    "Meat Cutter/Butcher": "Meat Cutter/Butcher",
    "Seafood Clerk": "Seafood Clerk",
    "Grocery Clerk": "Grocery Clerk",
    "Customer Service": "Customer Service",
    Bagger: "Bagger",
    "Floral Clerk": "Floral Clerk",
    "Janitor/Custodian": "Janitor/Custodian",
    "Department Manager": "Department Manager",
  },
  es: {
    Computer: "Computadora",
    "Microsoft Excel": "Microsoft Excel",
    "Microsoft Word": "Microsoft Word",
    "Quick Books": "Quick Books",
    "Data Entry": "Entrada de Datos",
    "Cash Register": "Caja Registradora",
    "Inventory Clerk": "Encargado de Inventario",
    Delivery: "Entrega",
    "Pallet Jack": "Gato de Paleta",
    "Fork Lift": "Montacargas",
    Maintenance: "Mantenimiento",
    Security: "Seguridad",
    Technology: "Tecnología",
    Multimedia: "Multimedia",
    Cashier: "Cajero",
    "Stock Clerk": "Encargado de Almacén",
    "Produce Clerk": "Encargado de Productos",
    "Deli Clerk": "Encargado de Delicatessen",
    "Bakery Clerk": "Encargado de Panadería",
    "Meat Cutter/Butcher": "Carnicero",
    "Seafood Clerk": "Encargado de Mariscos",
    "Grocery Clerk": "Encargado de Comestibles",
    "Customer Service": "Servicio al Cliente",
    Bagger: "Empacador",
    "Floral Clerk": "Encargado de Florería",
    "Janitor/Custodian": "Conserje",
    "Department Manager": "Gerente de Departamento",
  },
};

export function TechnicalSkillsTab({
  form,
  language,
}: TechnicalSkillsTabProps) {
  const t = translations[language].technical;
  const st = skillTranslations[language] as SkillTranslations;

  return (
    <div className="space-y-1">
      {/* Computer Skills */}
      <div className="space-y-3 p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Monitor className="h-4 w-4 text-blue-500" />
          </div>
          <h3 className="font-semibold text-base text-gray-800">
            {t.computerSkills}
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {computerSkillsList.map((skill) => (
            <FormField
              key={skill}
              control={form.control}
              name="computerSkills"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 p-1.5 rounded-md hover:bg-gray-50 transition-colors duration-200">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(skill)}
                      onCheckedChange={(checked) => {
                        const updatedList = checked
                          ? [...(field.value || []), skill]
                          : field.value?.filter(
                              (value: string) => value !== skill
                            ) || [];
                        field.onChange(updatedList);
                      }}
                      className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 h-4 w-4"
                    />
                  </FormControl>
                  <FormLabel className="font-normal text-sm cursor-pointer">
                    {st[skill] || skill}
                  </FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>
      </div>

      {/* Equipment Skills */}
      <div className="space-y-3 p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
            <Wrench className="h-4 w-4 text-green-500" />
          </div>
          <h3 className="font-semibold text-base text-gray-800">
            {t.equipmentSkills}
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {equipmentSkillsList.map((skill) => (
            <FormField
              key={skill}
              control={form.control}
              name="equipmentSkills"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 p-1.5 rounded-md hover:bg-gray-50 transition-colors duration-200">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(skill)}
                      onCheckedChange={(checked) => {
                        const updatedList = checked
                          ? [...(field.value || []), skill]
                          : field.value?.filter(
                              (value: string) => value !== skill
                            ) || [];
                        field.onChange(updatedList);
                      }}
                      className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 h-4 w-4"
                    />
                  </FormControl>
                  <FormLabel className="font-normal text-sm cursor-pointer">
                    {st[skill] || skill}
                  </FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>
      </div>

      {/* Position Preferences */}
      <div className="space-y-3 p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Briefcase className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-semibold text-base text-gray-800">
            {t.positionPreferences}
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {positionsList.map((position) => (
            <FormField
              key={position}
              control={form.control}
              name="positionPreferences"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 p-1.5 rounded-md hover:bg-gray-50 transition-colors duration-200">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(position)}
                      onCheckedChange={(checked) => {
                        const updatedList = checked
                          ? [...(field.value || []), position]
                          : field.value?.filter(
                              (value: string) => value !== position
                            ) || [];
                        field.onChange(updatedList);
                      }}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4"
                    />
                  </FormControl>
                  <FormLabel className="font-normal text-sm cursor-pointer">
                    {st[position] || position}
                  </FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>
      </div>

      {/* Other Skills */}
      <div className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center">
            <PenTool className="h-4 w-4 text-indigo-500" />
          </div>
          <h3 className="font-semibold text-base text-gray-800">
            {t.otherSkills}
          </h3>
        </div>
        <FormField
          control={form.control}
          name="otherSkills"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder={t.skillPlaceholder}
                  className="min-h-[100px] resize-none border-gray-200 focus:border-indigo-500 transition-all duration-200 text-sm"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
