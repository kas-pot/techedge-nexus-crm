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
  Image as ImageIcon, Layout, Trash2, Plus, Share2, MessageCircle, Clock, CheckCircle2
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useSystemSettings, useSettingsMutation,
  useContactSettings, useContactMutation,
  useTermsContent, useTermsMutation,
  usePrivacyContent, usePrivacyMutation,
  useWifiSettings, useWifiMutation,
  useWeatherSettings, useWeatherMutation,
  useSplashScreen, useSplashMutation,
  useHeroBanner, useBannerMutation,
  useLocalizationSettings, useLocalizationMutation,
} from '@/lib/api-hooks';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const TIMEZONES = [
  { group: 'Europa', options: [
    { value: 'Europe/Amsterdam', label: 'Amsterdam, Nederland (CET/CEST)' },
    { value: 'Europe/Brussels', label: 'Brussel, België (CET/CEST)' },
    { value: 'Europe/Berlin', label: 'Berlijn, Duitsland (CET/CEST)' },
    { value: 'Europe/Paris', label: 'Parijs, Frankrijk (CET/CEST)' },
    { value: 'Europe/Rome', label: 'Rome, Italië (CET/CEST)' },
    { value: 'Europe/Madrid', label: 'Madrid, Spanje (CET/CEST)' },
    { value: 'Europe/Zurich', label: 'Zürich, Zwitserland (CET/CEST)' },
    { value: 'Europe/Vienna', label: 'Wenen, Oostenrijk (CET/CEST)' },
    { value: 'Europe/Warsaw', label: 'Warschau, Polen (CET/CEST)' },
    { value: 'Europe/Stockholm', label: 'Stockholm, Zweden (CET/CEST)' },
    { value: 'Europe/Copenhagen', label: 'Kopenhagen, Denemarken (CET/CEST)' },
    { value: 'Europe/Oslo', label: 'Oslo, Noorwegen (CET/CEST)' },
    { value: 'Europe/London', label: 'Londen, VK (GMT/BST)' },
    { value: 'Europe/Lisbon', label: 'Lissabon, Portugal (WET/WEST)' },
    { value: 'Europe/Helsinki', label: 'Helsinki, Finland (EET/EEST)' },
    { value: 'Europe/Athens', label: 'Athene, Griekenland (EET/EEST)' },
    { value: 'Europe/Bucharest', label: 'Boekarest, Roemenië (EET/EEST)' },
    { value: 'Europe/Istanbul', label: 'Istanbul, Turkije (TRT)' },
    { value: 'Europe/Moscow', label: 'Moskou, Rusland (MSK)' },
  ]},
  { group: 'Afrika', options: [
    { value: 'Africa/Casablanca', label: 'Casablanca, Marokko (WET)' },
    { value: 'Africa/Cairo', label: 'Caïro, Egypte (EET)' },
    { value: 'Africa/Johannesburg', label: 'Johannesburg, Zuid-Afrika (SAST)' },
    { value: 'Africa/Lagos', label: 'Lagos, Nigeria (WAT)' },
    { value: 'Africa/Nairobi', label: 'Nairobi, Kenia (EAT)' },
  ]},
  { group: 'Midden-Oosten', options: [
    { value: 'Asia/Dubai', label: 'Dubai, VAE (GST)' },
    { value: 'Asia/Riyadh', label: 'Riyad, Saudi-Arabië (AST)' },
    { value: 'Asia/Tehran', label: 'Teheran, Iran (IRST)' },
  ]},
  { group: 'Azië', options: [
    { value: 'Asia/Karachi', label: 'Karachi, Pakistan (PKT)' },
    { value: 'Asia/Kolkata', label: 'Mumbai / Delhi, India (IST)' },
    { value: 'Asia/Dhaka', label: 'Dhaka, Bangladesh (BST)' },
    { value: 'Asia/Bangkok', label: 'Bangkok, Thailand (ICT)' },
    { value: 'Asia/Jakarta', label: 'Jakarta, Indonesië (WIB)' },
    { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
    { value: 'Asia/Shanghai', label: 'Peking / Shanghai, China (CST)' },
    { value: 'Asia/Tokyo', label: 'Tokio, Japan (JST)' },
    { value: 'Asia/Seoul', label: 'Seoul, Zuid-Korea (KST)' },
    { value: 'Asia/Taipei', label: 'Taipei, Taiwan (CST)' },
  ]},
  { group: 'Australazië', options: [
    { value: 'Australia/Perth', label: 'Perth, Australië (AWST)' },
    { value: 'Australia/Adelaide', label: 'Adelaide, Australië (ACST)' },
    { value: 'Australia/Sydney', label: 'Sydney, Australië (AEST)' },
    { value: 'Pacific/Auckland', label: 'Auckland, Nieuw-Zeeland (NZST)' },
  ]},
  { group: 'Amerika', options: [
    { value: 'America/New_York', label: 'New York, VS (EST/EDT)' },
    { value: 'America/Chicago', label: 'Chicago, VS (CST/CDT)' },
    { value: 'America/Denver', label: 'Denver, VS (MST/MDT)' },
    { value: 'America/Los_Angeles', label: 'Los Angeles, VS (PST/PDT)' },
    { value: 'America/Sao_Paulo', label: 'São Paulo, Brazilië (BRT)' },
    { value: 'America/Argentina/Buenos_Aires', label: 'Buenos Aires, Argentinië (ART)' },
    { value: 'America/Toronto', label: 'Toronto, Canada (EST/EDT)' },
    { value: 'America/Vancouver', label: 'Vancouver, Canada (PST/PDT)' },
    { value: 'America/Mexico_City', label: 'Mexico City, Mexico (CST/CDT)' },
  ]},
  { group: 'Universeel', options: [
    { value: 'UTC', label: 'UTC — Gecoördineerde Wereldtijd (UTC+0)' },
  ]},
];

const LANGUAGES = [
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'zh', label: '中文 (简体)', flag: '🇨🇳' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
];
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
  const { data: localization } = useLocalizationSettings();
  const settingsMutation = useSettingsMutation();
  const contactMutation = useContactMutation();
  const termsMutation = useTermsMutation();
  const privacyMutation = usePrivacyMutation();
  const wifiMutation = useWifiMutation();
  const weatherMutation = useWeatherMutation();
  const splashMutation = useSplashMutation();
  const bannerMutation = useBannerMutation();
  const localizationMutation = useLocalizationMutation();
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
        // localization (with safe defaults)
        timezone: localization?.timezone ?? 'Europe/Amsterdam',
        location: localization?.location ?? 'Amsterdam',
        country: localization?.country ?? 'Nederland',
        languages: localization?.languages ?? ['nl', 'en'],
        dateFormat: localization?.dateFormat ?? 'DD-MM-YYYY',
        timeFormat: localization?.timeFormat ?? '24h',
        currency: localization?.currency ?? 'EUR',
        currencySymbol: localization?.currencySymbol ?? '€',
        firstDayOfWeek: localization?.firstDayOfWeek ?? 'monday',
        localizationStatus: localization?.status ?? 'active',
        localizationUpdatedAt: localization?.updatedAt ?? null,
        localizationUpdatedBy: localization?.updatedBy ?? null,
      });
    }
  }, [settings, contact, terms, privacy, wifi, weather, splash, banners, localization]);
  const handleSave = async (section: string) => {
    try {
      if (['appearance', 'advanced', 'security'].includes(section)) {
        await settingsMutation.mutateAsync(formData as any);
      } else if (section === 'localization') {
        await localizationMutation.mutateAsync({
          timezone: formData.timezone,
          location: formData.location,
          country: formData.country,
          languages: formData.languages,
          dateFormat: formData.dateFormat,
          timeFormat: formData.timeFormat,
          currency: formData.currency,
          currencySymbol: formData.currencySymbol,
          firstDayOfWeek: formData.firstDayOfWeek,
          status: formData.localizationStatus,
          updatedBy: 'Nexus Admin',
        } as any);
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
                <CardHeader className="bg-slate-50/50 border-b">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <CardTitle>Taal & Regio</CardTitle>
                      <CardDescription>Configureer tijdzone, locatie en ondersteunde talen voor het platform.</CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      {formData.localizationUpdatedAt && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(formData.localizationUpdatedAt).toLocaleString('nl-NL', { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                      )}
                      <Select value={formData.localizationStatus} onValueChange={(v) => updateField('localizationStatus', v)}>
                        <SelectTrigger className="h-8 w-36 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">
                            <span className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Actief</span>
                          </SelectItem>
                          <SelectItem value="draft">
                            <span className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-amber-500" /> Concept</span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-8 space-y-8">
                  {/* Timezone */}
                  <div className="space-y-2">
                    <Label className="font-bold text-base">Tijdzone</Label>
                    <Select value={formData.timezone} onValueChange={(v) => updateField('timezone', v)}>
                      <SelectTrigger className="h-11"><SelectValue placeholder="Selecteer tijdzone..." /></SelectTrigger>
                      <SelectContent className="max-h-80">
                        {TIMEZONES.map((group) => (
                          <React.Fragment key={group.group}>
                            <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-slate-50">{group.group}</div>
                            {group.options.map((tz) => (
                              <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                            ))}
                          </React.Fragment>
                        ))}
                      </SelectContent>
                    </Select>
                    {formData.timezone && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                        <Clock className="h-3 w-3" />
                        Huidige tijd: <span className="font-mono font-bold">
                          {new Date().toLocaleTimeString('nl-NL', { timeZone: formData.timezone, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span> — {formData.timezone}
                      </p>
                    )}
                  </div>

                  {/* Country + Location */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-bold text-base">Land</Label>
                      <Input value={formData.country ?? ''} onChange={(e) => updateField('country', e.target.value)} placeholder="bijv. Nederland" className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold text-base">Locatie / Stad</Label>
                      <Input value={formData.location ?? ''} onChange={(e) => updateField('location', e.target.value)} placeholder="bijv. Amsterdam" className="h-11" />
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="space-y-3">
                    <Label className="font-bold text-base">Ondersteunde Talen</Label>
                    <p className="text-sm text-muted-foreground">Selecteer alle talen die beschikbaar zijn in de member app.</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {LANGUAGES.map((lang) => {
                        const isSelected = (formData.languages ?? []).includes(lang.code);
                        return (
                          <label
                            key={lang.code}
                            className={cn(
                              'flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all',
                              isSelected ? 'bg-indigo-50 border-indigo-300 dark:bg-indigo-950/30' : 'hover:bg-slate-50'
                            )}
                          >
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => {
                                const current: string[] = formData.languages ?? [];
                                updateField('languages', checked
                                  ? [...current, lang.code]
                                  : current.filter((l) => l !== lang.code)
                                );
                              }}
                            />
                            <span className="text-sm font-medium">{lang.flag} {lang.label}</span>
                          </label>
                        );
                      })}
                    </div>
                    {(formData.languages ?? []).length === 0 && (
                      <p className="text-xs text-rose-500">Selecteer minimaal één taal.</p>
                    )}
                  </div>

                  {/* Date + Time format */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-bold text-base">Datumnotatie</Label>
                      <Select value={formData.dateFormat} onValueChange={(v) => updateField('dateFormat', v)}>
                        <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DD-MM-YYYY">DD-MM-YYYY (Nederland)</SelectItem>
                          <SelectItem value="DD.MM.YYYY">DD.MM.YYYY (Duitsland / Rusland)</SelectItem>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (Verenigde Staten)</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (ISO 8601)</SelectItem>
                          <SelectItem value="D MMMM YYYY">D MMMM YYYY (Lang formaat)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">Voorbeeld: {new Date().toLocaleDateString('nl-NL')}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold text-base">Tijdnotatie</Label>
                      <Select value={formData.timeFormat} onValueChange={(v) => updateField('timeFormat', v)}>
                        <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="24h">24-uurs klok (14:30)</SelectItem>
                          <SelectItem value="12h">12-uurs klok (2:30 PM)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">Voorbeeld: {new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>

                  {/* Currency + First day of week */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-bold text-base">Valuta</Label>
                      <Select value={formData.currency} onValueChange={(v) => {
                        const symbols: Record<string, string> = { EUR: '€', USD: '$', GBP: '£', IDR: 'Rp', SGD: 'S$', AED: 'AED', CHF: 'CHF', JPY: '¥', CNY: '¥' };
                        updateField('currency', v);
                        updateField('currencySymbol', symbols[v] ?? v);
                      }}>
                        <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EUR">EUR — Euro (€)</SelectItem>
                          <SelectItem value="USD">USD — US Dollar ($)</SelectItem>
                          <SelectItem value="GBP">GBP — Brits Pond (£)</SelectItem>
                          <SelectItem value="CHF">CHF — Zwitserse Frank (CHF)</SelectItem>
                          <SelectItem value="AED">AED — Emirati Dirham (AED)</SelectItem>
                          <SelectItem value="SGD">SGD — Singapore Dollar (S$)</SelectItem>
                          <SelectItem value="IDR">IDR — Indonesische Rupiah (Rp)</SelectItem>
                          <SelectItem value="JPY">JPY — Japanse Yen (¥)</SelectItem>
                          <SelectItem value="CNY">CNY — Chinese Yuan (¥)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold text-base">Eerste dag van de week</Label>
                      <Select value={formData.firstDayOfWeek} onValueChange={(v) => updateField('firstDayOfWeek', v)}>
                        <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monday">Maandag (Europa)</SelectItem>
                          <SelectItem value="sunday">Zondag (VS / Midden-Oosten)</SelectItem>
                          <SelectItem value="saturday">Zaterdag (sommige islamitische landen)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Metadata footer */}
                  {formData.localizationUpdatedAt && (
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border text-xs text-muted-foreground flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        Laatste wijziging: {new Date(formData.localizationUpdatedAt).toLocaleString('nl-NL', { dateStyle: 'full', timeStyle: 'short' })}
                      </div>
                      {formData.localizationUpdatedBy && (
                        <div className="ml-5">Door: <span className="font-medium text-foreground">{formData.localizationUpdatedBy}</span></div>
                      )}
                    </div>
                  )}
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
                      <Label className="flex items-center gap-2"><Share2 className="h-3 w-3" /> Instagram URL</Label>
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