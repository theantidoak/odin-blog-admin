<script lang="ts">
  import CreateForm from "../create-form.svelte";
  import { post } from "../../../stores/user";
  import { page } from '$app/stores';
  const { body } = $page.data;
  post.set(body.post);

</script>

<CreateForm />