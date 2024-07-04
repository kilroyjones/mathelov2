<script lang="ts">
	// Libraries and modules
	import '../app.css';
	import { user } from '$lib/stores/user.store';

	// Types and variables
	import type { LayoutServerData } from './$types';

	export let data: LayoutServerData;

	$: $user = data.user;
</script>

<slot />
