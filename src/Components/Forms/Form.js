import React, { useState } from 'react';
import "./Form.css";

const Form = () => {
    const [status, setStatus] = useState("Connect");
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("❤️");
        const { name, email, message } = e.target.elements;
        let details = {
            name: name.value,
            email: email.value,
            message: message.value,
        };
        let response = await fetch("http://localhost:3000/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify(details),
        });
        setStatus("Connect");
        let result = await response.json();
        alert(result.status);
    };
    return (
        <section id="contact">
            <div className="contact">
                <h1>Contact Me</h1>
                <form onSubmit={handleSubmit}>
                    <div className="contact-main">
                        <input type="text" id="name" placeholder="Name" required />
                    </div>
                    <div className="contact-main">
                        <input type="email" id="email" placeholder="Email" required />
                    </div>
                    <div className="contact-main">
                        <textarea id="message" placeholder="Message" required />
                    </div>
                    <div className="contact-main">
                        <button type="submit">{status}</button>
                    </div>
                </form>
            </div>
        </section>
    );
};
export default Form;