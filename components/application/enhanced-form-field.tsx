"use client";

import { useState, useEffect } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import {
  Mail,
  Phone,
  User,
  MapPin,
  Home,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EnhancedFormFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
  required?: boolean;
  animation?: "none" | "slide" | "fade";
  showInputStatusMessage?: boolean;
  inputClassName?: string;
}

export function EnhancedFormField({
  form,
  name,
  label,
  placeholder,
  type = "text",
  icon,
  required = false,
  animation = "slide",
  showInputStatusMessage = false,
  inputClassName,
}: EnhancedFormFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Get the field value from the form
  const fieldValue = form.watch(name);

  // Update the dirty and valid states when the field value changes
  useEffect(() => {
    if (fieldValue) {
      setIsDirty(true);
      setIsValid(!form.formState.errors[name]);
    } else {
      setIsDirty(false);
      setIsValid(false);
    }
  }, [fieldValue, form.formState.errors, name]);

  // Get the appropriate icon for the field
  const fieldIcon = icon || getIconForField(name);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-1">
          <FormLabel className="text-sm font-medium flex items-center">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                {...field}
                type={type}
                placeholder={placeholder}
                className={cn(
                  "pl-9 py-1.5 h-auto text-sm",
                  isFocused ? "border-primary ring-1 ring-primary/20" : "",
                  inputClassName
                )}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                  setIsFocused(false);
                  field.onBlur();
                }}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                {fieldIcon}
              </div>
              {showInputStatusMessage && isDirty && (
                <div
                  className={`absolute right-3 top-1/2 -translate-y-1/2 transition-opacity duration-300 ${
                    animation === "fade" ? "opacity-0" : "opacity-100"
                  } ${isValid ? "text-green-500" : "text-red-500"}`}
                >
                  {isValid ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}

// Get the appropriate icon based on field name if not provided
const getIconForField = (name: string) => {
  if (name.toLowerCase().includes("email")) return <Mail className="h-4 w-4" />;
  if (name.toLowerCase().includes("phone"))
    return <Phone className="h-4 w-4" />;
  if (name.toLowerCase().includes("name")) return <User className="h-4 w-4" />;
  if (name.toLowerCase().includes("address"))
    return <Home className="h-4 w-4" />;
  if (
    name.toLowerCase().includes("city") ||
    name.toLowerCase().includes("state") ||
    name.toLowerCase().includes("zip")
  )
    return <MapPin className="h-4 w-4" />;

  return undefined;
};
