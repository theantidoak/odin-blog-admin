<script lang="ts">
  import { page } from "$app/stores";
  import { isLoggedIn } from "../stores/writables";
  import Header from "../components/header.svelte";
  import Footer from "../components/footer.svelte";

  isLoggedIn.set($page.data.isAuthorized);

</script>

<Header></Header>
<main id="main">
  <slot />
</main>
<Footer></Footer>

