import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Chat.css";
import { Avatar, IconButton } from "@material-ui/core";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import { SearchOutlined, AttachFile, MoreVert } from "@material-ui/icons";
import db from "./firebase";
import { useStateValue } from "./StateProvider";
import firebase from "firebase";
import DeleteIcon from "@material-ui/icons/Delete";
import { useHistory } from "react-router-dom";

function Chat() {
  const [input, setInput] = useState("");
  //const { seed, setSeed } = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  const [redirectURL, setRedirectURL] = useState(null);
  const history = useHistory();

  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => setRoomName(snapshot.data()));

      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [roomId]);

  useEffect(() => {
    if (redirectURL) {
      history.push("/");
    }
  }, [redirectURL]);

  const deleteRoom = () => {
    if (window.confirm("Are you sure to delete room?")) {
      db.collection("rooms").doc(roomId).delete();
      setRedirectURL(true);
    }
  };
  const clearChat = () => {
    if (window.confirm("Are you sure to delete chat?")) {
      var jobskill_query = db
        .collection("rooms")
        .doc(roomId)
        .collection("messages");
      jobskill_query.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref.delete();
        });
      });
    }
  };
  const sendMessage = (e) => {
    e.preventDefault();
    db.collection("rooms").doc(roomId).collection("messages").add({
      message: input,
      name: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setInput("");
  };
  let src = "";
  if (roomName != "") {
    src = `https://avatars.dicebear.com/4.5/api/human/${roomName.dp}.svg`;
  } else {
    src = "";
  }

  //check date contain or not if not then return empty string

  let date = messages[messages.length - 1]?.timestamp?.toDate();
  if (date) {
    date = new Date(date).toUTCString();
  } else {
    date = "";
  }

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={src} />
        <div className="chat__headerInfo">
          <h3>{roomName.name}</h3>
          <p>{date}</p>
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>

          <IconButton onClick={deleteRoom}>
            <DeleteIcon />
          </IconButton>

          <IconButton onClick={clearChat}>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="chat__body">
        {messages.map((message) => (
          <p
            className={`chat_message ${
              message.name === user.displayName && "chat_reciever"
            }`}
          >
            <span className="chat_name">{message.name}</span>
            {message.message}
            <span className="chat__timestamp">
              {new Date(message.timestamp?.toDate()).toUTCString()}
              {console.log("timestamp")}
            </span>
          </p>
        ))}
      </div>
      <div className="chat__footer">
        <InsertEmoticonIcon />
        <form>
          <input
            type="text"
            placeholder="Type a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" onClick={sendMessage}>
            Send a message
          </button>
        </form>
        <MicIcon />
      </div>
    </div>
  );
}

export default Chat;
