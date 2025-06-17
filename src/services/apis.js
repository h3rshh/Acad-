const BASE_URL = import.meta.env.VITE_BASE_URL

export const endPoints = {
    SENDOTP_API: BASE_URL + '/auth/sendotp',
    SIGNUP_API: BASE_URL + '/auth/signup',
    LOGIN_API: BASE_URL + '/auth/login',
    CHANGE_PASS: BASE_URL + '/auth/change-password',
    RESETPASSTOKEN_API: BASE_URL + '/auth/reset-password-token',
    RESETPASS_API: BASE_URL + '/auth/reset-pass',
}

export const categories = {
    CATEGORIES_API: BASE_URL + "/course/fetchAllCategories"
}

export const contactUsEndpoint = {
    CONTACT_US_FORM: BASE_URL + "/reach/contact"
}

export const settingsEndpoints = {
    UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateProfilePicture",
    UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
    CHANGE_PASSWORD_API: BASE_URL + "/auth/changepassword",
    DELETE_PROFILE_API: BASE_URL + "/profile/deleteProfile",
}

export const profileEndpoints = {
    GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses",
    GET_USER_DETAILS_API: BASE_URL + "/profile/fetchUserDetails",
    GET_INSTRUCTOR_DATA_API: BASE_URL + "/profile/instructorDashboard",   
}

export const studentEndpoints = {
    COURSE_PAYMENT_API: BASE_URL + "/payment/capturePayment",
    COURSE_VERIFY_API: BASE_URL + "/payment/verifyPayment",
    SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/sendPaymentSuccessEmail",
}

export const courseEndpoints = {
    GET_ALL_COURSE_API: BASE_URL + "/course/fetchAllCourses",
    COURSE_DETAILS_API: BASE_URL + "/course/fetchCourseDetails",
    EDIT_COURSE_API: BASE_URL + "/course/editCourse",
    COURSE_CATEGORIES_API: BASE_URL + "/course/fetchAllCategories",
    CREATE_COURSE_API: BASE_URL + "/course/createCourse",
    CREATE_SECTION_API: BASE_URL + "/course/addSection",
    CREATE_SUBSECTION_API: BASE_URL + "/course/addSubSection",
    UPDATE_SECTION_API: BASE_URL + "/course/updateSection",
    UPDATE_SUBSECTION_API: BASE_URL + "/course/updateSubSection",
    GET_ALL_INSTRUCTOR_COURSES_API: BASE_URL + "/course/getInstructorCourses",
    DELETE_SECTION_API: BASE_URL + "/course/deleteSection",
    DELETE_SUBSECTION_API: BASE_URL + "/course/deleteSubSection",
    DELETE_COURSE_API: BASE_URL + "/course/deleteCourse",
    GET_FULL_COURSE_DETAILS_AUTHENTICATED:
      BASE_URL + "/course/getFullCourseDetails",
    LECTURE_COMPLETION_API: BASE_URL + "/course/updateCourseProgress",
    CREATE_RATING_API: BASE_URL + "/course/createReview",
}

export const catalogData = {
  CATALOGPAGEDATA_API: BASE_URL + "/course/fetchCategoryDetails",
}

export const ratingsEndpoints = {
    REVIEWS_DETAILS_API2: BASE_URL + "/course/fetchAllReviews",
    REVIEWS_DETAILS_API: BASE_URL + "/course/getAllRating",
  }