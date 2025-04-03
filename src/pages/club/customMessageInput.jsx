import React, { useState } from "react";

const CustomMessageInput = ({ channel }) => {
    const [message, setMessage] = useState("");

    const handleSendMessage = () => {
        if (!channel) return;

        channel.sendUserMessage(message, (userMessage, error) => {
            if (error) {
                console.error("메시지 전송 실패:", error);
                return;
            }

            console.log("메시지 전송 성공:", userMessage);
            setMessage("");
        });
    };

    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="메시지를 입력하세요."
                style={{ flex: 1, padding: "8px", border: "1px solid #ccc" }}
            />
            <button
                onClick={handleSendMessage}
                style={{ padding: "8px 16px", backgroundColor: "#007bff", color: "white", border: "none" }}
            >
                전송
            </button>
        </div>
    );
};

export default CustomMessageInput;