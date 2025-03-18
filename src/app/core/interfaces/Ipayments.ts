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

  