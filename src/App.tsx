import React, { useState } from 'react';
import { MessageSquare, Palmtree as Palm, Compass, Sun, Umbrella, MapPin, Clock, Globe, Send } from 'lucide-react';

function ChatMessage({ message, isUser }) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`${isUser ? 'bg-blue-600 text-white' : 'bg-white'} rounded-lg px-4 py-2 max-w-[80%] shadow`}>
        {message}
      </div>
    </div>
  );
}

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID()); // Generate a unique session ID

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('https://pruebas.paseandoporvenezuela.com/webhook/fca17f77-7c13-4a6b-b08b-ebb9eb650568/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('demo:omed')
        },
        body: JSON.stringify({
          sessionId: sessionId,
          action: 'sendMessage',
          chatInput: userMessage
        })
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      setMessages(prev => [...prev, { text: data.output || "I received your message!", isUser: false }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting right now. Please try again later.", isUser: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="relative h-screen">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&q=80")'
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative h-full flex items-center justify-center text-center text-white px-4">
          <div className="max-w-4xl">
            <div className="flex items-center justify-center mb-6">
              <Umbrella size={48} className="text-white mr-3" />
              <h1 className="text-5xl font-bold">vzla.travel</h1>
            </div>
            <p className="text-2xl mb-8 max-w-2xl mx-auto">
              Discover the magic of Isla de Margarita with TurismoMgta, your intelligent travel companion
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 flex items-center mx-auto">
              <MessageSquare className="mr-2" />
              Try TurismoMgta Now
            </button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
            Your Personal Guide to Isla de Margarita
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Compass />}
              title="Local Expertise"
              description="Access detailed information about the best spots, hidden gems, and local favorites"
            />
            <FeatureCard 
              icon={<Clock />}
              title="24/7 Assistance"
              description="Get instant answers to your travel questions anytime, anywhere"
            />
            <FeatureCard 
              icon={<Globe />}
              title="Cultural Insights"
              description="Learn about local customs, traditions, and the rich history of Margarita"
            />
          </div>
        </div>
      </section>

      {/* Chatbot Preview */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-gray-800">
                Meet TurismoMgta
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Your intelligent travel companion powered by advanced AI technology. Get personalized recommendations, instant answers, and local insights about Isla de Margarita.
              </p>
              <div className="space-y-4">
                <Feature icon={<MapPin />} text="Detailed location information" />
                <Feature icon={<Sun />} text="Weather updates and best times to visit" />
                <Feature icon={<Palm />} text="Beach and activity recommendations" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="flex items-center mb-4">
                  <MessageSquare className="text-blue-600 mr-2" />
                  <span className="font-semibold">TurismoMgta Chat</span>
                </div>
                
                <div className="h-[350px] overflow-y-auto mb-4 p-4 bg-gray-50 rounded">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-32">
                      Start a conversation with TurismoMgta!
                    </div>
                  ) : (
                    messages.map((msg, index) => (
                      <ChatMessage key={index} message={msg.text} isUser={msg.isUser} />
                    ))
                  )}
                  {isLoading && (
                    <div className="flex justify-start mb-4">
                      <div className="bg-white rounded-lg px-4 py-2 animate-pulse">
                        Typing...
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={sendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask about Isla de Margarita..."
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !inputMessage.trim()}
                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center mb-8">
            <Umbrella size={32} className="text-white mr-2" />
            <span className="text-2xl font-bold">vzla.travel</span>
          </div>
          <p className="text-center text-gray-400">
            © 2024 vzla.travel - Your gateway to discovering Isla de Margarita
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-gray-50 p-8 rounded-xl text-center hover:shadow-lg transition duration-300">
      <div className="text-blue-600 w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-blue-100 rounded-full">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function Feature({ icon, text }) {
  return (
    <div className="flex items-center">
      <div className="text-blue-600 mr-3">{icon}</div>
      <span className="text-gray-700">{text}</span>
    </div>
  );
}

export default App;