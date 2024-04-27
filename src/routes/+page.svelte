<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { posts } from '../stores/auth';
  const { body, success } = $page.data;
  posts.set(body.posts ? body.posts : $posts);

  onMount(() => {
    console.log('page: ', $page);
    console.log('data: ', body);
  });

</script>

<main id="main" class="home">
  {#if $posts}
    <h1 class="home__heading">Blog</h1>
    <ul class="home__posts">
      {#each $posts as post}
        <li class="home__post">
          <a class="home__post-link" href="/{post.slug}">
            {#if post.image !== ''}
              <img src="{post.img}" alt="" />
            {/if}
            <div class="home__post-description">
              <h2 class="home__post-heading">{post.title}</h2>
              <p class="home__post-excerpt">{post.excerpt}</p>
            </div>
          </a>
        </li>
      {/each}
    </ul>
  {/if}
</main>

<style lang="scss">

  .home {

    &__posts {
      list-style: none;
    }

    &__post {
      display: flex;
      align-items: center;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .3);
      padding: 1rem clamp(.25rem, 4vw, 1rem);
      transition: all linear .3s;
      cursor: pointer;

      &:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, .3);
      }
    }

    &__post-link {
      text-decoration: none;
      color: black;
    }
  }

</style>