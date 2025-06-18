import { Link, matchPath } from "react-router-dom"
import NavbarLinks from "../../data/navbar-links"
import { useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import { AiOutlineShoppingCart } from "react-icons/ai"
import ProfileDropdown from "../auth/ProfileDropdown"
import { useEffect, useState } from "react"
import { apiConnector } from "../../services/apiconnector"
import { categories } from "../../services/apis"
import { IoIosArrowDropdownCircle } from "react-icons/io"
import { BsChevronDown } from "react-icons/bs"
import { AiOutlineMenu } from "react-icons/ai"
import apexLogo from "../../assets/Logo/acad.png"

function Navbar() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { totalItems } = useSelector((state) => state.cart)
  const location = useLocation()

  const [subLinks, setSubLinks] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        console.log("Result : ", res.data.allCategories)
        setSubLinks(res.data.allCategories)
      } catch (error) {
        // console.log("Could not fetch Categories.", error)
      }
      setLoading(false)
    })()
  }, [])

  // console.log("sub links", subLinks)

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  return (
    <div
      className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
        location.pathname !== "/" ? "bg-richblack-800" : ""
      } transition-all duration-200`}
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={apexLogo} alt="Apex Logo" width={36} height={36} loading="lazy" />
          <span className="text-richblack-5 text-2xl font-semibold">Acad+</span>
        </Link>

        {/* Navigation links */}
        <nav className="hidden md:block">
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <>
                    <div
                      className={`group relative flex cursor-pointer items-center gap-1 ${
                        matchRoute("/catalog/:catalogName")
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      <p>{link.title}</p>
                      <BsChevronDown />
                      <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[150px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 px-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[250px]">
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                        {loading ? (
                          <p className="text-center">Loading...</p>
                        ) : (subLinks && subLinks.length) ? (
                          <>
                            {subLinks
                              ?.filter(
                                (subLink) => true
                              )
                              ?.map((subLink, i) => {
                                // console.log("Sublink : ", subLink)
                                return (<Link
                                  to={`/catalog/${subLink.name
                                    .split(" ")
                                    .join("-")
                                    .toLowerCase()}`}
                                  className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                  key={i}
                                >
                                  <p>{subLink.name}</p>
                                </Link>)
                              })}
                          </>
                        ) : (
                          <p className="text-center">No Courses Found</p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${
                        matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Login / Signup / Dashboard */}
        <div className="hidden items-center gap-x-4 md:flex">
          {/* {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && ( */}
          {user && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null && (
            <Link to="/login">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Sign up
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropdown />}
        </div>
        <button className="mr-4 md:hidden">
          <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
        </button>
      </div>
    </div>
  )
}

export default Navbar


// const Navbar = () => {

//   const { token } = useSelector( (state) => state.auth);
//   const { user } = useSelector( (state) => state.profile);
//   const { totalItems } = useSelector( (state) => state.cart);
//   const [sublinks, setsublinks] = useState([]);
//   const [loading, setLoading] = useState(false)

//   const fetchsublinks = async () => {
//     try{
//       setLoading(true)
//       const result = await apiConnector("GET", categoreis.CATEGORIES_API);
//       console.log("Result : ", result.data.allCategories)
//       setsublinks(result.data.allCategories)
//       setLoading(false)
//     }
//     catch(error){
//       console.log("Couldnt fetch sublinks, error : ", error)
//     }
//   }

//   useEffect( () => {
//     fetchsublinks();
//   }, [])

//   const location = useLocation()
//   const matchRoute = (route) => {
//     return matchPath({path: route}, location.pathname)
//   }


//   return (
//     <div
//       className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
//         location.pathname !== "/" ? "bg-richblack-800" : ""
//       } transition-all duration-200`}
//     >
//       <div className="flex w-11/12 max-w-maxContent items-center justify-between">
//         {/* Logo */}
//         <Link to="/">
//           <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
//         </Link>

//         {/* Nav Links */}
//         <nav>
//           <ul className="flex gap-x-6 text-richblack-25">
//           {
//             NavbarLinks.map( (link, index) => (
//               <li key={index}>
//               {
//                 link.title === "Catalog" ? (<div>
//                   <div className="flex relative items-center gap-2 group">
//                     <p>{link.title}</p>
//                     <IoIosArrowDropdownCircle />

//                     <div className="invisible absolute left-[50%] top-[50%] flex translate-x-[-30%] translate-y-[50%]
//                     flex-col rounded-md bg-richblack-5 p-5 text-richblack-900 opacity-0
//                     transition-all duration-200 group-hover:visible group-hover:opacity-100 lg:w-[300px]">
//                       <div className="absolute left-[30%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
//                       {loading ? (
//                           <p className="text-center">Loading...</p>
//                         ) : (sublinks && sublinks.length) ? (
//                           <>
//                             {sublinks
//                               ?.filter(
//                                 (subLink) => { }
//                               )
//                               ?.map((subLink, i) => {
//                                 console.log("Operating sublink:", subLink); // ✅ Correct placement
                              
//                                 return (
//                                   <Link
//                                     to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}
//                                     className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
//                                     key={i}
//                                   >
//                                     <p>{subLink.name}</p>
//                                   </Link>
//                                 );
//                               })}
//                           </>
//                         ) : (
//                           <p className="text-center">No Courses Found</p>
//                         )}
//                     </div>
//                   </div>
//                 </div>) : (
//                   <Link to={link?.path}>
//                     <p className={`${matchRoute(link?.path) ? "text-yellow-25" : 
//                       "text-richblack-25"}`}
//                     >
//                       {link.title}
//                     </p>
//                   </Link>
//                 ) 
//               }
//               </li>
//             )) 
//           }
//           </ul>
//         </nav>

//         {/* Login/Signup/Dashboard */}
//         <div className="hidden items-center gap-x-4 md:flex">
//         {user && user?.accountType !== "Instructor" && (
//         // {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (

//             <Link to="/dashboard/cart" className="relative">
//               <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
//               {totalItems > 0 && (
//                 <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
//                   {totalItems}
//                 </span>
//               )}
//             </Link>
//           )}

//           {token === null && (
//             <Link to="/login">
//               <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
//                 Log in
//               </button>
//             </Link>
//           )}
//           {token === null && (
//             <Link to="/signup">
//               <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
//                 Sign up
//               </button>
//             </Link>
//           )}

//           {token !== null && <ProfileDropdown />}

//         </div>

//       </div>


//     </div>
//   )
// }

// export default Navbar