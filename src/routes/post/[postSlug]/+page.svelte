<script lang="ts">
  import { page } from '$app/stores'; 
  import { post, comments, isAdmin } from "../../../stores/writables";
  
  const { body } = $page.data;
  post.set(body.post);
  comments.set(body.comments);

  async function deleteComment(e: Event) {
    if (!$isAdmin) return;

    const btn = e.currentTarget as HTMLButtonElement;
    const { commentId } = btn.dataset;

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (!result) {
        console.error('Error deleting comment:', result);
        return;
      }

      comments.set($comments.filter((comment) => comment._id !== commentId));
    } catch (err) {
      console.error('Nework error: ', err);
    }
  }

</script>

<div class="comments">
  <h2>Comments:</h2>
  <ul class="comments__list">
    {#each $comments as comment}
      <li class="comments__list-item">
        <div class="comments__list-item-field">
          <p class="comments__content">{comment.content}</p>
          <p class="comments__likes">
            <span>{comment.likes}</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <title>heart-multiple</title>
              <path d="M13.5,20C6.9,13.9 3.5,10.8 3.5,7.1C3.5,4 5.9,1.6 9,1.6C10.7,1.6 12.4,2.4 13.5,3.7C14.6,2.4 16.3,1.6 18,1.6C21.1,1.6 23.5,4 23.5,7.1C23.5,10.9 20.1,14 13.5,20M12,21.1C5.4,15.2 1.5,11.7 1.5,7C1.5,6.8 1.5,6.6 1.5,6.4C0.9,7.3 0.5,8.4 0.5,9.6C0.5,13.4 3.9,16.5 10.5,22.4L12,21.1Z" />
            </svg>
          </p>
        </div>
        <div class="comments__list-item-field author-and-button">
          <p>By: {comment.author}</p>
          <button on:click={deleteComment} data-comment-id="{comment._id}" disabled={!$isAdmin}>Delete</button>
        </div>
      </li>
    {/each}
  </ul>
</div>

<style lang="scss">

  .comments {

    h2 {
      margin: 1rem 0 .5rem;
    }

    &__list {
      display: flex;
      flex-direction: column;
      list-style: none;
      gap: 1rem;
    }

    &__list-item {
      padding: .5rem .75rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .3);
      border-radius: 5px;
    }

    &__list-item-field {
      display: flex;
      align-items: center;
      gap: .75rem;
      font-weight: bold;
      position: relative;

      &.author-and-button {
        margin: 1.5rem 0 0;
        width: 100%;
        justify-content: space-between;
        font-size: 14px;
      }
    }

    &__content {
      margin: .25rem 0 1rem;
      width: calc(100% - 2rem);
      padding: .5rem .5rem;
    }

    &__likes {
      display: flex;
      align-items: center;
      gap: .25rem;
      position: absolute;
      top: 0;
      right: 0;
      color: var(--light-blue);
      font-weight: bold;

      svg {
        height: 1.25rem;
        width: 1.25rem;
        min-width: 1.25rem;
        fill: currentColor;
      }
    }

    button {
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
    }
  }
</style>