
/// <reference types="vite/client" />

// Extend the Progress component props to include indicatorClassName
declare module "@/components/ui/progress" {
  export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: number;
    indicatorClassName?: string;
  }
}
