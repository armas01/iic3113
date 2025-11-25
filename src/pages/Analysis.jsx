import './Analysis.css'
import { useState, useEffect } from "react";


function Analysis() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        {
            from: "bot",
            text: "Bienvenido al asistente de análisis inmobiliario con IA. Hemos recopilado datos reales desde Portal Inmobiliario mediante nuestro scraper. ¿Qué te gustaría analizar?"
        }
    ]);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        async function checkData() {
            try {
                const res = await fetch("http://localhost:3001/api/properties");
                const data = await res.json();

                if (data.count > 0) {
                    setIsReady(true);
                    setMessages([
                        {
                            from: "bot",
                            text: "Bienvenido al asistente de análisis inmobiliario con IA. Hemos recopilado datos reales desde Portal Inmobiliario mediante nuestro scraper. ¿Qué te gustaría analizar?"
                        }
                    ]);
                } else {
                    setIsReady(false);
                    setMessages([
                        {
                            from: "bot",
                            text: "Aún no se han recopilado datos. Debes realizar un scraping antes de utilizar el análisis con IA."
                        }
                    ]);
                }
            } catch (err) {
                console.error(err);
            }
        }

        checkData();
    }, []);


    const sendMessage = async () => {
        const newMessages = [...messages, { from: "me", text: input }];
        setMessages(newMessages);

        setInput("");

        const res = await fetch("http://localhost:3001/api/chat-analysis", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: input }),
        });

        const data = await res.json();

        setMessages([...newMessages, { from: "bot", text: data.reply }]);
        setInput("");
    };

    return (
        <div className="analysis-chat">
            <h2>Asistente Inteligente</h2>

            <div className="chat-window">
                {messages.map((m, i) => (
                    <div key={i} className={`msg ${m.from}`}>
                        {m.text}
                    </div>
                ))}
            </div>

            <div className="chat-input">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && isReady) {
                            e.preventDefault();
                            sendMessage();
                        }
                    }}
                    placeholder={isReady ? "Escribe tu mensaje..." : "Debes hacer scraping primero"}
                    disabled={!isReady}
                />
                <button className="send-btn" onClick={sendMessage} disabled={!isReady}>➤</button>
            </div>
        </div>
    );
}

export default Analysis;
