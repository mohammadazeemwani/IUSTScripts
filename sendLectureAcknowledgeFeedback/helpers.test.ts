import { test, describe } from 'node:test';
import assert from 'node:assert';
import { getCourseIds, getCourseTopicIds, sendFeedBack } from './helpers.js';


describe('IUST sendFeedback tests', async () => {
  /** for doing just one send Feedback check */
  let oneCourseVsTopic: { courseId: string, courseName?: string, topicId: string, topicName?: string } | null = null

  test('Get courseIdsMapping object correctly', async () => {
    const courseIdsMapping = await getCourseIds({});
    
    assert.equal(
      Object.keys(courseIdsMapping).length < 1,
      false
    )
    

    for (const [courseId, courseName] of Object.entries(courseIdsMapping)) {
      assert.equal(typeof courseId, 'string')
      assert.equal(typeof courseName, 'string')

      
      await test(`Get courseTopicIds object correctly for course: ${courseName}`, async () => {
        const courseTopicIdsMapping = await getCourseTopicIds({ courseId });
        
        
        assert.equal(
          Object.keys(courseTopicIdsMapping).length < 1,
          false
        )
        
        Object.entries(courseTopicIdsMapping).forEach(([topicId, topicName]) => {
          assert.equal(typeof topicId, 'string')
          assert.equal(typeof topicName, 'string')

          /** 
           * Just running this once
           * !!null = false
           * !!{} = true
           */
          if (!oneCourseVsTopic) (oneCourseVsTopic = { courseId, courseName, topicId, topicName })
        })
      })
    }
  })

  test('Testing weather sendFeedback will work or not just for one topic of a course', async () => {

    if (oneCourseVsTopic) {
      const { courseId, courseName, topicId, topicName } = oneCourseVsTopic;
      await assert.doesNotReject(
        sendFeedBack({ courseId, courseName, topicId, topicName})
      )
    } else {
      assert(false, 'Test failed cz data required to sendFeed back was not useful: oneCourseVsTopic was null')
    }
  })
})