import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Globe, Palette, Cpu, Wifi, Save, AlertTriangle, Monitor, Upload, Image as ImageIcon } from 'lucide-react';
import { useSystemSettings, useSettingsMutation } from '@/lib/api-hooks';
import { toast } from 'sonner';
export function SettingsPage() {
  const { data: settings, isLoading } = useSystemSettings();
  const mutation = useSettingsMutation();
  const [formData, setFormData] = useState<Record<string, any>>({});
  useEffect(() => {
    if (settings) {
      setFormData({
        theme: settings.theme || 'system',
        language: settings.language || 'English',
        ssoEnabled: settings.ssoEnabled || false,
        ssoEntityId: settings.ssoEntityId || '',
        ssoMetadataUrl: settings.ssoMetadataUrl || '',
        notificationEmail: settings.notificationEmail || '',
        ocrPrecision: settings.ocrPrecision || 'high',
        wifiSsid: settings.wifiSsid || '',
        splashBgColor: settings.splashBgColor || '#4F46E5',
      });
    }
  }, [settings]);
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutation.mutateAsync(formData);
      toast.success("Global configuration updated successfully");
    } catch (err) {
      toast.error("Failed to save settings");
    }
  };
  const updateField = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };
  if (isLoading) return <AppLayout container><div className="h-96 animate-pulse bg-muted/20 rounded-xl" /></AppLayout>;
  return (
    <AppLayout container>
      <div className="space-y-8 animate-fade-in">
        <div className="flex justify-between items-center border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Global System Settings</h1>
            <p className="text-muted-foreground">Master configuration for the Nexus CRM enterprise environment.</p>
          </div>
          <Button onClick={handleSave} disabled={mutation.isPending} className="bg-indigo-600 h-11 px-8 shadow-indigo-200">
            {mutation.isPending ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Global Config</>}
          </Button>
        </div>
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
            <TabsTrigger value="splash" className="w-full justify-start px-4 h-11 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 rounded-lg">
              <Monitor className="mr-2 h-4 w-4" /> Splash Screen
            </TabsTrigger>
            <TabsTrigger value="advanced" className="w-full justify-start px-4 h-11 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 rounded-lg">
              <Cpu className="mr-2 h-4 w-4" /> AI & OCR Ops
            </TabsTrigger>
          </TabsList>
          <div className="flex-1 space-y-6">
            <TabsContent value="appearance" className="m-0 space-y-6 animate-slide-up">
              <Card>
                <CardHeader><CardTitle>Theme Configuration</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Primary Color Mode</Label>
                    <Select value={formData.theme} onValueChange={(v) => updateField('theme', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
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
                <CardHeader><CardTitle>Language & Region</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Primary System Language</Label>
                    <Select value={formData.language} onValueChange={(v) => updateField('language', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English (US)</SelectItem>
                        <SelectItem value="Bahasa">Bahasa Indonesia</SelectItem>
                        <SelectItem value="Mandarin">Mandarin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="security" className="m-0 space-y-6 animate-slide-up">
              <Card>
                <CardHeader><CardTitle>Access Control & SSO</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border">
                    <div className="space-y-0.5">
                      <Label className="text-base">Enable SAML Single Sign-On</Label>
                      <p className="text-xs text-muted-foreground">Force administrative users through corporate IDP.</p>
                    </div>
                    <Switch checked={formData.ssoEnabled} onCheckedChange={(v) => updateField('ssoEnabled', v)} />
                  </div>
                  {formData.ssoEnabled && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                      <div className="space-y-2">
                        <Label>Entity ID (Issuer)</Label>
                        <Input value={formData.ssoEntityId} onChange={(e) => updateField('ssoEntityId', e.target.value)} placeholder="nexus-crm-idp" />
                      </div>
                      <div className="space-y-2">
                        <Label>Identity Provider Metadata URL</Label>
                        <Input value={formData.ssoMetadataUrl} onChange={(e) => updateField('ssoMetadataUrl', e.target.value)} placeholder="https://idp.enterprise.com/metadata" />
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>Security Notification Email</Label>
                    <Input value={formData.notificationEmail} onChange={(e) => updateField('notificationEmail', e.target.value)} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="splash" className="m-0 space-y-6 animate-slide-up">
              <Card>
                <CardHeader><CardTitle>Member App Splash Screen</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Background Color</Label>
                        <div className="flex gap-2">
                          <Input type="color" className="w-12 h-10 p-1" value={formData.splashBgColor} onChange={(e) => updateField('splashBgColor', e.target.value)} />
                          <Input value={formData.splashBgColor} onChange={(e) => updateField('splashBgColor', e.target.value)} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Branding Image</Label>
                        <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-2 hover:bg-slate-50 cursor-pointer">
                          <Upload className="h-8 w-8 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">PNG, SVG (Max 2MB)</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-100 rounded-3xl p-8 flex items-center justify-center relative overflow-hidden aspect-[9/16] shadow-inner max-w-[240px] mx-auto border-8 border-slate-900">
                      <div className="absolute inset-0" style={{ backgroundColor: formData.splashBgColor }} />
                      <div className="z-10 text-white font-bold text-4xl italic">NEXUS</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="advanced" className="m-0 space-y-6 animate-slide-up">
              <Card>
                <CardHeader><CardTitle>AI & Infrastructure</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>OCR Precision Mode</Label>
                    <Select value={formData.ocrPrecision} onValueChange={(v) => updateField('ocrPrecision', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High Precision (Best for Receipts)</SelectItem>
                        <SelectItem value="medium">Balanced</SelectItem>
                        <SelectItem value="low">Performance (Faster)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Venue WiFi Network Name (SSID)</Label>
                    <div className="flex gap-2">
                      <div className="bg-slate-100 p-2 rounded-lg"><Wifi className="h-5 w-5 text-indigo-600" /></div>
                      <Input value={formData.wifiSsid} onChange={(e) => updateField('wifiSsid', e.target.value)} />
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-3 text-amber-700">
                    <AlertTriangle className="h-5 w-5 shrink-0" />
                    <p className="text-xs font-medium">Changing AI processing parameters will affect the real-time point claim success rate across all venues.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </AppLayout>
  );
}