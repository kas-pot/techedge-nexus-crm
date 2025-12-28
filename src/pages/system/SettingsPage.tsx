import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Shield, Globe, Palette, Cpu, Wifi, Save, AlertTriangle, Monitor, Upload, 
  Mail, Phone, MessageSquare, BookOpen, UserCheck, Eye, EyeOff, CloudSun,
  Sun, CloudRain, Cloud, Droplets
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useSystemSettings, useSettingsMutation,
  useContactSettings, useContactMutation,
  useTermsContent, useTermsMutation,
  usePrivacyContent, usePrivacyMutation,
  useWifiSettings, useWifiMutation,
  useWeatherSettings, useWeatherMutation
} from '@/lib/api-hooks';
import { toast } from 'sonner';
import { WEATHER_PRESETS } from '@shared/mock-data';
import { cn } from '@/lib/utils';
export function SettingsPage() {
  const { tab } = useParams();
  const navigate = useNavigate();
  const currentTab = tab || 'appearance';
  const { data: settings, isLoading: loadingSettings } = useSystemSettings();
  const { data: contact, isLoading: loadingContact } = useContactSettings();
  const { data: terms, isLoading: loadingTerms } = useTermsContent();
  const { data: privacy, isLoading: loadingPrivacy } = usePrivacyContent();
  const { data: wifi, isLoading: loadingWifi } = useWifiSettings();
  const { data: weather, isLoading: loadingWeather } = useWeatherSettings();
  const settingsMutation = useSettingsMutation();
  const contactMutation = useContactMutation();
  const termsMutation = useTermsMutation();
  const privacyMutation = usePrivacyMutation();
  const wifiMutation = useWifiMutation();
  const weatherMutation = useWeatherMutation();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [showWifiPass, setShowWifiPass] = useState(false);
  useEffect(() => {
    if (settings && contact && terms && privacy && wifi && weather) {
      setFormData({
        ...settings,
        ...contact,
        ...weather,
        termsContent: terms.content,
        privacyContent: privacy.content,
        wifiPassword: wifi.password,
        wifiIsVisible: wifi.isVisible,
        language: settings.language || 'English',
        theme: settings.theme || 'system',
        ocrPrecision: settings.ocrPrecision || 'high',
      });
    }
  }, [settings, contact, terms, privacy, wifi, weather]);
  const handleSave = async (section: string) => {
    try {
      if (section === 'appearance' || section === 'localization' || section === 'advanced') {
        await settingsMutation.mutateAsync(formData as any);
      } else if (section === 'contact') {
        await contactMutation.mutateAsync(formData as any);
      } else if (section === 'terms') {
        await termsMutation.mutateAsync({ content: formData.termsContent } as any);
      } else if (section === 'privacy') {
        await privacyMutation.mutateAsync({ content: formData.privacyContent } as any);
      } else if (section === 'wifi') {
        await wifiMutation.mutateAsync({ password: formData.wifiPassword, isVisible: formData.wifiIsVisible } as any);
      } else if (section === 'weather') {
        await weatherMutation.mutateAsync({ 
          isEnabled: formData.isEnabled, 
          activeCondition: formData.activeCondition,
          locationName: formData.locationName,
          autoRotation: formData.autoRotation
        } as any);
      }
      toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} settings updated`);
    } catch (err) {
      toast.error("Failed to save changes");
    }
  };
  const updateField = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };
  if (loadingSettings || loadingContact || loadingTerms || loadingPrivacy || loadingWifi || loadingWeather) {
    return (
      <AppLayout container>
        <div className="space-y-6">
          <div className="h-20 w-full bg-muted/20 animate-pulse rounded-xl" />
          <div className="flex gap-8">
            <div className="w-64 h-96 bg-muted/20 animate-pulse rounded-xl" />
            <div className="flex-1 h-96 bg-muted/20 animate-pulse rounded-xl" />
          </div>
        </div>
      </AppLayout>
    );
  }
  const WeatherIcon = formData.activeCondition === 'sunny' ? Sun : 
                    formData.activeCondition === 'rainy' ? CloudRain : 
                    formData.activeCondition === 'cloudy' ? Cloud : Droplets;
  const WeatherColors = {
    sunny: "from-amber-400 to-orange-600",
    rainy: "from-indigo-500 to-blue-700",
    cloudy: "from-slate-400 to-slate-600",
    humid: "from-emerald-400 to-teal-600",
  };
  return (
    <AppLayout container>
      <div className="space-y-8 animate-fade-in">
        <div className="flex justify-between items-center border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Global Configuration</h1>
            <p className="text-muted-foreground">Master environment controls for the Nexus CRM ecosystem.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/system/faq')}>View Documentation</Button>
            <Button className="bg-indigo-600 shadow-indigo-200" onClick={() => handleSave(currentTab)}>
              <Save className="mr-2 h-4 w-4" /> Save Configuration
            </Button>
          </div>
        </div>
        <Tabs value={currentTab} onValueChange={(v) => navigate(`/system/${v}`)} className="flex flex-col md:flex-row gap-8">
          <TabsList className="md:w-64 flex flex-col h-auto bg-transparent border-r rounded-none p-0 gap-1 shrink-0">
            <TabsTrigger value="appearance" className="w-full justify-start px-4 h-11 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 rounded-lg">
              <Palette className="mr-2 h-4 w-4" /> Appearance
            </TabsTrigger>
            <TabsTrigger value="localization" className="w-full justify-start px-4 h-11 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 rounded-lg">
              <Globe className="mr-2 h-4 w-4" /> Localization
            </TabsTrigger>
            <TabsTrigger value="contact" className="w-full justify-start px-4 h-11 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 rounded-lg">
              <Mail className="mr-2 h-4 w-4" /> Contact Channels
            </TabsTrigger>
            <TabsTrigger value="weather" className="w-full justify-start px-4 h-11 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 rounded-lg">
              <CloudSun className="mr-2 h-4 w-4" /> Weather Intel
            </TabsTrigger>
            <TabsTrigger value="security" className="w-full justify-start px-4 h-11 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 rounded-lg">
              <Shield className="mr-2 h-4 w-4" /> Security & SSO
            </TabsTrigger>
            <TabsTrigger value="terms" className="w-full justify-start px-4 h-11 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 rounded-lg">
              <BookOpen className="mr-2 h-4 w-4" /> Terms & Conditions
            </TabsTrigger>
            <TabsTrigger value="privacy" className="w-full justify-start px-4 h-11 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 rounded-lg">
              <UserCheck className="mr-2 h-4 w-4" /> Privacy Policy
            </TabsTrigger>
            <TabsTrigger value="wifi" className="w-full justify-start px-4 h-11 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 rounded-lg">
              <Wifi className="mr-2 h-4 w-4" /> Wifi Config
            </TabsTrigger>
            <TabsTrigger value="advanced" className="w-full justify-start px-4 h-11 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 rounded-lg">
              <Cpu className="mr-2 h-4 w-4" /> AI & Operations
            </TabsTrigger>
          </TabsList>
          <div className="flex-1 min-w-0">
            <TabsContent value="appearance" className="m-0 space-y-6 animate-slide-up">
              <Card>
                <CardHeader>
                  <CardTitle>Theme & Branding</CardTitle>
                  <CardDescription>Configure the visual experience for administrators.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>UI Theme Mode</Label>
                    <Select value={formData.theme} onValueChange={(v) => updateField('theme', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light Mode</SelectItem>
                        <SelectItem value="dark">Dark Mode</SelectItem>
                        <SelectItem value="system">System Default</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Splash Background Color</Label>
                    <div className="flex gap-3">
                      <Input type="color" className="w-12 h-10 p-1" value={formData.splashBgColor} onChange={(e) => updateField('splashBgColor', e.target.value)} />
                      <Input value={formData.splashBgColor} onChange={(e) => updateField('splashBgColor', e.target.value)} placeholder="#HEX" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="localization" className="m-0 space-y-6 animate-slide-up">
              <Card>
                <CardHeader>
                  <CardTitle>Regional Settings</CardTitle>
                  <CardDescription>Configure primary language and localization parameters.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>System Language</Label>
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
            <TabsContent value="weather" className="m-0 space-y-6 animate-slide-up">
              <Card>
                <CardHeader>
                  <CardTitle>Weather Intelligence Integration</CardTitle>
                  <CardDescription>Manage PIK location-based operational context on the dashboard.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border">
                    <div className="space-y-1">
                      <Label className="text-base font-bold">Enable Dashboard Widget</Label>
                      <p className="text-xs text-muted-foreground">Show real-time weather alerts and recommendations to admins.</p>
                    </div>
                    <Switch checked={formData.isEnabled} onCheckedChange={(v) => updateField('isEnabled', v)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Location Label</Label>
                      <Input value={formData.locationName} onChange={(e) => updateField('locationName', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Active Preset (Manual Override)</Label>
                      <Select value={formData.activeCondition} onValueChange={(v) => updateField('activeCondition', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sunny">Sunny / High UV</SelectItem>
                          <SelectItem value="rainy">Rainy / Storm</SelectItem>
                          <SelectItem value="cloudy">Cloudy / Cool</SelectItem>
                          <SelectItem value="humid">Humid / Indoor Focus</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4 pt-4 border-t">
                    <Label className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Dashboard Preview</Label>
                    <div className={cn(
                      "rounded-2xl p-6 text-white shadow-lg bg-gradient-to-r transition-all duration-500",
                      formData.activeCondition ? WeatherColors[formData.activeCondition] : WeatherColors.sunny
                    )}>
                      <div className="flex items-center gap-4">
                        <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl border border-white/20">
                          <WeatherIcon className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">{formData.locationName}</div>
                          <div className="text-xl font-black">{WEATHER_PRESETS[formData.activeCondition || 'sunny'].condition}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="contact" className="m-0 space-y-6 animate-slide-up">
              <Card>
                <CardHeader>
                  <CardTitle>Corporate Contact Channels</CardTitle>
                  <CardDescription>Public contact details displayed in the member application.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> Support Email</Label>
                      <Input value={formData.email} onChange={(e) => updateField('email', e.target.value)} placeholder="pik.experience@agungsedyu.com" />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> Hotline Number</Label>
                      <Input value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="+62..." />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><MessageSquare className="h-3.5 w-3.5" /> WhatsApp Business</Label>
                      <Input value={formData.whatsapp} onChange={(e) => updateField('whatsapp', e.target.value)} placeholder="+62..." />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><Globe className="h-3.5 w-3.5" /> Website URL</Label>
                      <Input value={formData.websiteUrl} onChange={(e) => updateField('websiteUrl', e.target.value)} placeholder="https://..." />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="security" className="m-0 space-y-6 animate-slide-up">
              <Card>
                <CardHeader>
                  <CardTitle>Access & Authentication</CardTitle>
                  <CardDescription>Manage SSO and administrative security notifications.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border">
                    <div className="space-y-1">
                      <Label className="text-base">Force SAML Single Sign-On</Label>
                      <p className="text-xs text-muted-foreground">Restrict login to corporate IDP authorized users.</p>
                    </div>
                    <Switch checked={formData.ssoEnabled} onCheckedChange={(v) => updateField('ssoEnabled', v)} />
                  </div>
                  {formData.ssoEnabled && (
                    <div className="space-y-4 pt-2 border-t">
                      <div className="space-y-2">
                        <Label>SAML Entity ID</Label>
                        <Input value={formData.ssoEntityId} onChange={(e) => updateField('ssoEntityId', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Metadata URL</Label>
                        <Input value={formData.ssoMetadataUrl} onChange={(e) => updateField('ssoMetadataUrl', e.target.value)} />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="terms" className="m-0 space-y-6 animate-slide-up">
              <Card>
                <CardHeader>
                  <CardTitle>Program Terms & Conditions</CardTitle>
                  <CardDescription>Legally binding membership agreement text.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    className="min-h-[500px] font-mono text-sm leading-relaxed"
                    value={formData.termsContent}
                    onChange={(e) => updateField('termsContent', e.target.value)}
                  />
                  <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-100 flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-indigo-600 mt-0.5" />
                    <p className="text-xs text-indigo-700">Changing these terms requires member notification via push or email campaigns to remain compliant with local regulations.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="privacy" className="m-0 space-y-6 animate-slide-up">
              <Card>
                <CardHeader>
                  <CardTitle>Data Privacy Policy</CardTitle>
                  <CardDescription>Transparency regarding member data collection and usage.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    className="min-h-[500px] font-mono text-sm leading-relaxed"
                    value={formData.privacyContent}
                    onChange={(e) => updateField('privacyContent', e.target.value)}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="wifi" className="m-0 space-y-6 animate-slide-up">
              <Card>
                <CardHeader>
                  <CardTitle>Venue Wifi Credentials</CardTitle>
                  <CardDescription>Manage guest network details across physical locations.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Network SSID</Label>
                    <Input value={formData.wifiSsid} onChange={(e) => updateField('wifiSsid', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Guest Password</Label>
                    <div className="relative">
                      <Input
                        type={showWifiPass ? "text" : "password"}
                        value={formData.wifiPassword}
                        onChange={(e) => updateField('wifiPassword', e.target.value)}
                        className="pr-10"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowWifiPass(!showWifiPass)}
                      >
                        {showWifiPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border">
                    <div className="space-y-1">
                      <Label className="text-base">Broadcast Network</Label>
                      <p className="text-xs text-muted-foreground">Toggle visibility in member application dashboard.</p>
                    </div>
                    <Switch checked={formData.wifiIsVisible} onCheckedChange={(v) => updateField('wifiIsVisible', v)} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="advanced" className="m-0 space-y-6 animate-slide-up">
              <Card>
                <CardHeader>
                  <CardTitle>AI & Infrastructure</CardTitle>
                  <CardDescription>Manage processing parameters for OCR and Point Claims.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>OCR Precision Mode</Label>
                    <Select value={formData.ocrPrecision} onValueChange={(v) => updateField('ocrPrecision', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High Precision (Best for Receipts)</SelectItem>
                        <SelectItem value="medium">Balanced</SelectItem>
                        <SelectItem value="low">Performance Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-3 text-amber-700">
                    <AlertTriangle className="h-5 w-5 shrink-0" />
                    <p className="text-xs font-medium">Changing AI parameters will affect successful point claim rates in real-time across all active mall venues.</p>
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