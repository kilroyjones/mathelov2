<script lang="ts">
	// Components
	import LoggedIn from './LoggedIn.svelte';
	import LoggedOut from './LoggedOut.svelte';
	import ToggleLightDarkMode from './ToggleLightDarkMode.svelte';

	// Types and variables
	import { user } from '$lib/stores/user.store';

	export let inGame: boolean = false;
</script>

<div class="navbar bg-base-200 {inGame ? 'fixed' : ''}">
	<div class="flex-1">
		<a href="/" class="text-xl btn btn-ghost">MathElo</a>
		<div class="flex-none">
			<ToggleLightDarkMode></ToggleLightDarkMode>
		</div>
	</div>

	{#if $user}
		{#if $user.avatar}
			<LoggedIn avatar={$user.avatar}></LoggedIn>
		{:else if $user.avatarUrl}
			<LoggedIn avatar={$user.avatarUrl}></LoggedIn>
		{:else}
			<LoggedIn avatar={undefined}></LoggedIn>
		{/if}
	{:else}
		<LoggedOut></LoggedOut>
	{/if}
</div>
