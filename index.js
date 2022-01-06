const chalk = require('chalk')
const {
  pullUserInfo,
  createIssue,
  getTodayIssue,
  hasCommented,
  createComment,
  updateComment
} = require('./github')

const {
  createToday,
  isContainTitle,
  createTemplateContent,
  createIssueTitle,
  createIssueBody
} = require('./utils')

// today date
const today = createToday()

// template content
const content = createTemplateContent('./template.md')

const log = console.log

;(async () => {
  // check today template
  const isTodayTemplate = await isContainTitle('./template.md', today)
  if (!isTodayTemplate) {
    log(chalk.red('not found today template ...'))
    return
  }

  // user info
  const { login: user } = await pullUserInfo()
  if (!user) {
    log(chalk.red('user authorization error ...'))
    return
  }

  // pull today issue
  const issue = await getTodayIssue(today)
  if (!issue) {
    log(chalk.red('not found today issue ...'))
    log(chalk.cyan('creating issue...'))

    // if not found today issue, auto create issue
    const result = await createIssue(createIssueTitle(), createIssueBody())
    if (result.id && result.title) {
      log(chalk.green(`create issue success, title: ${result.title}, body: ${result.body}`))
    } else {
      log(chalk.red(`create issue error, error message: ${JSON.stringify(result)}`))
    }
    return
  }

  // check had commented
  const comment = await hasCommented(issue, user)
  if (comment) {
    await updateComment(comment, content)
    log(chalk.green(`comment update success, body: \n\n ${content}`))
  } else {
    await createComment(issue, content)
    log(chalk.green(`comment create success, body: \n\n ${content}`))
  }
})()
