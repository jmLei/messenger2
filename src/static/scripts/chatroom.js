import User, {createOutgoingFriendRequestElement} from "./user.js";

var currentUser;

const main = async () => {
    if(localStorage.getItem("id") === null) {
        window.location.replace("http://localhost:8080/index.html");
    }
    
    // Get user info.
    let response = await fetch(`http://localhost:8080/users/${localStorage.getItem("id")}`);
    response = await response.json();

    currentUser = new User(
        response._id,
        response.friendList,
        response.incomingFriendRequests,
        response.outgoingFriendRequests,
        response.conversations
    );

    drawOutgoingFriendRequests(currentUser.outgoingFriendRequests);
    
    const logoutButton = document.getElementById("logout-button");
    logoutButton.addEventListener("click", onLogoutButtonClick);

    const sendFriendRequestButton = document.getElementById("send-friend-request-button");
    sendFriendRequestButton.addEventListener("click", onsendFriendRequestButtonClick);
};

const drawOutgoingFriendRequests = (outgoingFriendRequests) => {
    console.log("Draw Outgoing Friend Requests");
    const outgoingFriendRequestsContainer = document.getElementById("outgoing-friend-requests-container");

    // Clear out outgoingFriendRequestsContainer
    while(outgoingFriendRequestsContainer.firstChild) {
        outgoingFriendRequestsContainer.removeChild(outgoingFriendRequestsContainer.firstChild);
    }

   for(let i = 0; i < currentUser.outgoingFriendRequests.length; i++) {
       const element = createOutgoingFriendRequestElement(currentUser.outgoingFriendRequests[i]);
       element.querySelector("button").addEventListener("click", onCancelButtonClick);
       outgoingFriendRequestsContainer.appendChild(element);
   }
};

const onCancelButtonClick = (event) => {
    console.log("Cancel clicked");
    const friendId = event.target.friendId;
    
    fetch(`http://localhost:8080/users/${friendId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            op: "remove",
            path: "/incoming-friend-requests",
            value: localStorage.getItem("id")
        })
    });

    fetch(`http://localhost:8080/users/${localStorage.getItem("id")}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            op: "remove",
            path: "/outgoing-friend-requests",
            value: friendId
        })
    });

    const index = currentUser.outgoingFriendRequests.indexOf(friendId);
    currentUser.outgoingFriendRequests.splice(index, 1);
    drawOutgoingFriendRequests(currentUser.outgoingFriendRequests);
}

const onLogoutButtonClick = (event) => {
    event.preventDefault();
    localStorage.removeItem("id");
    window.location.replace("http://localhost:8080/index.html");
};

const onsendFriendRequestButtonClick = async (event) => {
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
    currentUser.outgoingFriendRequests.push(friendId);
};

main();