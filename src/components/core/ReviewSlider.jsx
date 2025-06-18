// React and Swiper components
import React, { useEffect, useState } from "react";
import RatingStars from "./RatingStars";
import { Swiper, SwiperSlide } from "swiper/react";
// Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
// Custom styles
import "../../App.css";
// Icons
import { FaStar } from "react-icons/fa";
// Swiper modules (corrected!)
import { Autoplay, FreeMode, Pagination } from "swiper/modules";
// Get apiFunction and the endpoint
import { apiConnector } from "../../services/apiconnector"
import { ratingsEndpoints } from "../../services/apis"

function ReviewSlider() {
  const [reviews, setReviews] = useState([])
  const truncateWords = 15

  useEffect(() => {
    ;(async () => {
      const { data } = await apiConnector(
        "GET",
        ratingsEndpoints.REVIEWS_DETAILS_API
      )
      if (data?.success) {
        console.log("Reviews: ", data)
        setReviews(data?.data)
      }
    })()
  }, [])

  return (
    <div className="text-white">
      <div className="my-[50px] w-full max-w-6xl mx-auto">
        <Swiper
          spaceBetween={30}
          slidesPerView={3}
          loop={true}
          freeMode={true}
          speed={2000}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[FreeMode, Pagination, Autoplay]}
          className="w-full"
        >
          {reviews.map((review, i) => (
            <SwiperSlide key={i}>
              <div className="min-w-[320px] max-w-[355px] h-[250px] flex flex-col gap-4 bg-richblack-800 p-6 text-[15px] text-richblack-25 rounded-lg shadow-md">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      review?.user?.image
                        ? review?.user?.image
                        : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                    }
                    alt=""
                    className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex flex-col min-w-0">
                    <h1 className="font-semibold text-richblack-5 truncate">
                      {`${review?.user?.firstName} ${review?.user?.lastName}`}
                    </h1>
                    <h2 className="text-[13px] font-medium text-richblack-500 truncate">
                      {review?.course?.courseName}
                    </h2>
                  </div>
                </div>
                {/* Multi-line ellipsis for review text */}
                <p className="font-medium text-richblack-25 flex-grow leading-relaxed line-clamp-3">
                  {review?.review}
                </p>
                <div className="flex items-center gap-2 mt-auto">
                  <h3 className="font-semibold text-yellow-100">
                    {review.rating.toFixed(1)}
                  </h3>
                  <RatingStars
                    Review_Count={review.rating}
                    Star_Size={18}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default ReviewSlider