<script lang="ts">
  import CreateForm from "../create-form.svelte";
  import { post } from "../../../stores/user";
  import { page } from '$app/stores';
  import { comments } from "../../../stores/auth";
  const { body } = $page.data;
  post.set(body.post);
  comments.set(body.comments);

  async function deleteComment(e: Event) {
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

<div>
  <CreateForm />
  <div class="comments">
    <ul class="comments__list">
      {#each $comments as comment}
        <li class="comments__list-item">
          <p>{comment.content}</p>
          <p>{comment.author}</p>
          <p>{comment.likes}</p>
          <button on:click={deleteComment} data-comment-id="{comment._id}">Delete Comment</button>
        </li>
      {/each}
    </ul>
  </div>
</div>

<style lang="scss"></style>