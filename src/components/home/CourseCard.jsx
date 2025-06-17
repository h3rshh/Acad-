// Importing React Icons
import { HiUsers } from "react-icons/hi";
import { ImTree } from "react-icons/im";
import PropTypes from "prop-types"


const CourseCard = ({cardData, currentCard, setCurrentCard}) => {
  return (
    <div
      className={`w-[460px] lg:w-[28%] mx-4 ${
        currentCard === cardData?.heading
          ? "bg-white shadow-[12px_12px_0_0] shadow-yellow-50"
          : "bg-richblack-800"
      }  text-richblack-25 h-[300px] box-border cursor-pointer`}
      onClick={() => setCurrentCard(cardData?.heading)}
    >
      <div className="border-b-[2px]  border-richblack-400 border-dashed h-[80%] p-6 flex flex-col gap-3">
        <div
          className={` ${
            currentCard === cardData?.heading && "text-richblack-800"
          } font-semibold text-[20px]`}
        >
          {cardData?.heading}
        </div>

        <div className="text-richblack-400">{cardData?.description}</div>
      </div>

      <div
        className={`flex justify-between ${
          currentCard === cardData?.heading ? "text-blue-300" : "text-richblack-300"
        } px-6 py-3 font-medium`}
      >
        {/* Level */}
        <div className="flex items-center gap-2 text-[16px]">
          <HiUsers />
          <p>{cardData?.level}</p>
        </div>

        {/* Flow Chart */}
        <div className="flex items-center gap-2 text-[16px]">
          <ImTree />
          <p>{cardData?.lessionNumber} Lession</p>
        </div>
      </div>
    </div>
  );
};

CourseCard.propTypes = {
    cardData: PropTypes.shape({
        heading: PropTypes.string,
        description: PropTypes.string,
        level: PropTypes.string,
        lessionNumber: PropTypes.number,
    }),
    currentCard: PropTypes.string,
    setCurrentCard: PropTypes.func,
}

export default CourseCard;