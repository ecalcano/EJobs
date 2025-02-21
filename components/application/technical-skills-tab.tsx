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
    <div className="space-y-6">
      {/* Computer Skills */}
      <div className="space-y-4 p-4 border rounded-lg">
        <h3 className="font-semibold">{t.computerSkills}</h3>
        <div className="grid grid-cols-2 gap-2">
          {computerSkillsList.map((skill) => (
            <FormField
              key={skill}
              control={form.control}
              name="computerSkills"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
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
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    {st[skill] || skill}
                  </FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>
      </div>

      {/* Equipment Skills */}
      <div className="space-y-4 p-4 border rounded-lg">
        <h3 className="font-semibold">{t.equipmentSkills}</h3>
        <div className="grid grid-cols-2 gap-2">
          {equipmentSkillsList.map((skill) => (
            <FormField
              key={skill}
              control={form.control}
              name="equipmentSkills"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
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
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    {st[skill] || skill}
                  </FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>
      </div>

      {/* Position Preferences */}
      <div className="space-y-4 p-4 border rounded-lg">
        <h3 className="font-semibold">{t.positionPreferences}</h3>
        <div className="grid grid-cols-2 gap-2">
          {positionsList.map((position) => (
            <FormField
              key={position}
              control={form.control}
              name="positionPreferences"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
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
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    {st[position] || position}
                  </FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>
      </div>

      {/* Other Skills */}
      <FormField
        control={form.control}
        name="otherSkills"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t.otherSkills}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={t.skillPlaceholder}
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
