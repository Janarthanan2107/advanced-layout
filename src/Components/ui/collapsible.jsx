"use client"

import React, { cloneElement, createContext, isValidElement, useContext, useState } from "react"
import { cn } from "../../lib/utils" // optional utility (clsx/tw-merge)

// Context to share open/close state
const CollapsibleContext = createContext()

// Root
const Collapsible = ({ open: controlledOpen, defaultOpen = false, onOpenChange, children }) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)

  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen

  const setOpen = (value) => {
    if (!isControlled) setUncontrolledOpen(value)
    if (onOpenChange) onOpenChange(value)
  }

  return (
    <CollapsibleContext.Provider value={{ open: isOpen, setOpen }}>
      <div className="w-full">{children}</div>
    </CollapsibleContext.Provider>
  )
}

// Trigger
const CollapsibleTrigger = ({ children, asChild = false, className, ...props }) => {
  const { open, setOpen } = useContext(CollapsibleContext)

  if (asChild && isValidElement(children)) {
    // Clone the child and inject props into it
    return cloneElement(children, {
      onClick: (e) => {
        children.props?.onClick?.(e)
        setOpen(!open)
      },
      "aria-expanded": open,
      className: cn("cursor-pointer w-full", children.props.className, className),
      ...props,
    })
  }

  // Default behavior: render as a <button>
  return (
    <button
      onClick={() => setOpen(!open)}
      aria-expanded={open}
      className={cn("cursor-pointer w-full", className)}
      {...props}
    >
      {children}
    </button>
  )
}

// Content
const CollapsibleContent = ({ children, className, asChild, ...props }) => {
  const { open } = useContext(CollapsibleContext)

  return (
    <div
      className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out",
        open ? "max-h-screen opacity-100" : "max-h-0 opacity-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
