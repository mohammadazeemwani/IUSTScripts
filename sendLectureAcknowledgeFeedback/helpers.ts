import axios from "axios"
import { formURL, userAgent, accept, timeout } from "./constants.js"
import { cookie } from "../cookie.js"
import * as cheerio from "cheerio"
import type { CourseId, CourseIdsMapping, sendPOSTProps, sendPOSTReturn, Toipcs, TopicIdsMapping } from "./types.ts"
import { writeOutputToOutputHTML } from "./util.js"
import { METHODS } from "http"


type getCourseIdsProps = {
  /** 
   * It will be calculated on demand >> default is on demand
   * Otherwise give session explicitly @example 'SPRING-2025'
   */
  session?: string | null,
}
/** This will return a mapping of courseId to courseName */
type getCourseIdsReturn = Promise<CourseIdsMapping>
export async function getCourseIds({ }: getCourseIdsProps): getCourseIdsReturn {
  // as of now session is not used in the request cz it defaults to current session and I don't see any way to change it.
  // If you do.. make a PR.

  try {
    const G_res = await axios({
      url: formURL,
      method: "GET",
      headers: {
        Cookie: cookie,
        "User-Agent": userAgent,
      },
      timeout
    })
    const G_HTML = G_res.data

    const G_$ = cheerio.load(G_HTML)
    
    const courseIdsMapping: CourseIdsMapping = {}
    G_$("#cphMain_ddlCourse")
    .find("option")
    .each((_, element) => {
      const courseId = G_$(element).val() as CourseId;
      const label = G_$(element).text();
      courseIdsMapping[courseId] = label;
    })
    
    delete courseIdsMapping['0'] // cz this corresponds to >> '0': '--Select Course--',

    return courseIdsMapping
  } catch(err) {
    console.error('❌ Error in getCourseIds helper. Error:', (err as Error).message)
    throw err;
  }
}


type getCourseTopicIdsProps = {
    /** 
   * It will be calculated on demand >> default is on demand
   * Otherwise give session explicitly @example 'SPRING-2025'
   */
  session?: string | null,
  courseId: CourseId
}
type getCourseTopicIdsReturn = Promise<TopicIdsMapping>
export async function getCourseTopicIds({ session, courseId }: getCourseTopicIdsProps): getCourseTopicIdsReturn {
  try {
    const G_res = await axios({
      url: formURL,
      method: "GET",
      headers: {
        Cookie: cookie,
        "User-Agent": userAgent
      },
      timeout
    })
    const G_HTML = G_res.data
    const G_$ = cheerio.load(G_HTML)
    const __EVENTTARGET = 'ctl00$cphMain$ddlCourse'
    const __EVENTARGUMENT = G_$('#__EVENTARGUMENT').val() as string
    const __LASTFOCUS = G_$('#__LASTFOCUS').val() as string
    const __VIEWSTATE = G_$('#__VIEWSTATE').val() as string
    const __VIEWSTATEGENERATOR = G_$('#__VIEWSTATEGENERATOR').val() as string
    const __EVENTVALIDATION = G_$('#__EVENTVALIDATION').val() as string
    const __RequestVerificationToken = G_$('#ctl01 > span:nth-child(11) > input[type=hidden]').val() as string
    
    const ctl00$cphMain$ddlSession = session ?? G_$('#cphMain_ddlSession option[selected]').val() as string // should be something like 'SPRING-2025'
    const ctl00$cphMain$ddlCourse = courseId
    
    // It may be tempted to remove these fields but IUST sends it with POST..
    // strange IUST sends these .. let me know what are your thoughts on this.
    const ctl00$cphMain$A = 'rdYes' as string
    const ctl00$cphMain$ddlRating = '0' as string
    
    // making a post req
    const formData = new URLSearchParams({
      __EVENTTARGET,
      __EVENTARGUMENT,
      __LASTFOCUS,
      __VIEWSTATE,
      __VIEWSTATEGENERATOR,
      __EVENTVALIDATION,
      __RequestVerificationToken,
      ctl00$cphMain$ddlSession,
      ctl00$cphMain$ddlCourse,
      ctl00$cphMain$A,
      ctl00$cphMain$ddlRating
    }).toString()
    
    const res = await axios({
      url: formURL,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        'Accept': accept,
        'Cookie': cookie,
        'Referer': formURL,
        'Origin': null,
        "User-Agent": userAgent,
      },
      data: formData,
      timeout
    })
    const html = res.data;
    const $ = cheerio.load(html)
    
    
    const courseTopicIds: TopicIdsMapping = {}
    $("#cphMain_ddlTopic")
    .find("option")
    .each((_, element) => {
      const topicId = G_$(element).val() as Toipcs[number]
      const label = G_$(element).text()
      courseTopicIds[topicId] = label
    })
    
    // deleting the dummy one i.e. >> '0': '--Select Topic--'
    delete courseTopicIds['0']

    return courseTopicIds
  } catch(err) {
    console.error('❌ Error in getCourseTopicIds helper. Error:', (err as Error).message)
    throw err;
  }
}


