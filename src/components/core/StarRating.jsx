import { FaStar } from "react-icons/fa"
import { useState } from "react"

const StarRating = ({ rating, onRatingChange, size = 28 }) => {
  const [hover, setHover] = useState(0)

  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1
        return (
          <label key={index} className="cursor-pointer">
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => onRatingChange(ratingValue)}
              className="hidden"
            />
            <FaStar
              className={`transition-colors duration-200 ${
                ratingValue <= (hover || rating)
                  ? "text-yellow-400"
                  : "text-richblack-500"
              }`}
              size={size}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(0)}
            />
          </label>
        )
      })}
    </div>
  )
}

export default StarRating;


/* // Replace the Rating component in your modal with:
<StarRating
  rating={rating}
  onRatingChange={ratingChanged}
  size={28}
/> */