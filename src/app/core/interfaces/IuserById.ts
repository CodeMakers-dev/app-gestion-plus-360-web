export interface ITipoPersona {
  id: number;
  nombre: string;
  descripcion: string;
  usuarioCreacion: string;
  fechaCreacion: string;
  usuarioModificacion: string | null;
  fechaModificacion: string | null;
  activo: boolean;
}

export interface ITipoDocumento {
  id: number;
  nombre: string;
  descripcion: string;
  usuarioCreacion: string;
  fechaCreacion: string;
  usuarioModificacion: string | null;
  fechaModificacion: string | null;
  activo: boolean;
}

export interface IPais {
  id: number;
  nombre: string;
  codigoIso: string;
  usuarioCreacion: string;
  fechaCreacion: string;
  usuarioModificacion: string | null;
  fechaModificacion: string | null;
  activo: boolean;
}

export interface IDepartamento {
  id: number;
  nombre: string;
  pais: IPais;
  usuarioCreacion: string;
  fechaCreacion: string | null;
  usuarioModificacion: string | null;
  fechaModificacion: string | null;
  activo: boolean;
}

export interface ICiudad {
  id: number;
  nombre: string;
  departamento: IDepartamento;
  usuarioCreacion: string;
  fechaCreacion: string | null;
  usuarioModificacion: string | null;
  fechaModificacion: string | null;
  activo: boolean;
}

export interface IPersona {
  id: number;
  tipoPersona: ITipoPersona;
  nombre: string;
  tipoDocumento: ITipoDocumento;
  numeroDocumento: string;
  pais: IPais;
  departamento: IDepartamento;
  ciudad: ICiudad;
  direccion: string;
  actividadEconomica: string;
  telefono: string;
  correo: string;
  imagen: string | null;
  usuarioCreacion: string;
  fechaCreacion: string;
  usuarioModificacion: string | null;
  fechaModificacion: string | null;
  activo: boolean;
}

export interface IUserById {
  id: number;
  usuario: string;
  password: string;
  usuarioCreacion: string;
  fechaCreacion: string;
  usuarioModificacion: string | null;
  fechaModificacion: string | null;
  lstRol: any | null; // No se especifica la estructura de roles en el JSON
  activo: boolean;
  token: string | null;
  persona: IPersona;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  code: number;
  response: T;
}
