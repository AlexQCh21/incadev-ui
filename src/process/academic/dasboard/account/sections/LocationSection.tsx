import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconMapPin } from "@tabler/icons-react";
import { type UserData } from "@/process/academic/dasboard/account/hooks/useUserProfile";

interface LocationSectionProps {
  formData: UserData;
  isEditing: boolean;
  onChange: (field: keyof UserData, value: string) => void;
}

export function LocationSection({ formData, isEditing, onChange }: LocationSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconMapPin className="h-5 w-5 text-primary" />
          Ubicación
        </CardTitle>
        <CardDescription>
          {isEditing ? "Actualiza tu dirección" : "Tu dirección actual"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address">Dirección</Label>
          <Input
            id="address"
            placeholder="Av. Ejemplo 123, Dpto. 456"
            value={formData.address}
            onChange={(e) => onChange("address", e.target.value)}
            disabled={!isEditing}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">Ciudad/Región</Label>
            <Input
              id="city"
              placeholder="Arequipa"
              value={formData.city}
              onChange={(e) => onChange("city", e.target.value)}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">País</Label>
            <Input
              id="country"
              placeholder="Perú"
              value={formData.country}
              onChange={(e) => onChange("country", e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}