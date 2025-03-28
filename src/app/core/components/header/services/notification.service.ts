import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private notificationCreatedSource = new Subject<void>();
    notificationCreated$ = this.notificationCreatedSource.asObservable();

    notifyNotificationCreated() {
        this.notificationCreatedSource.next();
    }
}