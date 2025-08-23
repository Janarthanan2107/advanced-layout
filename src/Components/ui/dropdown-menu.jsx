"use client"

import React, { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from "react"
import { cn } from "../../lib/utils"
import { Check, ChevronRight, Circle } from "lucide-react"

// Context for Dropdown state
const DropdownContext = createContext(null)

const useDropdown = () => {
  const ctx = useContext(DropdownContext)
  if (!ctx) throw new Error("Dropdown components must be inside <DropdownMenu>")
  return ctx
}

// Root
const DropdownMenu = ({ children }) => {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef(null)

  return (
    <DropdownContext.Provider value={{ open, setOpen, triggerRef }}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  )
}

// Trigger
const DropdownMenuTrigger = React.forwardRef(
  ({ children, className, asChild = false, ...props }, ref) => {
    const { setOpen, triggerRef, open } = useDropdown()

    const mergedRef = (node) => {
      triggerRef.current = node
      if (ref) {
        if (typeof ref === "function") ref(node)
        else ref.current = node
      }
    }

    if (asChild && React.isValidElement(children)) {
      // Clone child and pass trigger props
      return React.cloneElement(children, {
        ref: mergedRef,
        onClick: (e) => {
          children.props.onClick?.(e)
          setOpen(!open)
        },
        className: cn("rounded-md hover:bg-accent", children.props.className, className),
        ...props,
      })
    }

    // Default fallback: <button>
    return (
      <button
        ref={mergedRef}
        onClick={() => setOpen(!open)}
        className={cn("rounded-md hover:bg-accent", className)}
        {...props}
      >
        {children}
      </button>
    )
  }
)

DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

// Content
const DropdownMenuContent = React.forwardRef(
  ({ children, className, side = "bottom", sideOffset = 4, ...props }, ref) => {    
    const { open, setOpen, triggerRef } = useDropdown()

    // ---- NEW: internal ref + merge with forwarded ref ----
    const contentRef = useRef(null)
    const setRefs = useCallback(
      (node) => {
        contentRef.current = node
        if (typeof ref === "function") ref(node)
        else if (ref) ref.current = node
      },
      [ref]
    )

    const [position, setPosition] = useState({ top: 0, left: 0, transform: undefined })

    // Positioning logic (unchanged except we now also store transform)
    useLayoutEffect(() => {
      if (open && triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect()
        const styles = {}

        switch (side) {
          case "top":
            styles.top = rect.top - sideOffset
            styles.left = rect.left
            styles.transform = "translateY(-100%)"
            break
          case "right":
            styles.top = rect.top
            styles.left = rect.right + sideOffset
            break
          case "left":
            styles.top = rect.top
            styles.left = rect.left - sideOffset
            styles.transform = "translateX(-100%)"
            break
          default: // bottom
            styles.top = rect.bottom + sideOffset
            styles.left = rect.left
        }

        setPosition(styles)
      }
    }, [open, triggerRef, side, sideOffset])

    // ---- FIXED: close on outside click (capture phase) + ESC ----
    useEffect(() => {
      if (!open) return

      const onPointerDown = (e) => {
        const c = contentRef.current
        const t = triggerRef.current
        if (!c || !t) return
        if (c.contains(e.target) || t.contains(e.target)) return
        setOpen(false)
      }

      const onKeyDown = (e) => {
        if (e.key === "Escape") setOpen(false)
      }

      // capture = true ensures we catch it even if propagation is stopped later
      document.addEventListener("pointerdown", onPointerDown, true)
      document.addEventListener("keydown", onKeyDown)

      return () => {
        document.removeEventListener("pointerdown", onPointerDown, true)
        document.removeEventListener("keydown", onKeyDown)
      }
    }, [open, setOpen, triggerRef])

    if (!open) return null

    return (
      <div
        ref={setRefs} // <-- use merged ref
        data-side={side}
        data-state={open ? "open" : "closed"}
        className={cn(
          "fixed z-50 min-w-[15rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2",
          "data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2",
          "data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        style={{
          position: "fixed",
          top: position.top,
          left: position.left,
          transform: position.transform,
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)

DropdownMenuContent.displayName = "DropdownMenuContent"

// Item
const DropdownMenuItem = React.forwardRef(
  ({ children, className, isActive, inset, ...props }, ref) => {
    const { setOpen } = useDropdown()

    return (
      <div
        ref={ref}
        onClick={() => setOpen(false)}
        className={cn(
          " relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
          inset && "pl-8",
          isActive 
            ? "bg-accent text-accent-foreground"  // active state
            : "hover:bg-accent hover:text-accent-foreground", // normal hover
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

DropdownMenuItem.displayName = "DropdownMenuItem"

// Checkbox Item
const DropdownMenuCheckboxItem = React.forwardRef(({ children, checked, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && <Check className="h-4 w-4" />}
      </span>
      {children}
    </div>
  )
})
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem"

// Radio Group
const DropdownMenuRadioGroup = ({ value, onValueChange, children }) => {
  return (
    <div role="radiogroup">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { checked: child.props.value === value, onValueChange })
      )}
    </div>
  )
}

const DropdownMenuRadioItem = React.forwardRef(({ children, value, checked, onValueChange, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      onClick={() => onValueChange && onValueChange(value)}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && <Circle className="h-2 w-2 fill-current" />}
      </span>
      {children}
    </div>
  )
})
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem"

// Label
const DropdownMenuLabel = React.forwardRef(({ children, className, inset, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
    {...props}
  >
    {children}
  </div>
))
DropdownMenuLabel.displayName = "DropdownMenuLabel"

// Separator
const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
))
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

// Shortcut
const DropdownMenuShortcut = ({ className, ...props }) => {
  return <span className={cn("ml-auto text-xs tracking-widest opacity-60", className)} {...props} />
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
}
