export enum NotificationType {
	SUCCESS = 'alert-success',
	FAILURE = 'alert-fail',
}

export interface NotificationPayload {
	type: NotificationType;
	message: string;
}
