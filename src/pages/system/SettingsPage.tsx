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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import {
  Shield, Globe, Palette, Cpu, Wifi, Save, AlertTriangle, CloudSun,
  Sun, CloudRain, Cloud, Droplets, Mail, Phone, MessageSquare, BookOpen, UserCheck, Eye, EyeOff, Info
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
import { motion, AnimatePresence } from 'framer-motion';
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
      if (['appearance', 'localization', 'advanced'].includes(section)) {
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
    <AppLayout container contentClassName="pb-20">
      <div className="max-w-7xl mx-auto space-y-10 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 dark:border-slate-800 pb-8 gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter text-foreground">Global Configuration</h1>
            <p className="text-muted-foreground font-medium">Enterprise master controls for the Nexus CRM ecosystem.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="h-11 px-6 rounded-xl" onClick={() => navigate('/system/faq')}>Documentation</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 h-11 px-8 rounded-xl shadow-lg shadow-indigo-100 font-bold" onClick={() => handleSave(currentTab)}>
              <Save className="mr-2 h-4 w-4" /> Save Configuration
            </Button>
          </div>
        </div>
        <Tabs value={currentTab} onValueChange={(v) => navigate(`/system/${v}`)} className="flex flex-col md:flex-row gap-12">
          <TabsList className="md:w-64 flex flex-col h-auto bg-transparent border-r border-slate-100 dark:border-slate-800 rounded-none p-0 gap-1 shrink-0">
            <TabsTrigger value="appearance" className="w-full justify-start px-4 h-12 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 rounded-xl transition-all font-bold">
              <Palette className="mr-3 h-4 w-4" /> Appearance
            </TabsTrigger>
            <TabsTrigger value="localization" className="w-full justify-start px-4 h-12 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 rounded-xl transition-all font-bold">
              <Globe className="mr-3 h-4 w-4" /> Localization
            </TabsTrigger>
            <TabsTrigger value="contact" className="w-full justify-start px-4 h-12 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 rounded-xl transition-all font-bold">
              <Mail className="mr-3 h-4 w-4" /> Contact Channels
            </TabsTrigger>
            <TabsTrigger value="weather" className="w-full justify-start px-4 h-12 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 rounded-xl transition-all font-bold">
              <CloudSun className="mr-3 h-4 w-4" /> Weather Intel
            </TabsTrigger>
            <TabsTrigger value="security" className="w-full justify-start px-4 h-12 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 rounded-xl transition-all font-bold">
              <Shield className="mr-3 h-4 w-4" /> Security & SSO
            </TabsTrigger>
            <TabsTrigger value="terms" className="w-full justify-start px-4 h-12 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 rounded-xl transition-all font-bold">
              <BookOpen className="mr-3 h-4 w-4" /> Terms & Conditions
            </TabsTrigger>
            <TabsTrigger value="privacy" className="w-full justify-start px-4 h-12 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 rounded-xl transition-all font-bold">
              <UserCheck className="mr-3 h-4 w-4" /> Privacy Policy
            </TabsTrigger>
            <TabsTrigger value="wifi" className="w-full justify-start px-4 h-12 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 rounded-xl transition-all font-bold">
              <Wifi className="mr-3 h-4 w-4" /> Wifi Config
            </TabsTrigger>
            <TabsTrigger value="advanced" className="w-full justify-start px-4 h-12 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 rounded-xl transition-all font-bold">
              <Cpu className="mr-3 h-4 w-4" /> AI & Operations
            </TabsTrigger>
          </TabsList>
          <div className="flex-1 min-w-0">
            <TabsContent value="appearance" className="m-0 space-y-6 animate-slide-up">
              <Card className="rounded-3xl border-none shadow-soft overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b pb-6">
                  <CardTitle>Branding & Visual Identity</CardTitle>
                  <CardDescription>Customize the interface for the administrative portal.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pt-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="font-bold">UI Theme Mode</Label>
                      <Select value={formData.theme} onValueChange={(v) => updateField('theme', v)}>
                        <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light Mode (Default)</SelectItem>
                          <SelectItem value="dark">Dark Mode</SelectItem>
                          <SelectItem value="system">System Synchronized</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label className="font-bold">Splash Background Color</Label>
                      <div className="flex gap-4">
                        <Input type="color" className="w-12 h-11 p-1 rounded-xl cursor-pointer" value={formData.splashBgColor} onChange={(e) => updateField('splashBgColor', e.target.value)} />
                        <Input value={formData.splashBgColor} className="h-11 rounded-xl font-mono uppercase" onChange={(e) => updateField('splashBgColor', e.target.value)} placeholder="#4F46E5" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="weather" className="m-0 space-y-6 animate-slide-up">
              <Card className="rounded-3xl border-none shadow-soft overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b pb-6">
                  <CardTitle>Weather Intelligence Integration</CardTitle>
                  <CardDescription>Operational context broadcasting based on PIK real-time conditions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pt-8">
                  <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="space-y-1">
                      <Label className="text-base font-bold text-foreground">Enable Intelligence Widget</Label>
                      <p className="text-sm text-muted-foreground font-medium">Broadcast alerts and operational tips to the executive dashboard.</p>
                    </div>
                    <Switch checked={formData.isEnabled} onCheckedChange={(v) => updateField('isEnabled', v)} />
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="font-bold">Location Display Name</Label>
                      <Input value={formData.locationName} className="h-11 rounded-xl" onChange={(e) => updateField('locationName', e.target.value)} />
                    </div>
                    <div className="space-y-3">
                      <Label className="font-bold">Active Condition (Override)</Label>
                      <Select value={formData.activeCondition} onValueChange={(v) => updateField('activeCondition', v)}>
                        <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sunny">Sunny / High UV Intensity</SelectItem>
                          <SelectItem value="rainy">Rainy / Storm Warning</SelectItem>
                          <SelectItem value="cloudy">Cloudy / Low Exposure</SelectItem>
                          <SelectItem value="humid">Humid / Indoor Focus</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-black uppercase text-indigo-600 tracking-widest">Dashboard Preview</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild><Info className="h-3 w-3 text-slate-300 cursor-help" /></TooltipTrigger>
                          <TooltipContent><p className="w-64 text-xs">This is how the widget will appear on the Main Dashboard for all administrators.</p></TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className={cn(
                      "rounded-3xl p-8 text-white shadow-xl bg-gradient-to-r transition-all duration-700 relative overflow-hidden",
                      formData.activeCondition ? WeatherColors[formData.activeCondition] : WeatherColors.sunny
                    )}>
                      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                        <div className="flex items-center gap-6">
                          <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/30 shadow-lg">
                            <WeatherIcon className="h-10 w-10 text-white animate-pulse" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <div className="text-[10px] font-black uppercase tracking-widest opacity-80">{formData.locationName}</div>
                              <Badge className="bg-white/20 text-white border-none text-[8px] h-4">PREVIEW</Badge>
                            </div>
                            <div className="text-3xl font-black">{WEATHER_PRESETS[formData.activeCondition || 'sunny'].condition}</div>
                          </div>
                        </div>
                        <div className="flex-1 max-w-sm bg-black/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                           <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">Automated Recommendation</div>
                           <p className="text-sm font-bold leading-relaxed">{WEATHER_PRESETS[formData.activeCondition || 'sunny'].tips[0]}</p>
                        </div>
                      </div>
                      <div className="absolute top-[-20px] right-[-20px] h-64 w-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="security" className="m-0 space-y-6 animate-slide-up">
              <Card className="rounded-3xl border-none shadow-soft overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b pb-6">
                  <CardTitle>Administrative Security</CardTitle>
                  <CardDescription>Enterprise identity management and SSO protocols.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pt-8">
                  <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100">
                    <div className="space-y-1">
                      <Label className="text-base font-bold">Enforce SAML Single Sign-On</Label>
                      <p className="text-sm text-muted-foreground font-medium">Require identity verification through corporate IDP.</p>
                    </div>
                    <Switch checked={formData.ssoEnabled} onCheckedChange={(v) => updateField('ssoEnabled', v)} />
                  </div>
                  {formData.ssoEnabled && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-6 pt-6 border-t overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Label className="font-bold">SAML Entity ID</Label>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild><Info className="h-3.5 w-3.5 text-slate-300 cursor-help" /></TooltipTrigger>
                                <TooltipContent><p className="w-56 text-xs">The globally unique identifier for your CRM instance in the identity provider.</p></TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <Input value={formData.ssoEntityId} className="h-11 rounded-xl font-mono text-xs" onChange={(e) => updateField('ssoEntityId', e.target.value)} />
                        </div>
                        <div className="space-y-3">
                          <Label className="font-bold">Metadata Endpoint URL</Label>
                          <Input value={formData.ssoMetadataUrl} className="h-11 rounded-xl font-mono text-xs" onChange={(e) => updateField('ssoMetadataUrl', e.target.value)} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="advanced" className="m-0 space-y-6 animate-slide-up">
              <Card className="rounded-3xl border-none shadow-soft overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b pb-6">
                  <CardTitle>AI Operations & Infrastructure</CardTitle>
                  <CardDescription>Fine-tune machine learning and computer vision parameters.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pt-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Label className="font-bold">OCR Precision Mode</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild><Info className="h-3.5 w-3.5 text-slate-300 cursor-help" /></TooltipTrigger>
                          <TooltipContent><p className="w-64 text-xs">High precision increases receipt recognition accuracy but may slightly increase processing latency.</p></TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Select value={formData.ocrPrecision} onValueChange={(v) => updateField('ocrPrecision', v)}>
                      <SelectTrigger className="h-12 rounded-xl text-indigo-600 font-bold border-indigo-100"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High Precision (Commercial Receipts)</SelectItem>
                        <SelectItem value="medium">Balanced Performance</SelectItem>
                        <SelectItem value="low">Resource Optimized</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-800 flex gap-4 text-amber-700 dark:text-amber-400">
                    <AlertTriangle className="h-6 w-6 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold text-sm">Critical Parameter Advisory</p>
                      <p className="text-xs leading-relaxed opacity-90 font-medium">
                        Adjusting AI precision settings will impact point-claim success rates for all mall tenants in real-time. 
                        We recommend performing a small batch test before deploying changes to peak operational hours.
                      </p>
                    </div>
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