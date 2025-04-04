import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MessageNotifications } from "@core/interfaces/ImessageNotifications";
import { MensajesMasivos } from "@core/interfaces/Imessages";
import { ApiResponse } from "@core/interfaces/Iresponse";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MensajeService {
  private apiUrl = '/api/v1/Mensaje';

  constructor(private http: HttpClient) {}

  getMensajes(): Observable<MensajesMasivos[]> {
    return this.http.get<MensajesMasivos[]>(this.apiUrl);
  }

  getMessagesByUserId(userId: number): Observable<ApiResponse<MessageNotifications[]>> {
    return this.http.get<ApiResponse<MessageNotifications[]>>(`${this.apiUrl}/usuario/${userId}`);
  }

  updateNotificationStatus(notification: MessageNotifications): Observable<ApiResponse<MessageNotifications>> {
    const body = {
      id: notification.id,
      usuario: notification.usuario,
      titulo: notification.titulo,
      descripcion: notification.descripcion,
      usuarioCreacion: notification.usuarioCreacion,
      fechaEnvio: notification.fechaEnvio,
      fechaCreacion: notification.fechaCreacion,
      usuarioModificacion: notification.usuarioModificacion,
      fechaModificacion: new Date().toISOString(),
      activo: notification.activo
    };
    return this.http.post<ApiResponse<MessageNotifications>>(`http://localhost:8080/api/v1/Mensaje/send`, body);
  }

  sendMessage(mensaje: any) {
    return this.http.post(`${this.apiUrl}/send`,mensaje)
  }

  sendMessageAll(mensaje: any) {
    return this.http.post(`${this.apiUrl}/sendAll`,mensaje)
  }
}
