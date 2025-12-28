import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './api-client';
import type { ApiResponse, Tier, Voucher, Venue, Outlet, Mission, Campaign } from '@shared/types';
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
// Mutation helper
export function useCreateEntity<T>(key: string, path: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<T>) => api<T>(path, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [key] });
    },
  });
}