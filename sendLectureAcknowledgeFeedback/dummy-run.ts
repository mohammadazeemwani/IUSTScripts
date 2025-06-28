import { getCourseIds, getCourseTopicIds, sendFeedBack } from "./helpers.js";

(async () => {
  const data = await sendFeedBack({ courseId: "5148", topicId: '511180'})
  console.log(data)
})()