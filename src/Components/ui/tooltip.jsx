"use client"

import React, { createContext, useContext, useState, useRef } from "react"
import { cn } from "../../lib/utils"

// Context
const TooltipContext = createContext()

// Provider (not really needed but keeping API consistent)
const TooltipProvider = ({ children }) => {
  return <>{children}</>
}

// Root
const Tooltip = ({ children }) => {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef(null)

  return (
    <TooltipContext.Provider value={{ open, setOpen, triggerRef }}>
      {children}
    </TooltipContext.Provider>
  )
}

// Trigger
const TooltipTrigger = ({ children }) => {
  const { setOpen, triggerRef } = useContext(TooltipContext)

  return (
    <span
      ref={triggerRef}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    // className="inline-flex"
    >
      {children}
    </span>
  )
}

// Content
const TooltipContent = React.forwardRef(
  ({ className, side = "top", sideOffset = 4, hidden, children }, ref) => {
    const { open, triggerRef } = useContext(TooltipContext)
    const [style, setStyle] = useState({})

    React.useEffect(() => {
      if (open && !hidden && triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect()
        const pos = {}

        switch (side) {
          case "top":
            pos.top = rect.top - sideOffset
            pos.left = rect.left + rect.width / 2
            break
          case "bottom":
            pos.top = rect.bottom + sideOffset
            pos.left = rect.left + rect.width / 2
            break
          case "left":
            pos.top = rect.top + rect.height / 2
            pos.left = rect.left - sideOffset
            break
          case "right":
            pos.top = rect.top + rect.height / 2
            pos.left = rect.right + sideOffset
            break
        }

        setStyle({
          position: "fixed",
          top: pos.top,
          left: pos.left,
          transform:
            side === "top" || side === "bottom"
              ? "translateX(-50%)"
              : "translateY(-50%)",
        })
      }
    }, [open, hidden, side, sideOffset, triggerRef])

    if (!open || hidden) return null

    return (
      <div
        ref={ref}
        style={style}
        className={cn(
          "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
          className
        )}
      >
        {children}
      </div>
    )
  }
)


TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
