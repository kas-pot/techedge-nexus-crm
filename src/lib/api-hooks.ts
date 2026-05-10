import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './api-client';
import type {
  ApiResponse, Tier, Voucher, Venue, Outlet, Mission, Campaign,
  InterestTag, Leaderboard, ApprovalTask, Partner, Badge,
  SystemSettings, Ad, MarketingTicket, NewsItem, GiftCard, FaqItem, Member,
  ContactSettings, LegalDocument, WifiSettings, WeatherConfig, PushCampaign,
  SplashScreenConfig, HeroBannerConfig, LocalizationSettings,
  ThePotUser, ThePotGame, ThePotChallenge, ThePotSubChallenge
} from '@shared/types';
export function useEntities<T>(key: string, path: string, params?: Record<string, string>, limit = 200) {
  const queryParams = new URLSearchParams(params);
  if (limit) queryParams.append('limit', limit.toString());
  const fullPath = `${path}?${queryParams.toString()}`;
  return useQuery({
    queryKey: [key, params, limit],
    queryFn: () => api<{ items: T[]; next: string | null }>(fullPath),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
}
export function useEntityMutation<T>(entityKey: string, apiPath: string) {
  const queryClient = useQueryClient();
  const create = useMutation({
    mutationFn: (data: Partial<T>) => api<T>(apiPath, { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [entityKey] }),
  });
  const update = useMutation({
    mutationFn: ({ id, ...data }: Partial<T> & { id: string }) =>
      api<T>(`${apiPath}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: [entityKey] });
      queryClient.invalidateQueries({ queryKey: [entityKey, data.id] });
    },
  });
  const remove = useMutation({
    mutationFn: (id: string) => api<{ success: boolean }>(`${apiPath}/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [entityKey] }),
  });
  return { create, update, remove };
}
export const useTiers = () => useEntities<Tier>('tiers', '/api/tiers');
export const useVouchers = () => useEntities<Voucher>('vouchers', '/api/vouchers');
export const useVenues = () => useEntities<Venue>('venues', '/api/venues');
export const useOutlets = (venueId?: string) => useEntities<Outlet>('outlets', '/api/outlets', venueId ? { venueId } : undefined);
export const useMissions = (type?: string) => useEntities<Mission>('missions', '/api/missions', type ? { type } : undefined);
export const useCampaigns = (channel?: string) => useEntities<Campaign>('campaigns', '/api/campaigns', channel ? { channel } : undefined);
export const useInterests = () => useEntities<InterestTag>('interests', '/api/interests');
export const useLeaderboards = () => useEntities<Leaderboard>('leaderboards', '/api/leaderboards');
export const useAds = () => useEntities<Ad>('ads', '/api/ads');
export const useTickets = () => useEntities<MarketingTicket>('tickets', '/api/tickets');
export const useNews = () => useEntities<NewsItem>('news', '/api/news');
export const useGiftCards = () => useEntities<GiftCard>('gift-cards', '/api/gift-cards');
export const useFaq = () => useEntities<FaqItem>('faqs', '/api/faqs');
export const useApprovals = (status?: string) => useEntities<ApprovalTask>('approvals', '/api/approvals', status ? { status } : undefined);
export const usePartners = () => useEntities<Partner>('partners', '/api/partners');
export const useBadges = () => useEntities<Badge>('badges', '/api/badges');
export const useMembers = (search?: string) => useEntities<Member>('members', '/api/users', search ? { search } : undefined);
// System Management Hooks
export const useSystemSettings = () => useQuery({
  queryKey: ['system-settings'],
  queryFn: () => api<SystemSettings>('/api/system/settings')
});
export const useContactSettings = () => useQuery({
  queryKey: ['contact-settings'],
  queryFn: () => api<ContactSettings>('/api/system/contact')
});
export const useTermsContent = () => useQuery({
  queryKey: ['terms-content'],
  queryFn: () => api<LegalDocument>('/api/system/terms')
});
export const usePrivacyContent = () => useQuery({
  queryKey: ['privacy-content'],
  queryFn: () => api<LegalDocument>('/api/system/privacy')
});
export const useWifiSettings = () => useQuery({
  queryKey: ['wifi-settings'],
  queryFn: () => api<WifiSettings>('/api/system/wifi')
});
export const useWeatherSettings = () => useQuery({
  queryKey: ['weather-settings'],
  queryFn: () => api<WeatherConfig>('/api/system/weather')
});
export const useSplashScreen = () => useQuery({
  queryKey: ['splash-screen'],
  queryFn: () => api<SplashScreenConfig>('/api/system/splash')
});
export const useHeroBanner = () => useQuery({
  queryKey: ['hero-banner'],
  queryFn: () => api<HeroBannerConfig>('/api/system/banner')
});
export const useLocalizationSettings = () => useQuery({
  queryKey: ['localization-settings'],
  queryFn: () => api<LocalizationSettings>('/api/system/localization'),
  staleTime: 5 * 60 * 1000,
});
// System Mutation Hooks
export const useSettingsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SystemSettings>) => api<SystemSettings>('/api/system/settings', { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['system-settings'] }),
  });
};
export const useLocalizationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<LocalizationSettings>) => api<LocalizationSettings>('/api/system/localization', { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['localization-settings'] }),
  });
};
export const useContactMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ContactSettings>) => api<ContactSettings>('/api/system/contact', { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contact-settings'] }),
  });
};
export const useTermsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<LegalDocument>) => api<LegalDocument>('/api/system/terms', { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['terms-content'] }),
  });
};
export const usePrivacyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<LegalDocument>) => api<LegalDocument>('/api/system/privacy', { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['privacy-content'] }),
  });
};
export const useWifiMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<WifiSettings>) => api<WifiSettings>('/api/system/wifi', { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wifi-settings'] }),
  });
};
export const useWeatherMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<WeatherConfig>) => api<WeatherConfig>('/api/system/weather', { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['weather-settings'] }),
  });
};
export const useSplashMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SplashScreenConfig>) => api<SplashScreenConfig>('/api/system/splash', { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['splash-screen'] }),
  });
};
export const useBannerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<HeroBannerConfig>) => api<HeroBannerConfig>('/api/system/banner', { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hero-banner'] }),
  });
};
// Common Mutations
export const useVoucherMutations = () => useEntityMutation<Voucher>('vouchers', '/api/vouchers');
export const useMemberMutations = () => useEntityMutation<Member>('members', '/api/users');
export const useStats = () => useQuery({
  queryKey: ['stats'],
  queryFn: () => api<{ totalMembers: number; totalCampaigns: number; totalApprovals: number; totalGiftCards: number }>('/api/stats'),
  staleTime: 60 * 1000,
});
export const useVenueMutations = () => useEntityMutation<Venue>('venues', '/api/venues');
export const useOutletMutations = () => useEntityMutation<Outlet>('outlets', '/api/outlets');
export const usePartnerMutations = () => useEntityMutation<Partner>('partners', '/api/partners');
export const useMissionMutations = () => useEntityMutation<Mission>('missions', '/api/missions');
export const useCampaignMutations = () => useEntityMutation<Campaign>('campaigns', '/api/campaigns');
export const useApprovalMutations = () => useEntityMutation<ApprovalTask>('approvals', '/api/approvals');
export const useAdMutations = () => useEntityMutation<Ad>('ads', '/api/ads');
export const useTicketMutations = () => useEntityMutation<MarketingTicket>('tickets', '/api/tickets');
export const useNewsMutations = () => useEntityMutation<NewsItem>('news', '/api/news');
export const useFaqMutations = () => useEntityMutation<FaqItem>('faqs', '/api/faqs');
export const useInterestMutations = () => useEntityMutation<InterestTag>('interests', '/api/interests');
export const usePushCampaigns = () => useEntities<PushCampaign>('push-campaigns', '/api/push-campaigns');
export const usePushCampaignMutations = () => useEntityMutation<PushCampaign>('push-campaigns', '/api/push-campaigns');
export const useGiftCardMutations = () => useEntityMutation<GiftCard>('gift-cards', '/api/gift-cards');
export const useGiftCardBatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { count: number, value: number, expiryDate?: string }) =>
      api<GiftCard[]>('/api/gift-cards/batch', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gift-cards'] }),
  });
};
export const usePartnerSync = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { partnerId: string, count: number }) =>
      api<{ synced: number, items: Voucher[] }>('/api/vouchers/sync-external', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vouchers'] }),
  });
};

