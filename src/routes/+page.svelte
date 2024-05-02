<script lang="ts">
  import { page } from '$app/stores';
  import { posts } from '../stores/auth';
  const { body, success } = $page.data;
  posts.set(body.posts ? body.posts : $posts);

  async function deletePost(e: Event) {
    const button = e.currentTarget as HTMLButtonElement;
    const { slug } = button.dataset;

    try {
      const response = await fetch(`/api/posts/${slug}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (!result) {
        console.error('Error deleting post:', result);
        return;
      }

      posts.set($posts.filter((post) => post.slug !== slug));
    } catch (err) {
      console.error('Nework error: ', err);
    }
  }

  async function publishPost(e: Event) {
    const btn = e.currentTarget as HTMLButtonElement;
    const { slug, id } = btn.dataset;

    const formData = new FormData();
    formData.append('id', id as string);

    try {
      const response = await fetch(`/api/posts/${slug}`, {
        method: 'PUT',
        body: formData
      });

      const result = await response.json();

      if (!result) {
        console.error('Error publishing post:', result);
        return;
      }

      console.log(result.post.is_published);
      btn.textContent = result.post.is_published ? 'unPublish' : 'Publish';
      btn.style.backgroundColor = result.post.is_published ? 'var(--light-blue)' : 'var(--dark-blue)';
    } catch (err) {
      console.error('Nework error: ', err);
    }
  }

</script>

<main id="main" class="home">
  {#if $posts}
    <h1 class="home__heading">Posts</h1>
    <ul class="home__posts">
      {#each $posts as post (post._id)}
        <li class="home__post">
          <a class="home__post-link" href="/post/{post.slug}">
            {#if post.image !== ''}
              <img src="{post.image}" alt="" />
            {/if}
            <div class="home__post-description">
              <h2 class="home__post-heading">{post.title}</h2>
              <p class="home__post-excerpt">{post.excerpt}</p>
            </div>
          </a>
          <div class="home__btn-container">
            <button on:click={publishPost} data-slug="{post.slug}" data-id="{post._id}">{post.is_published ? 'Unpublish' : 'Publish'}</button>
            <button on:click={deletePost} data-slug="{post.slug}">Delete</button>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</main>

<style lang="scss">

  .home {

    &__heading {
      margin: 1rem 0 3rem;
    }

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
      background-color: var(--light-pink);
      position: relative;
    }

    &__post-link {
      text-decoration: none;
      color: black;
    }

    &__post:has(.home__post-link:hover) {
      box-shadow: 0 4px 8px rgba(0, 0, 0, .3);
    }

    &__btn-container {
      position: absolute;
      bottom: -.5rem;
      right: 1rem;
      display: flex;
      width: 13rem;

      button {
        flex: 1;
        background-color: var(--dark-blue);
        border: 1px solid var(--dark-silver);
        color: white;
        padding: .5rem 1rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .2);
        border-radius: 5px;
        transition: all linear .3s;
        cursor: pointer;

        &:hover {
          box-shadow: 0 4px 8px rgba(0, 0, 0, .3);
        }

        &:first-of-type {
          margin-right: .5rem;
        }

        &:last-of-type {
          margin-left: .5rem;
        }
      }
    }
  }

</style>