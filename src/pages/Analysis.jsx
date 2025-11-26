import './Analysis.css'
import { useState, useEffect } from "react";


function Analysis() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        {
            from: "bot",
            text: "¡Hola! 👋 Soy tu asistente de análisis inmobiliario. He recopilado datos reales desde Portal Inmobiliario. ¿Qué te gustaría saber? \n\nPuedes preguntarme sobre:\n• 💰 Propiedades más económicas\n• 📏 Propiedades más espaciosas\n• 🏘️ Análisis por sectores\n• ⭐ Recomendaciones personalizadas\n• 📊 Tendencias del mercado"
        }
    ]);
    const [isReady, setIsReady] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

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
                            text: "¡Hola! 👋 Soy tu asistente de análisis inmobiliario. He recopilado datos reales desde Portal Inmobiliario. ¿Qué te gustaría saber? \n\nPuedes preguntarme sobre:\n• 💰 Propiedades más económicas\n• 📏 Propiedades más espaciosas\n• 🏘️ Análisis por sectores\n• ⭐ Recomendaciones personalizadas\n• 📊 Tendencias del mercado"
                        }
                    ]);
                } else {
                    setIsReady(false);
                    setMessages([
                        {
                            from: "bot",
                            text: "⚠️ Aún no se han recopilado datos. \n\nPor favor, ve al Dashboard y realiza un scraping antes de utilizar el análisis con IA."
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
        if (!input.trim()) return;

        const newMessages = [...messages, { from: "me", text: input }];
        setMessages(newMessages);
        setInput("");
        setIsTyping(true);

        try {
            const res = await fetch("http://localhost:3001/api/chat-analysis", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });

            const data = await res.json();

            setMessages([...newMessages, { from: "bot", text: data.reply }]);
        } catch (error) {
            setMessages([...newMessages, { 
                from: "bot", 
                text: "❌ Error al conectar con el servidor. Por favor, verifica que el backend esté activo." 
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="analysis-chat">
            <h2>Asistente Inteligente</h2>
            <p className="chat-subtitle">Análisis personalizado basado en datos reales</p>

            <div className="chat-window">
                {messages.map((m, i) => (
                    <div key={i} className={`msg ${m.from}`}>
                        {m.text}
                    </div>
                ))}
                {isTyping && (
                    <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                )}
            </div>

            <div className="chat-input">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && isReady && !isTyping) {
                            e.preventDefault();
                            sendMessage();
                        }
                    }}
                    placeholder={isReady ? "Escribe tu pregunta..." : "Debes hacer scraping primero"}
                    disabled={!isReady || isTyping}
                />
                <button 
                    className="send-btn" 
                    onClick={sendMessage} 
                    disabled={!isReady || isTyping || !input.trim()}
                >
                    ➤
                </button>
            </div>
        </div>
    );
}

export default Analysis;
