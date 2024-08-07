<script lang="ts">
	// Libraries and modules
	import { onDestroy, onMount } from 'svelte';

	// Component
	import Icon from '@iconify/svelte';
	import Playing from '$lib/components/game/Playing.svelte';

	// Type
	import type { Question } from '$lib/types/messages';

	// Variables
	import { playStore, PlayState } from '$lib/stores/games/play.store';
	import { socketStore } from '$lib/stores/games/websocket.store';
	import Complete from '$lib/components/game/Complete.svelte';
	import Waiting from '$lib/components/game/Waiting.svelte';
	import RightBar from '$lib/components/game/RightBar.svelte';

	const focus = (element: HTMLInputElement) => element.focus();

	// Question
	let question: string = 'demo/question.svg';
	let timer: number;
	let answer: string;

	/**
	 *
	 */
	function handleNextQuestion() {
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

<div class="flex justify-center h-full min-h-screen p-4 rounded-lg md:p-2">
	<div class="w-full grid lg:grid-cols-[2fr_3fr_2fr] md:grid-cols-[1fr_4fr_1fr] sm:grid-cols-1">
		<div class="hidden p-4 sm:block"></div>
		<div class="flex flex-row items-center justify-center">
			<Playing {question} {timer}></Playing>
			<!-- <Complete {question}></Complete> -->
		</div>
		<div class="hidden p-4 sm:block"></div>
	</div>
</div>

<div class="fixed inset-x-0 bottom-0 p-4 shadow-inner bg-base-200">
	<div class="flex items-center justify-center max-w-4xl mx-auto space-x-4">
		<input
			type="text"
			class="flex-grow max-w-lg text-xl font-bold std-input-field focus:ring-2"
			placeholder="Enter your answer..."
			bind:value={answer}
			on:keyup={handleKeyUp}
			use:focus
		/>

		<button class="px-6 py-2 text-lg std-input-button" on:click={handleSubmit}>
			<Icon icon="formkit:submit" /></button
		>
	</div>
</div>
