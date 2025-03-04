import { useEffect, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import IconBtn from "../../common/IconBtn";

export default function VideoDetailsSidebar({ setReviewModal }) {
  const [activeStatus, setActiveStatus] = useState("");
  const [videoBarActive, setVideoBarActive] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { sectionId, subSectionId } = useParams();
  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse);

  useEffect(() => {
    const updatedData = () => {
      if (!courseSectionData.length) return;
      const currentSectionIndex = courseSectionData.findIndex(
        (data) => data._id === sectionId
      );
      const currentSubSectionIndex = courseSectionData?.[
        currentSectionIndex
      ]?.subSection.findIndex((data) => data._id === subSectionId);
      const activeSubSectionId =
        courseSectionData[currentSectionIndex]?.subSection?.[
          currentSubSectionIndex
        ]?._id;
      setActiveStatus(courseSectionData?.[currentSectionIndex]?._id);
      setVideoBarActive(activeSubSectionId);
    };
    updatedData();
  }, [courseSectionData, courseEntireData, location.pathname]);

  return (
    <>
      {!videoBarActive ? (
        <div className="grid h-screen w-screen place-items-center">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col bordr-r-[1px] border-r-richblack-700 bg-richblack-800 ">
          <div className="mx-5 flex flex-col items-start justify-between gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25 ml-3 mt-5">
            <div className="flex w-full items-center justify-between">
              <div
                className="flex h-[30px] w-[30px] ml-3 items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90"
                onClick={() => {
                  navigate(`/dashboard/enrolled-courses`);
                }}
                title="back"
              >
                <IoIosArrowBack size={25} />
              </div>

              <IconBtn
                text="Add Review"
                customClasses="items-end"
                onclick={() => setReviewModal(true)}
              />
            </div>

            <div className="flex flex-col ml-3">
              <p>{courseEntireData?.courseName}</p>
              <p className="text-sm font-semibold text-richblack-500">
                {completedLectures?.length} / {totalNoOfLectures}
              </p>
            </div>

            <div className="overflow-y-auto w-[90%] ml-3">
              {courseSectionData.map((course, index) => (
                <div
                  className="mt-2 cursor-pointer text-sm text-richblack-5"
                  onClick={() => setActiveStatus(course?._id)}
                  key={index}
                >
                  {/* section */}
                  <div className="flex flex-row justify-between bg-richblack-600 px-5 py-4">
                    <div className="w-[70%] font-semibold">
                      {course?.sectionName}
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`${
                          activeStatus === course?.sectionName
                            ? "rotate-0"
                            : "rotate-180"
                        } transition-all duration-100`}
                      >
                        <BsChevronDown />
                      </span>
                    </div>
                  </div>

                  {/* Sub Sections */}
                  {activeStatus === course?._id && (
                    <div className="transition-[height] duration-500 ease-in-out">
                      {course.subSection.map((topic, i) => (
                        <div
                          className={`flex gap-3 px-5 py-2 ${
                            videoBarActive === topic._id
                              ? "bg-yellow-200 font-semibold text-richblack-800"
                              : "hover:bg-richblack-900"
                          }`}
                          key={i}
                          onClick={() => {
                            navigate(
                              `/view-course/${courseEntireData?._id}/section/${course?._id}/sub-section/${topic?._id}`
                            );
                            setVideoBarActive(topic._id);
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={completedLectures.includes(topic?._id)}
                            onChange={() => {}}
                          />
                          {topic.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
