const Category = require("../models/Category")
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

exports.createCategory = async (req, res) => {
    try{
        const { name, desc } = req.body
        if(!name || !desc){
            return res.status(400).json({
                success: false,
                message: "Enter all fields",
            })
        }

        const newCategory = await Category.create({
            name: name,
            description: desc,
            courses: [],
        })

        return res.status(200).json({
            success: true,
            message: "Category Created Successfully",
            newCategory
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

exports.fetchAllCategories = async (req, res) => {
    try{
        const allCategories = await Category.find({})
        if(allCategories == null){
            return res.status(400).json({
                success: false,
                message: "No categories found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Fetched all categories",
            allCategories
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.fetchCategoryDetails = async (req, res) => {
    try {
        const { categoryId } = req.body
        console.log("PRINTING CATEGORY ID: ", categoryId);
        // Get courses for the specified category
        const selectedCategory = await Category.findById(categoryId)
          .populate({
            path: "courses",
            match: { status: "Published" },
            populate: [
              { path: "instructor" },
              { path: "ratingAndReview" }
            ],
          })
          .exec()
    
        // console.log("SELECTED COURSE", selectedCategory)
        // Handle the case when the category is not found
        if (!selectedCategory) {
          console.log("Category not found.")
          return res
            .status(404)
            .json({ success: false, message: "Category not found" })
        }
        // Handle the case when there are no courses
        if (selectedCategory.courses.length === 0) {
          console.log("No courses found for the selected category.")
          return res.status(404).json({
            success: false,
            message: "No courses found for the selected category.",
          })
        }
    
        // Get courses for other categories
        const categoriesExceptSelected = await Category.find({
          _id: { $ne: categoryId },
        })
        let differentCategory = await Category.findOne(
          categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
            ._id
        )
          .populate({
            path: "courses",
            match: { status: "Published" },
            populate: [
              { path: "instructor" },
              { path: "ratingAndReview" }
            ],
          })
          .exec()
          // console.log("Different COURSE", differentCategory)
        // Get top-selling courses across all categories
        const allCategories = await Category.find()
          .populate({
            path: "courses",
            match: { status: "Published" },
            populate: [
              { path: "instructor" },
              { path: "ratingAndReview"}
            ]
          })
          .exec()
        const allCourses = allCategories.flatMap((category) => category.courses).filter(Boolean)
        const mostSellingCourses = allCourses
          .sort((a, b) => b.sold - a.sold)
          .slice(0, 10)
        //  console.log("mostSellingCourses COURSE", mostSellingCourses)
        res.status(200).json({
          success: true,
          data: {
            selectedCategory,
            differentCategory,
            mostSellingCourses,
          },
        })
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error.message,
        })
      }
}