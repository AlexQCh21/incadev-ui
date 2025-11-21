import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send, Minimize2, Bot, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: "¡Hola! Soy el asistente virtual de INCADEV. ¿En qué puedo ayudarte hoy?",
      timestamp: new Date()
    }
  ]);

  // Animación de apertura
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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
        <Card
          className={`fixed inset-x-2 bottom-20 sm:bottom-24 sm:right-4 sm:left-auto sm:w-96 h-[75vh] sm:h-[550px] max-h-[calc(100vh-6rem)] shadow-2xl z-50 border-2 overflow-hidden flex flex-col
            ${isAnimating ? 'animate-in slide-in-from-bottom-5 fade-in duration-300' : ''}`}
        >
          {/* Header mejorado */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:p-4 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
            <div className="flex items-center gap-2 sm:gap-3">
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-primary-foreground/20">
                <AvatarFallback className="bg-primary-foreground/10">
                  <Bot className="h-4 w-4 sm:h-6 sm:w-6 text-primary-foreground" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <CardTitle className="text-sm sm:text-base font-semibold">Asistente INCADEV</CardTitle>
                <div className="flex items-center gap-1.5 text-xs opacity-90">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span>En línea</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
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

          <CardContent className="p-3 sm:p-4 bg-gradient-to-b from-muted/20 to-background flex-1 flex flex-col overflow-hidden">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto mb-3 space-y-3 pr-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
                  {msg.type === "bot" && (
                    <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                      <AvatarFallback className="bg-primary/10">
                        <Bot className="h-4 w-4 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm ${
                      msg.type === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-card border rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {msg.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="mb-3 p-2 sm:p-3 bg-muted/50 rounded-lg border border-muted flex-shrink-0">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <p className="text-xs font-medium text-muted-foreground">Preguntas frecuentes</p>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {quickQuestions.map((question, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-all duration-200 shadow-sm text-xs"
                      onClick={() => handleQuickQuestion(question)}
                    >
                      {question}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="flex gap-2 items-end flex-shrink-0">
              <Input
                placeholder="Escribe tu mensaje..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 rounded-xl text-sm"
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                className="rounded-xl h-9 w-9 sm:h-10 sm:w-10 shadow-md hover:shadow-lg transition-all hover:scale-105 flex-shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Footer Info */}
            <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-muted/50 flex-shrink-0">
              <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <span className="hidden sm:inline">Tiempo de respuesta:</span>
                <span className="sm:hidden">Respuesta:</span>
                <span className="font-semibold text-foreground">~2 min</span>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Floating Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <Button
          size="lg"
          className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 bg-gradient-to-br from-primary to-primary/80 hover:shadow-primary/50"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X className="h-6 w-6 sm:h-7 sm:w-7" />
          ) : (
            <Bot className="h-6 w-6 sm:h-7 sm:w-7 animate-pulse" />
          )}
        </Button>

        {/* Notification badge - posicionado fuera del botón */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 h-5 w-5 sm:h-6 sm:w-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg animate-bounce z-10">
            1
          </span>
        )}

        {/* Pulsing ring animation */}
        {!isOpen && (
          <div className="absolute inset-0 h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-primary/30 animate-ping -z-10 pointer-events-none" />
        )}
      </div>
    </>
  );
}
