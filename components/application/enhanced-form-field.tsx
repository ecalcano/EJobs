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
import { Mail, Phone, User, MapPin, Home, AlertCircle } from "lucide-react";

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
}: EnhancedFormFieldProps) {
  const [status, setStatus] = useState<"default" | "valid" | "error">("default");
  const [statusMessage, setStatusMessage] = useState<string | undefined>(undefined);
  const fieldState = form.getFieldState(name);
  const value = form.watch(name);

  // Get the appropriate icon based on field name if not provided
  const getIconForField = () => {
    if (icon) return icon;
    
    if (name.toLowerCase().includes("email")) return <Mail className="h-4 w-4" />;
    if (name.toLowerCase().includes("phone")) return <Phone className="h-4 w-4" />;
    if (name.toLowerCase().includes("name")) return <User className="h-4 w-4" />;
    if (name.toLowerCase().includes("address")) return <Home className="h-4 w-4" />;
    if (name.toLowerCase().includes("city") || name.toLowerCase().includes("state") || name.toLowerCase().includes("zip")) 
      return <MapPin className="h-4 w-4" />;
    
    return undefined;
  };

  // Update status based on field state
  useEffect(() => {
    if (fieldState.error) {
      setStatus("error");
      setStatusMessage(fieldState.error.message);
    } else if (value && !fieldState.invalid) {
      setStatus("valid");
      setStatusMessage(undefined);
    } else {
      setStatus("default");
      setStatusMessage(undefined);
    }
  }, [fieldState, value]);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="relative group">
          <FormLabel className={`transition-all duration-200 ${status === "error" ? "text-red-500" : ""}`}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              icon={getIconForField()}
              status={status}
              statusMessage={statusMessage}
              showStatusMessage={showInputStatusMessage}
              animation={animation}
              className="group-hover:border-gray-400"
            />
          </FormControl>
          {status === "error" && <FormMessage />}
        </FormItem>
      )}
    />
  );
} 