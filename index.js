const {
  pullUserInfo,
  getTodayIssue,
  hasCommented,
  createComment,
  updateComment
} = require('./github')

const { createToday, isContainTitle, createTemplateContent } = require('./utils')

// today date
const today = createToday()

// template content
const content = createTemplateContent('./template.md')

;(async () => {
  const isTodayTemplate = await isContainTitle('./template.md', today)
  if (!isTodayTemplate) {
    console.log('not found today template')
    return
  }
  // user info
  const { login: user } = await pullUserInfo()
  if (!user) {
    console.log('user authorization error')
    return
  }

  // pull today issue
  const issue = await getTodayIssue(today)
  if (!issue) {
    console.log('not found today issue')
    return
  }
  // check had commented
  const comment = await hasCommented(issue, user)
  if (comment) {
    await updateComment(comment, content)
    console.log(`comment update success, body: \n\n ${content}`)
  } else {
    await createComment(issue, content)
    console.log(`comment create success, body: \n\n ${content}`)
  }
})()
