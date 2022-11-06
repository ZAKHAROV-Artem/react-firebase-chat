import React from "react";
import { Form } from "antd";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Login = () => {
  const navigate = useNavigate();

  const signinWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then(async (result) => {
      navigate("/");
      if (
        result.user.metadata.creationTime ===
        result.user.metadata.lastSignInTime
      ) {
        await setDoc(doc(db, "users", result.user.uid), {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          createdAt: result.user.metadata.creationTime,
          online: true,
        });

        await setDoc(doc(db, "usersChats", result.user.uid), {});
      }
    });
  };
  return (
    <div
      className="max-w-md mx-auto flex items-center justify-center"
      style={{
        maxHeight: "75vh",
        height: "75vh",
      }}
    >
      <div
        className="w-full rounded-md p-5"
        style={{
          boxShadow: "0px 0px 20px rgba(0,0,0,0.15)",
        }}
      >
        <h1 className="text-2xl">Login</h1>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
        >
          <div
            className="w-fit mx-auto cursor-pointer flex items-center rounded-md px-3 py-2 bg-blue-600"
            onClick={signinWithGoogle}
          >
            <FcGoogle size={30} className="bg-white rounded " />
            <button className="ml-3 text-xl font-medium text-white">
              Sign in with Google
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
