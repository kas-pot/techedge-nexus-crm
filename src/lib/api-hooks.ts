import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './api-client';
import type { ApiResponse, Tier, Voucher, Venue, Outlet, Mission, Campaign, InterestTag, Leaderboard, ApprovalTask, Partner, Badge, SystemSettings } from '@shared/types';
// Generic hook for listing entities
export function useEntities<T>(key: string, path: string, params?: Record<string, string>) {
  const queryParams = params ? new URLSearchParams(params).toString() : '';
  const fullPath = queryParams ? `${path}?${queryParams}` : path;
  return useQuery({
    queryKey: [key, params],
    queryFn: () => api<{ items: T[]; next: string | null }>(fullPath),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
}
// Specific hooks for CRM modules
export const useTiers = () => useEntities<Tier>('tiers', '/api/tiers');
export const useVouchers = () => useEntities<Voucher>('vouchers', '/api/vouchers');
export const useVenues = () => useEntities<Venue>('venues', '/api/venues');
export const useOutlets = (venueId?: string) =>
  useEntities<Outlet>('outlets', '/api/outlets', venueId ? { venueId } : undefined);
// Marketing & Missions Hooks
export const useMissions = (type?: string) =>
  useEntities<Mission>('missions', '/api/missions', type ? { type } : undefined);
export const useCampaigns = (channel?: string) =>
  useEntities<Campaign>('campaigns', '/api/campaigns', channel ? { channel } : undefined);
// Gamification Hooks
export const useInterests = () => useEntities<InterestTag>('interests', '/api/interests');
export const useLeaderboards = () => useEntities<Leaderboard>('leaderboards', '/api/leaderboards');
// Phase 5 Hooks
export const useApprovals = (status?: string) => 
  useEntities<ApprovalTask>('approvals', '/api/approvals', status ? { status } : undefined);
export const usePartners = () => useEntities<Partner>('partners', '/api/partners');
export const useBadges = () => useEntities<Badge>('badges', '/api/badges');
export const useSystemSettings = () => useQuery({
  queryKey: ['system-settings'],
  queryFn: () => api<SystemSettings>('/api/system/settings')
});
// Mutations
export function useGenericMutation<TInput, TOutput>(path: string, method: 'POST' | 'PUT' = 'POST', invalidationKeys: string[]) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TInput) => api<TOutput>(path, {
      method,
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      invalidationKeys.forEach(key => queryClient.invalidateQueries({ queryKey: [key] }));
    },
  });
}
export const useApprovalMutation = (id: string) => useGenericMutation<{ status: 'approved' | 'rejected' }, ApprovalTask>(`/api/approvals/${id}/decide`, 'POST', ['approvals']);
export const useSettingsMutation = () => useGenericMutation<Partial<SystemSettings>, SystemSettings>('/api/system/settings', 'PUT', ['system-settings']);
export const useMissionMutation = () => useGenericMutation<Partial<Mission>, Mission>('/api/missions', 'POST', ['missions']);