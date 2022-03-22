let conversations = [];
let friendList = [];
let friendRequests = [];

const run = async () => {
    redirect();

    // Get user info.
    let response = await fetch(`http://localhost:8080/users/${localStorage.getItem("id")}`);
    response = await response.json();

    conversations = response.conversations;
    friendList = response.friendList;
    friendRequests = response.friendRequests;
};

const logoutButton = document.getElementById("logout-button");
logoutButton.addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.removeItem("id");
    redirect();
});

const redirect = () => {
    if(localStorage.getItem("id") === null) {
        window.location.replace("http://localhost:8080/index.html");
    }
};


run();


