import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MensajesMasivos } from "@core/interfaces/Imessages";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MensajeService {
  private apiUrl = 'https://api.example.com/mensajes'; // Reemplaza con la URL de tu API

  constructor(private http: HttpClient) {}

  getMensajes(): Observable<MensajesMasivos[]> {
    return this.http.get<MensajesMasivos[]>(this.apiUrl);
  }
}
