<script lang="ts">
	import { addTodo, getTodos } from '$lib/firebase';
	import TodoItem from '@components/todo-item.svelte';

	export let user: UserType;

	// Form Text
	let text = 'some task';

	const todos = getTodos(user.uid);

	function add() {
		addTodo(user.uid, text);
		text = '';
	}
</script>

{#if $todos?.length}
	<ul>
		{#each $todos || [] as todo}
			<TodoItem {todo} />
		{/each}
	</ul>
{/if}
<form on:submit|preventDefault={add}>
	<input class="border p-2 rounded-lg" bind:value={text} />
	<button class="border p-2 rounded-lg bg-purple-600 text-white font-semibold" type="submit">Add Task</button>
</form>
