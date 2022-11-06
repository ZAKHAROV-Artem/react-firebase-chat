import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{ height: "70vh" }}
      className="flex flex-col items-center justify-center "
    >
      <img
        src="https://dam.muyinteresante.com.mx/wp-content/uploads/2020/04/error-404.jpg"
        alt=""
        className="rounded-xl max-w-xl"
      />

      <div className="mt-5">
        <span className="text-xl">Go to </span>
        <button
          onClick={() => navigate("/")}
          className=" bg-blue-400 px-3 py-2 rounded-md text-white"
        >
          Main page
        </button>
      </div>
    </div>
  );
};

export default NotFound;