// ─── The Pot App — Live D1 Hooks ──────────────────────────────────────────────
type PotListResponse<T> = { items: T[]; total: number; page: number; limit: number };

export const usePotStats = () => useQuery({
  queryKey: ['pot-stats'],
  queryFn: () => api<{ users: number; games: number; challenges: number; subChallenges: number }>('/api/thepot/stats'),
  staleTime: 30 * 1000,
});

export const usePotUsers = (search?: string, page = 1) => useQuery({
  queryKey: ['pot-users', search, page],
  queryFn: () => {
    const params = new URLSearchParams({ page: String(page), limit: '50' });
    if (search) params.set('search', search);
    return api<PotListResponse<ThePotUser>>(`/api/thepot/users?${params}`);
  },
  staleTime: 10 * 1000,
});

export const usePotUserMutations = () => {
  const queryClient = useQueryClient();
  const create = useMutation({
    mutationFn: (data: { first_name: string; last_name: string; email: string; user_role?: string; is_active?: number; birth_date?: string; gender?: string }) =>
      api<ThePotUser>('/api/thepot/users', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pot-users'] });
      queryClient.invalidateQueries({ queryKey: ['pot-stats'] });
    },
  });
  const update = useMutation({
    mutationFn: ({ id, ...data }: Partial<ThePotUser> & { id: number }) =>
      api<ThePotUser>(`/api/thepot/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pot-users'] }),
  });
  const deactivate = useMutation({
    mutationFn: (id: number) => api<{ success: boolean }>(`/api/thepot/users/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pot-users'] }),
  });
  return { create, update, deactivate };
};

export const usePotGames = (page = 1) => useQuery({
  queryKey: ['pot-games', page],
  queryFn: () => api<PotListResponse<ThePotGame>>(`/api/thepot/games?page=${page}&limit=50`),
  staleTime: 10 * 1000,
});

export const usePotGameDetail = (id: number | null) => useQuery({
  queryKey: ['pot-game', id],
  queryFn: () => api<ThePotGame & { teams: any[]; rounds: any[] }>(`/api/thepot/games/${id}`),
  enabled: id != null,
});

export const usePotGameMutations = () => {
  const queryClient = useQueryClient();
  const remove = useMutation({
    mutationFn: (id: number) => api<{ success: boolean }>(`/api/thepot/games/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pot-games'] }),
  });
  return { remove };
};

export const usePotChallenges = () => useQuery({
  queryKey: ['pot-challenges'],
  queryFn: () => api<PotListResponse<ThePotChallenge>>('/api/thepot/challenges'),
  staleTime: 10 * 1000,
});

export const usePotSubChallenges = (challengeId: string | null) => useQuery({
  queryKey: ['pot-sub-challenges', challengeId],
  queryFn: () => api<PotListResponse<ThePotSubChallenge>>(`/api/thepot/challenges/${challengeId}/sub-challenges`),
  enabled: !!challengeId,
  staleTime: 10 * 1000,
});

export const usePotChallengeMutations = () => {
  const queryClient = useQueryClient();
  const create = useMutation({
    mutationFn: (data: { name: string }) =>
      api<ThePotChallenge>('/api/thepot/challenges', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pot-challenges'] }),
  });
  const update = useMutation({
    mutationFn: ({ id, ...data }: { id: number; name: string; is_active: number }) =>
      api<ThePotChallenge>(`/api/thepot/challenges/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pot-challenges'] }),
  });
  const remove = useMutation({
    mutationFn: (id: number) => api<{ success: boolean }>(`/api/thepot/challenges/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pot-challenges'] }),
  });
  return { create, update, remove };
};

export const usePotSubChallengeMutations = (challengeId: string) => {
  const queryClient = useQueryClient();
  const create = useMutation({
    mutationFn: (data: { name: string }) =>
      api<ThePotSubChallenge>(`/api/thepot/challenges/${challengeId}/sub-challenges`, { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pot-sub-challenges', challengeId] }),
  });
  const update = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      api<ThePotSubChallenge>(`/api/thepot/sub-challenges/${id}`, { method: 'PUT', body: JSON.stringify({ name }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pot-sub-challenges', challengeId] }),
  });
  const remove = useMutation({
    mutationFn: (id: number) => api<{ success: boolean }>(`/api/thepot/sub-challenges/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pot-sub-challenges', challengeId] }),
  });
  return { create, update, remove };
};