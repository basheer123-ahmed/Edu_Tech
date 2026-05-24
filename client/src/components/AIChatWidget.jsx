import React, { useState, useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, ContactShadows, Html, RoundedBox, Sphere } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Sparkles, MessageCircle } from 'lucide-react';
import axios from 'axios';
import * as THREE from 'three';

// --- Premium Pixar-Style 3D SkilBot (100% Code-Based) ---
const SkilBot = ({ size = 1.1, isHovered = false }) => {
  const headRef = useRef();
  const bodyRef = useRef();
  const rightArmRef = useRef();
  const leftArmRef = useRef();
  const eyesRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Slight body float and idle breathing
    if (bodyRef.current) {
      bodyRef.current.position.y = Math.sin(t * 1.5) * 0.12;
      bodyRef.current.rotation.z = Math.sin(t * 0.6) * 0.05;
    }
    
    // Head bobbing & tracking rotation
    if (headRef.current) {
      headRef.current.position.y = 0.65 + Math.sin(t * 1.5) * 0.02;
      headRef.current.rotation.y = Math.sin(t * 0.4) * 0.15;
      headRef.current.rotation.x = Math.cos(t * 0.4) * 0.06;
    }

    // Interactive hand animations
    const waveSpeed = isHovered ? 6.5 : 1.5;
    const waveIntensity = isHovered ? 0.35 : 0.08;

    if (rightArmRef.current) {
      // Right arm: moves up and down (waving when hovered)
      const baseRotZ = Math.PI / 2.5;
      rightArmRef.current.rotation.z = baseRotZ + Math.sin(t * waveSpeed) * waveIntensity;
      rightArmRef.current.rotation.x = Math.sin(t * waveSpeed) * (isHovered ? 0.25 : 0.05);
    }
    


    // Eye blinking
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
      <group ref={leftArmRef} position={[-0.6, 0.15, 0]}>
        <mesh rotation={[0, 0, -Math.PI / 3]}><capsuleGeometry args={[0.07, 0.35, 16, 16]} />{silverMaterial}</mesh>
      </group>
    </group>
  );
};

const AIChatWidget = ({ position = 'top' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Beep Boop! 🤖 I am SkilBot. How can I help you today?' }
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

    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      setMessages(prev => [...prev, { role: 'assistant', content: "Please log in to chat with SkilBot! 🔒" }]);
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:5000/api/ai/chat',
        { message: input, history: messages },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (res.data.status === 'success') {
        setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
      }
    } catch (err) {
      console.error('[AIChatWidget ERROR] Failed to send chat message:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        setMessages(prev => [...prev, { role: 'assistant', content: "Your session has expired or is invalid. Please log in again. 🔒" }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "Neural sync error. Try again! Beep!" }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative z-50 flex flex-col items-end pointer-events-auto select-none">
      {/* Bot Button Trigger - Always visible */}
      <div 
        className="relative group cursor-pointer" 
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-12 h-3 bg-pink-200/40 blur-lg rounded-full" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }} 
          whileHover={{ scale: 1.08, filter: 'drop-shadow(0 0 10px rgba(244, 114, 182, 0.45))' }} 
          className="w-16 h-16 relative"
        >
           <Canvas camera={{ position: [0, 0, 5], fov: 42 }} gl={{ alpha: true }}>
              <Suspense fallback={null}>
                 <Float speed={4} rotationIntensity={0.8} floatIntensity={0.8}>
                   <SkilBot size={1.25} isHovered={isHovered} />
                 </Float>
                 <Environment preset="city" />
              </Suspense>
           </Canvas>
        </motion.div>
        
        {/* Help popup - Only visible when closed */}
        {!isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: position === 'bottom' ? 5 : -5 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 1.2 }} 
            className={`absolute ${position === 'bottom' ? 'bottom-[100%] mb-1' : 'top-[100%] mt-1'} right-0 px-3 py-1.5 bg-white rounded-2xl shadow-xl border border-slate-100 whitespace-nowrap hidden sm:flex items-center z-50`}
          >
             <p className="text-[10px] font-extrabold text-slate-800 tracking-tight">Need help? 👋</p>
             <svg className={`absolute ${position === 'bottom' ? 'bottom-[-6px] rotate-180' : 'top-[-6px]'} right-[20px] w-3 h-2 fill-white`} viewBox="0 0 12 10"><path d="M6 0 L12 10 L0 10 Z" /></svg>
          </motion.div>
        )}
      </div>

      {/* Chat window dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: position === 'bottom' ? 10 : -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: position === 'bottom' ? 10 : -10 }}
            className={`w-[320px] sm:w-[360px] h-[480px] absolute ${position === 'bottom' ? 'bottom-[110%]' : 'top-[110%]'} right-0 rounded-[2.5rem] shadow-[0_40px_100px_rgba(244,114,182,0.15)] border border-white/80 flex flex-col overflow-hidden z-[9999] pointer-events-auto`}
            style={{ background: 'rgba(255, 235, 245, 0.90)', backdropFilter: 'blur(40px)' }}
          >
            <div className="absolute inset-0 z-0 opacity-40">
               <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                  <Suspense fallback={null}>
                     <SkilBot size={0.7} isHovered={false} />
                     <Environment preset="city" />
                     <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
                  </Suspense>
               </Canvas>
            </div>
            <div className="relative z-10 flex flex-col h-full">
               <div className="bg-[#E94D8E] px-5 py-4 flex items-center justify-between shrink-0 shadow-sm border-b border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shrink-0 shadow-inner text-2xl">
                      🤖
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-bold text-white tracking-tight leading-none">SkilStation AI Tutor</h3>
                        <span className="bg-white/25 px-2 py-0.5 rounded-full text-[9px] font-bold text-white">15 COURSES</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                         <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                         <span className="text-[11px] font-medium text-white/90">Online — Ready to help</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setMessages([{ role: 'assistant', content: 'Beep Boop! 🤖 I am SkilBot. How can I help you today?' }])} className="px-3 py-1 border border-white/40 rounded-full text-[10px] font-bold text-white hover:bg-white/20 transition-colors">CLEAR</button>
                    <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors p-1"><X size={18}/></button>
                  </div>
               </div>
               <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar">
                  {messages.map((msg, idx) => (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[12.5px] font-bold leading-relaxed shadow-sm ${
                        msg.role === 'user' ? 'bg-gradient-to-tr from-pink-500 to-rose-400 text-white rounded-tr-none' : 'bg-white border border-slate-50 text-slate-800 rounded-tl-none'
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
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AIChatWidget;
