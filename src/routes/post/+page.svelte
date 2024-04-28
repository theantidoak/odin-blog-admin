<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { responseMessage } from '../../stores/user';
  const { body, success } = $page.data;

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
          { value: body.user || 'Anonymous', title: 'User Email' }
        ],
        ai_request: (request: any, respondWith: any) => respondWith.string(() => Promise.reject("See docs to implement AI Assistant")),
      });
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
        method: form.method,
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
  <form class="form" action="/api/posts" method="post" on:submit={createPost}>
    <div class="form__field">
      <label for="title">Post Title</label>
      <input type="text" name="title" id="title" />
    </div>
    <div class="form__field">
      <label for="content"></label>
      <textarea id="content" name="content"></textarea>
    </div>
    <div class="form__field">
      <button>Submit</button>
    </div>
  </form>
  <p class="form-message">{$responseMessage}</p>
</div>