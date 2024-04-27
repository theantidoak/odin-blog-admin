<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  onMount(() => {
    console.log('page: ', $page);
  })
</script>

<main>
  <h1>Error: {$page?.status}</h1>
  <p>{$page?.error?.message}</p>
  <details>
    <summary>More info</summary>
    <pre></pre>
  </details>
</main>

<style>
  main {
    padding: 1rem;
    font-family: Arial, sans-serif;
  }
</style>