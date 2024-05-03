<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

</script>

<main>
  <h1>Error: {$page?.status}</h1>
  <p>{$page?.error?.message}</p>
</main>

<style>
  main {
    padding: 1rem;
    font-family: Arial, sans-serif;
  }
</style>