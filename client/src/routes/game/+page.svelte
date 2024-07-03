<script lang="ts">
	// Libraries and modules
	import { onDestroy, onMount } from 'svelte';

	// Type and enums
	import { PlayState } from '$lib/stores/games/play.store';

	// Variables
	import { playStore } from '$lib/stores/games/play.store';
	import { socketStore } from '$lib/stores/games/websocket.store';

	const focus = (element: HTMLInputElement) => element.focus();

	let question: string;
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
	 */
	function submitAnswer() {
		socketStore.sendMessage('message', { type: 'answer-question', data: { answer: answer } });
	}

	/**
	 *
	 * @param event
	 */
	function handleKeyUp(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			submitAnswer();
		}
	}

	/**
	 *
	 */
	onMount(() => {
		socketStore.connect();

		const unsubscribe = socketStore.subscribe((socket) => {
			if (socket) {
				socket.off('message');
				socket.on('message', (message: any) => {
					const { type, msg } = message;
					switch (type) {
						case 'get-question':
							playStore.setPlayState(PlayState.Answering);
							question = msg.question;
							console.log(answerInput);
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
		<div class="hidden p-4 sm:block">Left Column</div>
		<div class="flex items-center justify-center p-4">
			{#if $playStore.playState == PlayState.Waiting}
				<button class="btn" on:click={nextQuestion}> Next question</button>
			{:else if $playStore.playState == PlayState.Answering}
				<div class="flex flex-col items-center justify-center p-4">
					<div class="flex mb-4 text-4xl">
						{question}
					</div>
					<div class="flex">
						<input
							class="mr-2 text-center std-input-field"
							bind:value={answer}
							on:keyup={handleKeyUp}
							use:focus
						/>
						<button class="btn" on:click={submitAnswer}>Submit</button>
					</div>
				</div>
			{/if}
		</div>
		<div class="hidden p-4 sm:block">Right Column</div>
	</div>
</div>
