import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Brain, Loader2, AlertCircle, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import NutrientChart from './NutrientChart';

interface FollowUpChatProps {
  extractedText: string;
  analysis: any; // Use a more specific type later if needed
}

const FollowUpChat: React.FC<FollowUpChatProps> = ({ extractedText, analysis }) => {
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'ai' }>>([
    { text: 'Do you have any follow up questions? powered by perplexity', sender: 'ai' as const } // Hardcoded initial message
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast(); // Use toast for error messages

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const newMessage = { text: input, sender: 'user' as const };
    // Add user message to the chat immediately
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInput('');
    setIsLoading(true);

    const apiKey = import.meta.env.VITE_PERPLEXITY_API_KEY;
    if (!apiKey) {
      toast({
        title: "Configuration Error",
        description: "Perplexity API key is not configured",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
        // Construct the context for the AI
        const context = `Initial Nutrition Label Text: ${extractedText}\n\nInitial Analysis:\nKey Nutrients: ${analysis.nutrients.map(n => `${n.name}: ${n.value}${n.unit}`).join(', ')}\nHealth Implications: ${analysis.healthImplications.join('\n')}\nAllergens: ${analysis.allergens.join(', ')}\nOverall Assessment: ${analysis.overallAssessment}\n\nChat History:\n${messages.map(msg => `${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.text}`).join('\n')}`;

      const prompt = `Based on the following nutrition label analysis and chat history, answer the user's follow-up question:\n\n${context}\n\nUser Question: ${newMessage.text}\n\nAI Response:`;

      const response = await fetch('/api/perplexity/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'sonar', // Or another suitable model
          messages: [
             { role: 'system', content: 'You are a helpful AI assistant answering follow-up questions about a nutrition label analysis.' },
             { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      const responseText = await response.text();
      let data;

      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse API response:', responseText);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        const errorMessage = data.error?.message || 'Failed to get AI response';
        console.error('API error:', errorMessage);
        throw new Error(errorMessage);
      }

      const aiResponseText = data.choices?.[0]?.message?.content || 'No response from AI.';

      setMessages(prevMessages => [
        ...prevMessages,
        { text: aiResponseText, sender: 'ai' as const },
      ]);

    } catch (error) {
      console.error('Follow-up question error:', error);
      toast({
        title: "Chat Error",
        description: error instanceof Error ? error.message : "Could not get response from AI",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to render markdown bold
  const renderBoldMarkdown = (text: string) => {
    // Replace **text** with <strong>text</strong>
    const htmlText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return { __html: htmlText };
  };

  return (
    <Card className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-purple-200 dark:border-slate-700">
      <h4 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Follow-up Questions</h4>
      <div className="chat-box h-64 overflow-y-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-[70%] ${message.sender === 'user' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-800 dark:bg-slate-700 dark:text-slate-200'}`}
            >
              {message.sender === 'ai' ? (
                <span dangerouslySetInnerHTML={renderBoldMarkdown(message.text)}></span>
              ) : (
                message.text
              )}
            </div>
          </div>
        ))}
        {isLoading && (
             <div className="flex justify-start">
                <div className="px-4 py-2 rounded-lg max-w-[70%] bg-gray-200 text-gray-800 dark:bg-slate-700 dark:text-slate-200">
                     ...
                </div>
             </div>
        )}
      </div>
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Ask a follow-up question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
          className="flex-grow bg-white dark:bg-slate-700 border-none focus:border-none focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder-black dark:placeholder-white shadow-none"
          disabled={isLoading}
        />
        <Button onClick={handleSendMessage} disabled={isLoading || input.trim() === ''}>
           {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Send
        </Button>
      </div>
    </Card>
  );
};

export default FollowUpChat; 