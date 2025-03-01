const express = require("express");
const router = express.Router();

// Routes for deleteprofile , updateprofile ,getuserdetails , getEnrolledCourse , updateDisplayPicture;

const { auth, isInstructor } = require("../middlewares/auth");
const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateProfilePicture,
  getEnrolledCourses,
  instructorDashboard,
} = require("../controllers/Profile");

// ********************************************************************************************************
//                                      Profile routes                                                    *
// ********************************************************************************************************
router.delete("/deleteProfile", auth, deleteAccount); // Delete User Account
router.put("/updateProfile", auth, updateProfile);
router.get("/getUserDetails", auth, getAllUserDetails);
router.get("/getEnrolledCourses", auth, getEnrolledCourses); // Get Enrolled Courses
router.put("/updateDisplayPicture", auth, updateProfilePicture);
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard);

module.exports = router;
