const { Octokit } = require('@octokit/core')
const fs = require('fs')
const { handleResponse, exist } = require('./utils')

// check isLocal
const isLocal = process.env.MODE === 'local'

const token = isLocal
  ? fs.readFileSync('./token.txt', { encoding: 'utf8' })
  : process.env['G_TOKEN']

// octokit instance
const octokit = new Octokit({ auth: token })

// repo
const repo = {
  owner: 'cuixiaorui',
  repo: 'study-every-day'
}

// user info
async function pullUserInfo() {
  let [err, result] = await handleResponse(octokit.request('GET /user'))
  if (err) {
    return err
  }
  return result.data
}

// pull all issues
async function pullAllIssues() {
  return await handleResponse(
    octokit.request('GET /repos/{owner}/{repo}/issues', {
      ...repo
    })
  )
}

// check has issue ? by formatDate
async function getTodayIssue(formatDate) {
  const [err, result] = await pullAllIssues()
  if (err) {
    return null
  }
  const issues = result.data
  const existTitle = exist(
    issues.map(issue => issue.title),
    title => title.includes(formatDate)
  )
  return existTitle ? issues.find(issue => issue.title === existTitle) : null
}

// pull all comments for a issue
async function pullAllComments(issue) {
  return await handleResponse(
    octokit.request('GET /repos/{owner}/{repo}/issues/{issue_number}/comments', {
      ...repo,
      issue_number: issue.number
    })
  )
}

// check designated user, has comment for one of issue
async function hasCommented(issue, user) {
  const [err, comments] = await pullAllComments(issue)
  if (err) {
    return false
  }
  return exist(comments.data, comment => comment.user.login === user)
}

// create comment
async function createComment(issue, body) {
  const [err, res] = await handleResponse(
    octokit.request('POST /repos/{owner}/{repo}/issues/{issue_number}/comments', {
      ...repo,
      issue_number: issue.number,
      body
    })
  )
  return err ? false : true
}

// update comment
async function updateComment(comment, body) {
  const [err, res] = await handleResponse(
    octokit.request('PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}', {
      ...repo,
      comment_id: comment.id,
      body
    })
  )
  return err ? false : true
}

module.exports = {
  pullUserInfo,
  getTodayIssue,
  pullAllComments,
  hasCommented,
  createComment,
  updateComment
}
