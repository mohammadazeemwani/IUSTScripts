export type CourseId = string;
export type CourseIdsMapping = Record<string, string>

export type Toipcs = string[]
export type TopicIdsMapping = Record<string, string>


/** 
 * All fields are optional. 
 * Which means if you don't send them they won't make to the POST req.
 * If you want a filed but empty, set it to: ''
 */
export type sendPOSTProps = {
  __EVENTTARGET?: string,
  __EVENTARGUMENT?: string,
  __LASTFOCUS?: string,
  __VIEWSTATE?: string,
  __VIEWSTATEGENERATOR?: string,
  __EVENTVALIDATION?: string,
  __RequestVerificationToken?: string,

  ctl00$cphMain$ddlSession?: string,
  ctl00$cphMain$ddlCourse?: string,
  ctl00$cphMain$ddlTopic?: string,
  ctl00$cphMain$A?: string,
  ctl00$cphMain$txtDuration?: string,
  ctl00$cphMain$ddlRating?: string,
  ctl00$cphMain$txtComments?: string,
  ctl00$cphMain$btnSubmit?: string,
}

export type sendPOSTReturn = {
  __EVENTARGUMENT: string,
  __LASTFOCUS: string,
  __VIEWSTATE: string,
  __VIEWSTATEGENERATOR: string,
  __EVENTVALIDATION: string,
  __RequestVerificationToken: string,
  rawHTML: any
}