"use client"
import { cn } from "@/lib/utils"

interface SwitchProps {
  id?: string // Added id prop for accessibility
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  className?: string
}

export function Switch({ id, checked, onCheckedChange, className }: SwitchProps) {
  return (
    <button
      id={id} // Added id attribute
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        checked ? "bg-primary" : "bg-muted",
        className,
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
          checked ? "translate-x-6" : "translate-x-1",
        )}
      />
    </button>
  )
}
