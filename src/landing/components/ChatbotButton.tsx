import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send, Minimize2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: "¡Hola! Soy el asistente virtual de INCADEV. ¿En qué puedo ayudarte hoy?",
      timestamp: new Date()
    }
  ]);

  // FAQs rápidas del chatbot
  const quickQuestions = [
    "¿Cómo me inscribo?",
    "¿Cuáles son los precios?",
    "¿Tienen certificación?",
    "¿Modalidad de clases?"
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Agregar mensaje del usuario
    const newUserMessage = {
      id: messages.length + 1,
      type: "user",
      content: message,
      timestamp: new Date()
    };

    setMessages([...messages, newUserMessage]);
    setMessage("");

    // Simular respuesta del bot (en producción sería una API call)
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: "bot",
        content: "Gracias por tu pregunta. Un agente te responderá en breve. También puedes contactarnos al +51 999 888 777 o escribirnos a info@incadev.edu",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleQuickQuestion = (question: string) => {
    setMessage(question);
    handleSendMessage();
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-4 w-96 max-w-[calc(100vw-2rem)] shadow-2xl z-50 animate-in slide-in-from-bottom-5 duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <CardTitle className="text-lg">Chat con INCADEV</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => setIsOpen(false)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-4">
            {/* Messages Area */}
            <div className="h-80 overflow-y-auto mb-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      msg.type === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <span className="text-xs opacity-70">
                      {msg.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-2">Preguntas frecuentes:</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => handleQuickQuestion(question)}
                    >
                      {question}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="flex gap-2">
              <Input
                placeholder="Escribe tu mensaje..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button size="icon" onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Footer Info */}
            <div className="mt-3 pt-3 border-t">
              <p className="text-xs text-muted-foreground text-center">
                Tiempo de respuesta promedio: <span className="font-semibold">2 minutos</span>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Floating Button */}
      <Button
        size="lg"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 hover:scale-110 transition-transform"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-destructive rounded-full flex items-center justify-center text-xs animate-pulse">
              1
            </span>
          </>
        )}
      </Button>
    </>
  );
}
