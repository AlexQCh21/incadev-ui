import React, {useEffect, useState} from "react";
import { ChevronUp, ChevronDown, Pencil, Trash } from "lucide-react";
import {Card, CardContent} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
export default function AddLicenseForm({ open, onClose, softwareList, onCreate }) {


    const licenseStatuses = [
        {value: "active", label: "Activa"},
        {value: "expired", label: "Expirada"},
        {value: "pending", label: "Pendiente de renovación"},
        {value: "deactivated", label: "Desactivada"},
    ]
  const [form, setForm] = useState({
    software_id: "",
    key_code:"",
    provider:"",
    purchase_date:"",
    expiration_date:"",
    cost:"",
    status:""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
   const res = await fetch("http://localhost:8000/api/infrastructure/licenses", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(form)
      });
    
    const newLic = await res.json();
    onCreate(newLic);

    setForm({ software_id: "",
    key_code:"",
    provider:"",
    purchase_date:"",
    expiration_date:"",
    cost:"",
    status:"",
});


    if (typeof onClose === "function") onClose();
  };
  return (
    <Card className="p-4 mb-6">
      <CardContent>
        <form onSubmit={handleSubmit} className="grip gap-4">
         {/* Software */}
          <div>
            <Label>Software</Label>
            <Select
              value={form.software_id}
              onValueChange={(value) => setForm({ ...form, software_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione software" />
              </SelectTrigger>
              <SelectContent>
                {softwareList.map((soft) => (
                  <SelectItem key={soft.id} value={String(soft.id)}>
                    {soft.software_name} {soft.version && `(${soft.version})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Clave */}
          <div>
            <Label>Clave / License Key</Label>
            <Input
              placeholder="Ej: XXXX-XXXX-XXXX"
              value={form.key_code}
              onChange={(e) =>
                setForm({ ...form, key_code: e.target.value })
              }
            />
          </div>
          {/* Proveedor */}
          <div>
            <Label>Proveedor</Label>
            <Input
              placeholder="Ej: Microsoft, Google, Salesforce"
              value={form.provider}
              onChange={(e) =>
                setForm({ ...form, provider: e.target.value })
              }
            />
          </div>

         {/* Fecha de compra */}
          <div>
            <Label>Fecha de compra</Label>
            <Input
              type="date"
              value={form.purchase_date}
              onChange={(e) =>
                setForm({ ...form, purchase_date: e.target.value })
              }
            />
          </div>
          {/* Fecha de expiración */}
          <div>
            <Label>Fecha de expiración</Label>
            <Input
              type="date"
              value={form.expiration_date}
              onChange={(e) =>
                setForm({ ...form, expiration_date: e.target.value })
              }
            />
          </div>
          {/*Costo*/}
         <div>
            <Label>Costo de licencia</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={form.cost}
              onChange={(e) =>
                setForm({ ...form, cost: e.target.value })
              }
            />
          </div>
        {/* Estado de licencia */} 
          <div>
            <Label>Estado de licencia</Label>
            <Select
                value={form.status}
                onValueChange={(value) => setForm({...form, status: value})}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Seleccion estado"></SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {licenseStatuses.map((st) => (
                        <SelectItem key={st.value} value={st.value}>
                            {st.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>

          {/* Botón */}
          <Button type="submit" className="w-fit">
            Registrar licencia
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}