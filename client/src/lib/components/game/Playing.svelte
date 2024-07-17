<script lang="ts">
	import { onMount } from 'svelte';

	// Types
	import type { KeyboardEventHandler, MouseEventHandler } from 'svelte/elements';

	// Variables
	export let question: string;
	export let timer: number = 200000;

	let answer: string = '';

	let timeIncrement: number = 100;
	let timeLeft: number;
	let percentRemaining: number;

	onMount(() => {
		timeLeft = timer;
		const interval = setInterval(() => {
			if (timeLeft > 0) {
				timeLeft -= timeIncrement;
				percentRemaining = (timeLeft / timer) * 100;
			} else {
				clearInterval(interval);
			}
		}, timeIncrement);
	});
</script>

<div class="flex flex-col w-full">
	<div class="mb-1">
		<div class="flex flex-row justify-between flex-grow-0 flex-shrink-0 w-full basis-1/6">
			<div class="p-2 text-lg font-bold rounded-md bg-secondary">ELO: 1234</div>
			<div class="p-2 text-lg font-bold rounded-md bg-primary min-w-[70px] text-center">
				{(timeLeft / 1000).toFixed(1)}
			</div>
		</div>
	</div>
	<div
		class="flex flex-col items-center justify-center w-full p-4 mb-20 rounded-lg md:mb-0 bg-base-200 md:min-h-96 min-h-72"
	>
		<div class="flex items-center justify-center flex-grow flex-shrink-0 mb-4 basis-2/3">
			<img src="demo/question.svg" alt="Question" />
		</div>
	</div>
</div>
