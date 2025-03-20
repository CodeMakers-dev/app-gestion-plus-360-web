export interface IUsuario {
    id: number;
    usuario: string;
    persona: IPersona;
  }
  
  export interface IPersona {
    id: number;
    nombre: string;
  }


  export interface ITipoPlan {
    id: number;
    nombre: string;
  }

  export interface IOrigenPago {
    id: number;
    nombre: string;
  }

  export interface IDestinoPago{
    id: number;
    nombre: string;
  }

  export interface IPagos{
    id: number;
    persona: IPersona;
    tipoPlan: ITipoPlan;
    origenPago: IOrigenPago;
    destinoPago: IDestinoPago;
    valorPago: number;
    referencia: string;
    fechaPago: Date;
    vigenciaDesde:Date;
    vigenciaHasta:Date;
    diasVigencia:string;
    usuarioCreacion: string;
    fechaCreacion: string;
    usuarioModificacion: string | null;
    fechaModificacion: string | null;
    activo: boolean;
  }