const main = () => {
    localStorage.setItem("id", null);

    const button = document.getElementById("login-form-button");
    button.addEventListener("click", onClick);

};

const onClick = async (event) => {
    event.preventDefault();

    // Get id user entered into textfield
    const id = document.getElementById("name").value;

    if(! id.match("^[A-Za-z0-9]+$")) {
        console.log("Id can only contain letters and numbers.");
    }
    else {
        // Check if id already exists
        const response = await fetch(`${window.location.origin}/users/${id}`, { method: "HEAD"});

        // if id does not exist, create new user document
        if(response.status === 404) {
            await fetch(`${window.location.origin}/users`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    _id: id,
                    friendList: [],
                    incomingFriendRequests: [],
                    outgoingFriendRequests: [],
                    conversations: []
                })
            }); 
        }

        // Set the id
        localStorage.setItem("id", id);

        // Redirect
        window.location.replace(`${window.location.origin}/chatroom.html`);
    }
}

main();