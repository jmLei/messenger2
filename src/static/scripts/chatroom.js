import User, {createOutgoingFriendRequestElement, createIncomingFriendRequestElement, createFriendElement, createConversationElement} from "./user.js";
import Conversation, {createMessageElements} from "./conversation.js";

var currentUser;
var currentConversation;
var socket;

const main = async () => {
    if(localStorage.getItem("id") === null) {
        window.location.replace("http://localhost:8080/index.html");
    }

    socket = io();
    socket.emit("send-user-id", localStorage.getItem("id"));
    
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

    // Update the view.
    drawOutgoingFriendRequests(currentUser.outgoingFriendRequests);
    drawIncomingFriendRequests(currentUser.incomingFriendRequests);
    drawFriendList(currentUser.friendList);
    drawConversationList(currentUser.conversations);
    
    // Add functionalities to buttons.
    const logoutButton = document.getElementById("logout-button");
    logoutButton.addEventListener("click", onLogoutButtonClick);

    const sendFriendRequestButton = document.getElementById("send-friend-request-button");
    sendFriendRequestButton.addEventListener("click", sendFriendRequest);

    const sendMessageButton = document.getElementById("send-message");
    sendMessageButton.addEventListener("click", sendMessage);

    socket.on("friend-request-cancelled", (emitterId) => {
        const index = currentUser.incomingFriendRequests.indexOf(emitterId);
        if(index > -1) {
            currentUser.incomingFriendRequests.splice(index, 1);
            drawIncomingFriendRequests(currentUser.incomingFriendRequests);
        }
    });

    socket.on("friend-request-rejected", (emitterId) => {
        const index = currentUser.outgoingFriendRequests.indexOf(emitterId);
        if(index > -1) {
            currentUser.outgoingFriendRequests.splice(index, 1);
            drawOutgoingFriendRequests(currentUser.outgoingFriendRequests);
        }
    })

    socket.on("receive-friend-request", (emitterId) => {
        currentUser.incomingFriendRequests.push(emitterId);
        drawIncomingFriendRequests(currentUser.incomingFriendRequests);
    })

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
       element.querySelector("button").addEventListener("click", cancelFriendRequest);
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
        buttonGroup[0].addEventListener("click", acceptFriendRequest);
        buttonGroup[1].addEventListener("click", rejectFriendRequest);
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

const drawConversationList = async (conversationIds) => {
    const conversations = [];

    for(let i = 0; i < conversationIds.length; i++) {
        const response = await fetch(`http://localhost:8080/conversations/${conversationIds[i]}`);
        const conversation = await response.json();
        conversations.push(conversation);
    }

    const conversationList = document.getElementById("conversation-list");

    while(conversationList.firstChild) {
        conversationList.removeChild(conversationList.firstChild);
    }

    for(let i = 0; i < conversations.length; i++) {
        const element = createConversationElement(conversations[i]);
        element.addEventListener("click", setCurrentConversation);

        conversationList.appendChild(element);
    }
};

const drawCurrentConversation = (currentConversation) => {
    console.log(currentConversation);
    const container = document.getElementById("current-conversation");


    while(container.firstChild) {
        container.removeChild(container.firstChild);
    }

    const h1 = document.createElement("h1");
    h1.innerText = currentConversation.name;

    const messages = createMessageElements(currentConversation.messages);

    container.appendChild(h1);
    container.appendChild(messages);
    
}

const acceptFriendRequest = (event) => {

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

    createConversation(currentUser._id, friendId);

    const index = currentUser.incomingFriendRequests.indexOf(friendId);
    currentUser.incomingFriendRequests.splice(index, 1);
    currentUser.friendList.push(friendId);
    drawIncomingFriendRequests(currentUser.incomingFriendRequests);
    drawFriendList(currentUser.friendList);
};

const rejectFriendRequest = (event) => {
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

    socket.emit("reject-friend-request", [currentUser._id, friendId]);
};

const cancelFriendRequest = (event) => {
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

    socket.emit("cancel-friend-request", [currentUser._id, friendId]);
}

const onLogoutButtonClick = (event) => {
    event.preventDefault();
    localStorage.removeItem("id");
    window.location.replace("http://localhost:8080/index.html");
};

const sendFriendRequest = async (event) => {
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
    drawOutgoingFriendRequests();

    // Update friend's client
    console.log("Socket.emit(send-friend-request)");
    socket.emit("send-friend-request", [localStorage.getItem("id"), friendId]);
};

const createConversation = async (id, friendId) => {

    let conversation = await fetch("http://localhost:8080/conversations", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: `${id} & ${friendId}`,
            messages: []
        })
    });

    conversation = await conversation.json();
    const conversationId = conversation._id;

    await fetch(`http://localhost:8080/users/${friendId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            op: "add",
            path: "/conversations",
            value: conversationId
        })
    });

    await fetch(`http://localhost:8080/users/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            op: "add",
            path: "/conversations",
            value: conversationId
        })
    });

    currentUser.conversations.push(conversationId);
    drawConversationList(currentUser.conversations);
}

const setCurrentConversation = (event) => {
    console.log("Set Current Conversation");
    const conversation = event.target.conversation;

    currentConversation = new Conversation(
        conversation._id,
        conversation.name,
        conversation.messages
    );

    drawCurrentConversation(currentConversation);
}

const sendMessage = (event) => {
    const message = document.getElementById("message-field").value;
    
    const body = {
        timestamp: new Date(),
        from: currentUser._id,
        body: message
    };

    // Send message to database.
    fetch(`http://localhost:8080/conversations/${currentConversation._id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            op: "add",
            path: "/messages",
            value: JSON.stringify(body)
        })
    });

    // Update client.
    currentConversation.messages.push(body);

    // Update friend's client.

    // Re-draw current conversation.
    drawCurrentConversation(currentConversation);
}

main();