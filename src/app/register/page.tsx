"use client";

import React, { useEffect, useState } from "react";
import GoogleIMG from "@/assists/google.webp";
import Image from "next/image";
import Logo from "@/assists/logo.png";
import Link from "next/link";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";

// define user type
type User = {
  username: string;
  password: string;
  email: string;
};

function Register() {
  // define all states here
  const [token, setToken] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [user, setUser] = useState<User>({
    username: "",
    email: "",
    password: "",
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { email, password, username } = user || {};
  const { data, status } = useSession();

  // hanlde change for all feilds
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  // protect route by token
  useEffect(() => {
    setToken(Cookies.get("token") || null);
    if (token) {
      router.push("/dashboard");
    }
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [router, status, token]);

  // form submit funtion
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password?.length < 8) {
      toast.error("password length too short!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.message);
      } else {
        toast.success(data?.message);
        setUser({
          username: "",
          email: "",
          password: "",
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred!");
      }
    } finally {
      setLoading(false);
    }
  }

  // set email on cookie
  useEffect(() => {
    if (data) {
      const emailAddress = data?.user?.email;
      if (emailAddress) {
        Cookies.set("email", emailAddress);
      }
    }
  }, [data]);

  // google singin function
  const handleClick = () => {
    signIn("google");
  };

  return (
    <section
      className="w-full min-h-screen flex flex-col justify-center items-center bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <div className="w-11/12 md:w-[700px] bg-[rgba(0,10,30,0.8)] border border-[rgba(0,170,255,0.5)] shadow-lg shadow-[rgba(0,170,255,0.4)] backdrop-blur-md px-5 py-10 md:px-10 md:py-10 flex flex-col gap-5 justify-center items-center rounded-xl my-10">
        <Link href={"/"}>
          <Image src={Logo} alt="Logo" width={100} />
        </Link>
        <h1 className="text-3xl font-bold text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] tracking-wider">
          Regsiter Now and take new place
        </h1>
        <p className="text-lg text-[#d0eaff] font-medium text-center leading-8">
          Fill this form to grap the new role or use google auth to continue
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 w-full mt-6"
        >
          <span className="flex flex-col gap-3 w-full">
            <label htmlFor="" className="text-white text-base font-medium">
              Enter your username*
            </label>
            <input
              type="text"
              name="username"
              onChange={(e) => handleChange(e)}
              value={username}
              placeholder="Username"
              required
              className="bg-white text-black py-2 px-4 rounded-sm font-medium text-base outline-[#1380BA]"
            />
          </span>
          <span className="flex flex-col gap-3 w-full">
            <label htmlFor="" className="text-white text-base font-medium">
              Enter your email*
            </label>
            <input
              type="email"
              name="email"
              onChange={(e) => handleChange(e)}
              value={email}
              required
              placeholder="E-mail"
              className="bg-white text-black py-2 px-4 rounded-sm font-medium text-base outline-[#1380BA]"
            />
          </span>
          <span className="flex flex-col gap-3 w-full">
            <label htmlFor="" className="text-white text-base font-medium">
              Enter your password*
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                name="password"
                onChange={(e) => handleChange(e)}
                value={password}
                required
                placeholder="xxx-xxx-xxx"
                className="bg-white text-black py-2 px-4 rounded-sm font-medium text-base w-full outline-[#1380BA]"
              />
              {showPass ? (
                <FaEye
                  className="absolute top-[13px] right-[13px]"
                  onClick={() => setShowPass(false)}
                />
              ) : (
                <FaEyeSlash
                  className="absolute top-[13px] right-[13px]"
                  onClick={() => setShowPass(true)}
                />
              )}
            </div>
          </span>

          {loading ? (
            <button
              disabled
              className="flex items-center justify-center gap-2 px-6 py-2 text-white text-lg font-bold rounded-md shadow-[0_0_10px_rgba(42,181,254,0.5)] border border-[rgba(42,181,254,0.8)] transition ease-in-out duration-300 bg-gradient-to-r from-[#2ab5fe] to-[#1a94d6] hover:opacity-90 text-center hover:bg-[#1380BA]"
            >
              <svg
                className="w-5 h-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16z"
                ></path>
              </svg>
              Loading...
            </button>
          ) : (
            <button
              type="submit"
              className="cursor-pointer px-6 py-2 text-white text-lg font-bold rounded-md shadow-[0_0_10px_rgba(42,181,254,0.5)] border border-[rgba(42,181,254,0.8)] transition ease-in-out duration-300 bg-gradient-to-r from-[#2ab5fe] to-[#1a94d6] hover:opacity-90 text-center hover:bg-[#1380BA]"
            >
              Register
            </button>
          )}
        </form>

        <div className="flex gap-5 w-full items-center">
          <span className="w-full h-0.5 bg-white"></span>
          <p className="text-white w-full text-center text-base font-normal">
            Or continue with
          </p>
          <span className="w-full h-0.5 bg-white"></span>
        </div>
        <button
          onClick={handleClick}
          className="cursor-pointer px-6 py-2 text-[#003366] text-lg font-bold rounded-md border border-[rgba(42,181,254,0.8)] transition ease-in-out duration-300 bg-gradient-to-r from-[#d0d8e5] to-[#aabbcc] shadow-[0_0_10px_rgba(0,170,255,0.5)] p-4 text-center hover:bg-[#1380BA] w-full flex items-center justify-center gap-3"
        >
          <Image src={GoogleIMG} alt="google" width={20} />
          <span>Google</span>
        </button>

        <div className="flex gap-2 items-center">
          <p className="text-[#fff] text-base font-normal">
            Do you have an account?
          </p>
          <Link
            href={"/login"}
            className="text-[#fff] text-base font-normal hover:underline 
            "
          >
            Login
          </Link>
        </div>

        <p className="text-[rgba(200,255,255,0.8)] text-sm mt-2">
          © 2025 Pro AI Marketing. All rights reserved.
        </p>
      </div>
      <Toaster position="top-right" />
    </section>
  );
}

export default Register;
