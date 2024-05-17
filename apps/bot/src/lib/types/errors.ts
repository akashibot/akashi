export interface MemgeError {
	url?: string;
	statusCode: number;
	statusMessage: string;
	message: string;
	stack?: string[];
}
