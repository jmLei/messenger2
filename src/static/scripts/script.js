const redirect = () => {
    if(localStorage.getItem("id") !== null) {
        window.location.replace("http://localhost:8080/chatroom.html");
    }
};

redirect();

const loginFormButton = document.getElementById("login-form-button");

loginFormButton.addEventListener("click", (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;

    fetch(`http://localhost:8080/users/${name}`, { method: "HEAD"})
    .then((response) => {

        if(!response.ok) {
            
            fetch("http://localhost:8080/users", { 
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "_id": name,
                    "friendList": [],
                    "friendRequests": [],
                    "conversations": []
                })
            });
            
        } 
    })
    .catch((error) => {
        console.log(error);
    });

    localStorage.setItem("id", name);
    redirect();
});