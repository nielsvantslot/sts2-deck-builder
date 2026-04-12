// TypeScript declaration for Ko-fi widget overlay
export {};
declare global {
  interface Window {
    kofiWidgetOverlay?: {
      draw: (user: string, opts: Record<string, any>) => void;
    };
  }
}