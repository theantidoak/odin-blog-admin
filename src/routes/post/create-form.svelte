<script lang="ts">
  import { onMount } from 'svelte';
  import { hasLoaded, responseMessage } from '../../stores/user';
  import { post } from '../../stores/user';
  import Editor from '@tinymce/tinymce-svelte';
  import he from 'he';

  let tinyMCEEditor: any;
  let contentValue: string = he.decode($post?.content || '');

  onMount(() => {
    hasLoaded.set(true);
  })

  const conf = {
    plugins: ['anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount', 'linkchecker'],
    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat'
  };

  async function createPost(e: Event) {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    formData.set('content', contentValue);
    
    try {
      const response = await fetch(form.action, {
        method: $post?.title ? 'PUT' : 'POST',
        body: formData
      });

      const result = await response.json();

      if (!result) {
        console.error('Error creating post:', result);
        return;
      }

      responseMessage.set(result.message);
      setTimeout(function() {
        responseMessage.set('');
      }, 10000);
    } catch (err) {
      console.error('Nework error: ', err);
    }

  }

</script>

<div class="form-container">
  <form class="form" action="/api/posts{$post?.title ? '/' + $post.slug : ''}" on:submit={createPost}>
    <div class="form__field title-field">
      <label for="title">Title:</label>
      <input type="text" name="title" id="title" value={$post?.title || ''} />
    </div>
    <div class="form__field">
      <p id="editor-container">
        <Editor
          apiKey="wzdghp9v2dxfstcizj5b7v7d047m5yh6odsemgd5awbvmoz1"
          {conf}
          inline={true}
          disabled={false}
          modelEvents="input change undo redo"
          bind:value={contentValue}
          bind:this={tinyMCEEditor}
          id="content"
        />
      </p>
    </div>
    <input type="hidden" name="id" value={$post?._id || ''}>
    <input type="hidden" name="published" value={$post?.is_published || false}>
    <div class="form__field">
      <button>Submit</button>
    </div>
  </form>
  <p class="form-message {$responseMessage !== '' ? 'has-message' : ''}">{$responseMessage}</p>
  <!-- <div>
    <p>Preview: </p>
    <div>{@html contentValue}</div>
  </div> -->
</div>

<!-- svelte-ignore css-unused-selector -->
<style lang="scss">
  .form-container {
    position: relative;
  }

  .form {
    display: flex;
    flex-direction: column;

    &__field {
      margin: 0 0 1rem;
      display: flex;
      gap: .5rem;
      align-items: center;
    }

    label {
      font-size: clamp(18px, 4.5vw, 21px);
      font-weight: bold;
    }

    input {
      padding: .5rem .75rem;
      border-radius: 4px;
      border: none;
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

  #editor-container {
    min-height: 10rem;
    border-radius: 8px;
    border: 2px solid var(--dark-blue);
    margin: 0;
    width: 100%;
    padding: 1rem;
    background-color: white;

    :global(.mce-content-body) {
      min-height: 7.75rem;
    }
  }

  .form-message {
    color: var(--dark-blue);
    font-weight: bold;
    margin: 1rem 0;
    padding: .5rem 1rem;
    font-size: 14px;
    position: absolute;
    bottom: 0rem;
    border-radius: 5px;
    left: 8rem;
    height: fit-content;
    width: fit-content;

    &.has-message {
      background-color: white;
    }
  }
</style>