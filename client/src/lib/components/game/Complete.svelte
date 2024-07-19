<script lang="ts">
	// Modules and libraries
	import Icon from '@iconify/svelte';

	// Variables
	export let question: string;
	export let correct: boolean = true;
</script>

<div class="flex flex-col w-full p-2 pt-4 rounded-lg bg-base-200 min-h-72 md:min-h-96">
	<div class="flex flex-row justify-center pb-2 text-2xl font-bold">
		{#if correct}
			Correct!
		{:else}
			Incorrect
		{/if}
	</div>
	<hr class="mb-4" />
	<!-- This is shown on medium and larger screens -->
	<div class="flex-row items-stretch justify-center hidden w-full md:flex">
		<div class="flex flex-col w-2/3 h-full pl-8 pr-8">
			<div class="flex text-lg font-bold">Question</div>
			<img src={question} alt="Question" class="flex w-full" />
			<div class="flex mb-4 text-lg font-bold">Answer</div>
			<div class="flex text-md">Enter an answer here</div>
		</div>
		<div class="flex flex-col w-1/3 h-full justify-left">
			<div class="flex mt-auto mb-4 font-bold">Stats</div>
			<div class="flex flex-col w-full gap-2">
				<div class="flex flex-row items-center">
					<span class="mr-2 text-2xl text-success"
						><Icon icon="material-symbols:check-box-outline" />
					</span>
					<span class="text-lg text-success">63%</span>
				</div>

				<div class="flex flex-row items-center">
					<span class="mr-2 text-2xl text-warning"
						><Icon icon="material-symbols:disabled-by-default-outline-rounded" />
					</span>
					<span class="text-lg text-warning">29%</span>
				</div>

				<div class="flex flex-row items-center">
					<span class="mr-2 text-2xl text-info"
						><Icon icon="material-symbols:timer-off-outline" />
					</span>
					<span class="text-lg text-info">8%</span>
				</div>
			</div>
		</div>
	</div>

	<!-- This is shown on mobile or small screens -->
	<div class="flex-row items-stretch justify-center w-full pb-4 md:hidden">
		<div class="flex flex-col pl-4 pr-4">
			<div class="flex text-lg font-bold">Question</div>
			<img src={question} alt="Question" class="flex w-full" />

			<div class="flex mb-4 text-lg font-bold">Answer</div>
			<div class="flex mb-4 text-md">Enter an answer here</div>

			<div class="flex mt-auto mb-4 font-bold">Stats</div>
			<div class="flex flex-row justify-between">
				<div class="flex">
					<span class="mr-2 text-2xl text-success"
						><Icon icon="material-symbols:check-box-outline" />
					</span>
					<span class="text-lg text-success">63%</span>
				</div>

				<div class="flex">
					<span class="mr-2 text-2xl text-warning"
						><Icon icon="material-symbols:disabled-by-default-outline-rounded" />
					</span>
					<span class="text-lg text-warning">29%</span>
				</div>

				<div class="flex">
					<span class="mr-2 text-2xl text-info"
						><Icon icon="material-symbols:timer-off-outline" />
					</span>
					<span class="text-lg text-info">8%</span>
				</div>
			</div>
		</div>
	</div>
</div>
