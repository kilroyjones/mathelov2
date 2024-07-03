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

export interface PlayStore {
	playState: PlayState;
	currentQuestion: Question | null;
	setPlayState: (state: PlayState) => void;
	setCurrentQuestion: (question: Question) => void;
	resetCurrentQuestion: () => void;
}

const initialState: Omit<
	PlayStore,
	'setPlayState' | 'setCurrentQuestion' | 'resetCurrentQuestion'
> = {
	playState: PlayState.Waiting,
	currentQuestion: null
};

function createPlayStore() {
	const { subscribe, update } = writable(initialState);

	return {
		subscribe,
		setPlayState: (state: PlayState) => {
			update((store) => {
				return { ...store, playState: state };
			});
		},
		setCurrentQuestion: (question: Question) => {
			update((store) => {
				return { ...store, currentQuestion: question };
			});
		},
		resetCurrentQuestion: () => {
			update((store) => {
				return { ...store, currentQuestion: null };
			});
		}
	};
}

export const playStore = createPlayStore();
