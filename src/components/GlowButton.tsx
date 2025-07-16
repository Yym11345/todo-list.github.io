import React from 'react';

interface GlowButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
  icon?: React.ReactNode;
}

const GlowButton: React.FC<GlowButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '',
  icon 
}) => {
  const baseClasses = "relative px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden group";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700 shadow-lg hover:shadow-blue-500/25",
    secondary: "border-2 border-white text-white hover:bg-white hover:text-blue-600 shadow-lg hover:shadow-white/25"
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {/* 发光效果 */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-teal-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      
      {/* 脉冲效果 */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600 to-teal-600 opacity-0 group-hover:opacity-30 animate-pulse" />
      
      {/* 内容 */}
      <span className="relative flex items-center justify-center">
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </span>
    </button>
  );
};

export default GlowButton;