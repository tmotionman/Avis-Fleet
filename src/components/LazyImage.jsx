import React, { useState, useEffect, useRef } from 'react'

const LazyImage = ({ src, alt, className = '', placeholder = 'bg-gray-200' }) => {
  const [loaded, setLoaded] = useState(false)
  const [imageSrc, setImageSrc] = useState(null)
  const imgRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setImageSrc(src)
          observer.unobserve(imgRef.current)
        }
      },
      { threshold: 0.1 }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current)
      }
    }
  }, [src])

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={`${className} transition-opacity duration-300 ${
        loaded ? 'opacity-100' : 'opacity-0'
      }`}
      onLoad={() => setLoaded(true)}
    />
  )
}

export default LazyImage
