<script lang="ts">
	import { onMount } from 'svelte';

	// Types
	import type { KeyboardEventHandler, MouseEventHandler } from 'svelte/elements';

	// Variables
	export let question: string;
	export let timer: number;
	export let handleKeyUp: KeyboardEventHandler<EventTarget>;
	export let handleSubmit: MouseEventHandler<HTMLButtonElement>;

	const focus = (element: HTMLInputElement) => element.focus();

	let answer: string = '';

	let timeIncrement: number = 100;
	let timeLeft: number;

	onMount(() => {
		timeLeft = timer;
		const interval = setInterval(() => {
			if (timeLeft > 0) {
				timeLeft -= timeIncrement;
			} else {
				clearInterval(interval);
			}
		}, timeIncrement);
	});
</script>

<div
	class="flex flex-col items-center justify-center w-full p-4 ml-4 mr-4 bg-base-200 min-h-96 border-lg"
>
	<div class="flex flex-row justify-between flex-grow-0 flex-shrink-0 w-full mb-4 basis-1/6">
		<div>ELO</div>
		<div>{(timeLeft / 1000).toFixed(1)}</div>
	</div>
	<div class="flex items-center justify-center flex-grow flex-shrink-0 mb-4 basis-2/3">
		{question}
	</div>
	<div class="flex items-center justify-center flex-grow-0 flex-shrink-0 basis-1/6">
		<div class="flex items-center">
			<input
				class="mr-2 text-center std-input-field"
				bind:value={answer}
				on:keyup={handleKeyUp}
				use:focus
			/>
			<button class="btn" on:click={handleSubmit}>Submit</button>
		</div>
	</div>
</div>
