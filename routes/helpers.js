const isNonEmptyString = str => str !== ''
exports.isNonEmptyString = isNonEmptyString

const prop = (p, obj) => obj[p]
exports.prop = prop

const parseArray = str => str.split(',').filter(isNonEmptyString)
exports.parseArray = parseArray

const retrieveArrayFromFormData = p => data => {
  try {
    const emails = prop(p, data)
    return parseArray(emails)
  } catch (err) {
    return []
  }
}
exports.retrieveArrayFromFormData = retrieveArrayFromFormData

const retrieveEmails = retrieveArrayFromFormData('emails')
exports.retrieveEmails = retrieveEmails

const retrievePhones = retrieveArrayFromFormData('phones')
exports.retrievePhones = retrievePhones

const retrieveWebsites = retrieveArrayFromFormData('websites')
exports.retrieveWebsites = retrieveWebsites
