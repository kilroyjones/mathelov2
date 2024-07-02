<script lang="ts">
	// Libraries and modules
	import '../app.css';
	import { user } from '$lib/stores/user.store';

	// Components
	import Navbar from '$lib/components/navbar/Navbar.svelte';

	// Types and variables
	import type { LayoutServerData } from './$types';

	export let data: LayoutServerData;

	$: $user = data.user;
</script>

<Navbar></Navbar>
<slot />
