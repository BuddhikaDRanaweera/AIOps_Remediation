import "@fortawesome/fontawesome-free/css/all.min.css";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "./../../assest/virtusa.png";
import { IoChevronBack } from "react-icons/io5";

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const hiddenPaths = [
    "/remediation",
    "/audit",
    "/new-rule",
    "/recommendation",
    "/new-problem",
    "/",
  ];
  const shouldHideIcons = hiddenPaths.includes(location.pathname);
  return (
    <div className=" h-[75px] py-[10px] px-[20px] bg-[#444a4e] flex justify-between">
      <div className="my-auto">
        <img src={logo} alt="Company Logo" />
      </div>
      <div className="my-auto flex justify-center gap-5">
        {!shouldHideIcons && (
          <div className="flex ">
            <IoChevronBack
              onClick={() => navigate(-1)}
              className="text-[#e4e4e4] my-auto text-4xl rounded-full hover:bg-slate-600 p-1"
            />
          </div>
        )}
         <div>        <label
          className=" text-[#e4e4e4] my-auto text-2xl"
          onClick={() => navigate("/")}
        >
          <i className="fas fa-home"></i>
        </label></div>
      </div>
    </div>
  );
};

export default TopBar;
