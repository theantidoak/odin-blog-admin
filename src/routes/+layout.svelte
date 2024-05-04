<script lang="ts">
  import { page } from "$app/stores";
  import { isAdmin, isLoggedIn } from "../stores/writables";
  import Header from "../components/header.svelte";
  import Footer from "../components/footer.svelte";

  isLoggedIn.set($page.data.authData?.success);
  isAdmin.set($page.data.authData?.user.is_admin);

</script>

<Header></Header>
<main id="main">
  <slot />
</main>
<Footer></Footer>

