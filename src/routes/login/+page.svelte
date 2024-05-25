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
  <h1 class="form-container-heading">Login Form</h1>
  <form id="login-form-id" action="" class="form" on:submit={submitForm}>
    <div class="form__field">
      <label for="email">Email: </label>
      <input type="email" name="email" required />
    </div>
    <div class="form__field">
      <label for="password">Password: </label>
      <input type="password" name="password" required />
    </div>
    <div class="form__field buttons">
      <button class="form__submit-btn">Login</button>
    </div>
  </form>
</div>

<style lang="scss">
  .form-container {
    width: fit-content;
    height: fit-content;
    margin: 4rem auto;
    padding: 1rem 1.25rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .3);
  }

  .form-container-heading {
    color: var(--dark-blue);
    font-weight: bold;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: .75rem;
    width: fit-content;
    margin: 1rem 0 0;

    &__field {
      display: flex;
      align-items: center;

      &.buttons {
        width: fit-content;
        margin: 1rem auto .5rem;
      }

      label {
        flex: 1;
        padding: 0 .5rem;
        font-size: clamp(14px, 4.5vw, 16px);
      }

      input {
        padding: .25rem .5rem;
      }
    }

    &__submit-btn {
      padding: .5rem 1rem;
      cursor: pointer;
      font-size: 16px;
      color: white;
      background-color: var(--light-blue);
      border-radius: 10px;
      border: none;
      box-shadow: 0 1px 2px rgba(0, 0, 0, .3);

      &:hover, &:active {
        box-shadow: 0 3px 6px rgba(0, 0, 0, .3);
      }
    }
  }
</style>