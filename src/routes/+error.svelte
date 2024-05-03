<script lang="ts">
  import { page } from '$app/stores';

</script>

<div>
  <h1>Error: {$page?.status}</h1>
  <p>{$page?.error?.message}</p>
</div>

<style>
  div {
    padding: 1rem;
    font-family: Arial, sans-serif;
    width: fit-content;
    margin: 0 auto;
  }

  h1 {
    margin: 0 0 1rem;
    text-align: center;
  }

  p {
    text-align: center;
  }
</style>