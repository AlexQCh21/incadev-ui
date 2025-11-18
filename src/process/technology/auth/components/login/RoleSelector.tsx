import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { IconShieldCheck, IconLifebuoy, IconServer, IconShield, IconChartBar, IconCode } from "@tabler/icons-react"
import { TECHNOLOGY_ROLES, TECHNOLOGY_MODULE_META } from "@/config/roles/technology-roles"

const iconMap: Record<string, any> = {
  IconShieldCheck,
  IconLifebuoy,
  IconServer,
  IconShield,
  IconChartBar,
  IconCode,
}

interface RoleSelectorProps {
  onRoleSelect: (roleId: string) => void
}

export function RoleSelector({ onRoleSelect }: RoleSelectorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500/5 via-background to-purple-500/5">
      {/* Main Content */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top duration-700">
          <div className="flex justify-center mb-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <IconShieldCheck className="h-11 w-11 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">{TECHNOLOGY_MODULE_META.name}</h1>
          <p className="text-muted-foreground text-lg">
            Selecciona tu rol para iniciar sesión
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {TECHNOLOGY_ROLES.map((role, index) => {
            const Icon = iconMap[role.icon] || IconShieldCheck

            return (
              <Card
                key={role.id}
                onClick={() => onRoleSelect(role.id)}
                className="group cursor-pointer border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 bg-background/50 backdrop-blur-sm overflow-hidden animate-in fade-in slide-in-from-bottom duration-500 relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                <CardHeader className="pb-4 relative z-10">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center text-white mb-4 shadow-lg ring-4 ring-background group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl transition-colors">
                    {role.name}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed mt-2">
                    {role.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
