<script lang="ts">
	import { socketStore } from '$lib/stores/games/websocket.store';
	import { onDestroy, onMount } from 'svelte';

	let receivedMessages: string[] = [];
	let question: string;

	/**
	 *
	 */
	function nextQuestion() {
		socketStore.sendMessage('message', { type: 'get-question' });
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
							question = msg.question;
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
	});
</script>

<div class="flex justify-center h-full min-h-screen">
	<div class="w-full grid lg:grid-cols-3 md:grid-cols-[1fr_2fr_1fr] sm:grid-cols-1">
		<div class="hidden p-4 sm:block">Left Column</div>
		<div class="flex items-center justify-center p-4 bg-green-200">
			<div class="flex items-center justify-center p-4 bg-green-200">
				{question}
			</div>
			<button class="btn" on:click={nextQuestion}> Start</button>
		</div>
		<div class="hidden p-4 sm:block">Right Column</div>
	</div>
</div>
