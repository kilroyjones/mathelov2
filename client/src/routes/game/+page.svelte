<script lang="ts">
	// Libraries and modules
	import { onDestroy, onMount } from 'svelte';

	// Component
	import Playing from '$lib/components/game/Playing.svelte';

	// Type
	import type { Question } from '$lib/types/messages';

	// Variables
	import { playStore, PlayState } from '$lib/stores/games/play.store';
	import { socketStore } from '$lib/stores/games/websocket.store';

	// Question
	let question: string;
	let timer: number;

	let answer: string;
	let answerInput: HTMLInputElement;

	/**
	 *
	 */
	function nextQuestion() {
		socketStore.sendMessage('message', { type: 'get-question', data: {} });
	}

	/**
	 *
	 * @param event
	 */
	function handleKeyUp(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleSubmit();
		}
	}

	/**
	 *
	 */
	function handleSubmit() {
		socketStore.sendMessage('message', { type: 'answer-question', data: { answer: answer } });
	}

	/**
	 *
	 * @param newQuestion
	 */
	function handleReceiveQuestion(newQuestion: Question) {
		question = newQuestion.question;
		timer = newQuestion.time;
		playStore.setPlayState(PlayState.Playing);
	}

	/**
	 *
	 */
	onMount(() => {
		socketStore.connect();

		const unsubscribe = socketStore.subscribe((socket) => {
			if (socket) {
				socket.off('message');

				// Handle all messages
				socket.on('message', (message: any) => {
					const { type, msg } = message;

					switch (type) {
						case 'get-question':
							handleReceiveQuestion(msg);
							break;
					}
				});
			}
		});

		return () => {
			unsubscribe();
		};
	});

	/**
	 *
	 */
	onDestroy(() => {
		socketStore.disconnect();
		playStore.setPlayState(PlayState.Waiting);
	});
</script>

<div class="flex justify-center h-full min-h-screen">
	<div class="w-full grid lg:grid-cols-3 md:grid-cols-[1fr_2fr_1fr] sm:grid-cols-1">
		<div class="hidden p-4 sm:block"></div>
		<div class="flex items-center justify-center">
			{#if $playStore.playState == PlayState.Waiting}
				<button class="btn" on:click={nextQuestion}> Next question</button>
			{:else if $playStore.playState == PlayState.Playing}
				<Playing {question} {timer} {handleKeyUp} {handleSubmit}></Playing>
			{/if}
		</div>
		<div class="hidden p-4 sm:block"></div>
	</div>
</div>
