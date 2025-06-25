import { getCourseIds, getCourseTopicIds, sendFeedBack } from "./helpers.js";

(async () => {
  const data = await sendFeedBack({ courseId: "5149", topicId: '510400'})
  console.log(data)
})()