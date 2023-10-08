import React, { useState } from "react";
import Button from "../button";
import MessageService from "../../clientServices/MessageService";
import { Loader } from "../loader";

export const MessageToUser = ({ id }: { id: string }) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSend = () => {
    setIsLoading(true);
    MessageService.sendMessage(id, message)
      .then((data) => console.log(data))
      .catch((e) => console.error(e))
      .finally(() => setIsLoading(false));
  };
  return (
    <div>
      <p> Сообщение которое необходимо отправить:</p>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button onClick={handleSend} text="отправить" />
      {isLoading && <Loader />}
    </div>
  );
};