type sendFeedBackProps = {
  /** 
   * It will be calculated on demand >> default is on demand
   * Otherwise give session explicitly @example 'SPRING-2025'
   */
  session?: string | null,
  courseId: CourseId,
  topicId: Toipcs[number],
  topicDelivered?: boolean,
  rating?: number,
  comment?: string
}
/**
 * @working here we need to simulate multiple posts as Carbon.
 * 1. Session is selected by default
 * 2. Select course. In POST >> __EVENTTARGET = ctl00$cphMain$ddlCourse
 * 3. Select Topic. In POST >> __EVENTTARGET = ctl00$cphMain$ddlTopic
 * 4. Select Lec. acknoledgment. In POST>> __EVENTTARGET = ctl00$cphMain$rdYes 
 * 5. Set Duration >> 60 NO POST REQ. for this field
 * 6. Set Rating. In POST >> __EVENTTARGET = ctl00$cphMain$ddlRating
 * 7. Write comment >> NO POST REQ. for this field
 * 8. For submission, do Final POST
 * 
 * IMP. Each POST draws on from previous View state and other ASP.NET style validations.
 */
export async function sendFeedBack({ 
    session=null, 
    courseId, 
    topicId, 
    topicDelivered=true, 
    rating=5,
    comment='Excellent Lecture delivered.'
}: sendFeedBackProps) {
  if (rating<1 && rating >5) throw new Error('Rating can only be 1 - 5')

  try {
    const G_res = await axios({
      url: formURL,
      method: "GET",
      headers: {
        Cookie: cookie,
        "User-Agent": userAgent,
      },
      timeout
    })
    const G_HTML = G_res.data
    const G_$ = cheerio.load(G_HTML)

    // 2. Making POST to set course

    const __EVENTARGUMENT = G_$('#__EVENTARGUMENT').val() as string
    const __LASTFOCUS = G_$('#__LASTFOCUS').val() as string
    const __VIEWSTATE = G_$('#__VIEWSTATE').val() as string
    const __VIEWSTATEGENERATOR = G_$('#__VIEWSTATEGENERATOR').val() as string
    const __EVENTVALIDATION= G_$('#__EVENTVALIDATION').val() as string
    const __RequestVerificationToken = G_$('#ctl01 > span:nth-child(11) > input[type=hidden]').val() as string
    const ctl00$cphMain$ddlSession = session ?? G_$('#cphMain_ddlSession option[selected]').val() as string // should be something like 'SPRING-2025'

    const data_setCoursePOST = await sendPOST({ 
      __EVENTTARGET: 'ctl00$cphMain$ddlCourse',
      __EVENTARGUMENT,
      __LASTFOCUS,
      __VIEWSTATE,
      __VIEWSTATEGENERATOR,
      __EVENTVALIDATION,
      __RequestVerificationToken,
      ctl00$cphMain$ddlSession,
      ctl00$cphMain$ddlCourse: courseId,
      ctl00$cphMain$A: 'rdYes',
      ctl00$cphMain$ddlRating: '0'
    });


    // 3. 
    const data_setTopicPOST = await sendPOST({
      __EVENTTARGET: 'ctl00$cphMain$ddlTopic',
      __EVENTARGUMENT: data_setCoursePOST.__EVENTARGUMENT,
      __LASTFOCUS: data_setCoursePOST.__LASTFOCUS,
      __VIEWSTATE: data_setCoursePOST.__VIEWSTATE,
      __VIEWSTATEGENERATOR: data_setCoursePOST.__VIEWSTATEGENERATOR,
      __EVENTVALIDATION: data_setCoursePOST.__EVENTVALIDATION,
      __RequestVerificationToken: data_setCoursePOST.__RequestVerificationToken,
      ctl00$cphMain$ddlSession, // will be the latest fetched from the first GET
      ctl00$cphMain$ddlCourse: courseId,
      ctl00$cphMain$ddlTopic: topicId,
      ctl00$cphMain$A: 'rdYes',
      ctl00$cphMain$ddlRating: '0',
    })

    // 4. lets skip this. 
    // 5. no post needed
    // 6.
    const data_setRatingPOST = await sendPOST({
      __EVENTTARGET: 'ctl00$cphMain$ddlRating',
      __EVENTARGUMENT: data_setTopicPOST.__EVENTARGUMENT,
      __LASTFOCUS: data_setTopicPOST.__LASTFOCUS,
      __VIEWSTATE: data_setTopicPOST.__VIEWSTATE,
      __VIEWSTATEGENERATOR: data_setTopicPOST.__VIEWSTATEGENERATOR,
      __EVENTVALIDATION: data_setTopicPOST.__EVENTVALIDATION,
      __RequestVerificationToken: data_setTopicPOST.__RequestVerificationToken,
      ctl00$cphMain$ddlSession, // will be the latest fetched from the first GET
      ctl00$cphMain$ddlCourse: courseId,
      ctl00$cphMain$ddlTopic: topicId,
      ctl00$cphMain$A: 'rdYes',
      ctl00$cphMain$txtDuration: '60',
      ctl00$cphMain$ddlRating: '5',
    })

    // 7. no post needed
    // 8 
    const data_sendSubmitPOST = await sendPOST({
      __EVENTTARGET: '',
      __EVENTARGUMENT: data_setRatingPOST.__EVENTARGUMENT,
      __LASTFOCUS: data_setRatingPOST.__LASTFOCUS,
      __VIEWSTATE: data_setRatingPOST.__VIEWSTATE,
      __VIEWSTATEGENERATOR: data_setRatingPOST.__VIEWSTATEGENERATOR,
      __EVENTVALIDATION: data_setRatingPOST.__EVENTVALIDATION,
      __RequestVerificationToken: data_setRatingPOST.__RequestVerificationToken,
      ctl00$cphMain$ddlSession, // will be the latest fetched from the first GET
      ctl00$cphMain$ddlCourse: courseId,
      ctl00$cphMain$ddlTopic: topicId,
      ctl00$cphMain$A: 'rdYes',
      ctl00$cphMain$txtDuration: '60',
      ctl00$cphMain$ddlRating: '5',
      ctl00$cphMain$txtComments: 'Excellent Lecture delivered!',
      ctl00$cphMain$btnSubmit: 'Submit'
    })

    const Final_$ = cheerio.load(data_sendSubmitPOST.rawHTML);
    /**
     * Success will be determined on: havnig 'Response saved successfully
' back in html from the sendSubmitPOST
     */
    const success = Final_$('#cphMain_lblMsg').text() === 'Response saved successfully';

    return { success }
  
  } catch(err) {
    console.error('\n❌ Error in sendFeedBack helper. Error:', (err as Error).message)
    // don't trow here, cz it is common to miss it.
  }
}




async function sendPOST(data: sendPOSTProps): Promise<sendPOSTReturn> {
  const fieldsData = data;

  const formData = new URLSearchParams(fieldsData)

  const res = await axios({
    url: formURL,
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      'Accept': accept,
      'Cookie': cookie,
      'Referer': formURL,
      'Origin': null,
      "User-Agent": userAgent,
    },
    data: formData,
    timeout
  })

  const html = res.data;
  const $ = cheerio.load(html);

  const newFormData: sendPOSTReturn = {
    __EVENTARGUMENT: $('#__EVENTARGUMENT').val() as string,
    __LASTFOCUS: $('#__LASTFOCUS').val() as string,
    __VIEWSTATE: $('#__VIEWSTATE').val() as string,
    __VIEWSTATEGENERATOR: $('#__VIEWSTATEGENERATOR').val() as string,
    __EVENTVALIDATION: $('#__EVENTVALIDATION').val() as string,
    __RequestVerificationToken: $('#ctl01 > span:nth-child(11) > input[type=hidden]').val() as string,
    rawHTML: html
  }

  return newFormData
}