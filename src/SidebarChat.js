import React, { useState, useEffect } from "react";
import "./SidebarChat.css";
import { Avatar, IconButton } from "@material-ui/core";
import db from "./firebase";
import { Link } from "react-router-dom";

function Sidebarchat({ id, name, dp, addNewChat }) {
  const [messages, setMessages] = useState("");
  useEffect(() => {
    if (id) {
      db.collection("rooms")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [id]);
  const createChat = () => {
    const roomName = prompt("Please enter name for chat room");

    if (roomName) {
      const seed = Math.floor(Math.random() * 5000);
      db.collection("rooms").add({
        name: roomName,
        dp: seed,
      });
    }
  };
  return !addNewChat ? (
    <Link to={`/rooms/${id}`}>
      <div className="sidebarChat">
        <Avatar src={`https://avatars.dicebear.com/4.5/api/human/${dp}.svg`} />
        <div className="sidebarChat__info">
          <h3>{name}</h3>
          <p>{messages[0]?.message}</p>
        </div>
      </div>
    </Link>
  ) : (
    <div onClick={createChat} className="sidebarChat">
      <h2>Add new Chat</h2>
    </div>
  );
}

export default Sidebarchat;
