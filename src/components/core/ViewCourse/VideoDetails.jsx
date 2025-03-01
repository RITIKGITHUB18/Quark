import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import "video-react/dist/video-react.css";
import { useLocation } from "react-router-dom";
import { BigPlayButton, Player } from "video-react";
import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI";
import { updateCompletedLectures } from "../../../slices/viewCourseSlice";
import IconBtn from "../../common/IconBtn";

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const playerRef = useRef(null);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse);
  const [videoData, setVideoData] = useState([]);
  const [previewSource, setPreviewSource] = useState("");
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const courseSection = async () => {
      if (!courseSectionData.length) return;
      if (!courseId && !sectionId && !subSectionId) {
        navigate(`/dashboard/enrolled-courses`);
      } else {
        const filteredData = courseSectionData.filter(
          (course) => course._id === sectionId
        );
        const filteredVideoData = filteredData?.[0]?.subSection.filter(
          (data) => data._id === subSectionId
        );
        setVideoData(filteredVideoData[0]);
        setPreviewSource(courseEntireData.thumbnail);
        setVideoEnded(false);
      }
    };

    courseSection();
  }, [courseSectionData, courseEntireData, location.pathname]);

  const isFirstVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    const currentSubSectionIndex = courseSectionData[
      currentSectionIndex
    ].subSection.findIndex((data) => data._id === subSectionId);

    if (currentSectionIndex === 0 && currentSubSectionIndex === 0) return true;
    else return false;
  };

  const goToNextVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    const noOfSubsections =
      courseSectionData[currentSectionIndex].subSection.length;
    const currentSubSectionIndex = courseSectionData[
      currentSectionIndex
    ].subSection.findIndex((data) => data._id === subSectionId);

    if (currentSubSectionIndex !== noOfSubsections - 1) {
      const nextSubSectionId =
        courseSectionData[currentSectionIndex].subSection[
          currentSubSectionIndex + 1
        ]._id;
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
      );
    } else {
      const nextSectionId = courseSectionData[currentSectionIndex + 1]._id;
      const nextSubSectionId =
        courseSectionData[currentSectionIndex + 1].subSection[0]._id;
      navigate(
        `/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`
      );
    }
  };

  //   check if the lecture is th last video of the course
  const isLastVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    const noOfSubsections =
      courseSectionData[currentSectionIndex].subSection.length;
    const currentSubSectionIndex = courseSectionData[
      currentSectionIndex
    ].subSection.findIndex((data) => data._id === subSectionId);

    if (
      currentSectionIndex === courseSectionData.length - 1 &&
      currentSubSectionIndex === noOfSubsections - 1
    )
      return true;
    else return false;
  };

  const goToPrevVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    const currentSubSectionIndex = courseSectionData[
      currentSectionIndex
    ].subSection.findIndex((data) => data._id === subSectionId);

    if (currentSubSectionIndex !== 0) {
      const prevSubSectionId =
        courseSectionData[currentSectionIndex].subSection[
          currentSubSectionIndex - 1
        ]._id;
      navigate(
        `/view-course/${courseId}/section/${sectionId}/${prevSubSectionId}`
      );
    } else {
      const prevSectionId = courseSectionData[currentSectionIndex - 1]._id;
      const prevSubSectionLength =
        courseSectionData[currentSectionIndex - 1].subSection.length;

      const prevSubSectionId =
        courseSectionData[currentSectionIndex - 1].subSection[
          prevSubSectionLength - 1
        ]._id;
      navigate(
        `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`
      );
    }
  };

  const handleLectureCompletion = async () => {
    setLoading(true);
    const res = await markLectureAsComplete(
      { courseId: courseId, subSectionId: subSectionId },
      token
    );
    if (res) {
      dispatch(updateCompletedLectures(subSectionId));
    }
    setLoading(false);
  };

  return (
    <>
      <div className="flex flex-col justify-center gap-5 w-[90%] text-richblack-5 ml-5 mt-5 p-2 border-[2px] border-richblack-600 rounded-md">
        {!videoData ? (
          <img
            src={previewSource}
            alt="Preview"
            className="h-full w-[80%] rounded-md object-cover"
          />
        ) : (
          <Player
            ref={playerRef}
            aspectRatio="16:9"
            playsInline
            onEnded={() => setVideoEnded(true)}
            src={videoData?.videoUrl}
          >
            <BigPlayButton position="center" />

            {/* Render when video Ends */}
            {videoEnded && (
              <div
                style={{
                  backgroundImage:
                    "linear-gradient(to top,rgb(0,0,0), rbga(0,0,0,7), rgba(0,0,0,0.5),rbga(0,0,0,0.1))",
                }}
                className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter"
              >
                {!completedLectures.includes(subSectionId) && (
                  <IconBtn
                    disabled={loading}
                    onclick={() => handleLectureCompletion()}
                    text={!loading ? "Mark As Completed" : "Loading..."}
                    customClasses="text-xl max-w-max px-4 mx-auto"
                  />
                )}

                <IconBtn
                  disabled={loading}
                  text="Rewatch"
                  customClasses="text-xl max-w-max px-4 mx-auto mt-2"
                  onclick={() => {
                    if (playerRef?.current) {
                      playerRef?.current?.seek(0);
                      setVideoEnded(false);
                    }
                  }}
                />

                <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                  {!isFirstVideo() && (
                    <button
                      disabled={loading}
                      onClick={goToPrevVideo}
                      className="blackButton"
                    >
                      Prev
                    </button>
                  )}
                  {!isLastVideo() && (
                    <button
                      disabled={loading}
                      onClick={goToNextVideo}
                      className="blackButton"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            )}
          </Player>
        )}
      </div>

      <div className="items-start flex flex-col justify-center gap-5 w-[90%] text-richblack-5 ml-5 mt-5 p-3 border-[2px] border-richblack-600 bg-richblack-600 rounded-md backdrop-blur-lg">
        <h1 className="ml-10 mt-4 text-3xl font-semibold">
          {videoData?.title}
        </h1>
        <p className=" ml-10 pt-2 pb-6">{videoData?.description}</p>
      </div>
    </>
  );
};

export default VideoDetails;
