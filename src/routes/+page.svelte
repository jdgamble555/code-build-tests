<script lang="ts">
	import { loginWithGoogle, logout, user } from '$lib/firebase';
	import Todos from '@components/todos.svelte';
	import Profile from '@components/profile.svelte';
	
</script>

<section class="flex flex-col gap-3 p-5 items-center">
	{#if $user}
		<Profile user={$user} />
		<button class="border bg-blue-600 text-white w-fit p-3 rounded-lg font-semibold" on:click={logout}>Logout</button>
		<hr />
		<Todos user={$user} />
	{:else}
		<button class="bg-red-600 text-white font-semibold p-2" on:click={loginWithGoogle}>Signin with Google</button>
	{/if}
</section>

