import { useRef, useState, useEffect, FormEvent } from 'react';
import { MessageList, Input, Button } from 'react-chat-elements';

interface Message {
  from: 'user' | 'bot';
  text: string;
  date: Date;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { from: 'bot', text: 'Halo, ada yang bisa saya bantu?', date: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const messageListRef = useRef<any>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage(event: FormEvent) {
    event.preventDefault();
    if (!input.trim() || loading) return;

    setMessages(msgs => [...msgs, { from: 'user', text: input, date: new Date() }]);
    setLoading(true);
    const prompt = input;
    setInput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt }),
      });
      const data = await response.json();
      setMessages(msgs => [
        ...msgs,
        { from: 'bot', text: data.reply ?? '[Tidak ada balasan]', date: new Date() },
      ]);
    } catch {
      setMessages(msgs => [
        ...msgs,
        { from: 'bot', text: '[Gagal menghubungi server chatbot]', date: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      maxWidth: 400,
      margin: '2rem auto',
      background: 'white',
      borderRadius: 16,
      padding: 16,
      boxShadow: '0px 4px 20px #0001',
      border: '1px solid #eee'
    }}>
      <MessageList
        className="message-list"
        lockable
        toBottomHeight={'100%'}
        referance={messageListRef}
        dataSource={messages.map((m, idx) => ({
          position: m.from === 'user' ? ('right' as const) : ('left' as const),
          type: 'text' as const,
          title: m.from === 'user' ? 'Anda' : 'Bot',
          text: m.text,
          date: m.date,
          id: idx,
          focus: false,
          titleColor: '',
          forwarded: false,
          replyButton: false,
          removeButton: false,
          status: 'read' as const,
          notch: true,
          retracted: false,
          // tambahkan `avatar` jika ingin, misal:
          // avatar: m.from === "user" ? "/user.png" : "/bot.png"
        }))}
      />
      <div style={{ minHeight: 320, marginBottom: 12 }} />
      <form style={{ display: "flex", gap: 4 }} onSubmit={sendMessage}>
        <Input
          placeholder={loading ? "Menunggu balasan..." : "Ketik pesan..."}
          value={input}
          maxHeight={100}
          onChange={(e: any) => setInput((e.target as HTMLInputElement).value)}
          // `react-chat-elements` versi terbaru gunakan prop onKeyDown
          onKeyDown={(e: any) => {
            if (e.key === "Enter" && !e.shiftKey) {
              sendMessage(e as any);
            }
          }}
          inputStyle={{ flex: 1, opacity: loading ? 0.6 : 1 }}
        />
        <Button
          text='Kirim'
          onClick={sendMessage}
          disabled={loading}
          backgroundColor='#2563eb'
          color='#fff'
        />
      </form>
      <div ref={chatBottomRef} />
    </div>
  );
}