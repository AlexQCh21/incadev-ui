"use client"
import React from "react";
import { ModeToggle } from '@/components/core/ModeToggle';
import { Button } from "@/components/ui/button";
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  NavigationMenuTrigger 
} from "@/components/ui/navigation-menu";

export function Navbar() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
            <div className="h-16">
                <img 
                src="/ISOLOGOTIPO_HORIZONTAL.svg" 
                alt="Incadev - Instituto de Capacitación y Desarrollo Virtual" 
                className="h-full w-auto"
                />
            </div>
        </div>

        {/* Navegación */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Cursos</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-4 w-[400px]">
                  <NavigationMenuLink asChild>
                    <a
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      href="/cursos"
                    >
                      <div className="text-sm font-medium leading-none">Todos los Cursos</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Explora nuestro catálogo completo
                      </p>
                    </a>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <a
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      href="/cursos/programacion"
                    >
                      <div className="text-sm font-medium leading-none">Programación</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Desarrollo web y software
                      </p>
                    </a>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <a
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      href="/cursos/diseno"
                    >
                      <div className="text-sm font-medium leading-none">Diseño</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        UX/UI y diseño gráfico
                      </p>
                    </a>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuLink href="/nosotros" className="px-4 py-2 text-sm font-medium">
                Nosotros
              </NavigationMenuLink>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuLink href="/contacto" className="px-4 py-2 text-sm font-medium">
                Contacto
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Acciones */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex gap-2">
            <Button variant="ghost" size="sm" asChild>
              <a href="/academico/login">Ingresar</a>
            </Button>
            <Button size="sm" asChild>
              <a href="/academico/register">Registrarse</a>
            </Button>
          </div>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}