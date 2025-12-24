import { View, ViewProps } from 'react-native';
import React from 'react';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'elevated' | 'flat' | 'outline';
}

export const Card = ({
  children,
  className = '',
  variant = 'elevated',
  ...props
}: CardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return 'bg-white shadow-xl shadow-deepTeal/5';
      case 'flat':
        return 'bg-cardamomCream';
      case 'outline':
        return 'bg-transparent border border-cardamomCream';
      default:
        return 'bg-white shadow-xl shadow-deepTeal/5';
    }
  };

  return (
    <View
      className={`
        p-5 rounded-[24px]
        ${getVariantStyles()}
        ${className}
      `}
      {...props}
    >
      {children}
    </View>
  );
};

