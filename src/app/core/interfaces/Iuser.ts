export interface Iuser {
    id: string;
    correo: string;
    password: string; // Omitir en la interfaz del front si no lo usarás
    usuarioCreacion: string;
    fechaCreacion: string;
    usuarioModificacion: string | null;
    listaRol: any | null; // O tipar mejor si conoces la estructura de listaRol
    fechaModificacion: string | null;
    activo: boolean;
    token: string;
}
