const layout = require("../layout");
const { getError } = require("../../helpers");

module.exports = ({ req, errors }) => {
  return layout({
    content: `
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-one-quarter">
            <form method="POST">
              <h1 class="title">Sign Up</h1>
                <div class="field">
                  <label class="label">Email</label>
                  <input required class="input" name="email" placeholder="Email" />
                  <p class="help is-danger">${getError(errors, "email")}</p>
                </div>
                <div class="field">
                  <label class="label">Password</label>
                  <input required class="input" name="password" placeholder="Password" type="password" />
                  <p class="help is-danger">${getError(errors, "password")}</p>
                </div>
                <div class="field">
                  <label class="label">Password Confirmation</label>
                  <input required class="input" name="passwordConfirmation" placeholder="Password Confirmation" type="password" />
                  <p class="help is-danger">${getError(
                    errors,
                    "passwordConfirmation"
                  )}</p>
                </div>  
                <button class="button is-primary">Submit</button>
              </form>
              <a href="/signin">Have an account? Sign In</a>
            </div>
          </div>
        </div>`
  });
};
