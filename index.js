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
    return
  }
  // user info
  const { login: user } = await pullUserInfo()
  if (!user) {
    return
  }

  // pull all issues
  const issue = await getTodayIssue(today)
  if (!issue) {
    return
  }
  // check had commented
  const comment = await hasCommented(issue, user)
  if (comment) {
    await updateComment(comment, content)
  } else {
    await createComment(issue, content)
  }
})()
