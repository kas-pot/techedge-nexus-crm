import React, { useState, useEffect } from "react";
import { Command } from "cmdk";
import { useNavigate } from "react-router-dom";
import {
  Users, Ticket, LayoutDashboard, Settings, Bell,
  ShieldCheck, Trophy, Store, Building2, Coins, Search,
  Calendar, Gift, UserCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };
  return (
    <AnimatePresence>
      {open && (
        <Command.Dialog
          open={open}
          onOpenChange={setOpen}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-white dark:bg-slate-950 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            <div className="flex items-center border-b px-4 py-3">
              <Search className="mr-3 h-5 w-5 text-muted-foreground" />
              <Command.Input
                placeholder="Type a command or search entities..."
                className="flex-1 bg-transparent border-none outline-none text-base placeholder:text-muted-foreground py-1"
              />
              <div className="hidden md:flex gap-1 ml-4">
                <kbd className="px-1.5 py-0.5 rounded border bg-slate-100 text-[10px] font-bold">ESC</kbd>
              </div>
            </div>
            <Command.List className="max-h-[60vh] overflow-y-auto p-2 custom-scrollbar">
              <Command.Empty className="py-12 text-center text-sm text-muted-foreground">
                No results found.
              </Command.Empty>
              <Command.Group heading="Navigation" className="px-2 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <CommandItem icon={LayoutDashboard} onSelect={() => runCommand(() => navigate('/'))}>Dashboard</CommandItem>
                <CommandItem icon={Users} onSelect={() => runCommand(() => navigate('/members'))}>Member Registry</CommandItem>
                <CommandItem icon={Ticket} onSelect={() => runCommand(() => navigate('/loyalty/vouchers'))}>Vouchers</CommandItem>
                <CommandItem icon={ShieldCheck} onSelect={() => runCommand(() => navigate('/tiers'))}>Membership Tiers</CommandItem>
                <CommandItem icon={Bell} onSelect={() => runCommand(() => navigate('/marketing/push'))}>Push Command Center</CommandItem>
                <CommandItem icon={Settings} onSelect={() => runCommand(() => navigate('/system'))}>System Settings</CommandItem>
              </Command.Group>
              <Command.Group heading="Operations" className="px-2 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-t">
                <CommandItem icon={Building2} onSelect={() => runCommand(() => navigate('/ops/venues'))}>Venues</CommandItem>
                <CommandItem icon={Store} onSelect={() => runCommand(() => navigate('/ops/outlets'))}>Outlets & Tenants</CommandItem>
                <CommandItem icon={UserCheck} onSelect={() => runCommand(() => navigate('/manual-approval'))}>Pending Approvals</CommandItem>
              </Command.Group>
              <Command.Group heading="Loyalty Engine" className="px-2 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-t">
                <CommandItem icon={Coins} onSelect={() => runCommand(() => navigate('/loyalty/earn-points'))}>Earn Rules</CommandItem>
                <CommandItem icon={Gift} onSelect={() => runCommand(() => navigate('/loyalty/gift-cards'))}>Gift Cards</CommandItem>
                <CommandItem icon={Trophy} onSelect={() => runCommand(() => navigate('/leaderboards'))}>Leaderboards</CommandItem>
              </Command.Group>
            </Command.List>
          </motion.div>
        </Command.Dialog>
      )}
    </AnimatePresence>
  );
}
function CommandItem({ children, icon: Icon, onSelect }: { children: React.ReactNode; icon: any; onSelect: () => void }) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer aria-selected:bg-indigo-50 aria-selected:text-indigo-600 dark:aria-selected:bg-indigo-900/30 dark:aria-selected:text-indigo-400 transition-colors"
    >
      <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <span className="text-sm font-semibold">{children}</span>
    </Command.Item>
  );
}