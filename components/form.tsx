import { useState } from "react";
import { sendContactForm } from "../lib/contactform.js";
import { IForm } from "@/interface/iForm.jsx";

const Form = () => {
  const [formData, setFormData] = useState<IForm>({
    name: "",
    age: "",
    email: "",
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    await sendContactForm(formData);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
    console.log(formData);
  };

  const handleAut = async () => {
    document.cookie = "my_cookie=my_cookie_value; max-age=86400; path=/";
    const res = await fetch("/api/autorisation", {
      method: "POST",
      body: "dsdsdsd",
      headers: {
        Cookie: document.cookie,
      },
      credentials: "same-origin",
    });
    const data = await res.json();
    console.log(data);
  };

  const handleCookie = () => {
    console.log(document.cookie);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">
          Name
          <input type="text" required id="name" onChange={handleInputChange} />
        </label>
        <label htmlFor="name">
          age
          <input type="number" required onChange={handleInputChange} id="age" />
        </label>
        <label htmlFor="name">
          Email
          <input
            type="email"
            required
            onChange={handleInputChange}
            id="email"
          />
        </label>
        <button type="submit">Отправить</button>
      </form>
      <button onClick={handleAut}>autorisation</button>
      <button onClick={handleCookie}>cookie</button>
    </>
  );
};

export default Form;
