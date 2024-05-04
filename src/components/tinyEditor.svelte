<script context="module" lang="ts">
  import type TinyMCEOptions from "@tinymce/tinymce-svelte";
  declare var tinyMCE: TinyMCEOptions;
</script> 

<script lang="ts">
  import { post, tinyEditor } from '../stores/writables';
  import Editor from '@tinymce/tinymce-svelte';
  import he from 'he';
  
  export let apiKey: string;
  export let conf: { plugins: string[], toolbar: string } = {
    plugins: ['anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount', 'linkchecker'],
    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat'
  }
  export let inline: boolean = false;

  function handleTinyEditorInit(e: { detail: { editor: TinyMCEOptions; }; }) {
    const { editor } = e.detail;
    editor.setContent(he.decode($post?.content || ''));
    tinyEditor.set(editor);
  }
</script>

<Editor
  apiKey={apiKey}
  conf={conf}
  inline={inline}
  disabled={false}
  modelEvents="input change undo redo"
  on:init={handleTinyEditorInit}
  id="content"
/>