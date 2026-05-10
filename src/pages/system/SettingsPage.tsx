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
  Shield, Globe, Palette, Cpu, Wifi, Save, CloudSun,
  Mail, Phone, BookOpen, UserCheck, Eye, EyeOff,
  Image as ImageIcon, Layout, Trash2, Plus, Instagram, Facebook, MessageCircle
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useSystemSettings, useSettingsMutation,
  useContactSettings, useContactMutation,
  useTermsContent, useTermsMutation,
  usePrivacyContent, usePrivacyMutation,
  useWifiSettings, useWifiMutation,
  useWeatherSettings, useWeatherMutation,
  useSplashScreen, useSplashMutation,
  useHeroBanner, useBannerMutation
} from '@/lib/api-hooks';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
export function SettingsPage() {
  const { tab } = useParams();
  const navigate = useNavigate();
  const currentTab = tab || 'appearance';
  const { data: settings } = useSystemSettings();
  const { data: contact } = useContactSettings();
  const { data: terms } = useTermsContent();
  const { data: privacy } = usePrivacyContent();
  const { data: wifi } = useWifiSettings();
  const { data: weather } = useWeatherSettings();
  const { data: splash } = useSplashScreen();
  const { data: banners } = useHeroBanner();
  const settingsMutation = useSettingsMutation();
  const contactMutation = useContactMutation();
  const termsMutation = useTermsMutation();
  const privacyMutation = usePrivacyMutation();
  const wifiMutation = useWifiMutation();
  const weatherMutation = useWeatherMutation();
  const splashMutation = useSplashMutation();
  const bannerMutation = useBannerMutation();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [showWifiPass, setShowWifiPass] = useState(false);
  const [activeTermsTab, setActiveTermsTab] = useState<'edit' | 'preview'>('edit');
  const [activePrivacyTab, setActivePrivacyTab] = useState<'edit' | 'preview'>('edit');
  useEffect(() => {
    if (settings && contact && terms && privacy && wifi && weather && splash && banners) {
      setFormData({
        ...settings,
        ...contact,
        ...weather,
        splashImageUrl: splash.imageUrl,
        splashBgColor: splash.backgroundColor,
        splashDuration: splash.displayDuration,
        bannerEnabled: banners.isEnabled,
        bannersList: banners.banners,
        termsContent: terms.content,
        privacyContent: privacy.content,
        wifiPassword: wifi.password,
        wifiIsVisible: wifi.isVisible,
        language: settings.language || 'English',
        theme: settings.theme || 'system',
        ocrPrecision: settings.ocrPrecision || 'high',
      });
    }
  }, [settings, contact, terms, privacy, wifi, weather, splash, banners]);
  const handleSave = async (section: string) => {
    try {
      if (['appearance', 'localization', 'advanced', 'security'].includes(section)) {
        await settingsMutation.mutateAsync(formData as any);
      } else if (section === 'contact') {
        await contactMutation.mutateAsync(formData as any);
      } else if (section === 'terms') {
        await termsMutation.mutateAsync({ content: formData.termsContent } as any);
      } else if (section === 'privacy') {
        await privacyMutation.mutateAsync({ content: formData.privacyContent } as any);
      } else if (section === 'wifi') {
        await wifiMutation.mutateAsync({ password: formData.wifiPassword, isVisible: formData.wifiIsVisible, ssid: formData.wifiSsid } as any);
      } else if (section === 'weather') {
        await weatherMutation.mutateAsync({
          isEnabled: formData.isEnabled,
          activeCondition: formData.activeCondition,
          locationName: formData.locationName,
          autoRotation: formData.autoRotation
        } as any);
      } else if (section === 'splash') {
        await splashMutation.mutateAsync({
          imageUrl: formData.splashImageUrl,
          backgroundColor: formData.splashBgColor,
          displayDuration: Number(formData.splashDuration)
        } as any);
      } else if (section === 'banner') {
        await bannerMutation.mutateAsync({
          isEnabled: formData.bannerEnabled,
          banners: formData.bannersList
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
  const navItems = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'localization', label: 'Localization', icon: Globe },
    { id: 'splash', label: 'Splash Screen', icon: ImageIcon },
    { id: 'banner', label: 'Hero Banners', icon: Layout },
    { id: 'contact', label: 'Contact Channels', icon: Mail },
    { id: 'weather', label: 'Weather Intel', icon: CloudSun },
    { id: 'security', label: 'SSO Config', icon: Shield },
    { id: 'privacy', label: 'Privacy Policy', icon: UserCheck },
    { id: 'terms', label: 'Terms & Conditions', icon: BookOpen },
    { id: 'wifi', label: 'Wifi Settings', icon: Wifi },
    { id: 'advanced', label: 'AI & OCR', icon: Cpu },
  ];
  return (
    <AppLayout container contentClassName="pb-20">
      <div className="max-w-7xl mx-auto space-y-10 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-8 gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter">System Mastery</h1>
            <p className="text-muted-foreground font-medium">Enterprise controls for the TechEdge Nexus mobile experience.</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700 h-11 px-8 rounded-xl shadow-lg font-bold" onClick={() => handleSave(currentTab)}>
            <Save className="mr-2 h-4 w-4" /> Save Configuration
          </Button>
        </div>
        <Tabs value={currentTab} onValueChange={(v) => navigate(`/system/${v}`)} className="flex flex-col md:flex-row gap-12">
          <TabsList className="md:w-64 flex flex-col h-auto bg-transparent border-r rounded-none p-0 gap-1 shrink-0">
            {navItems.map((t) => (
              <TabsTrigger key={t.id} value={t.id} className="w-full justify-start px-4 h-12 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 rounded-xl transition-all font-bold">
                <t.icon className="mr-3 h-4 w-4" /> {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="flex-1 min-w-0">
            {/* Appearance Tab */}
            <TabsContent value="appearance" className="m-0 space-y-6">
              <Card className="rounded-3xl border-none shadow-soft overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b"><CardTitle>Global Themes</CardTitle></CardHeader>
                <CardContent className="pt-8 space-y-4">
                  <Label className="font-bold">System Theme</Label>
                  <Select value={formData.theme} onValueChange={(v) => updateField('theme', v)}>
                    <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light Mode</SelectItem>
                      <SelectItem value="dark">Dark Mode</SelectItem>
                      <SelectItem value="system">Follow System</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </TabsContent>
            {/* Localization Tab */}
            <TabsContent value="localization" className="m-0 space-y-6">
              <Card className="rounded-3xl border-none shadow-soft overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b"><CardTitle>Language & Region</CardTitle></CardHeader>
                <CardContent className="pt-8 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-bold">Default Display Language</Label>
                      <Select value={formData.language} onValueChange={(v) => updateField('language', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English (US)</SelectItem>
                          <SelectItem value="Indonesian">Bahasa Indonesia</SelectItem>
                          <SelectItem value="Mandarin">Mandarin (Simplified)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Primary Timezone</Label>
                      <Select defaultValue="Asia/Jakarta">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Jakarta">Jakarta (GMT+7)</SelectItem>
                          <SelectItem value="Asia/Singapore">Singapore (GMT+8)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            {/* Splash Screen Tab */}
            <TabsContent value="splash" className="m-0 space-y-6">
              <Card className="rounded-3xl border-none shadow-soft overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b">
                  <CardTitle>Splash Screen Editor</CardTitle>
                  <CardDescription>Customize the mobile app entry experience.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-8 pt-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="font-bold">Branding Color</Label>
                      <div className="flex gap-3">
                        <Input type="color" className="w-14 h-11 p-1" value={formData.splashBgColor} onChange={(e) => updateField('splashBgColor', e.target.value)} />
                        <Input value={formData.splashBgColor} onChange={(e) => updateField('splashBgColor', e.target.value)} className="font-mono" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Logo/Image URL</Label>
                      <Input value={formData.splashImageUrl} onChange={(e) => updateField('splashImageUrl', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Display Duration (ms)</Label>
                      <Input type="number" value={formData.splashDuration} onChange={(e) => updateField('splashDuration', e.target.value)} />
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <Label className="text-xs uppercase font-bold text-muted-foreground">Mobile Preview</Label>
                    <div className="relative w-64 aspect-[9/19] rounded-[3rem] border-[8px] border-slate-900 shadow-2xl overflow-hidden flex items-center justify-center" style={{ backgroundColor: formData.splashBgColor }}>
                      <img src={formData.splashImageUrl} alt="Splash Logo" className="w-32 h-auto floating" />
                      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                        <span className="text-[10px] text-white/50 font-bold tracking-widest">LOADING...</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            {/* Hero Banner Tab */}
            <TabsContent value="banner" className="m-0 space-y-6">
              <Card className="rounded-3xl border-none shadow-soft overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Home Hero Banners</CardTitle>
                    <CardDescription>Manage the main carousel on the member app home screen.</CardDescription>
                  </div>
                  <Switch checked={formData.bannerEnabled} onCheckedChange={(v) => updateField('bannerEnabled', v)} />
                </CardHeader>
                <CardContent className="pt-8 space-y-4">
                  {formData.bannersList?.map((banner: any, idx: number) => (
                    <div key={banner.id} className="p-4 rounded-2xl border bg-slate-50/50 space-y-4 relative group">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="md:col-span-1 aspect-[16/9] rounded-xl overflow-hidden bg-slate-200">
                          <img src={banner.imageUrl} alt="Banner" className="w-full h-full object-cover" />
                        </div>
                        <div className="md:col-span-2 space-y-3">
                          <Input placeholder="Banner Title" value={banner.title} onChange={(e) => {
                            const next = [...formData.bannersList];
                            next[idx].title = e.target.value;
                            updateField('bannersList', next);
                          }} />
                          <Input placeholder="Subtitle" value={banner.subtitle} onChange={(e) => {
                            const next = [...formData.bannersList];
                            next[idx].subtitle = e.target.value;
                            updateField('bannersList', next);
                          }} />
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => {
                          updateField('bannersList', formData.bannersList.filter((_: any, i: number) => i !== idx));
                        }}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full border-dashed h-12" onClick={() => {
                    updateField('bannersList', [...formData.bannersList, { id: crypto.randomUUID(), title: '', subtitle: '', imageUrl: '', order: formData.bannersList.length + 1 }]);
                  }}><Plus className="mr-2 h-4 w-4" /> Add New Banner Slide</Button>
                </CardContent>
              </Card>
            </TabsContent>
            {/* Contact Channels Tab */}
            <TabsContent value="contact" className="m-0 space-y-6">
              <Card className="rounded-3xl border-none shadow-soft overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b"><CardTitle>Support Channels</CardTitle></CardHeader>
                <CardContent className="pt-8 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><Mail className="h-3 w-3" /> Support Email</Label>
                      <Input value={formData.email} onChange={(e) => updateField('email', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><Phone className="h-3 w-3" /> Customer Hotline</Label>
                      <Input value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><MessageCircle className="h-3 w-3" /> WhatsApp Contact</Label>
                      <Input value={formData.whatsapp} onChange={(e) => updateField('whatsapp', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><Instagram className="h-3 w-3" /> Instagram URL</Label>
                      <Input value={formData.instagramUrl} onChange={(e) => updateField('instagramUrl', e.target.value)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            {/* Weather Intelligence Tab */}
            <TabsContent value="weather" className="m-0 space-y-6">
              <Card className="rounded-3xl border-none shadow-soft overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b flex flex-row items-center justify-between">
                  <div><CardTitle>Weather Intelligence</CardTitle></div>
                  <Switch checked={formData.isEnabled} onCheckedChange={(v) => updateField('isEnabled', v)} />
                </CardHeader>
                <CardContent className="pt-8 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-bold">Active Override Condition</Label>
                      <Select value={formData.activeCondition} onValueChange={(v) => updateField('activeCondition', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sunny">Sunny / Clear</SelectItem>
                          <SelectItem value="rainy">Rainy / Stormy</SelectItem>
                          <SelectItem value="cloudy">Overcast / Cloudy</SelectItem>
                          <SelectItem value="humid">High Humidity</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Display Location Name</Label>
                      <Input value={formData.locationName} onChange={(e) => updateField('locationName', e.target.value)} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="space-y-0.5">
                      <Label className="font-bold">Auto-Rotate Tips</Label>
                      <p className="text-xs text-muted-foreground font-medium">Cycle through weather recommendations automatically.</p>
                    </div>
                    <Switch checked={formData.autoRotation} onCheckedChange={(v) => updateField('autoRotation', v)} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            {/* Security / SSO Tab */}
            <TabsContent value="security" className="m-0 space-y-6">
              <Card className="rounded-3xl border-none shadow-soft overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b flex flex-row items-center justify-between">
                  <div><CardTitle>Sedayu SSO Integration</CardTitle></div>
                  <Switch checked={formData.ssoEnabled} onCheckedChange={(v) => updateField('ssoEnabled', v)} />
                </CardHeader>
                <CardContent className="pt-8 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="font-bold">SAML Entity ID</Label>
                      <Input value={formData.ssoEntityId} onChange={(e) => updateField('ssoEntityId', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Identity Provider Metadata URL</Label>
                      <Input value={formData.ssoMetadataUrl} onChange={(e) => updateField('ssoMetadataUrl', e.target.value)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            {/* Privacy Policy Tab */}
            <TabsContent value="privacy" className="m-0 space-y-6">
              <Card className="rounded-3xl border-none shadow-soft overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b flex flex-row items-center justify-between">
                  <CardTitle>Privacy Policy</CardTitle>
                  <div className="flex bg-muted p-1 rounded-lg">
                    <Button variant={activePrivacyTab === 'edit' ? 'secondary' : 'ghost'} size="sm" onClick={() => setActivePrivacyTab('edit')}>Edit</Button>
                    <Button variant={activePrivacyTab === 'preview' ? 'secondary' : 'ghost'} size="sm" onClick={() => setActivePrivacyTab('preview')}>Preview</Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-8">
                  {activePrivacyTab === 'edit' ? (
                    <Textarea value={formData.privacyContent} onChange={(e) => updateField('privacyContent', e.target.value)} className="min-h-[500px] font-mono text-sm" />
                  ) : (
                    <div className="prose prose-slate dark:prose-invert max-w-none p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl whitespace-pre-wrap">
                      {formData.privacyContent}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            {/* Terms Tab */}
            <TabsContent value="terms" className="m-0 space-y-6">
              <Card className="rounded-3xl border-none shadow-soft overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b flex flex-row items-center justify-between">
                  <CardTitle>Terms & Conditions</CardTitle>
                  <div className="flex bg-muted p-1 rounded-lg">
                    <Button variant={activeTermsTab === 'edit' ? 'secondary' : 'ghost'} size="sm" onClick={() => setActiveTermsTab('edit')}>Edit</Button>
                    <Button variant={activeTermsTab === 'preview' ? 'secondary' : 'ghost'} size="sm" onClick={() => setActiveTermsTab('preview')}>Preview</Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-8">
                  {activeTermsTab === 'edit' ? (
                    <Textarea value={formData.termsContent} onChange={(e) => updateField('termsContent', e.target.value)} className="min-h-[500px] font-mono text-sm" />
                  ) : (
                    <div className="prose prose-slate dark:prose-invert max-w-none p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl whitespace-pre-wrap">
                      {formData.termsContent}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            {/* Wifi Tab */}
            <TabsContent value="wifi" className="m-0 space-y-6">
              <Card className="rounded-3xl border-none shadow-soft overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b"><CardTitle>Guest Wifi Access</CardTitle></CardHeader>
                <CardContent className="space-y-6 pt-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label className="font-bold">SSID (Network Name)</Label>
                      <Input value={formData.wifiSsid} onChange={(e) => updateField('wifiSsid', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">WPA2 Password</Label>
                      <div className="relative">
                        <Input type={showWifiPass ? "text" : "password"} value={formData.wifiPassword} onChange={(e) => updateField('wifiPassword', e.target.value)} />
                        <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={() => setShowWifiPass(!showWifiPass)}>
                          {showWifiPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="space-y-0.5"><Label className="font-bold">Broadcast SSID</Label></div>
                    <Switch checked={formData.wifiIsVisible} onCheckedChange={(v) => updateField('wifiIsVisible', v)} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            {/* AI & OCR Tab */}
            <TabsContent value="advanced" className="m-0 space-y-6">
              <Card className="rounded-3xl border-none shadow-soft overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b"><CardTitle>AI & Engine Config</CardTitle></CardHeader>
                <CardContent className="pt-8 space-y-6">
                  <div className="space-y-2">
                    <Label className="font-bold">OCR Scan Precision</Label>
                    <Select value={formData.ocrPrecision} onValueChange={(v) => updateField('ocrPrecision', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">Enterprise High (Slowest)</SelectItem>
                        <SelectItem value="medium">Balanced (Recommended)</SelectItem>
                        <SelectItem value="low">Performance (Fastest)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">System Notification Email</Label>
                    <Input value={formData.notificationEmail} onChange={(e) => updateField('notificationEmail', e.target.value)} />
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