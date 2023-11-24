type StringMap = { [key: string]: string };
type StringKeyMap = { [key: string]: any };

export function getPrompt(email: StringMap, kwargs: StringMap): string {
  let prompt = `You will be given an email. Please try to summarize the email. 
  Make sure you includes the important dates because the user wants to add 
  information to his calendar if the email is an activity invitation or 
  contains a registration ddl.

  Here is more information on the your return format. Most importantly, give
  your response in JSON format. For each email, there are three different
  types of events, e.g. notification, activity, and registration. Below is 
  about how each type of events should be represented in JSON.

  A notification is a piece of information that should not appear on user's 
  calender, because it contains no dates (such as system generated no-reply
  message). You should parse a notification into the following format:

  {
      "event_type": "notification",
      "summary": "what is the notification about?"
  }

  An activity is an invitation to an activity, which CONTAINS the start time
  and the end time of the activity. You should be precise on the time, since
  the activity's time will be displayed to user's calendar. Here is what you
  should return if there is an activity:

  {
      "event_type": "activity",
      "start_time": "2023-01-01T07:00:00 Asia/Shanghai",
      "end_time": "2023-01-01T09:00:00 Asia/Shanghai",  // if you cannot find the end time in the email, use "unspecified"
      "summary": "what is the activity about?",
      // include the url link if the activity will take place online
      "venue": "where will the activity take place?"  
  }

  A registration event is a registration to an activity. You should be able to 
  see a registration deadline for the activity. Make sure your mark that time down.
  You should parse a registration into the following format:

  {
      "event_type": "registration",
      "end_time": "2023-01-01T00:00:00 US/Pacific",  // if you are unsure, use "unspecified"
      "summary": "what is the registration about?",
      "venue": "Is there a registration link? If there is one, include it. If not, just leave it empty."
  }

  Note that an email may contains multiple events. For example, an invitation to 
  some activity may contains an activity event and a registration event at the 
  same time. Therefore, to make the return format uniform, please always return a list of events. 
  Use the following format:

  {
      "events": [
          {...}, // event 1
          {...}, // event 2
          ...,
          {...} // event n
      ]
  }

  For all the start and end time, please do remember to include the timezone. 
  Use the available timezones in pytz library since the datetime will be parsed with pytz.
  If the timezone is not presented in the email, you should consider user's timezone. 
  The user's timezone is ${kwargs.timezone || "Asia/Shanghai"}.
  If the start or end time is not specified in the email, please use "unspecified" for that field.

  Here is the user's email:
  
  
  Title: ${email.subject}
  Received date: ${email.date}
  Email content:
  ${email.content} 
  `;
  return prompt;
}
