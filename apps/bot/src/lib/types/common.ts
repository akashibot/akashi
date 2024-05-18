export interface TranslationResult {
	translations: {
		text: string;
		to: string;
		sentLen?: {
			srcSentLen: number[];
			transSentLen: number[];
		};
		transliteration?: {
			script: string;
			text: string;
		};
		alignment?: object;
	}[];
	detectedLanguage?: {
		language: string;
		score: number;
	};
}
