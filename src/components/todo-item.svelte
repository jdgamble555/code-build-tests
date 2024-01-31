<script lang="ts">
	import { fly } from 'svelte/transition';
	import { deleteTodo, updateTodo } from '$lib/firebase';

	export let todo: Todo;

	function remove() {
		deleteTodo(todo.id);
	}

	function toggleStatus() {
		updateTodo(todo.id, !todo.complete);
	}
</script>

<li in:fly={{ x: 900, duration: 500 }}>
	<span class:complete={todo.complete}>{todo.text} - {todo.id}</span>
	{#if todo.complete}
		<button class="text-green-600 line-through" on:click={toggleStatus}> ✔️ </button>
	{:else}
		<button on:click={toggleStatus}> ❌ </button>
	{/if}
	<button on:click={remove}> 🗑 </button>
</li>
