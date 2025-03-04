// AdminControls.js
"use client";
import React from "react";
import { Shield, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch, SwitchThumb } from "@/components/ui/switch";
import { toast } from "sonner";

export function AdminBanner() {
  return (
    <div className="bg-amber-100 p-2 text-amber-800 text-center text-sm font-medium flex items-center justify-center space-x-2">
      <Shield className="h-4 w-4" />
      <span>Admin Moderator Mode Active</span>
    </div>
  );
}

export function AdminHeaderControls({
  isAdminMode,
  handleAdminModeToggle,
  navigateToAdminDashboard,
}) {
  return (
    <div className="absolute top-2 right-2 z-10">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/40"
          >
            <Settings className="h-4 w-4 text-white" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-sm font-medium">Admin Mode</span>
            <Switch
              checked={isAdminMode}
              onCheckedChange={handleAdminModeToggle}
              className="data-[state=checked]:bg-amber-500"
            >
              <SwitchThumb />
            </Switch>
          </div>
          <DropdownMenuItem onClick={navigateToAdminDashboard}>
            <Shield className="mr-2 h-4 w-4" />
            <span>Admin Dashboard</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function AdminBadge() {
  return (
    <Badge
      variant="outline"
      className="bg-amber-50 text-amber-800 border-amber-200"
    >
      <Shield className="h-3 w-3 mr-1" />
      Admin View
    </Badge>
  );
}

export function AdminButton({ navigateToAdminDashboard }) {
  return (
    <Button
      className="rounded-full bg-amber-500 hover:bg-amber-600"
      onClick={navigateToAdminDashboard}
    >
      <Shield className="h-4 w-4 mr-2" />
      Admin Dashboard
    </Button>
  );
}

export function AdminInfoPanel() {
  return (
    <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
      <h3 className="text-sm font-medium flex items-center text-amber-800 mb-2">
        <Shield className="h-4 w-4 mr-1" />
        Admin Information
      </h3>
      <div className="space-y-2 text-sm">
        <p>
          <span className="font-medium">Patient ID:</span>{" "}
          {/* patient.id would go here */}
        </p>
        <p>
          <span className="font-medium">Account Status:</span> Active
        </p>
        <p>
          <span className="font-medium">Data Consent:</span> Full
        </p>
        <p>
          <span className="font-medium">Last Login:</span>{" "}
          {new Date().toLocaleDateString()}
        </p>
      </div>
      <div className="mt-3 flex gap-2">
        <Button size="sm" variant="outline" className="text-xs">
          View Full History
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-xs text-red-500 hover:text-red-700"
        >
          Flag Account
        </Button>
      </div>
    </div>
  );
}

export function AdminPreferencesPanel() {
  return (
    <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
      <h3 className="text-sm font-medium flex items-center text-amber-800 mb-2">
        <Shield className="h-4 w-4 mr-1" />
        Admin Preference Controls
      </h3>
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span>Allow Community Content</span>
          <Switch defaultChecked className="data-[state=checked]:bg-amber-500">
            <SwitchThumb />
          </Switch>
        </div>
        <div className="flex items-center justify-between">
          <span>Enable Marketing Communications</span>
          <Switch className="data-[state=checked]:bg-amber-500">
            <SwitchThumb />
          </Switch>
        </div>
        <div className="flex items-center justify-between">
          <span>Research Participation Eligibility</span>
          <Switch defaultChecked className="data-[state=checked]:bg-amber-500">
            <SwitchThumb />
          </Switch>
        </div>
      </div>
      <Button
        size="sm"
        className="mt-3 w-full bg-amber-500 hover:bg-amber-600 text-xs"
      >
        Save Preference Settings
      </Button>
    </div>
  );
}

export function AdminHealthPanel({ fallRisk }) {
  return (
    <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
      <h3 className="text-sm font-medium flex items-center text-amber-800 mb-2">
        <Shield className="h-4 w-4 mr-1" />
        Admin Health Controls
      </h3>
      <div className="space-y-2 text-sm">
        <p>
          <span className="font-medium">Risk Assessment Date:</span>{" "}
          {new Date().toLocaleDateString()}
        </p>
        <p>
          <span className="font-medium">Assessment Method:</span> Standardized
          Protocol v2.3
        </p>
        <p>
          <span className="font-medium">Assessor:</span> Dr. Johnson, M.D.
        </p>
        <p>
          <span className="font-medium">Follow-up Required:</span>{" "}
          {fallRisk === "yes" ? "Yes - 14 days" : "No"}
        </p>
      </div>
      <div className="mt-3 flex gap-2">
        <Button size="sm" className="text-xs bg-amber-500 hover:bg-amber-600">
          Update Assessment
        </Button>
        <Button size="sm" variant="outline" className="text-xs">
          View Medical Records
        </Button>
      </div>
    </div>
  );
}

export function AdminEditControls() {
  return (
    <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
      <h3 className="text-sm font-medium flex items-center text-amber-800 mb-2">
        <Shield className="h-4 w-4 mr-1" />
        Admin Edit Controls
      </h3>
      <p className="text-xs text-amber-800 mb-2">
        As an admin, you have access to additional profile controls.
      </p>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm">Override Data Restrictions</span>
          <Switch className="data-[state=checked]:bg-amber-500">
            <SwitchThumb />
          </Switch>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Verify Patient Identity</span>
          <Switch className="data-[state=checked]:bg-amber-500">
            <SwitchThumb />
          </Switch>
        </div>
      </div>
    </div>
  );
}

export function AdminFloatingButton({ handleAdminModeToggle }) {
  return (
    <Button
      className="fixed right-4 bottom-4 rounded-full h-12 w-12 p-0 bg-amber-500 hover:bg-amber-600 shadow-lg"
      onClick={handleAdminModeToggle}
    >
      <Shield className="h-5 w-5" />
    </Button>
  );
}

export default function PatientProfile() {
  const [loading, setLoading] = useState(false);
  const [patient, setPatient] = useState<PatientDetails | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminRights, setAdminRights] = useState(false);
  const router = useRouter();

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getUser = useCallback(async () => {
    try {
      setLoading(true);
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) throw error;

      if (user) {
        // Extract display name from various possible sources

        // Update user data in the database
        // Send data to the backend
        const response = await fetch(`/api/patient-profile/${user.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setPatient(data?.patient);

          // Check if user has admin rights (this would need to be part of your user data)
          if (data?.isAdmin) {
            setAdminRights(true);
          }
        }
      } else {
        // If no user is found, redirect to auth page
        router.push("/auth");
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AuthSessionMissingError") {
        router.push("/auth");
      } else {
        console.error("Error:", error);
        toast.error("Error loading user data");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  const handleAdminModeToggle = () => {
    if (!isAdminMode) {
      toast.success("Admin moderator mode activated");
    } else {
      toast.info("Returned to standard view");
    }
    setIsAdminMode(!isAdminMode);
  };

  const navigateToAdminDashboard = () => {
    toast.info("Navigating to admin dashboard...");
    router.push("/admin/patients");
  };

  const formatGender = (gender: string) => {
    if (!gender) return "";
    return gender
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const ageDisplay = patient?.age ? `${patient.age} years` : "Not specified";

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="container flex-grow-1 h-full max-w-md mx-0 px-0 py-0"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">Loading patient data...</p>
        </div>
      ) : patient ? (
        <Card className="overflow-hidden h-full flex flex-col justify-between mx-0 px-0 rounded-none pb-0">
          {/* Admin Mode Banner */}
          {isAdminMode && <AdminBanner />}

          {/* Profile Header */}
          <CardHeader className="relative p-0">
            <div
              className={`h-32 ${
                isAdminMode
                  ? "bg-gradient-to-r from-amber-400 to-orange-500"
                  : "bg-gradient-to-r from-blue-400 to-purple-500"
              }`}
            >
              {/* Admin controls in header */}
              {adminRights && (
                <AdminHeaderControls
                  isAdminMode={isAdminMode}
                  handleAdminModeToggle={handleAdminModeToggle}
                  navigateToAdminDashboard={navigateToAdminDashboard}
                />
              )}
            </div>
            <div className="absolute -bottom-16 left-0 w-full flex justify-center">
              <Avatar className="h-32 w-32 border-4 border-white bg-white">
                {patient.profilePicture ? (
                  <AvatarImage
                    src={patient.profilePicture}
                    alt={patient.name}
                  />
                ) : (
                  <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                    {getInitials(patient.name)}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
          </CardHeader>

          <CardContent className="pt-20 pb-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">{patient.name}</h1>
              <p className="text-gray-500">{patient?.email}</p>

              <div className="flex justify-center gap-2 mt-2">
                {patient.fallRisk === "yes" && (
                  <Badge variant="destructive">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Fall Risk
                  </Badge>
                )}

                {isAdminMode && <AdminBadge />}
              </div>
            </div>

            <motion.div
              className="flex justify-center gap-4 mb-6"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => setIsEditing(!isEditing)}
              >
                <EditIcon className="h-4 w-4 mr-2" />
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>

              {isAdminMode && (
                <AdminButton
                  navigateToAdminDashboard={navigateToAdminDashboard}
                />
              )}
            </motion.div>

            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="info">Info</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                <TabsTrigger value="health">Health</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4">
                <div className="space-y-3">
                  {patient.about && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">{patient.about}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-[24px_1fr] gap-3 items-center">
                    <User className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Age & Gender</p>
                      <p className="text-sm text-gray-500">
                        {ageDisplay} • {formatGender(patient.gender)}
                      </p>
                    </div>
                  </div>

                  {patient.location && (
                    <div className="grid grid-cols-[24px_1fr] gap-3 items-center">
                      <MapPin className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-sm text-gray-500">
                          {patient.location}
                        </p>
                      </div>
                    </div>
                  )}

                  {patient.dateOfBirth && (
                    <div className="grid grid-cols-[24px_1fr] gap-3 items-center">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Date of Birth</p>
                        <p className="text-sm text-gray-500">
                          {patient.dateOfBirth}
                        </p>
                      </div>
                    </div>
                  )}

                  {patient.education && (
                    <div className="grid grid-cols-[24px_1fr] gap-3 items-center">
                      <BookOpen className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Education</p>
                        <p className="text-sm text-gray-500">
                          {patient.education}
                        </p>
                      </div>
                    </div>
                  )}

                  {patient.work && (
                    <div className="grid grid-cols-[24px_1fr] gap-3 items-center">
                      <Briefcase className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Work</p>
                        <p className="text-sm text-gray-500">{patient.work}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Admin-only information */}
                {isAdminMode && <AdminInfoPanel />}
              </TabsContent>

              <TabsContent value="preferences" className="space-y-4">
                <div className="space-y-4">
                  {patient.likes && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-rose-500" />
                        <h3 className="font-medium">Likes</h3>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">{patient.likes}</p>
                      </div>
                    </div>
                  )}

                  {patient.dislikes && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <X className="h-4 w-4 text-gray-500" />
                        <h3 className="font-medium">Dislikes</h3>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">
                          {patient.dislikes}
                        </p>
                      </div>
                    </div>
                  )}

                  {Object.keys(patient.promptAnswers || {}).length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-medium">Profile Prompts</h3>
                      {Object.entries(patient.promptAnswers || {}).map(
                        ([prompt, answer], index) => (
                          <div
                            key={index}
                            className="bg-gray-50 p-3 rounded-lg"
                          >
                            <p className="text-sm font-medium">{prompt}</p>
                            <p className="text-sm text-gray-700 mt-1">
                              {String(answer)}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* Admin-only preferences controls */}
                {isAdminMode && <AdminPreferencesPanel />}
              </TabsContent>

              <TabsContent value="health" className="space-y-4">
                {patient.symptoms && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Symptoms</h3>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">
                        {patient.symptoms}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <h3 className="font-medium">Fall Risk Assessment</h3>
                  <div
                    className={`p-3 rounded-lg ${
                      patient.fallRisk === "yes" ? "bg-red-50" : "bg-green-50"
                    }`}
                  >
                    <p
                      className={`text-sm ${
                        patient.fallRisk === "yes"
                          ? "text-red-700"
                          : "text-green-700"
                      }`}
                    >
                      {patient.fallRisk === "yes"
                        ? "Patient has been identified as having a fall risk."
                        : "No fall risk identified."}
                    </p>
                  </div>
                </div>

                {/* Admin-only health data access */}
                {isAdminMode && (
                  <AdminHealthPanel fallRisk={patient.fallRisk} />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter
            className={`border-t pt-4 flex justify-between text-xs text-gray-500 ${
              isAdminMode ? "bg-amber-50" : ""
            }`}
          >
            <p>Joined: {new Date(patient.createdAt).toLocaleDateString()}</p>
            <p>
              Last Updated: {new Date(patient.updatedAt).toLocaleDateString()}
            </p>
          </CardFooter>
        </Card>
      ) : (
        <p className="text-center text-gray-500">Patient data not found.</p>
      )}

      {/* Edit Form Modal */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="mt-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>
                {isAdminMode ? "Admin Edit Profile" : "Edit Profile"}
              </CardTitle>
              <CardDescription>Update your profile information</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Form would go here */}
              <p className="text-sm text-gray-500">
                Edit form would be implemented here with all the relevant fields
                from the schema.
              </p>

              {/* Show additional admin controls in edit mode */}
              {isAdminMode && <AdminEditControls />}
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button
                className={isAdminMode ? "bg-amber-500 hover:bg-amber-600" : ""}
              >
                {isAdminMode ? "Save Admin Changes" : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}

      {/* Floating Admin Button - only visible to those with admin rights who aren't in admin mode */}
      {adminRights && !isAdminMode && (
        <AdminFloatingButton handleAdminModeToggle={handleAdminModeToggle} />
      )}
    </motion.div>
  );
}
