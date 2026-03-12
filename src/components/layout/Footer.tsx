import React from 'react'

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/40 text-muted-foreground">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-8 px-4 md:h-24 md:flex-row md:py-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-foreground">My App</p>
          <span className="text-sm">© {currentYear} All rights reserved.</span>
        </div>
        <p className="text-balance text-center text-sm leading-loose md:text-left">
          Built with Next.js 16, Tailwind CSS v4, and shadcn/ui.
        </p>
      </div>
    </footer>
  )
}
