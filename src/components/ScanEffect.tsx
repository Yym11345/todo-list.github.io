import React from 'react';

interface ScanEffectProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const ScanEffect: React.FC<ScanEffectProps> = ({ children, className = '', delay = 0 }) => {
  return (
    <div className={`relative overflow-hidden group ${className}`}>
      {children}
      {/* 扫光效果 */}
      <div 
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none"
        style={{ animationDelay: `${delay}ms` }}
      />
    </div>
  );
};

export default ScanEffect;