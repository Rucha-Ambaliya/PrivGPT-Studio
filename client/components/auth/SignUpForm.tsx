"use client";

import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { format } from "date-fns";
import { CalendarIcon, Eye, EyeOff } from "lucide-react"; // Imported Eye icons

import { DayPicker, DropdownProps } from "react-day-picker"
import "react-day-picker/dist/style.css"

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

/* ---- helper functions ---- */
function isoToDate(value?: string) {
  return value ? new Date(value) : undefined;
}

function dateToISO(date?: Date) {
  return date ? format(date, "yyyy-MM-dd") : "";
}

/* -------- */
// Updated Schema with Regex Validation
const formSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "Email is required." })
      .email({ message: "Invalid email address." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter." })
      .regex(/[a-z]/, { message: "Must contain at least one lowercase letter." })
      .regex(/[0-9]/, { message: "Must contain at least one number." })
      .regex(/[\W_]/, { message: "Must contain at least one special character." }),
    confirmPassword: z.string(),
    username: z.string().optional(),
    gender: z.enum(["male", "female", "other"]).optional().or(z.literal("")),
    dob: z.string().optional(),
    phone: z
      .string()
      .regex(/^[1-9]\d{9}$/, {
        message: "Phone number must be a valid 10-digit number",
      })
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

const CalendarDropdown = (props: DropdownProps) => {
  const { value, onChange, children } = props;
  const options = React.Children.toArray(children) as React.ReactElement<React.OptionHTMLAttributes<HTMLOptionElement>>[];

  const handleChange = (newValue: string) => {
    const changeEvent = {
      target: { value: newValue },
    } as React.ChangeEvent<HTMLSelectElement>;
    onChange?.(changeEvent);
  };

  return (
    <Select value={value?.toString()} onValueChange={handleChange}>
      <SelectTrigger className="pr-1.5 focus:ring-0">
        <SelectValue>{options.find(o => o.props.value === value)?.props.children}</SelectValue>
      </SelectTrigger>
      <SelectContent position="popper" className="max-h-[200px] overflow-y-auto">
        {options.map((option) => (
          <SelectItem key={option.props.value as string} value={option.props.value as string}>
            {option.props.children}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function SignUpForm() {
  const router = useRouter();
  
  // State for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
      gender: "",
      dob: "",
      phone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:5000";
      const response = await fetch(`${backendUrl}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          username: values.username,
          gender: values.gender,
          dob: values.dob,
          phone: values.phone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Account created successfully! Please sign in.");
        router.push("/sign-in");
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your email and password to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Password Field with Toggle */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password Field with Toggle */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showConfirmPassword
                            ? "Hide password"
                            : "Show password"}
                        </span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <hr className="my-2" />

            <p className="-mt-2 text-sm text-muted-foreground">
              These fields are optional. You can update them later.
            </p>

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="your username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="flex flex-col justify-end">
                    <FormLabel>Date of Birth</FormLabel>

                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            {field.value
                              ? format(new Date(field.value), "dd-MM-yyyy")
                              : "dd-mm-yyyy"}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>

                      <PopoverContent className="w-auto p-3" align="start">
                        <DayPicker
                          mode="single"
                          selected={isoToDate(field.value)}
                          onSelect={(date) => field.onChange(dateToISO(date))}
                          fromYear={1900}
                          toYear={new Date().getFullYear()}
                          captionLayout="dropdown"
                          disabled={{ after: new Date() }}
                          components={{
                            Dropdown: CalendarDropdown,
                          }}
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex flex-col justify-end">
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="123-456-7890"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full mt-4">
              Create an account
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <Link href="/sign-in" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}