const redirect = () => {
    if(localStorage.getItem("id") !== null) {
        window.location.replace("http://localhost:8080/chatroom.html");
    }
};

redirect();

const loginFormButton = document.getElementById("login-form-button");

loginFormButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const id = document.getElementById("name").value;
    console.log("loginFormButton")
    
    let response = await fetch(`http://localhost:8080/users/${id}`, { method: "HEAD"});
    
    // User id exists.
    if(response.status === 200) { 
        // Do nothing.
    }
    // User id does not exist.
    else if(response.status == 404) {
        response = await fetch("http://localhost:8080/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                _id: id,
                friendList: [],
                friendRequests: [],
                conversations: []
            })
        }); 
    }
    
    localStorage.setItem("id", id);
    redirect();
});