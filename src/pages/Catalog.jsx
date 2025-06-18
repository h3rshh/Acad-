import React from 'react'
import { useState, useEffect } from 'react'
import Footer from "../components/core/Footer"
import { useParams } from 'react-router-dom'
import { apiConnector }  from "../services/apiconnector" 
import { getCatalogPageData } from "../services/operations/pageAndComponentData" 
import { useSelector } from 'react-redux'
import { categories } from '../services/apis'
import CourseSlider from '../components/catalog/CourseSlider'
import Course_Card from '../components/catalog/Course_Card'

const Catalog = () => {

  const { loading } = useSelector((state) => state.profile)
  const { catalogPage } = useParams()
  const [active, setActive] = useState(1)
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [categoryId, setCategoryId] = useState("");

  //Fetch all categories
  useEffect(()=> {
      const getCategories = async() => {
          const res = await apiConnector("GET", categories.CATEGORIES_API);
          // console.log("Result of Get categories from catalog.jsx: ", res)
          const category_id = 
          res?.data?.allCategories?.filter((ct) => ct.name.split(" ").join("-").toLowerCase() === catalogPage)[0]._id;
          setCategoryId(category_id);e
          // console.log("Set cat id: ", category_id)
      }
      getCategories();
  },[catalogPage]);

  useEffect(() => {
    // console.log("Entered get cat details func catalog.jsx, catId: ", categoryId)
    const getCategoryDetails = async() => {
        try{
            const res = await getCatalogPageData(categoryId);
            // console.log("Printing res of getcatdetails from catalog.jsx: ", res);
            setCatalogPageData(res);
        }
        catch(error) {
            // console.log("error in get cat details func catalog.jsx")
            // console.log(error)
        }
    }
    if(categoryId) {
        getCategoryDetails();
    }
    // console.log("Exiting get cat details func catalog.jsx")
      
  },[categoryId]);

  return (
    <>
      {/* Hero Section */}
      <div className=" box-content bg-richblack-800 px-4">
        <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
          <p className="text-sm text-richblack-300">
            {`Home / Catalog / `}
            <span className="text-yellow-25">
              {catalogPageData?.data?.selectedCategory?.name}
            </span>
          </p>
          <p className="text-3xl text-richblack-5">
            {catalogPageData?.data?.selectedCategory?.name}
          </p>
          <p className="max-w-[870px] text-richblack-200">
            {catalogPageData?.data?.selectedCategory?.description}
          </p>
        </div>
      </div>

      {/* Section 1 */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">Courses to get you started</div>
        <div className="my-4 flex border-b border-b-richblack-600 text-sm">
          <p
            className={`px-4 py-2 ${
              active === 1
                ? "border-b border-b-yellow-25 text-yellow-25"
                : "text-richblack-50"
            } cursor-pointer`}
            onClick={() => setActive(1)}
          >
            Most Populer
          </p>
          <p
            className={`px-4 py-2 ${
              active === 2
                ? "border-b border-b-yellow-25 text-yellow-25"
                : "text-richblack-50"
            } cursor-pointer`}
            onClick={() => setActive(2)}
          >
            New
          </p>
        </div>
        <div>
          <CourseSlider
            Courses={catalogPageData?.data?.selectedCategory?.courses}
          />
        </div>
      </div>
      
      {/* Section 2 */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">
          Top courses in {catalogPageData?.data?.differentCategory?.name}
        </div>
        <div className="py-8">
          <CourseSlider
            Courses={catalogPageData?.data?.differentCategory?.courses}
          />
        </div>
      </div>

      {/* Section 3 */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">Frequently Bought</div>
        <div className="py-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {catalogPageData?.data?.mostSellingCourses
              ?.slice(0, 4)
              .map((course, i) => (
                <Course_Card course={course} key={i} Height={"h-[250px]"} />
              ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default Catalog