const loginFormButton = document.getElementById("login-form-button");

loginFormButton.addEventListener("click", (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    console.log(name);
});