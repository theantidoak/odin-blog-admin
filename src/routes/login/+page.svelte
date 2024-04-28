<script lang="ts">
  async function submitForm(e: Event) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const formDataSerialized = Object.fromEntries(formData);
    const jsonData = JSON.stringify(formDataSerialized);
    
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jsonData)
    });

    const responseData = await response.json();
    const { success } = responseData;

    if (success) {
      location.href = "/";
    }
  }
</script>

<div class="form-container">
  <form id="login-form-id" action="" class="form" on:submit={submitForm}>
    <div class="form__field">
      <label for="email">Email: </label>
      <input type="email" name="email" required />
    </div>
    <div class="form__field">
      <label for="password">Password: </label>
      <input type="password" name="password" required />
    </div>
    <div class="form__field">
      <button class="form__submit-btn">Login</button>
    </div>
  </form>
</div>