import { useState, useEffect } from "react";
import { config } from "@/config/academic-config";
import { routes } from "@/process/academic/academic-site";
import { useAcademicAuth } from "@/process/academic/hooks/useAcademicAuth";

export interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  birth_date?: string;
  profile_photo?: string;
  role: string | string[];
  dni?: string;
  document?: string;
  country_location?: string;
  gender?: string;
}

export const useUserProfile = () => {
  const { token, user: initialUser, mounted: authMounted } = useAcademicAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<any | null>(initialUser);
  
  const [formData, setFormData] = useState<UserData>({
    id: 0,
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    birth_date: "",
    profile_photo: "",
    role: ""
  });

  const mapApiDataToForm = (apiData: any): UserData => {
    return {
      id: apiData.id || 0,
      first_name: apiData.first_name || "",
      last_name: apiData.last_name || "",
      email: apiData.email || "",
      phone: apiData.phone_number || "",
      address: apiData.address || "",
      city: apiData.country_location || "",
      country: apiData.country || "Perú",
      birth_date: apiData.birth_date ? apiData.birth_date.split('T')[0] : "",
      profile_photo: apiData.profile_photo || `${routes.base}9440461.webp`,
      role: apiData.role || "student",
      dni: apiData.dni || "",
      document: apiData.document || "",
      country_location: apiData.country_location || "",
      gender: apiData.gender || ""
    };
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        if (initialUser) {
          setUser(initialUser);
          setFormData(mapApiDataToForm(initialUser));
        }

        if (token && initialUser?.id) {
          const tokenWithoutQuotes = token.replace(/^"|"$/g, '');
          
          const response = await fetch(`${config.apiUrl}${config.endpoints.users.getById}`.replace(":id", initialUser.id.toString()), {
            headers: {
              "Authorization": `Bearer ${tokenWithoutQuotes}`,
              "Accept": "application/json"
            }
          });

          if (response.ok) {
            const apiData = await response.json();
            setUser(apiData);
            setFormData(mapApiDataToForm(apiData));
            localStorage.setItem("user", JSON.stringify(apiData));
          } else {
            console.error("Error fetching profile:", await response.text());
          }
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        setMessage({
          type: 'error',
          text: "Error al cargar el perfil. Por favor, recarga la página."
        });
      } finally {
        setLoading(false);
      }
    };

    // Solo ejecutar si authMounted es true (la autenticación está lista)
    if (authMounted) {
      fetchUserProfile();
    }
  }, [token, initialUser, authMounted]); // Dependencias del efecto

  const handleChange = (field: keyof UserData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const tokenWithoutQuotes = token?.replace(/^"|"$/g, '');
      
      const response = await fetch(`${config.apiUrl}${config.endpoints.users.update}`.replace(":id", user.id), {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${tokenWithoutQuotes}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone_number: formData.phone,
          address: formData.address,
          country_location: formData.city,
          country: formData.country,
          birth_date: formData.birth_date,
          profile_photo: formData.profile_photo
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar el perfil.");
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setFormData(mapApiDataToForm(updatedUser));
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setMessage({
        type: 'success',
        text: "¡Perfil actualizado exitosamente!"
      });
      setIsEditing(false);
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : "Error al actualizar el perfil. Por favor, intenta nuevamente."
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData(mapApiDataToForm(user));
    }
    setIsEditing(false);
    setMessage(null);
  };

  const getRoleLabel = (role: string | string[]) => {
    if (Array.isArray(role)) {
      return role.map(r => {
        const roles: Record<string, string> = {
          student: "Estudiante",
          teacher: "Docente",
          admin: "Administrador",
          graduate: "Egresado"
        };
        return roles[r] || r;
      }).join(", ");
    }
    
    const roles: Record<string, string> = {
      student: "Estudiante",
      teacher: "Docente",
      admin: "Administrador",
      graduate: "Egresado"
    };
    return roles[role] || role;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return {
    mounted: authMounted, // ← Usar authMounted en lugar del estado local
    loading,
    saving,
    message,
    isEditing,
    formData,
    user,
    
    setIsEditing,
    handleChange,
    handleSubmit,
    handleCancel,
    
    getRoleLabel,
    getInitials
  };
};