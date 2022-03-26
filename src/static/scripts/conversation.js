export default class Conversation {
    constructor(_id, name, participants, messages) {
        this._id = _id;
        this.name = name;
        this.participants = participants;
        this.messages = messages;
    }
}

export const createMessageElements = (messages) => {
    const div = document.createElement("div");

    for(let i = 0; i < messages.length; i++) {
        const element = createMessageElement(messages[i]);
        div.appendChild(element);
    }
    return div;
}

// Message format: { 
//    timestamp: Date, 
//    from: String,
//    body: String
// }
const createMessageElement = (message) => {
    const div = document.createElement("div");
    const h3 = document.createElement("h3");
    h3.innerText = `${message.timestamp} ${message.from}`;
    const p = document.createElement("p");
    p.innerText = message.body;

    div.appendChild(h3);
    div.appendChild(p);

    return div;
};