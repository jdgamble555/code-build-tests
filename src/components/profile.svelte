<script lang="ts">
	export let user: UserType;
</script>

<div class="flex flex-col justify-center items-center gap-3">
	<h3 class="text-2xl font-bold">Hi {user.displayName}!</h3>

	<img src={user.photoURL} width="100" alt="user avatar" />
	<p>Your userID is {user.uid}</p>
</div>
