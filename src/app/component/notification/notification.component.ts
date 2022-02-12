import {
	ChangeDetectorRef,
	Component,
	HostBinding,
	OnDestroy,
	ViewEncapsulation,
} from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { NotificationPayload, NotificationType } from './notification.model';
import { NotificationService } from './notification.service';

@Component({
	selector: 'sk-notification',
	templateUrl: './notification.component.html',
	styleUrls: ['./notification.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class NotificationComponent implements OnDestroy {
	@HostBinding('class.sk-notification') hostCss = true;

	private subscription: Subscription;
	displayedNotifications: NotificationPayload[] = [];
	notificationTypes = NotificationType;

	constructor(
		private notificationService: NotificationService,
		private cdRef: ChangeDetectorRef
	) {
		this.subscription = this.notificationService.subscribe(
			(notification: NotificationPayload) => {
				this.popupNotification(notification);
			}
		);
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

	private popupNotification(notification: NotificationPayload) {
		this.displayedNotifications.push(notification);
		this.cdRef.detectChanges();
		timer(5000).subscribe(() => {
			this.displayedNotifications.splice(
				this.displayedNotifications.indexOf(notification),
				1
			);
			this.cdRef.detectChanges();
		});
	}
}
