import React, { useState, useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, ContactShadows, Html, RoundedBox, Sphere } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Sparkles, MessageCircle } from 'lucide-react';
import axios from 'axios';
import * as THREE from 'three';

// --- Premium Pixar-Style 3D SkillBot (100% Code-Based) ---
const SkillBot = ({ size = 1.1 }) => {
  const headRef = useRef();
  const bodyRef = useRef();
  const rightArmRef = useRef();
  const eyesRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (bodyRef.current) {
      bodyRef.current.position.y = Math.sin(t * 1.5) * 0.12;
      bodyRef.current.rotation.z = Math.sin(t * 0.6) * 0.08;
    }
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.4) * 0.25;
      headRef.current.rotation.x = Math.cos(t * 0.4) * 0.1;
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.z = -0.6 + Math.sin(t * 3.5) * 0.6;
      rightArmRef.current.rotation.x = Math.sin(t * 3.5) * 0.2;
    }
    if (eyesRef.current) {
      const blink = Math.sin(t * 5) > 0.98 ? 0.05 : 1;
      eyesRef.current.scale.y = THREE.MathUtils.lerp(eyesRef.current.scale.y, blink, 0.4);
    }
  });

  const bodyMaterial = <meshStandardMaterial color="#ffffff" roughness={0.15} metalness={0.05} />;
  const silverMaterial = <meshStandardMaterial color="#cbd5e1" roughness={0.1} metalness={0.8} />;
  const glowMaterial = <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={4} />;

  return (
    <group scale={size} position={[0, -0.2, 0]}>
      <mesh ref={bodyRef}>
        <sphereGeometry args={[0.55, 32, 32]} />
        {bodyMaterial}
        <mesh position={[0, 0, 0.45]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          {glowMaterial}
        </mesh>
      </mesh>
      <group ref={headRef} position={[0, 0.65, 0]}>
        <mesh><sphereGeometry args={[0.5, 32, 32]} />{bodyMaterial}</mesh>
        <mesh position={[0, 0, 0.38]}>
          <planeGeometry args={[0.65, 0.4]} />
          <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.9} transparent opacity={0.95} />
        </mesh>
        <group ref={eyesRef} position={[0, 0.05, 0.42]}>
          <mesh position={[-0.2, 0, 0]}><sphereGeometry args={[0.08, 16, 16]} /><meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={8} /></mesh>
          <mesh position={[0.2, 0, 0]}><sphereGeometry args={[0.08, 16, 16]} /><meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={8} /></mesh>
        </group>
        <group position={[0.48, 0, 0.1]}>
           <mesh rotation={[Math.PI/2, 0, 0]}><cylinderGeometry args={[0.04, 0.04, 0.1]} />{silverMaterial}</mesh>
           <mesh position={[-0.25, -0.3, 0.35]} rotation={[0, -Math.PI/4, 0]}><cylinderGeometry args={[0.015, 0.015, 0.5]} />{silverMaterial}</mesh>
           <mesh position={[-0.45, -0.48, 0.52]}><sphereGeometry args={[0.05]} /><meshStandardMaterial color="#1e293b" /></mesh>
        </group>
      </group>
      <group ref={rightArmRef} position={[0.6, 0.15, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2.5]}><capsuleGeometry args={[0.07, 0.35, 16, 16]} />{silverMaterial}</mesh>
      </group>
      <group position={[-0.6, 0.15, 0]}>
        <mesh rotation={[0, 0, -Math.PI / 3]}><capsuleGeometry args={[0.07, 0.35, 16, 16]} />{silverMaterial}</mesh>
      </group>
    </group>
  );
};

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Beep Boop! 🤖 I am SkillBot. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/ai/chat', { message: input, history: messages });
      if (res.data.status === 'success') {
        setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Neural sync error. Try again! Beep!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="w-[320px] sm:w-[360px] h-[480px] mb-8 mr-2 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.12)] border border-white/50 flex flex-col overflow-hidden relative pointer-events-auto"
            style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(40px)' }}
          >
            <div className="absolute inset-0 z-0 opacity-40">
               <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                  <Suspense fallback={null}>
                     <SkillBot size={0.7} />
                     <Environment preset="city" />
                     <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
                  </Suspense>
               </Canvas>
            </div>
            <div className="relative z-10 flex flex-col h-full">
               <div className="px-8 pt-8 pb-1 flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">SkillBot 🤖</h3>
                    <div className="flex items-center gap-1.5">
                       <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active</span>
                    </div>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="p-2 text-slate-300 hover:text-slate-900 transition-all"><X size={20}/></button>
               </div>
               <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 py-4 space-y-4 custom-scrollbar">
                  {messages.map((msg, idx) => (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[12.5px] font-bold leading-relaxed shadow-sm ${
                        msg.role === 'user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white border border-slate-50 text-slate-800 rounded-tl-none'
                      }`}>
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
               </div>
               <div className="p-6">
                  <form onSubmit={handleSend} className="relative group">
                    <input 
                      type="text" 
                      value={input} 
                      onChange={(e) => setInput(e.target.value)} 
                      placeholder="Message..." 
                      className="w-full bg-[#F8FAFC] border border-slate-100 rounded-full py-3.5 px-6 text-[13px] font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-pink-500/5 transition-all shadow-inner" 
                    />
                    <button type="submit" disabled={!input.trim() || isLoading} className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center hover:scale-105 transition-all shadow-lg shadow-pink-100">
                       <Send size={14} />
                    </button>
                  </form>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!isOpen && (
        <div className="relative group cursor-pointer pointer-events-auto" onClick={() => setIsOpen(true)}>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-8 bg-pink-200/40 blur-2xl rounded-full" />
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ scale: 1.1 }} className="w-44 h-44 relative">
             <Canvas camera={{ position: [0, 0, 5], fov: 42 }} gl={{ alpha: true }}>
                <Suspense fallback={null}>
                   <Float speed={4} rotationIntensity={0.8} floatIntensity={0.8}><SkillBot size={1.0} /></Float>
                   <Environment preset="city" />
                </Suspense>
             </Canvas>
             <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 }} className="absolute right-[95%] top-1/2 -translate-y-1/2 px-4 py-2.5 bg-white rounded-full shadow-xl border border-slate-50 whitespace-nowrap hidden sm:flex items-center">
                <p className="text-[12px] font-extrabold text-slate-800 tracking-tight">Need help? 👋</p>
                <svg className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-2.5 h-3.5 fill-white" viewBox="0 0 10 12"><path d="M0 0 L10 6 L0 12 Z" /></svg>
             </motion.div>
          </motion.div>
        </div>
      )}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AIChatWidget;
