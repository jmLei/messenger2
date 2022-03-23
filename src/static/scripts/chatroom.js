let conversations = [];
let friendList = [];
let incomingFriendRequests = [];
let outgoingFriendRequests = [];

const redirect = () => {
    if(localStorage.getItem("id") === null) {
        window.location.replace("http://localhost:8080/index.html");
    }
};

const start = async () => {
    redirect();
    
    // Get user info.
    let response = await fetch(`http://localhost:8080/users/${localStorage.getItem("id")}`);
    response = await response.json();
    conversations = response.conversations;
    friendList = response.friendList;
    incomingFriendRequests = response.incomingFriendRequests;
    outgoingFriendRequests = response.outgoingFriendRequests;

    renderOutgoingFriendRequests();
};

const renderOutgoingFriendRequests = () => {
    console.log("Rendering Outgoing Friend Requests");
    const outgoingFriendRequestsContainer = document.getElementById("outgoing-friend-requests-container");

    while(outgoingFriendRequestsContainer.firstChild) {
        outgoingFriendRequestsContainer.removeChild(outgoingFriendRequestsContainer.firstChild);
    }

    for(let i = 0; i < outgoingFriendRequests.length; i++) {
        let div = document.createElement("div");
        let outgoingFriendRequest = outgoingFriendRequests[i];
        div.textContent = outgoingFriendRequest;

        let cancelButton = document.createElement("button");
        cancelButton.innerHTML = "Cancel";
        cancelButton.addEventListener("click", () => {
            alert(`${outgoingFriendRequest} cancelled.`);
        });

        div.append(cancelButton);
        outgoingFriendRequestsContainer.append(div);
    }
};

const logoutButton = document.getElementById("logout-button");
logoutButton.addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.removeItem("id");
    redirect();
});

const sendFriendRequestButton = document.getElementById("send-friend-request-button");
sendFriendRequestButton.addEventListener("click", async (event) => {
    event.preventDefault();
    
    const friendId = document.getElementById("friend-id").value;

    await fetch(`http://localhost:8080/users/${friendId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            op: "add",
            path: "/incoming-friend-requests",
            value: localStorage.getItem("id")
        })
    });

    // Update server about adding to outgoing friend requests list
    await fetch(`http://localhost:8080/users/${localStorage.getItem("id")}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            op: "add",
            path: "/outgoing-friend-requests",
            value: friendId
        })
    });

    // Update client about adding to outgoing friend requests list
    outgoingFriendRequests.push(friendId);

    // Re-draw list of outgoing friend requests.
    renderOutgoingFriendRequests();
});

start();