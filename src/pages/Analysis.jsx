import './Analysis.css'
import { useState, useEffect } from "react";


function Analysis() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        {
            from: "bot",
            text: "¡Hola! 👋 Soy tu asistente de análisis inmobiliario. He recopilado datos reales desde Portal Inmobiliario. ¿Qué te gustaría saber? \n\nPuedes preguntarme sobre:\n• 💰 Propiedades más económicas\n• 📏 Propiedades más espaciosas\n• 🏘️ Análisis por sectores\n• ⭐ Recomendaciones personalizadas\n• 📊 Tendencias del mercado",
            type: "text"
        }
    ]);
    const [isReady, setIsReady] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const formatUF = (uf) => {
        if (!uf || isNaN(uf)) return 'N/A'
        return `${Math.round(uf).toLocaleString('es-CL')} UF`
    }

    const formatComunaName = (slug) => {
        if (!slug) return 'N/A'
        return slug
            .replace('-metropolitana', '')
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
    }

    const addToFavorites = (property) => {
        const favorites = JSON.parse(localStorage.getItem('favoriteProperties') || '[]')
        const exists = favorites.find(fav => fav.id === property.id)
        if (!exists) {
            favorites.push(property)
            localStorage.setItem('favoriteProperties', JSON.stringify(favorites))
            alert('✅ Propiedad agregada a favoritos')
        } else {
            alert('⚠️ Esta propiedad ya está en favoritos')
        }
    }

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
                            text: "¡Hola! 👋 Soy tu asistente de análisis inmobiliario. He recopilado datos reales desde Portal Inmobiliario. ¿Qué te gustaría saber? \n\nPuedes preguntarme sobre:\n• 💰 Propiedades más económicas\n• 📏 Propiedades más espaciosas\n• 🏘️ Análisis por sectores\n• ⭐ Recomendaciones personalizadas\n• 📊 Tendencias del mercado",
                            type: "text"
                        }
                    ]);
                } else {
                    setIsReady(false);
                    setMessages([
                        {
                            from: "bot",
                            text: "⚠️ Aún no se han recopilado datos. \n\nPor favor, ve al Dashboard y realiza un scraping antes de utilizar el análisis con IA.",
                            type: "text"
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

        const newMessages = [...messages, { from: "me", text: input, type: "text" }];
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

            // Check if response includes properties to display as cards
            if (data.properties && data.properties.length > 0) {
                setMessages([
                    ...newMessages, 
                    { 
                        from: "bot", 
                        text: data.reply,
                        type: "text"
                    },
                    {
                        from: "bot",
                        properties: data.properties,
                        type: "properties"
                    }
                ]);
            } else {
                setMessages([...newMessages, { 
                    from: "bot", 
                    text: data.reply,
                    type: "text"
                }]);
            }
        } catch (error) {
            setMessages([...newMessages, { 
                from: "bot", 
                text: "❌ Error al conectar con el servidor. Por favor, verifica que el backend esté activo.",
                type: "text"
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
                    <div key={i}>
                        {m.type === "text" && (
                            <div className={`msg ${m.from}`}>
                                {m.text}
                            </div>
                        )}
                        {m.type === "properties" && m.properties && (
                            <div className="properties-cards-container">
                                {m.properties.map((property, idx) => (
                                    <div key={idx} className="chat-property-card">
                                        <button 
                                            className="chat-favorite-btn"
                                            onClick={() => addToFavorites(property)}
                                            title="Agregar a favoritos"
                                        >
                                            ❤️
                                        </button>
                                        
                                        <div className="chat-property-header">
                                            <h4>{property.title}</h4>
                                            <span className="chat-property-comuna">
                                                📍 {formatComunaName(property.comuna)}
                                            </span>
                                        </div>

                                        <div className="chat-property-price">
                                            <span className="price-label">Precio:</span>
                                            <span className="price-value">{formatUF(property.priceUF)}</span>
                                        </div>

                                        <div className="chat-property-specs">
                                            <div className="chat-spec-item">
                                                <span className="spec-icon">🛏️</span>
                                                <span className="spec-value">{property.bedrooms || 0}</span>
                                            </div>
                                            <div className="chat-spec-item">
                                                <span className="spec-icon">🚿</span>
                                                <span className="spec-value">{property.bathrooms || 0}</span>
                                            </div>
                                            <div className="chat-spec-item">
                                                <span className="spec-icon">📐</span>
                                                <span className="spec-value">{property.area || 0}m²</span>
                                            </div>
                                            <div className="chat-spec-item">
                                                <span className="spec-icon">🚗</span>
                                                <span className="spec-value">{property.parking || 0}</span>
                                            </div>
                                        </div>

                                        {property.link && (
                                            <a
                                                href={property.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="chat-property-link"
                                            >
                                                Ver propiedad →
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
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
