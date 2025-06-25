import axios from "axios"
import { formURL, userAgent, accept, timeout } from "./constants.js"
import { cookie } from "../cookie.js"
import * as cheerio from "cheerio"
import type { CourseId, CourseIdsMapping, Toipcs, TopicIdsMapping } from "./types.ts"
import { writeOutputToOutputHTML } from "./util.js"


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
    const __EVENTTARGET = 'ctl00$cphMain$ddlCourse' as string
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
    const __EVENTTARGET = 'ctl00$cphMain$ddlCourse' as string
    const __EVENTARGUMENT = G_$('#__EVENTARGUMENT').val() as string
    const __LASTFOCUS = G_$('#__LASTFOCUS').val() as string
    const __VIEWSTATE = G_$('#__VIEWSTATE').val() as string
    const __VIEWSTATEGENERATOR = G_$('#__VIEWSTATEGENERATOR').val() as string
    const __EVENTVALIDATION = G_$('#__EVENTVALIDATION').val() as string
    const __RequestVerificationToken = G_$('#ctl01 > span:nth-child(11) > input[type=hidden]').val() as string
    
    const ctl00$cphMain$ddlSession = session ?? G_$('#cphMain_ddlSession option[selected]').val() as string // should be something like 'SPRING-2025'
    const ctl00$cphMain$ddlCourse = courseId; 
    const ctl00$cphMain$ddlTopic = topicId;
    const ctl00$cphMain$A = topicDelivered ? 'rdYes': 'RdNo';
    const ctl00$cphMain$ddlRating = String(rating);
    const ctl00$cphMain$txtComments = comment;
    
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
      ctl00$cphMain$ddlTopic,
      ctl00$cphMain$A,
      ctl00$cphMain$ddlRating,
      ctl00$cphMain$txtComments
    }).toString()
    
    
    try {
      
      await axios({
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
    } catch(err) {
      const error = err as Error;
      console.error('\n❌ Error in sendFeedBack helper; for CourseId:', courseId, 'TopicId', topicId, 'Error:', error.message)
    }
    
    // if no error >  correctness of operation
    return { success: true }
  
  } catch(err) {
    console.error('❌ Error in sendFeedBack helper. Error:', (err as Error).message)
    throw err;
  }
}
