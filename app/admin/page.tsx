"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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

export default function AdminPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchField, setSearchField] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);

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

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
    if (!isAuthenticated) {
      router.push('/admin/login');
      return;
    }

    fetchApplications();
    fetchJobs();
    fetchUsers();
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
  }, [editingJob]);

  function handleLogout() {
    localStorage.removeItem('isAdminAuthenticated');
    router.push('/admin/login');
  }

  async function fetchApplications() {
    const { data, error } = await supabase
      .from('applications')
      .select(`
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
      `)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Failed to fetch applications");
      return;
    }

    // Ensure array fields are properly initialized
    const processedData = data?.map(app => ({
      ...app,
      computer_skills: app.computer_skills || [],
      equipment_skills: app.equipment_skills || [],
      position_preferences: app.position_preferences || [],
      department_preferences: app.department_preferences || [],
      references: app.references || []
    }));

    setApplications(processedData || []);
  }

  async function fetchJobs() {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Failed to fetch jobs");
      return;
    }

    setJobs(data);
  }

  async function fetchUsers() {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id, username, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Failed to fetch users");
      return;
    }

    setUsers(data);
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase
      .from('applications')
      .update({ 
        status,
        status_by: localStorage.getItem('adminUsername') || 'admin',
        status_date: new Date().toISOString()
      })
      .eq('id', id);

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
          .from('jobs')
          .update(values)
          .eq('id', editingJob.id);

        if (error) throw error;
        toast.success("Job updated successfully");
      } else {
        const { error } = await supabase
          .from('jobs')
          .insert([values]);

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
          .from('admin_users')
          .update({
            username: values.username,
            password: values.password,
          })
          .eq('id', editingUser.id);

        if (error) throw error;
        toast.success("User updated successfully");
      } else {
        const { error } = await supabase
          .from('admin_users')
          .insert([{
            username: values.username,
            password: values.password,
          }]);

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

    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Failed to delete job");
      return;
    }

    toast.success("Job deleted successfully");
    fetchJobs();
  }

  async function deleteUser(id: string) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Failed to delete user");
      return;
    }

    toast.success("User deleted successfully");
    fetchUsers();
  }

  const filteredApplications = applications.filter(app => {
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

  return (
    <>
      <ApplicationDetailsDialog
        application={selectedApplication}
        open={showApplicationDialog}
        onOpenChange={setShowApplicationDialog}
      />

      <div className="container mx-auto py-6">
        <div className="flex justify-end mb-6">
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="jobs">Job Listings</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="applications">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClipboardListIcon className="h-6 w-6" />
                    <CardTitle>Job Applications</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={searchField}
                      onValueChange={setSearchField}
                    >
                      <SelectTrigger className="w-[150px]">
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
                    <div className="relative w-64">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={`Search by ${searchField}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
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
                      {filteredApplications.map((app) => (
                        <TableRow 
                          key={app.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => {
                            setSelectedApplication(app);
                            setShowApplicationDialog(true);
                          }}
                        >
                          <TableCell>
                            {app.first_name} {app.last_name}
                          </TableCell>
                          <TableCell>{app.job_title || '-'}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{app.email}</span>
                              <span className="text-sm text-muted-foreground">{app.phone}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                app.status === 'approved' 
                                  ? 'success' 
                                  : app.status === 'rejected' 
                                  ? 'destructive' 
                                  : 'secondary'
                              }
                            >
                              {app.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {app.resume_url && (
                              <a
                                href={app.resume_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-primary hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                View <ExternalLinkIcon className="h-4 w-4" />
                              </a>
                            )}
                          </TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateStatus(app.id, 'approved')}
                                disabled={app.status === 'approved'}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateStatus(app.id, 'rejected')}
                                disabled={app.status === 'rejected'}
                              >
                                Reject
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

          <TabsContent value="jobs">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-6 w-6" />
                    <CardTitle>Job Listings</CardTitle>
                  </div>
                  <Dialog open={showJobDialog} onOpenChange={setShowJobDialog}>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => {
                          setEditingJob(null);
                          setShowJobDialog(true);
                        }}
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add Job
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          {editingJob ? 'Edit Job Listing' : 'Create Job Listing'}
                        </DialogTitle>
                      </DialogHeader>
                      <Form {...jobForm}>
                        <form onSubmit={jobForm.handleSubmit(onJobSubmit)} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={jobForm.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Job Title</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
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
                                  <FormLabel>Department</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={jobForm.control}
                              name="location"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Location</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
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
                                  <FormLabel>Job Type</FormLabel>
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
                                      <SelectItem value="Internship">Internship</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={jobForm.control}
                            name="salary_range"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Salary Range (Optional)</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={jobForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Job Description</FormLabel>
                                <FormControl>
                                  <Textarea
                                    {...field}
                                    className="min-h-[100px]"
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
                                <FormLabel>Requirements</FormLabel>
                                <FormControl>
                                  <Textarea
                                    {...field}
                                    className="min-h-[100px]"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={jobForm.control}
                            name="active"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    Active Listing
                                  </FormLabel>
                                  <div className="text-sm text-muted-foreground">
                                    This job will be visible to applicants
                                  </div>
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
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setShowJobDialog(false)}
                            >
                              Cancel
                            </Button>
                            <Button type="submit">
                              {editingJob ? 'Update' : 'Create'} Job
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
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
                      {jobs.map((job) => (
                        <TableRow key={job.id}>
                          <TableCell>
                            <Link href={'/jobs?job=' + job.id} className="text-primary hover:underline">
                              {job.title}
                            </Link>
                          </TableCell>
                          <TableCell>{job.department}</TableCell>
                          <TableCell>{job.location}</TableCell>
                          <TableCell>{job.type}</TableCell>
                          <TableCell>
                            <Badge
                              variant={job.active ? "success" : "secondary"}
                            >
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
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteJob(job.id)}
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

          <TabsContent value="users">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-6 w-6" />
                    <CardTitle>Admin Users</CardTitle>
                  </div>
                  <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => {
                          setEditingUser(null);
                          setShowUserDialog(true);
                        }}
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editingUser ? 'Edit User' : 'Create User'}
                        </DialogTitle>
                      </DialogHeader>
                      <Form {...userForm}>
                        <form onSubmit={userForm.handleSubmit(onUserSubmit)} className="space-y-4">
                          <FormField
                            control={userForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                  <Input {...field} />
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
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <DialogFooter>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setShowUserDialog(false)}
                            >
                              Cancel
                            </Button>
                            <Button type="submit">
                              {editingUser ? 'Update' : 'Create'} User
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingUser(user);
                                  setShowUserDialog(true);
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteUser(user.id)}
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
      </div>
    </>
  );
}