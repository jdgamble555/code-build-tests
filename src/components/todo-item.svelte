<script lang="ts">
	import { fly } from 'svelte/transition';
	import { deleteTodo, updateTodo } from '$lib/todos';

	export let todo: Todo;
	export let user: UserType;

	function remove() {
		deleteTodo(todo.id, user.uid);
	}

	function toggleStatus() {
		updateTodo(todo.id, !todo.complete);
	}
</script>

<li in:fly={{ x: 900, duration: 500 }}>
	<span class={todo.complete ? 'text-green-600 line-through' : ''}>
		{todo.text} - {todo.id}
	</span>
	{#if todo.complete}
		<button on:click={toggleStatus}> ✔️ </button>
	{:else}
		<button on:click={toggleStatus}> ❌ </button>
	{/if}
	<button on:click={remove}> 🗑 </button>
</li>
