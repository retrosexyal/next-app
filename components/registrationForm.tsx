import React, { useState } from "react";
import AuthService from "@/clientServices/AuthService";

const RegistrationForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    AuthService.registration(email, password).then((res) => {
      if (res.status === 200) {
        console.log(res);
        localStorage.setItem("token", res.data.accessToken);
        alert("пользователь успешно зарегистрирован");
      } else if (res.status === 400) {
        alert("пользователь уже зарегистрирован");
      }
    });
  };
  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  return (
    <form onSubmit={handleSubmit}>
      registrationForm
      <input type="email" value={email} onChange={handleEmail} />
      <input type="password" value={password} onChange={handlePassword} />
      <button>зарегистрироватся</button>
    </form>
  );
};

export default RegistrationForm;
