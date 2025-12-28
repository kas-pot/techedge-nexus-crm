import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Globe, Palette, Cpu, Wifi, Save, AlertTriangle } from 'lucide-react';
import { useSystemSettings, useSettingsMutation } from '@/lib/api-hooks';
import { toast } from 'sonner';
export function SettingsPage() {
  const { data: settings, isLoading } = useSystemSettings();
  const mutation = useSettingsMutation();
  const [formData, setFormData] = useState<Record<string, string>>({});
  useEffect(() => {
    if (settings) {
      setFormData({
        theme: settings.theme || '',
        language: settings.language || '',
        ssoEnabled: settings.ssoEnabled ? 'on' : 'off',
        notificationEmail: settings.notificationEmail || '',
        ocrPrecision: settings.ocrPrecision || '',
        wifiSsid: settings.wifiSsid || '',
      });
    }
  }, [settings]);
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutation.mutateAsync({
        ...formData,
        ssoEnabled: formData.ssoEnabled === 'on',
      });
      toast.success("Global settings updated");
    } catch (err) {
      toast.error("Failed to save settings");
    }
  };
  const updateField = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };
  if (isLoading) return <AppLayout container><div className="h-96 animate-pulse bg-muted/20 rounded-xl" /></AppLayout>;
  return (
    <AppLayout container>
      <div className="space-y-8 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Global System Settings</h1>
            <p className="text-muted-foreground">Master configuration for the Nexus CRM enterprise environment.</p>
          </div>
        </div>
        <form onSubmit={handleSave}>
          <Tabs defaultValue="appearance" className="flex flex-col md:flex-row gap-8">
            <TabsList className="md:w-64 flex flex-col h-auto bg-transparent border-r rounded-none p-0 gap-1">
              <TabsTrigger value="appearance" className="w-full justify-start px-4 h-11 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 rounded-lg">
                <Palette className="mr-2 h-4 w-4" /> Appearance
              </TabsTrigger>
              <TabsTrigger value="localization" className="w-full justify-start px-4 h-11 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 rounded-lg">
                <Globe className="mr-2 h-4 w-4" /> Localization
              </TabsTrigger>
              <TabsTrigger value="security" className="w-full justify-start px-4 h-11 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 rounded-lg">
                <Shield className="mr-2 h-4 w-4" /> Security & SSO
              </TabsTrigger>
              <TabsTrigger value="advanced" className="w-full justify-start px-4 h-11 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 rounded-lg">
                <Cpu className="mr-2 h-4 w-4" /> Advanced Ops
              </TabsTrigger>
            </TabsList>
            <div className="flex-1 space-y-6">
              <TabsContent value="appearance" className="m-0 space-y-6 animate-slide-up">
                <Card>
                  <CardHeader>
                    <CardTitle>Theme Configuration</CardTitle>
                    <CardDescription>Select the default UI look and feel for all administrative users.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Primary Color Mode</Label>
                      <Select value={formData.theme} onValueChange={(v) => updateField('theme', v)}>
                        <SelectTrigger><SelectValue placeholder="Select mode" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light Mode</SelectItem>
                          <SelectItem value="dark">Dark Mode</SelectItem>
                          <SelectItem value="system">System Default</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="localization" className="m-0 space-y-6 animate-slide-up">
                <Card>
                  <CardHeader>
                    <CardTitle>Language & Region</CardTitle>
                    <CardDescription>Set the primary language for the member app and backoffice.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Primary Language</Label>
                      <Select value={formData.language} onValueChange={(v) => updateField('language', v)}>
                        <SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English (US)</SelectItem>
                          <SelectItem value="Bahasa">Bahasa Indonesia</SelectItem>
                          <SelectItem value="Mandarin">Mandarin Chinese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="security" className="m-0 space-y-6 animate-slide-up">
                <Card>
                  <CardHeader>
                    <CardTitle>Access Control</CardTitle>
                    <CardDescription>Configure Single Sign-On and data privacy policies.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border">
                      <div className="space-y-0.5">
                        <Label className="text-base">Enable SSO (SAML/OpenID)</Label>
                        <p className="text-xs text-muted-foreground">Force all admin users to authenticate via corporate identity provider.</p>
                      </div>
                      <Switch
                        checked={formData.ssoEnabled === 'on'}
                        onCheckedChange={(checked) => updateField('ssoEnabled', checked ? 'on' : 'off')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Admin Notification Email</Label>
                      <Input
                        value={formData.notificationEmail || ''}
                        onChange={(e) => updateField('notificationEmail', e.target.value)}
                        placeholder="admin@nexus-crm.com"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="advanced" className="m-0 space-y-6 animate-slide-up">
                <Card>
                  <CardHeader>
                    <CardTitle>Operational Engine</CardTitle>
                    <CardDescription>Fine-tune AI and infrastructure parameters.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>OCR Processing Precision</Label>
                      <Select value={formData.ocrPrecision} onValueChange={(v) => updateField('ocrPrecision', v)}>
                        <SelectTrigger><SelectValue placeholder="Select precision" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High (Maximum accuracy, slower)</SelectItem>
                          <SelectItem value="medium">Balanced</SelectItem>
                          <SelectItem value="low">Economy (Fastest)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>In-Venue WiFi SSID</Label>
                      <div className="flex gap-2">
                        <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-slate-500"><Wifi className="h-5 w-5" /></div>
                        <Input
                          value={formData.wifiSsid || ''}
                          onChange={(e) => updateField('wifiSsid', e.target.value)}
                          placeholder="Nexus_Guest_WiFi"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 flex gap-3 text-rose-700 dark:bg-rose-900/10 dark:border-rose-900/20">
                  <AlertTriangle className="h-5 w-5 shrink-0" />
                  <div className="text-xs font-medium">Warning: Changing advanced operational settings may affect the performance of real-time point claims and member authentication.</div>
                </div>
              </TabsContent>
              <div className="flex justify-end pt-4 border-t">
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="bg-indigo-600 hover:bg-indigo-700 h-11 px-8 shadow-indigo-200 disabled:opacity-50"
                >
                  {mutation.isPending ? (
                    <>
                      <Save className="mr-2 h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Save Global Config
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Tabs>
        </form>
      </div>
    </AppLayout>
  );
}