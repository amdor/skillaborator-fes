export interface LoginResponse {
	email: string;
	token: string;
	nextSkillaborationStart: string;
}


export interface OneTimeCodeResponse {
    oneTimeCode: string;
}