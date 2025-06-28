import { delayForTooManyReq } from "./constants";
import { getCourseIds, getCourseTopicIds, sendFeedBack } from "./helpers";
import { getRandomDelay } from "./util";

type sendLectureAcknowledgementFeedbackProps = {
  /**
   * Enter delay range of submission so that we don't get detected as robots. xD
   * @example [1000, 3000]
   */
  delaySubmissionBy?: (number)[],
}

export async function sendLectureAcknowledgementFeedback({ 
  delaySubmissionBy=[400, 900]
}: sendLectureAcknowledgementFeedbackProps) {
  const courseIdsMapping = await getCourseIds({});
  console.log('⚡ Following courses were found:')
  Object.entries(courseIdsMapping).forEach(([courseId, courseName]) => {
    console.log(`${courseName}`)
  })
  let someTopicError = false;

  for (const [courseId, courseName] of Object.entries(courseIdsMapping)) {
    const courseTopicsIdsMapping = await getCourseTopicIds({ courseId });
    console.log('\n🚀 Course:', courseName, 'has', Object.keys(courseTopicsIdsMapping).length, 'Topics')
    
      for (const [topicId, topicName] of Object.entries(courseTopicsIdsMapping)) {
        const data = await sendFeedBack({ courseId, topicId })
        if (data?.success) {
          console.log('\n✅ Feedback submitted for Course', courseName, 'Topic', topicName)
        } else {
          console.log('\n⚠️ Something went wrong for Course', courseName, 'Topic', topicName)
          console.log('⚡ Trying again...')
          console.log(`🤞 But first waiting for: ${delayForTooManyReq}ms to restore our reputation with IUST servers xP.`)
          await new Promise(resolve => setTimeout(resolve, delayForTooManyReq));
          const data = await sendFeedBack({ courseId, topicId })
          if (data?.success) {
            console.log('✅ Submission done. Nothing leaves us..')
          } else {
            someTopicError = true;
            console.log('🤔 Somethings fishy, After all is done, try running again.')
          }
        }
        const delay = getRandomDelay({ range: delaySubmissionBy })
        console.log(`🤞 Delaying for: ${delay}ms`)
        await new Promise(resolve => setTimeout(resolve, delay));
      }
  }

  someTopicError && console.log(
    `If something went wrong 🤔, don\'t hesitate. Just rerun this program after you are done. 
    This follows from the fact the missed Lectures will still be present and will be tackled next time 🚀.`
  )
}