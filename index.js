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
  createIssueBody,
  createFormatTime
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
    log(chalk.red(`not found today's template ...`))
    return
  }

  // user info
  const { login: user } = await pullUserInfo()
  if (!user) {
    log(chalk.red('user authorization error ...'))
    return
  }
  log(chalk.green(`load user success! username: ${user}`))

  // pull today issue
  const issue = await getTodayIssue(today)
  if (!issue) {
    log(chalk.redBright(`not found today's issue ...`))
    log(chalk.yellowBright(`creating today's issue...`))

    // if not found today issue, auto create issue
    const result = await createIssue(createIssueTitle(), createIssueBody())
    if (result.id && result.title) {
      log(chalk.greenBright(`create issue success! title: ${result.title}, body: ${result.body}`))
    } else {
      log(chalk.redBright(`create issue error! error message: ${JSON.stringify(result)}`))
    }
    return
  }
  log(
    chalk.greenBright(
      `load today issue success! issue's title: ${issue.title}, create at: ${createFormatTime(
        issue.created_at
      )}`
    )
  )

  // check had commented
  const comment = await hasCommented(issue, user)
  if (comment) {
    await updateComment(comment, content)
    log(chalk.greenBright(`comment update success! update body: \n\n ${content}`))
  } else {
    await createComment(issue, content)
    log(chalk.greenBright(`comment create success! create body: \n\n ${content}`))
  }
})()
