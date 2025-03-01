// const Section = require("../models/Section");
// const Course = require("../models/Course");
// const SubSection = require("../models/SubSection");

// //in course we create many section like chapter_1 , chapter_2 and in section we create many subsection like chapter_1 divided into five topic...
// const createSection = async (req, res) => {
//   try {
//     const { sectionName, courseId } = req.body; //data fetch
//     if (!sectionName || !courseId) {
//       //data validation
//       return res
//         .status(400)
//         .json({ success: false, message: "Missing Properties" });
//     }

//     //create section in DB;
//     const newSection = await Section.create({ sectionName });

//     //update course with section ObjectID
//     const updatedCourseDetails = await Course.findByIdAndUpdate(
//       courseId,
//       { $push: { courseContent: newSection._id } },
//       { new: true }
//     )
//       .populate({ path: "courseContent", populate: { path: "subSection" } })
//       .exec();

//     return res.status(200).json({
//       //return response
//       success: true,
//       message: "Section created successfully",
//       updatedCourseDetails,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Unable to create Section, please try again",
//       error: error.message,
//     });
//   }
// };

// const updateSection = async (req, res) => {
//   try {
//     const { sectionName, sectionId, courseId } = req.body; //data input
//     if (!sectionName || !sectionId) {
//       //data validation
//       return res
//         .status(400)
//         .json({ success: false, message: "Missing Properties" });
//     }

//     const section = await Section.findByIdAndUpdate(
//       sectionId,
//       { sectionName },
//       { new: true }
//     ); //it find section that id is matched with sectionid and in that section {sectionName} is updated;
//     // await Section.findByIdAndUpdate(sectionId, {sectionName}, {new:true}); agar hm itna bhi likhe to koi effect nhi padega;
//     const course = await Course.findById(courseId)
//       .populate({ path: "courseContent", populate: { path: "subSection" } })
//       .exec();

//     return res.status(200).json({
//       //return res
//       success: true,
//       data: course,
//       message: "Section Updated Successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Unable to update Section, please try again",
//       error: error.message,
//     });
//   }
// };

// // DELETE a section
// const deleteSection = async (req, res) => {
//   try {
//     const { sectionId, courseId } = req.body;
//     await Course.findByIdAndUpdate(courseId, {
//       $pull: { courseContent: sectionId },
//     });

//     const section = await Section.findById(sectionId);
//     if (!section) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Section not Found" });
//     }

//     //delete sub section
//     await SubSection.deleteMany({ _id: { $in: section.subSection } });

//     await Section.findByIdAndDelete(sectionId);

//     //find the updated course and return
//     const course = await Course.findById(courseId)
//       .populate({
//         //here there is no use of const course , its only store updated course;
//         path: "courseContent", // if you also write without  "const course = " then it also work;
//         populate: {
//           path: "subSection",
//         },
//       })
//       .exec();

//     res.status(200).json({
//       success: true,
//       message: "Section deleted",
//       data: course,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

// module.exports = { createSection, updateSection, deleteSection };

//  !  **************Updated Section**************************
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const Course = require("../models/Course");

exports.createSection = async (req, res) => {
  console.log("Create Section");
  try {
    //data fetch
    console.log(req.body);
    const { sectionName, courseId } = req.body;
    //data validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        Message: "Missing Properties",
      });
    }
    //create section
    const newSection = await Section.create({ sectionName });
    //update course with section objectId
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    )
      .populate({ path: "courseContent", populate: { path: "subSection" } })
      .exec();
    console.log("updated course", updatedCourse);

    //return response
    return res.status(200).json({
      success: true,
      message: "Section Created Successfully",
      updatedCourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Section Creation Failed",
      error: error.message,
    });
  }
};

exports.updateSection = async (req, res) => {
  try {
    // data input
    const { sectionName, sectionId, courseId } = req.body;
    // data validation
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Missing Fields",
      });
    }
    // update data
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    const course = await Course.findById(courseId)
      .populate({ path: "courseContent", populate: { path: "subSection" } })
      .exec();

    // return res
    return res.status(200).json({
      success: true,
      message: "Section Updated Successfully",
      data: course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update Section, please try again",
      error: error.message,
    });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    // Get SectionId- assuming that we are sending Id in params
    // const { sectionId,courseId } = req.params;
    // or
    const { sectionId, courseId } = req.body;
    await Course.findByIdAndUpdate(courseId, {
      $pull: { courseContent: sectionId },
    });

    const section = await Section.findById(sectionId);
    if (!section) {
      return res
        .status(404)
        .json({ success: false, message: "Section not Found" });
    }

    //delete sub section
    await SubSection.deleteMany({ _id: { $in: section.subSection } });

    await Section.findByIdAndDelete(sectionId);

    //find the updated course and return
    const course = await Course.findById(courseId)
      .populate({
        //here there is no use of const course , its only store updated course;
        path: "courseContent", // if you also write without  "const course = " then it also work;
        populate: {
          path: "subSection",
        },
      })
      .exec();

    res.status(200).json({
      success: true,
      message: "Section deleted",
      data: course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete Section",
    });
  }
};
