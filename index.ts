import { sendLectureAcknowledgementFeedback } from "./sendLectureAcknowledgeFeedback";

(async () => {
  console.time('Time Taken');

  await sendLectureAcknowledgementFeedback({});

  console.timeEnd('Time Taken')
})()