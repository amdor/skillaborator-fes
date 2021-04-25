import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { NotificationPayload, NotificationType } from './notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notificationSubject: Subject<NotificationPayload> = new Subject();
  private notificationObservable: Observable<NotificationPayload> = this.notificationSubject.asObservable();

  subscribe(
    success: (value: NotificationPayload) => void,
    err?: (err: any) => void
  ) {
    return this.notificationObservable.subscribe({ next: success, error: err });
  }

  showNotification(type: NotificationType, msg: string = '') {
    if (msg) {
      this.notificationSubject.next({ type, message: msg });
    }
  }
}
