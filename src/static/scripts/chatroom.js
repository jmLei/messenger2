import User, {createOutgoingFriendRequestElement, createIncomingFriendRequestElement, createFriendElement} from "./user.js";

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

    const header = document.getElementById("my-header");
    const text = document.createTextNode(`Welcome back, ${currentUser._id}`);
    header.prepend(text);

    drawOutgoingFriendRequests(currentUser.outgoingFriendRequests);
    drawIncomingFriendRequests(currentUser.incomingFriendRequests);
    drawFriendList(currentUser.friendList);

    const addUserButton = document.getElementById("add-user-button");
    addUserButton.addEventListener("click", onAddUserButtonClick);
    
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

const drawIncomingFriendRequests = (incomingFriendRequests) => {
    console.log("Drawing Incoming Friend Requests.");
    const container = document.getElementById("incoming-friend-requests");

    // Clear out container.
    while(container.firstChild) {
        container.removeChild(container.firstChild);
    }

    for(let i = 0; i < currentUser.incomingFriendRequests.length; i++) {
        const element = createIncomingFriendRequestElement(currentUser.incomingFriendRequests[i]);
        const buttonGroup = element.querySelector("div").querySelectorAll("button");
        buttonGroup[0].addEventListener("click", onAcceptButtonClick);
        buttonGroup[1].addEventListener("click", onRejectButtonClick);
        container.appendChild(element);
    }
};

const drawFriendList = (friendList) => {
    console.log("Drawing Friend List.");
    const container = document.getElementById("friend-list");

    // Clear out container.
    while(container.firstChild) {
        container.removeChild(container.firstChild);
    }

    for(let i = 0; i < currentUser.friendList.length; i++) {
        const element = createFriendElement(currentUser.friendList[i]);
        container.appendChild(element);
    }
}

const onAcceptButtonClick = (event) => {

    const friendId = event.target.friendId;

    fetch(`http://localhost:8080/users/${friendId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            op: "remove",
            path: "/outgoing-friend-requests",
            value: currentUser._id
        })
    });

    fetch(`http://localhost:8080/users/${currentUser._id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            op: "remove",
            path: "/incoming-friend-requests",
            value: friendId
        })
    });

    fetch(`http://localhost:8080/users/${currentUser._id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            op: "add",
            path: "/friend-list",
            value: friendId
        })
    });

    fetch(`http://localhost:8080/users/${friendId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            op: "add",
            path: "/friend-list",
            value: currentUser._id
        })
    });

    const index = currentUser.incomingFriendRequests.indexOf(friendId);
    currentUser.incomingFriendRequests.splice(index, 1);
    currentUser.friendList.push(friendId);
    drawIncomingFriendRequests(currentUser.incomingFriendRequests);
    drawFriendList(currentUser.friendList);
};

const onRejectButtonClick = (event) => {
    console.log(`${event.target.friendId} reject button clicked.`);

    const friendId = event.target.friendId;

    fetch(`http://localhost:8080/users/${friendId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            op: "remove",
            path: "/outgoing-friend-requests",
            value: currentUser._id
        })
    });

    fetch(`http://localhost:8080/users/${currentUser._id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            op: "remove",
            path: "/incoming-friend-requests",
            value: friendId
        })
    });

    const index = currentUser.incomingFriendRequests.indexOf(friendId);
    currentUser.incomingFriendRequests.splice(index, 1);
    drawIncomingFriendRequests(currentUser.incomingFriendRequests);
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

const onAddUserButtonClick = (event) => {
    event.preventDefault();
    console.log("Add User Button Click");
};

main();