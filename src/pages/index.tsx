import Chatbot from '../components/Chatbot';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <h1 style={{ textAlign: 'center', margin: '2rem 0', fontWeight: 'bold', fontSize: '2rem' }}>
        Chatbot Sederhana (Next.js)
      </h1>
      <Chatbot />
    </div>
  );
}