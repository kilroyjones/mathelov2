<script lang="ts">
	// Types
	import type { MouseEventHandler } from 'svelte/elements';

	// Variables
	export let handleNextQuestion: MouseEventHandler<HTMLButtonElement>;
</script>

<div
	class="flex flex-col items-center justify-center w-full p-4 ml-4 mr-4 rounded-lg bg-base-200 min-h-96"
>
	<button class="btn std-input-button" on:click={handleNextQuestion}> Next question</button>
</div>
