<script lang="ts">
  import { onMount } from 'svelte';
  import { responseMessage } from '../../stores/user';
  import { post } from '../../stores/user';

  onMount(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.tiny.cloud/1/wzdghp9v2dxfstcizj5b7v7d047m5yh6odsemgd5awbvmoz1/tinymce/7/tinymce.min.js';
    script.onload = () => {
      tinymce.init({
        selector: '#content',
        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker',
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
        tinycomments_mode: 'embedded',
        tinycomments_author: 'Author name',
        mergetags_list: [
          { value: 'Anonymous', title: 'User Email' }
        ],
        ai_request: (request: any, respondWith: any) => respondWith.string(() => Promise.reject("See docs to implement AI Assistant")),
      });

      tinymce.get('content').targetElm.innerHTML = $post?.content || '';
    };
    document.head.appendChild(script);
  });


  async function createPost(e: Event) {
    e.preventDefault();

    tinymce.triggerSave();

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

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

<div>
  <form class="form" action="/api/posts{$post?.title ? '/' + $post.slug : ''}" on:submit={createPost}>
    <div class="form__field">
      <label for="title">Post Title</label>
      <input type="text" name="title" id="title" value={$post?.title || ''} />
    </div>
    <div class="form__field">
      <label for="content"></label>
      <textarea id="content" name="content"></textarea>
    </div>
    <input type="hidden" name="id" value={$post?._id || ''}>
    <div class="form__field">
      <button>Submit</button>
    </div>
  </form>
  <p class="form-message">{$responseMessage}</p>
</div>