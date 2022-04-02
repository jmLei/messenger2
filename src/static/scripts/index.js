const main = () => {
    localStorage.setItem("id", null);

    const button = document.getElementById("index-button");
    button.addEventListener("click", onClick);

};

const onClick = async (event) => {
    event.preventDefault();

    // Get id user entered into textfield
    const id = document.getElementById("index-id").value;
    const error = document.getElementById("error");

    console.log(id);

    if(! id.match("^[A-Za-z0-9]+$")) {
        error.innerText = "ID can only contain alphanumeric characters.";
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