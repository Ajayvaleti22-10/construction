import React, { memo, useState } from 'react';
import { useLazyImage } from '../hooks/useAnimations';
import { resolveImageUrl } from '@/lib/cloudinary';

/**
 * Optimized Image Component with lazy loading and blur placeholder
 * Uses native loading="lazy" with Intersection Observer fallback
 */
export const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  className = '',
  aspectRatio = 'auto',
  priority = false,
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Resolve Cloudinary public IDs or use URL as-is
  const optimizedSrc = resolveImageUrl(src, { w: 800, q: 80 });

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  if (hasError) {
    return (
      <div 
        className={`bg-muted flex items-center justify-center ${className}`}
        style={{ aspectRatio }}
      >
        <span className="text-muted-foreground text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio }}>
      {/* Blur placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      <img
        src={optimizedSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
});

/**
 * Section container with reveal animation
 */
export const Section = memo(function Section({
  children,
  className = '',
  id,
  ...props
}) {
  return (
    <section
      id={id}
      className={`relative ${className}`}
      {...props}
    >
      {children}
    </section>
  );
});

/**
 * Container component for consistent max-width and padding
 */
export const Container = memo(function Container({
  children,
  className = '',
  size = 'default',
}) {
  const sizes = {
    small: 'max-w-4xl',
    default: 'max-w-7xl',
    large: 'max-w-screen-2xl',
    full: 'max-w-full',
  };

  return (
    <div className={`${sizes[size]} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
});

/**
 * Section heading with consistent styling
 */
export const SectionHeading = memo(function SectionHeading({
  label,
  title,
  description,
  align = 'left',
  className = '',
}) {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto',
  };

  return (
    <div className={`max-w-2xl ${alignClasses[align]} ${className}`}>
      {label && (
        <span className="inline-block font-mono text-xs uppercase tracking-[0.2em] text-primary mb-3">
          {label}
        </span>
      )}
      {title && (
        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-secondary text-balance">
          {title}
        </h2>
      )}
      {description && (
        <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
});

/**
 * Stat display component
 */
export const StatCard = memo(function StatCard({
  value,
  label,
  icon: Icon,
  className = '',
}) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {Icon && (
        <div className="w-12 h-12 flex items-center justify-center bg-primary/10 text-primary">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <div>
        <div className="font-heading text-3xl sm:text-4xl font-bold text-secondary">
          {value}
        </div>
        <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
      </div>
    </div>
  );
});

/**
 * Trust badge/certification display
 */
export const TrustBadge = memo(function TrustBadge({
  icon: Icon,
  title,
  description,
  className = '',
}) {
  return (
    <div className={`flex items-start gap-4 ${className}`}>
      <div className="w-10 h-10 flex items-center justify-center bg-accent/10 text-accent flex-shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h4 className="font-heading text-sm uppercase tracking-wide text-secondary">
          {title}
        </h4>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
    </div>
  );
});

export default {
  OptimizedImage,
  Section,
  Container,
  SectionHeading,
  StatCard,
  TrustBadge,
};
