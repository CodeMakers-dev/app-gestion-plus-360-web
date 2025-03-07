export interface MessageNotifications {
  id: number;
  usuario: string | null;
  titulo: string;
  descripcion: string;
  fechaEnvio: string;
  usuarioCreacion: string;
  fechaCreacion: string;
  usuarioModificacion: string | null;
  fechaModificacion: string | null;
  activo: boolean;
}
