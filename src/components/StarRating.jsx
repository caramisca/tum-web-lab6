import { useState } from 'react'

export default function StarRating({ value, onChange, size = '', readonly = false }) {
  const [hover, setHover] = useState(null)

  return (
    <div
      className={`star-rating star-rating--${size} ${readonly ? 'star-rating--readonly' : ''}`}
      onMouseLeave={() => setHover(null)}
    >
      {[1, 2, 3, 4, 5].map(n => {
        const filled = (hover ?? value ?? 0) >= n
        const isPreview = hover !== null && hover >= n
        return (
          <i
            key={n}
            className={`fa-star ${filled ? 'fa-solid' : 'fa-regular'} star-rating__star ${
              isPreview ? 'preview' : filled ? 'filled' : ''
            }`}
            onMouseEnter={() => !readonly && setHover(n)}
            onClick={() => {
              if (!readonly && onChange) {
                onChange(value === n ? null : n)
              }
            }}
          />
        )
      })}
    </div>
  )
}
