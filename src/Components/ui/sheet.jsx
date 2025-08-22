"use client"

import * as React from "react"
import { X } from "lucide-react"

import { cn } from "../../lib/utils"

// Context for sheet state
const SheetContext = React.createContext(null)

const Sheet = ({ children, open, onOpenChange, ...props }) => {
  return (
    <SheetContext.Provider value={{ open, onOpenChange }}>
      {children}
    </SheetContext.Provider>
  )
}

const SheetTrigger = ({ children, ...props }) => {
  const { onOpenChange } = React.useContext(SheetContext)
  
  return React.cloneElement(children, {
    onClick: () => onOpenChange(true),
    ...props
  })
}

const SheetClose = ({ children, ...props }) => {
  const { onOpenChange } = React.useContext(SheetContext)
  
  return React.cloneElement(children, {
    onClick: () => onOpenChange(false),
    ...props
  })
}

const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => {
  const { open, onOpenChange } = React.useContext(SheetContext)
  
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-black/80 transition-opacity duration-300",
        open ? "opacity-100" : "opacity-0 pointer-events-none",
        className
      )}
      onClick={() => onOpenChange(false)}
      ref={ref}
      {...props}
    />
  )
})
SheetOverlay.displayName = "SheetOverlay"

const sheetVariants = {
  side: {
    top: "inset-x-0 top-0 border-b",
    bottom: "inset-x-0 bottom-0 border-t",
    left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
    right: "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm"
  }
}

const SheetContent = React.forwardRef(({ side = "right", className, children, title = "sheet", ...props }, ref) => {
  const { open, onOpenChange } = React.useContext(SheetContext)
  
  // Animation classes based on side
  const getAnimationClasses = () => {
    if (!open) {
      switch(side) {
        case "top": return "transform -translate-y-full"
        case "bottom": return "transform translate-y-full"
        case "left": return "transform -translate-x-full"
        case "right": return "transform translate-x-full"
        default: return ""
      }
    }
    return ""
  }
  
  return (
    <>
      <SheetOverlay />
      <div
        ref={ref}
        className={cn(
          "fixed z-50 gap-4 bg-background p-6 shadow-lg transition-transform duration-300",
          sheetVariants.side[side],
          getAnimationClasses(),
          className
        )}
        {...props}
      >
        <span className="sr-only">{title}</span>
        {children}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </>
  )
})
SheetContent.displayName = "SheetContent"

const SheetHeader = ({ className, ...props }) => (
  <div
    className={cn("flex flex-col space-y-2 text-center sm:text-left", className)}
    {...props}
  />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
))
SheetTitle.displayName = "SheetTitle"

const SheetDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
SheetDescription.displayName = "SheetDescription"

export {
  Sheet,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription
}