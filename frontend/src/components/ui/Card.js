import React from 'react';

const Card = ({ 
  children, 
  className = '',
  padding = 'md',
  shadow = 'md',
  hover = false,
  ...props 
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-lg'
  };

  const hoverClass = hover ? 'hover:shadow-lg transition-shadow duration-200' : '';

  const classes = `
    bg-white rounded-lg border border-gray-200
    ${paddingClasses[padding]}
    ${shadowClasses[shadow]}
    ${hoverClass}
    ${className}
  `.trim();

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

// Sub-components untuk card structure
Card.Header = ({ children, className = '' }) => (
  <div className={`border-b border-gray-200 pb-4 mb-4 ${className}`}>
    {children}
  </div>
);

Card.Body = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

Card.Footer = ({ children, className = '' }) => (
  <div className={`border-t border-gray-200 pt-4 mt-4 ${className}`}>
    {children}
  </div>
);

export default Card;