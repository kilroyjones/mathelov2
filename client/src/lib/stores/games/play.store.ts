import { writable } from 'svelte/store';

export enum PlayState {
	Answering = 'answering',
	Waiting = 'waiting',
	Error = 'error'
}

export interface Question {
	question: string;
	type: string;
	time: number;
}

export const playState = writable<PlayState>(PlayState.Waiting);
export const currentQuestion = writable<Question | null>(null);

/**
 *
 * @param state
 */
export function setPlayState(state: PlayState) {
	playState.set(state);
}

/**
 *
 * @param question
 */
export function setCurrentQuestion(question: Question) {
	currentQuestion.set(question);
}

/**
 *
 */
export function resetCurrentQuestion() {
	currentQuestion.set(null);
}
