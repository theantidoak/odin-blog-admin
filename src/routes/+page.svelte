<script lang="ts">
  import { page } from '$app/stores';
  import { isAdmin, posts } from '../stores/writables';
  const { body, success } = $page.data;
  posts.set(body.posts ? body.posts : $posts);

  async function deletePost(e: Event) {
    if (!$isAdmin) return;

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
    if (!$isAdmin) return;

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

      btn.textContent = result.post.is_published ? 'unPublish' : 'Publish';
      btn.style.backgroundColor = result.post.is_published ? 'var(--light-blue)' : 'var(--dark-blue)';
    } catch (err) {
      console.error('Nework error: ', err);
    }
  }

</script>

<div class="home">
  {#if $posts}
    <div class="home__heading-container">
      <h1 class="home__heading">Posts</h1>
      <a class="home__add-new-post-link" aria-label="Go to create post page" href="/post">
        <svg class="home__add-new-post-link-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>Create New Post</title>
          <path d="M17,13H13V17H11V13H7V11H11V7H13V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
        </svg>
      </a>
    </div>
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
            <button on:click={publishPost} style="background-color: {post.is_published ? 'var(--light-blue)' : 'var(--dark-blue)'}" data-slug="{post.slug}" data-id="{post._id}" disabled={!$isAdmin}>{post.is_published ? 'Unpublish' : 'Publish'}</button>
            <button on:click={deletePost} data-slug="{post.slug}" disabled={!$isAdmin}>Delete</button>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
  </div>

<style lang="scss">

  .home {

    &__heading-container {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin: 0 0 1.5rem;
    }

    &__heading {
      font-size: clamp(26px, 5vw, 30px);
    }

    &__add-new-post-link {
      height: clamp(26px, 5vw, 30px);
      border: none;
      background-color: transparent;
    }

    &__add-new-post-link-svg {
      height: 100%;
      width: auto;
      fill: var(--dark-blue);
      cursor: pointer;
      transition: all .3s linear;

      &:hover {
        transform: scale(1.05);
        background-color: transparent;
      }
    }

    &__posts {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    &__post {
      display: flex;
      align-items: center;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .3);
      padding: 1rem clamp(.25rem, 4vw, 1rem);
      transition: all linear .3s;
      background-color: white;
      position: relative;
    }

    &__post-heading {
      margin: 0 0 1rem;
      font-size: clamp(22px, 5vw, 26px);
    }

    &__post-link {
      text-decoration: none;
      color: black;
      line-height: 1.7;
      margin: 0 0 1rem;
      width: 100%;

      @media (min-width: 768px) {
        width: calc(100% - 9rem);
      }
    }

    &__post:has(.home__post-link:hover) {
      box-shadow: 0 4px 8px rgba(0, 0, 0, .3);
    }

    &__btn-container {
      position: absolute;
      bottom: -1rem;
      right: 1rem;
      display: flex;
      width: 13rem;

      @media (min-width: 768px) {
        flex-direction: column;
        width: 7rem;
        top: 0;
        bottom: 0;
        height: 100%;
        justify-content: center;
        gap: 1rem;
      }

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

        @media (min-width: 768px) {
          flex: initial;
          margin: 0 !important;
        }

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