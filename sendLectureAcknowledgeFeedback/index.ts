import { getCourseIds, getCourseTopicIds, sendFeedBack } from "./helpers";
import { sleepBetweenTwoFeedbacks } from "./constants";

type sendLectureAcknowledgementFeedbackProps = {}

export async function sendLectureAcknowledgementFeedback({}: sendLectureAcknowledgementFeedbackProps) {
  const courseIdsMapping = await getCourseIds({});
  console.log('⚡ Following courses were found:')
  Object.entries(courseIdsMapping).forEach(([courseId, courseName]) => {
    console.log(`${courseName}`)
  })

  for (const [courseId, courseName] of Object.entries(courseIdsMapping)) {
    const courseTopicsIdsMapping = await getCourseTopicIds({ courseId });
    console.log('\n🚀 Course:', courseName, 'has', Object.keys(courseTopicsIdsMapping).length, 'Topics')
    
      for (const [topicId, topicName] of Object.entries(courseTopicsIdsMapping)) {
        const { success } = await sendFeedBack({ courseId, topicId })
        if (success) {
          console.log('\n✅ Feedback submitted for Course', courseName, 'Topic', topicName)
        }
        await new Promise(resolve => setTimeout(resolve, sleepBetweenTwoFeedbacks));
      }
  }
}