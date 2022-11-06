import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthCotext";
import MessagePart from "../components/Chat/MessagePart";
import UserChatItemPart from "../components/Chat/UserChatItemPart";
import { updateDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { changeChat } from "../redux/reducers/chatSlice";

const Chat = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const setStatus = async () => {
      await updateDoc(doc(db, "users", currentUser.uid), {
        online: true,
      });
    };
    setStatus();

    const handleTabClose = async (e) => {
      await updateDoc(doc(db, "users", currentUser.uid), {
        online: false,
      });
    };
    window.addEventListener("beforeunload", handleTabClose);
    return () => {
      window.removeEventListener("beforeunload", handleTabClose);
    };
  }, [currentUser.uid]);

  const signout = async () => {
    await updateDoc(doc(db, "users", currentUser.uid), {
      online: false,
    });
    signOut(auth)
      .then(() =>
        dispatch(
          changeChat({
            chatId: "",
            user: {},
          })
        )
      )
      .then(() => navigate("/"));
  };

  return (
    <div className="sm:w-5/6 w-full  mx-auto">
      <div className="mx-5">
        <div className="mx-1 flex justify-between items-center">
          <h1 style={{ fontSize: "30px" }} className="text-left mb-3">
            Chat
          </h1>
          <button
            className="bg-red-500 hover:bg-red-400 duration-300 rounded-md h-fit text-white px-3 py-2"
            onClick={signout}
          >
            Log out
          </button>
        </div>
        <div
          className="max-w-7xl w-full mx-auto rounded flex"
          style={{
            maxHeight: "90vh",
            height: "90vh",
            boxShadow: "0px 0px 20px rgba(0,0,0,0.15)",
            display: "grid",
            gridTemplateColumns: "1.5fr 3fr",
          }}
        >
          <UserChatItemPart />
          <MessagePart currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
