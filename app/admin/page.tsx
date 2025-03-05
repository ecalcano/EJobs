"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/lib/supabase";
import {
  ClipboardListIcon,
  ExternalLinkIcon,
  PlusIcon,
  Pencil,
  Trash2,
  Briefcase,
  Users,
  LogOut,
  Search,
  LayoutDashboard,
  ChevronRight,
  CheckCircle,
  XCircle,
  FileText,
  Store,
  MapPin,
  Phone,
  Mail,
  Clock,
  ToggleLeft,
  Menu,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ApplicationDetailsDialog } from "@/components/application/application-details-dialog";

type Application = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: string;
  resume_url: string;
  created_at: string;
  job_title: string;
  job_location: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  computer_skills?: string[];
  equipment_skills?: string[];
  position_preferences?: string[];
  department_preferences?: string[];
  other_skills?: string;
  status_date?: string;
  status_by?: string;
  [key: string]: any;
};

type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  salary_range: string;
  active: boolean;
  created_at: string;
};

type User = {
  id: string;
  username: string;
  created_at: string;
};

type Store = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string | null;
  email: string | null;
  description: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

const jobFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  department: z.string().min(1, "Department is required"),
  location: z.string().min(1, "Location is required"),
  type: z.string().min(1, "Job type is required"),
  description: z.string().min(1, "Description is required"),
  requirements: z.string().min(1, "Requirements are required"),
  salary_range: z.string().optional(),
  active: z.boolean().default(true),
});

const userFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const storeFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Store name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip_code: z.string().min(1, "ZIP code is required"),
  phone: z.string().optional().nullable(),
  email: z.string().email("Invalid email address").optional().nullable(),
  description: z.string().optional().nullable(),
  active: z.boolean().default(true),
});

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("applications");
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [storeDialogOpen, setStoreDialogOpen] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [searchField, setSearchField] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [storeSearchQuery, setStoreSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Detect mobile view - default sidebar to closed on mobile
  const [isMobile, setIsMobile] = useState(false);

  // Check window size on component mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Initial check
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);

    // Clean up
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Initialize sidebar state based on device type
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const jobForm = useForm<z.infer<typeof jobFormSchema>>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      department: "",
      location: "",
      type: "Full-time",
      description: "",
      requirements: "",
      salary_range: "",
      active: true,
    },
  });

  const userForm = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const storeForm = useForm<z.infer<typeof storeFormSchema>>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      state: "",
      zip_code: "",
      phone: "",
      email: "",
      description: "",
      active: true,
    },
  });

  useEffect(() => {
    const authStatus = localStorage.getItem("isAdminAuthenticated");
    setIsAuthenticated(!!authStatus);
    setAdminUsername(localStorage.getItem("adminUsername") || "admin");

    if (!authStatus) {
      router.push("/admin/login");
    } else {
      fetchApplications();
      fetchJobs();
      fetchUsers();
      fetchStores();
    }
  }, [router]);

  useEffect(() => {
    if (editingJob) {
      jobForm.reset({
        title: editingJob.title,
        department: editingJob.department,
        location: editingJob.location,
        type: editingJob.type,
        description: editingJob.description,
        requirements: editingJob.requirements,
        salary_range: editingJob.salary_range || "",
        active: editingJob.active,
      });
    } else {
      jobForm.reset({
        title: "",
        department: "",
        location: "",
        type: "Full-time",
        description: "",
        requirements: "",
        salary_range: "",
        active: true,
      });
    }
  }, [editingJob, jobForm]);

  useEffect(() => {
    if (selectedStore) {
      storeForm.reset({
        id: selectedStore.id,
        name: selectedStore.name,
        address: selectedStore.address,
        city: selectedStore.city,
        state: selectedStore.state,
        zip_code: selectedStore.zip_code,
        phone: selectedStore.phone,
        email: selectedStore.email,
        description: selectedStore.description,
        active: selectedStore.active,
      });
    } else {
      storeForm.reset({
        name: "",
        address: "",
        city: "",
        state: "",
        zip_code: "",
        phone: "",
        email: "",
        description: "",
        active: true,
      });
    }
  }, [selectedStore, storeForm]);

  function handleLogout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("isAdminAuthenticated");
      localStorage.removeItem("adminUsername");
    }
    router.push("/admin/login");
  }

  async function fetchApplications() {
    const { data, error } = await supabase
      .from("applications")
      .select(
        `
        *,
        computer_skills,
        equipment_skills,
        position_preferences,
        department_preferences,
        other_skills,
        high_school,
        college,
        other_education,
        references
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch applications");
      return;
    }

    // Ensure array fields are properly initialized
    const processedData = data?.map((app) => ({
      ...app,
      computer_skills: app.computer_skills || [],
      equipment_skills: app.equipment_skills || [],
      position_preferences: app.position_preferences || [],
      department_preferences: app.department_preferences || [],
      references: app.references || [],
    }));

    setApplications(processedData || []);
  }

  async function fetchJobs() {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch jobs");
      return;
    }

    setJobs(data);
  }

  async function fetchUsers() {
    const { data, error } = await supabase
      .from("admin_users")
      .select("id, username, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch users");
      return;
    }

    setUsers(data);
  }

  async function fetchStores() {
    try {
      console.log("Fetching stores...");
      const { data, error } = await supabase
        .from("stores")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching stores:", error);
        throw error;
      }

      console.log(
        "Fetched stores successfully:",
        data?.length || 0,
        "stores found"
      );
      setStores(data || []);
    } catch (error) {
      console.error("Error fetching stores:", error);
      toast.error("Failed to fetch stores");
    }
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase
      .from("applications")
      .update({
        status,
        status_by: adminUsername,
        status_date: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
      return;
    }

    toast.success("Status updated successfully");
    fetchApplications();
  }

  async function onJobSubmit(values: z.infer<typeof jobFormSchema>) {
    try {
      if (editingJob) {
        const { error } = await supabase
          .from("jobs")
          .update(values)
          .eq("id", editingJob.id);

        if (error) throw error;
        toast.success("Job updated successfully");
      } else {
        const { error } = await supabase.from("jobs").insert([values]);

        if (error) throw error;
        toast.success("Job created successfully");
      }

      setShowJobDialog(false);
      setEditingJob(null);
      fetchJobs();
    } catch (error: any) {
      toast.error(error.message || "Failed to save job");
    }
  }

  async function onUserSubmit(values: z.infer<typeof userFormSchema>) {
    try {
      if (editingUser) {
        const { error } = await supabase
          .from("admin_users")
          .update({
            username: values.username,
            password: values.password,
          })
          .eq("id", editingUser.id);

        if (error) throw error;
        toast.success("User updated successfully");
      } else {
        const { error } = await supabase.from("admin_users").insert([
          {
            username: values.username,
            password: values.password,
          },
        ]);

        if (error) throw error;
        toast.success("User created successfully");
      }

      setShowUserDialog(false);
      setEditingUser(null);
      userForm.reset();
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to save user");
    }
  }

  async function deleteJob(id: string) {
    if (!confirm("Are you sure you want to delete this job?")) return;

    const { error } = await supabase.from("jobs").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete job");
      return;
    }

    toast.success("Job deleted successfully");
    fetchJobs();
  }

  async function deleteUser(id: string) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    const { error } = await supabase.from("admin_users").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete user");
      return;
    }

    toast.success("User deleted successfully");
    fetchUsers();
  }

  async function onStoreSubmit(values: z.infer<typeof storeFormSchema>) {
    console.log("onStoreSubmit called with values:", values);
    try {
      if (values.id) {
        // Update existing store
        console.log("Updating existing store with ID:", values.id);
        const { data, error } = await supabase
          .from("stores")
          .update({
            name: values.name,
            address: values.address,
            city: values.city,
            state: values.state,
            zip_code: values.zip_code,
            phone: values.phone,
            email: values.email,
            description: values.description,
            active: values.active,
          })
          .eq("id", values.id)
          .select();

        if (error) {
          console.error("Supabase update error:", error);
          throw error;
        }

        console.log("Store updated successfully, response:", data);
        toast.success("Store updated successfully");
      } else {
        // Create new store
        console.log("Creating new store with name:", values.name);
        const { data, error } = await supabase
          .from("stores")
          .insert({
            name: values.name,
            address: values.address,
            city: values.city,
            state: values.state,
            zip_code: values.zip_code,
            phone: values.phone,
            email: values.email,
            description: values.description,
            active: values.active,
          })
          .select();

        if (error) {
          console.error("Supabase insert error:", error);
          throw error;
        }

        console.log("New store created successfully, response:", data);
        toast.success("Store created successfully");
      }

      setStoreDialogOpen(false);
      setSelectedStore(null);
      fetchStores();
    } catch (error: any) {
      console.error("Error saving store:", error);
      toast.error(error.message || "Failed to save store");
    }
  }

  async function deleteStore(id: string) {
    try {
      const { error } = await supabase.from("stores").delete().eq("id", id);

      if (error) throw error;
      fetchStores();
    } catch (error) {
      console.error("Error deleting store:", error);
    }
  }

  function editStore(store: Store) {
    setSelectedStore(store);
    setStoreDialogOpen(true);
  }

  function addNewStore() {
    console.log("addNewStore function called");
    setSelectedStore(null);
    setStoreDialogOpen(true);
    console.log("storeDialogOpen set to:", true);
  }

  function handleDialogChange(open: boolean) {
    console.log("Dialog open state changed to:", open);
    setStoreDialogOpen(open);
    if (!open) {
      // Reset the form when dialog is closed
      setSelectedStore(null);
      storeForm.reset();
    }
  }

  const filteredApplications = applications.filter((app) => {
    const searchLower = searchTerm.toLowerCase();

    switch (searchField) {
      case "name":
        return (
          app.first_name?.toLowerCase().includes(searchLower) ||
          app.last_name?.toLowerCase().includes(searchLower)
        );
      case "email":
        return app.email?.toLowerCase().includes(searchLower);
      case "phone":
        return app.phone?.includes(searchTerm);
      case "address":
        return app.address?.toLowerCase().includes(searchLower);
      case "city":
        return app.city?.toLowerCase().includes(searchLower);
      case "state":
        return app.state?.toLowerCase().includes(searchLower);
      case "zip":
        return app.zip_code?.includes(searchTerm);
      case "job":
        return app.job_title?.toLowerCase().includes(searchLower);
      case "status":
        return app.status?.toLowerCase().includes(searchLower);
      default:
        return true;
    }
  });

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(storeSearchQuery.toLowerCase()) ||
      store.city.toLowerCase().includes(storeSearchQuery.toLowerCase()) ||
      store.state.toLowerCase().includes(storeSearchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      {/* Mobile Header - Always visible on small screens */}
      <div className="lg:hidden flex items-center justify-between bg-black text-white p-4 sticky top-0 z-20 shadow-md">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center text-sm font-medium">
            {adminUsername?.charAt(0).toUpperCase() || "A"}
          </div>
          <h1 className="text-lg font-bold">Admin Portal</h1>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Sidebar - Modified for better mobile handling */}
      <aside
        className={`
          fixed left-0 top-0 h-full w-64 bg-black text-white z-30 shadow-xl
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Sidebar content */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-lg hover:bg-gray-800 transition-colors lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="space-y-1">
            {/* ...existing navigation buttons... */}
            <button
              onClick={() => {
                setActiveTab("applications");
                if (isMobile) setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg ${
                activeTab === "applications"
                  ? "bg-red-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              } transition-colors`}
            >
              <ClipboardListIcon className="h-5 w-5" />
              <span>Applications</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("jobs");
                if (isMobile) setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg ${
                activeTab === "jobs"
                  ? "bg-red-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              } transition-colors`}
            >
              <Briefcase className="h-5 w-5" />
              <span>Job Listings</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("stores");
                if (isMobile) setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg ${
                activeTab === "stores"
                  ? "bg-red-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              } transition-colors`}
            >
              <Store className="h-5 w-5" />
              <span>Stores</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("users");
                if (isMobile) setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg ${
                activeTab === "users"
                  ? "bg-red-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              } transition-colors`}
            >
              <Users className="h-5 w-5" />
              <span>Users</span>
            </button>
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile - only show when sidebar is open on mobile */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content - Make sure padding adapts based on sidebar visibility */}
      <main
        className={`
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? "lg:ml-64" : "ml-0"}
          p-2 sm:p-4 lg:p-8 pt-4
          ${isMobile ? "mt-14" : ""}
        `}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage {activeTab} and related data
            </p>
          </div>

          {!sidebarOpen && (
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-medium">
                  {adminUsername?.charAt(0).toUpperCase() || "A"}
                </div>
                <div className="text-sm font-medium">
                  {adminUsername || "Admin"}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-8">
          <Card className="bg-white shadow-md border-0 hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm">
                    Total Applications
                  </p>
                  <h3 className="text-xl sm:text-3xl font-bold mt-1">
                    {applications.length}
                  </h3>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <ClipboardListIcon className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md border-0 hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm">
                    Active Jobs
                  </p>
                  <h3 className="text-xl sm:text-3xl font-bold mt-1">
                    {jobs.filter((job) => job.active).length}
                  </h3>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md border-0 hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm">
                    Admin Users
                  </p>
                  <h3 className="text-xl sm:text-3xl font-bold mt-1">
                    {users.length}
                  </h3>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4 sm:space-y-6"
        >
          <TabsList className="bg-white p-1 rounded-lg border border-gray-200 shadow-sm w-full overflow-x-auto flex flex-nowrap">
            <TabsTrigger
              value="applications"
              className="text-xs sm:text-sm whitespace-nowrap data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              Applications
            </TabsTrigger>
            <TabsTrigger
              value="jobs"
              className="text-xs sm:text-sm whitespace-nowrap data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              Job Listings
            </TabsTrigger>
            <TabsTrigger
              value="stores"
              className="text-xs sm:text-sm whitespace-nowrap data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              Stores
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="text-xs sm:text-sm whitespace-nowrap data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications">
            <Card className="bg-white shadow-lg border-0 rounded-xl overflow-hidden">
              <CardHeader className="bg-white pb-4 border-b border-gray-100">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                      <ClipboardListIcon className="h-4 w-4 text-red-600" />
                    </div>
                    <CardTitle>Job Applications</CardTitle>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <Select value={searchField} onValueChange={setSearchField}>
                      <SelectTrigger className="w-full sm:w-[150px] border-gray-200 bg-white">
                        <SelectValue placeholder="Search by..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="address">Address</SelectItem>
                        <SelectItem value="city">City</SelectItem>
                        <SelectItem value="state">State</SelectItem>
                        <SelectItem value="zip">ZIP Code</SelectItem>
                        <SelectItem value="job">Job Title</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="relative w-full">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder={`Search by ${searchField}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 border-gray-200 bg-white w-full"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="w-full overflow-auto">
                  <div className="rounded-md min-w-[800px]">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Job Title</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Resume</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredApplications.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="text-center py-8 text-gray-500"
                            >
                              No applications found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredApplications.map((app) => (
                            <TableRow
                              key={app.id}
                              className="cursor-pointer hover:bg-gray-50 transition-colors"
                              onClick={() => {
                                router.push(`/admin/application/${app.id}`);
                              }}
                            >
                              <TableCell className="font-medium">
                                {app.first_name} {app.last_name}
                              </TableCell>
                              <TableCell className="max-w-[150px] truncate">
                                {app.job_title || "-"}
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="text-sm truncate max-w-[180px]">
                                    {app.email}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {app.phone}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    app.status === "approved"
                                      ? "default"
                                      : app.status === "rejected"
                                      ? "destructive"
                                      : "secondary"
                                  }
                                  className={
                                    app.status === "approved"
                                      ? "bg-green-500 hover:bg-green-600 text-white"
                                      : ""
                                  }
                                >
                                  {app.status === "approved" && (
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                  )}
                                  {app.status === "rejected" && (
                                    <XCircle className="h-3 w-3 mr-1" />
                                  )}
                                  {app.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {app.resume_url && (
                                  <a
                                    href={app.resume_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 hover:underline"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <FileText className="h-4 w-4" /> View
                                  </a>
                                )}
                              </TableCell>
                              <TableCell onClick={(e) => e.stopPropagation()}>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      updateStatus(app.id, "approved")
                                    }
                                    disabled={app.status === "approved"}
                                    className="whitespace-nowrap border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700 text-xs h-8"
                                  >
                                    <CheckCircle className="h-3.5 w-3.5 sm:mr-1" />
                                    <span className="hidden sm:inline">
                                      Approve
                                    </span>
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      updateStatus(app.id, "rejected")
                                    }
                                    disabled={app.status === "rejected"}
                                    className="whitespace-nowrap border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 text-xs h-8"
                                  >
                                    <XCircle className="h-3.5 w-3.5 sm:mr-1" />
                                    <span className="hidden sm:inline">
                                      Reject
                                    </span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs">
            <Card className="bg-white shadow-lg border-0 rounded-xl overflow-hidden">
              <CardHeader className="bg-white pb-4 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                      <Briefcase className="h-4 w-4 text-red-600" />
                    </div>
                    <CardTitle>Job Listings</CardTitle>
                  </div>
                  <Dialog open={showJobDialog} onOpenChange={setShowJobDialog}>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => {
                          setEditingJob(null);
                          setShowJobDialog(true);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add Job
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="w-full overflow-auto">
                  <div className="rounded-md min-w-[800px]">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {jobs.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="text-center py-8 text-gray-500"
                            >
                              No job listings found
                            </TableCell>
                          </TableRow>
                        ) : (
                          jobs.map((job) => (
                            <TableRow
                              key={job.id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <TableCell className="font-medium">
                                <Link
                                  href={"/application?job=" + job.id}
                                  className="text-red-600 hover:text-red-800 hover:underline"
                                >
                                  {job.title}
                                </Link>
                              </TableCell>
                              <TableCell>{job.department}</TableCell>
                              <TableCell>{job.location}</TableCell>
                              <TableCell>{job.type}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={job.active ? "default" : "secondary"}
                                  className={
                                    job.active
                                      ? "bg-green-500 hover:bg-green-600 text-white"
                                      : ""
                                  }
                                >
                                  {job.active && (
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                  )}
                                  {job.active ? "Active" : "Inactive"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setEditingJob(job);
                                      setShowJobDialog(true);
                                    }}
                                    className="border-gray-200 hover:bg-gray-50"
                                  >
                                    <Pencil className="h-4 w-4 text-gray-600" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => deleteJob(job.id)}
                                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stores" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Store Management
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  Manage store locations and details
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start gap-2">
                <div className="relative w-full sm:flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search stores..."
                    className="pl-9 w-full"
                    value={storeSearchQuery}
                    onChange={(e) => setStoreSearchQuery(e.target.value)}
                  />
                </div>
                <Button
                  onClick={() => {
                    addNewStore();
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Store
                </Button>
              </div>
            </div>

            <Card className="overflow-hidden border-0 shadow-md">
              <CardContent className="p-0">
                <ScrollArea className="w-full overflow-auto">
                  <div className="min-w-[800px]">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead className="font-semibold">
                            Store Name
                          </TableHead>
                          <TableHead className="font-semibold">
                            Location
                          </TableHead>
                          <TableHead className="font-semibold">
                            Contact
                          </TableHead>
                          <TableHead className="font-semibold">
                            Status
                          </TableHead>
                          <TableHead className="font-semibold text-right">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStores.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="text-center py-8 text-gray-500"
                            >
                              {storeSearchQuery
                                ? "No stores found matching your search."
                                : "No stores have been added yet."}
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredStores.map((store) => (
                            <TableRow
                              key={store.id}
                              className="hover:bg-gray-50"
                            >
                              <TableCell className="font-medium">
                                {store.name}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-start gap-2">
                                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                  <div>
                                    <p className="text-sm">{store.address}</p>
                                    <p className="text-xs text-gray-500">
                                      {store.city}, {store.state}{" "}
                                      {store.zip_code}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {store.phone && (
                                  <div className="flex items-center gap-2 mb-1">
                                    <Phone className="h-3 w-3 text-gray-400" />
                                    <span className="text-sm">
                                      {store.phone}
                                    </span>
                                  </div>
                                )}
                                {store.email && (
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-3 w-3 text-gray-400" />
                                    <span className="text-sm truncate max-w-[150px]">
                                      {store.email}
                                    </span>
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={store.active ? "default" : "outline"}
                                  className={
                                    store.active
                                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                                      : "text-gray-500"
                                  }
                                >
                                  {store.active ? "Active" : "Inactive"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => editStore(store)}
                                    className="h-8 w-8"
                                  >
                                    <Pencil className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      if (
                                        window.confirm(
                                          `Are you sure you want to delete ${store.name}?`
                                        )
                                      ) {
                                        deleteStore(store.id);
                                      }
                                    }}
                                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="bg-white shadow-lg border-0 rounded-xl overflow-hidden">
              <CardHeader className="bg-white pb-4 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                      <Users className="h-4 w-4 text-red-600" />
                    </div>
                    <CardTitle>Users</CardTitle>
                  </div>
                  <Dialog
                    open={showUserDialog}
                    onOpenChange={setShowUserDialog}
                  >
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => {
                          setEditingUser(null);
                          setShowUserDialog(true);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add User
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="rounded-md">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow
                          key={user.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <TableCell className="font-medium">
                            {user.username}
                          </TableCell>
                          <TableCell>
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingUser(user);
                                  setShowUserDialog(true);
                                }}
                                className="border-gray-200 hover:bg-gray-50"
                              >
                                <Pencil className="h-4 w-4 text-gray-600" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteUser(user.id)}
                                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Job Dialog */}
      <Dialog open={showJobDialog} onOpenChange={setShowJobDialog}>
        <DialogContent className="sm:max-w-[600px] z-[100]">
          <DialogHeader>
            <DialogTitle>{editingJob ? "Edit Job" : "Add New Job"}</DialogTitle>
          </DialogHeader>
          <Form {...jobForm}>
            <form
              onSubmit={jobForm.handleSubmit(onJobSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={jobForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter job title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={jobForm.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter department" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={jobForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={jobForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Type*</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select job type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Temporary">Temporary</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={jobForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description*</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter job description"
                        className="resize-none min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={jobForm.control}
                name="requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requirements*</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter job requirements"
                        className="resize-none min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={jobForm.control}
                name="salary_range"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary Range</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. $50,000 - $70,000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={jobForm.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>
                        Set whether this job is currently active
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {editingJob ? "Update Job" : "Add Job"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* User Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="sm:max-w-[500px] z-[100]">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Edit User" : "Add New User"}
            </DialogTitle>
          </DialogHeader>
          <Form {...userForm}>
            <form
              onSubmit={userForm.handleSubmit(onUserSubmit)}
              className="space-y-6"
            >
              <FormField
                control={userForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={userForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password*</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {editingUser ? "Update User" : "Add User"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Store Dialog */}
      <Dialog open={storeDialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="sm:max-w-[600px] z-[100]">
          <DialogHeader>
            <DialogTitle>
              {selectedStore ? "Edit Store" : "Add New Store"}
            </DialogTitle>
          </DialogHeader>
          <Form {...storeForm}>
            <div className="space-y-6">
              {selectedStore && (
                <FormField
                  control={storeForm.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={storeForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter store name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={storeForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter street address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={storeForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={storeForm.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter state" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={storeForm.control}
                  name="zip_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP Code*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter ZIP code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={storeForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter phone number"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={storeForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter email address"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={storeForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter store description"
                        className="resize-none min-h-[100px]"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={storeForm.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>
                        Set whether this store is currently active
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    type="button"
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => {
                      console.log("Submit button clicked manually");
                      storeForm.handleSubmit((values) => {
                        onStoreSubmit(values);
                      })();
                    }}
                  >
                    {selectedStore ? "Update Store" : "Add Store"}
                  </Button>
                </DialogClose>
              </DialogFooter>
            </div>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Direct test button and Test Dialog */}
    </div>
  );
}
