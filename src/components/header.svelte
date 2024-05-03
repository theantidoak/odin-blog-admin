<script lang="ts">
  import { isLoggedIn } from "../stores/writables";
  
  async function logOut(e: Event) {
    try {
      const response = await fetch(`/api/logout`, {
        method: 'POST'
      });

      if (!response.ok) {
        console.error(`Logout API error: ${response.status}`, response.statusText);
        return;
      }

      const { success, message} = await response.json();

      if (success) {
        location.reload();
      }

    } catch (err) {
      console.error('Nework error: ', err);
    }
  }
</script>

<header id="header">
  <nav class="nav">
    <a class="nav__item" href="/">Posts</a>
    {#if $isLoggedIn}
      <button class="nav__item" on:click={logOut}>Log out</button>
    {:else}
      <a class="nav__item" href="/login">Log in</a>
    {/if}
  </nav>
</header>

<style lang="scss">
  header {
    width: 100%;
    height: 4.5rem;
    display: flex;
    align-items: center;

    .nav {
      width: fit-content;
      display: flex;
      gap: 2rem;
      margin: auto;

      &__item {
        background-color: transparent;
        border: none;
        font-size: 15px;
        text-decoration: none;
        font-family: inherit;
        color: var(--dark-blue);
        font-weight: bold;
        cursor: pointer;

        &::after {
          display: block;
          content: "";
          border-bottom: 2px solid rgba(0,0,0,0);
          transition: all .3s linear;
          transform-origin: 0% 50%;
          transform: scaleX(0);
          padding: .25rem 0 0;
        }

        &:hover {

          &::after {
            border-bottom-color: var(--primary-color-1);
            transform: scaleX(1);
          }
        }
      }
    }

  }
  
</style>