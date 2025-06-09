import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  Palette,
  Globe,
  Bell,
  MapPin,
  Clock,
  Save,
  RefreshCw,
  Moon,
  Sun,
  Monitor,
  Mail,
  Phone,
  Building,
} from "lucide-react";
import { useBusinessSettings } from "@/hooks/useEnhancedSupabase";
import { toast } from "sonner";

export function BusinessSettings() {
  const { settings, loading, updateSettings } = useBusinessSettings();
  const [localSettings, setLocalSettings] = useState({
    business_name: "",
    business_email: "",
    business_phone: "",
    business_address: "",
    theme: "light" as "light" | "dark",
    language: "en" as "en" | "es" | "fr" | "de",
    currency: "USD",
    timezone: "UTC",
    notification_preferences: {
      email_bookings: true,
      sms_bookings: true,
      email_payments: true,
      maintenance_alerts: true,
    },
    working_hours: {
      monday: { start: "08:00", end: "17:00", closed: false },
      tuesday: { start: "08:00", end: "17:00", closed: false },
      wednesday: { start: "08:00", end: "17:00", closed: false },
      thursday: { start: "08:00", end: "17:00", closed: false },
      friday: { start: "08:00", end: "17:00", closed: false },
      saturday: { start: "09:00", end: "15:00", closed: false },
      sunday: { start: "00:00", end: "00:00", closed: true },
    },
  });

  useEffect(() => {
    if (settings) {
      setLocalSettings({
        business_name: settings.business_name,
        business_email: settings.business_email,
        business_phone: settings.business_phone,
        business_address: settings.business_address,
        theme: settings.theme,
        language: settings.language,
        currency: settings.currency,
        timezone: settings.timezone,
        notification_preferences: settings.notification_preferences,
        working_hours: settings.working_hours,
      });
    }
  }, [settings]);

  const handleSaveSettings = async () => {
    try {
      await updateSettings(localSettings);
      toast.success("Settings saved successfully");

      // Apply theme change
      if (localSettings.theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch (error) {
      toast.error("Failed to save settings");
    }
  };

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
  ];

  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  ];

  const timezones = [
    "UTC",
    "America/New_York",
    "America/Los_Angeles",
    "America/Chicago",
    "Europe/London",
    "Europe/Paris",
    "Asia/Tokyo",
    "Australia/Sydney",
  ];

  const weekDays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
        <div className="h-96 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="business" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="localization">Localization</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="hours">Working Hours</TabsTrigger>
        </TabsList>

        {/* Business Information */}
        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="w-5 h-5" />
                <span>Business Information</span>
              </CardTitle>
              <CardDescription>
                Update your business details that appear throughout the
                application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="business_name">Business Name</Label>
                  <Input
                    id="business_name"
                    value={localSettings.business_name}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        business_name: e.target.value,
                      })
                    }
                    placeholder="EquipEase Rentals"
                  />
                </div>

                <div>
                  <Label htmlFor="business_email">Business Email</Label>
                  <Input
                    id="business_email"
                    type="email"
                    value={localSettings.business_email}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        business_email: e.target.value,
                      })
                    }
                    placeholder="contact@equipease.com"
                  />
                </div>

                <div>
                  <Label htmlFor="business_phone">Business Phone</Label>
                  <Input
                    id="business_phone"
                    value={localSettings.business_phone}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        business_phone: e.target.value,
                      })
                    }
                    placeholder="+1-555-EQUIP"
                  />
                </div>

                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={localSettings.currency}
                    onValueChange={(value) =>
                      setLocalSettings({ ...localSettings, currency: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.symbol} {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="business_address">Business Address</Label>
                <Textarea
                  id="business_address"
                  value={localSettings.business_address}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      business_address: e.target.value,
                    })
                  }
                  placeholder="123 Industrial Ave, City, State 12345"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="w-5 h-5" />
                <span>Appearance</span>
              </CardTitle>
              <CardDescription>
                Customize the look and feel of your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Theme Mode</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      localSettings.theme === "light"
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200"
                    }`}
                    onClick={() =>
                      setLocalSettings({ ...localSettings, theme: "light" })
                    }
                  >
                    <div className="flex items-center justify-center mb-2">
                      <Sun className="w-8 h-8 text-yellow-500" />
                    </div>
                    <div className="text-center">
                      <div className="font-medium">Light</div>
                      <div className="text-sm text-gray-600">
                        Clean and bright interface
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      localSettings.theme === "dark"
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200"
                    }`}
                    onClick={() =>
                      setLocalSettings({ ...localSettings, theme: "dark" })
                    }
                  >
                    <div className="flex items-center justify-center mb-2">
                      <Moon className="w-8 h-8 text-blue-500" />
                    </div>
                    <div className="text-center">
                      <div className="font-medium">Dark</div>
                      <div className="text-sm text-gray-600">
                        Easy on the eyes
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg opacity-50 cursor-not-allowed">
                    <div className="flex items-center justify-center mb-2">
                      <Monitor className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="text-center">
                      <div className="font-medium">System</div>
                      <div className="text-sm text-gray-600">Coming soon</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">
                  Theme Preview
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded border">
                    <div className="w-full h-2 bg-orange-500 rounded mb-2"></div>
                    <div className="space-y-1">
                      <div className="w-3/4 h-2 bg-gray-200 rounded"></div>
                      <div className="w-1/2 h-2 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="bg-gray-800 p-3 rounded text-white">
                    <div className="w-full h-2 bg-orange-500 rounded mb-2"></div>
                    <div className="space-y-1">
                      <div className="w-3/4 h-2 bg-gray-600 rounded"></div>
                      <div className="w-1/2 h-2 bg-gray-600 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Localization */}
        <TabsContent value="localization">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>Localization</span>
              </CardTitle>
              <CardDescription>
                Set your language, timezone, and regional preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Language</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  {languages.map((language) => (
                    <div
                      key={language.code}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        localSettings.language === language.code
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() =>
                        setLocalSettings({
                          ...localSettings,
                          language: language.code as any,
                        })
                      }
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">{language.flag}</div>
                        <div className="font-medium">{language.name}</div>
                        <div className="text-sm text-gray-600">
                          {language.code.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={localSettings.timezone}
                  onValueChange={(value) =>
                    setLocalSettings({ ...localSettings, timezone: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((timezone) => (
                      <SelectItem key={timezone} value={timezone}>
                        {timezone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">
                  🚧 Coming Soon
                </h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Date format preferences</li>
                  <li>• Number format localization</li>
                  <li>• Full UI translation</li>
                  <li>• Right-to-left language support</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </CardTitle>
              <CardDescription>
                Configure how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">
                      Email Booking Notifications
                    </Label>
                    <p className="text-sm text-gray-600">
                      Get notified via email when new bookings are received
                    </p>
                  </div>
                  <Switch
                    checked={
                      localSettings.notification_preferences.email_bookings
                    }
                    onCheckedChange={(checked) =>
                      setLocalSettings({
                        ...localSettings,
                        notification_preferences: {
                          ...localSettings.notification_preferences,
                          email_bookings: checked,
                        },
                      })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">
                      SMS Booking Notifications
                    </Label>
                    <p className="text-sm text-gray-600">
                      Get notified via SMS for urgent booking requests
                    </p>
                  </div>
                  <Switch
                    checked={
                      localSettings.notification_preferences.sms_bookings
                    }
                    onCheckedChange={(checked) =>
                      setLocalSettings({
                        ...localSettings,
                        notification_preferences: {
                          ...localSettings.notification_preferences,
                          sms_bookings: checked,
                        },
                      })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Payment Notifications</Label>
                    <p className="text-sm text-gray-600">
                      Email alerts for payment status updates
                    </p>
                  </div>
                  <Switch
                    checked={
                      localSettings.notification_preferences.email_payments
                    }
                    onCheckedChange={(checked) =>
                      setLocalSettings({
                        ...localSettings,
                        notification_preferences: {
                          ...localSettings.notification_preferences,
                          email_payments: checked,
                        },
                      })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Maintenance Alerts</Label>
                    <p className="text-sm text-gray-600">
                      Notifications for scheduled maintenance and inspections
                    </p>
                  </div>
                  <Switch
                    checked={
                      localSettings.notification_preferences.maintenance_alerts
                    }
                    onCheckedChange={(checked) =>
                      setLocalSettings({
                        ...localSettings,
                        notification_preferences: {
                          ...localSettings.notification_preferences,
                          maintenance_alerts: checked,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Working Hours */}
        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Working Hours</span>
              </CardTitle>
              <CardDescription>
                Set your business operating hours for each day of the week
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {weekDays.map((day) => (
                <div key={day} className="flex items-center space-x-4">
                  <div className="w-24">
                    <Label className="capitalize">{day}</Label>
                  </div>

                  <Switch
                    checked={
                      !localSettings.working_hours[
                        day as keyof typeof localSettings.working_hours
                      ].closed
                    }
                    onCheckedChange={(checked) =>
                      setLocalSettings({
                        ...localSettings,
                        working_hours: {
                          ...localSettings.working_hours,
                          [day]: {
                            ...localSettings.working_hours[
                              day as keyof typeof localSettings.working_hours
                            ],
                            closed: !checked,
                          },
                        },
                      })
                    }
                  />

                  {!localSettings.working_hours[
                    day as keyof typeof localSettings.working_hours
                  ].closed && (
                    <>
                      <Input
                        type="time"
                        value={
                          localSettings.working_hours[
                            day as keyof typeof localSettings.working_hours
                          ].start
                        }
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            working_hours: {
                              ...localSettings.working_hours,
                              [day]: {
                                ...localSettings.working_hours[
                                  day as keyof typeof localSettings.working_hours
                                ],
                                start: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-32"
                      />
                      <span className="text-gray-500">to</span>
                      <Input
                        type="time"
                        value={
                          localSettings.working_hours[
                            day as keyof typeof localSettings.working_hours
                          ].end
                        }
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            working_hours: {
                              ...localSettings.working_hours,
                              [day]: {
                                ...localSettings.working_hours[
                                  day as keyof typeof localSettings.working_hours
                                ],
                                end: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-32"
                      />
                    </>
                  )}

                  {localSettings.working_hours[
                    day as keyof typeof localSettings.working_hours
                  ].closed && (
                    <span className="text-gray-500 italic">Closed</span>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset to Defaults
        </Button>
        <Button
          onClick={handleSaveSettings}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
