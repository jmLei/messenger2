const redirect = () => {
    if(localStorage.getItem("id") === null) {
        window.location.replace("http://localhost:8080/index.html");
    }
};

redirect();

const logoutButton = document.getElementById("logout-button");

logoutButton.addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.removeItem("id");
    console.log(localStorage.getItem("id"));
    redirect();
});
