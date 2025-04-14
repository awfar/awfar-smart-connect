
// This file re-exports the toast hook from the hooks directory
import { useToast as useToastHook, toast as toastFunction } from "@/hooks/use-toast";

export const useToast = useToastHook;
export const toast = toastFunction;
