import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './api-client';
import type {
  ApiResponse, Tier, Voucher, Venue, Outlet, Mission, Campaign,
  InterestTag, Leaderboard, ApprovalTask, Partner, Badge,
  SystemSettings, Ad, MarketingTicket, NewsItem, GiftCard, FaqItem, Member,
  ContactSettings, LegalDocument, WifiSettings, WeatherConfig
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
// System Mutation Hooks
export const useSettingsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SystemSettings>) => api<SystemSettings>('/api/system/settings', { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['system-settings'] }),
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
// Common Mutations
export const useVoucherMutations = () => useEntityMutation<Voucher>('vouchers', '/api/vouchers');
export const useMemberMutations = () => useEntityMutation<Member>('members', '/api/users');
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