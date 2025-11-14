import { ModeToggle } from "@/components/core/ModeToggle"

export function AuthHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img
              src="/ISOLOGOTIPO_VERTICAL.svg"
              alt="INCADEV"
              className="h-12 w-auto"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-foreground">INCADEV</h1>
              <p className="text-xs text-muted-foreground">Sistema de Gestión</p>
            </div>
          </a>

          {/* Theme Toggle */}
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
