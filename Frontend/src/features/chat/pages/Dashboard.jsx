import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat.js";
import { useEffect } from "react";

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);

  const chat = useChat();

  useEffect(() => {
    chat.initializeSocketConnection();
  }, []);

  return <div>Dashboard</div>;
};

export default Dashboard;
