export enum SortUserFields {
	ID = 'id',
	CODE = 'code',
	EMAIL = 'email',
	NAME = 'name',
	ROLE = 'role',
	STATUS = 'status',
	LAST_LOGIN = 'lastLogin',
	DEACTIVATED_TIME = 'deactivatedTime',
	UPDATED_TIME = 'updatedTime',
	CREATED_TIME = 'createdTime',
}

export enum UserRoles {
	JETQ = 'JETQ',
	MERCHANT = 'MERCHANT',
	DRIVER = 'DRIVER',
}

export enum UserStatuses {
	ACTIVATED = 'ACTIVATED',
	DEACTIVATED = 'DEACTIVATED',
}
