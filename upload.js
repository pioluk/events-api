const AWS = require('aws-sdk')

const s3 = new AWS.S3({
  signatureVersion: 'v4',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const BUCKET_NAME = 'pioluk-event-images-original'

module.exports = (key, file) =>
  new Promise((resolve, reject) => {
    s3.createBucket({ Bucket: BUCKET_NAME }, () => {
      const params = { Bucket: BUCKET_NAME, Key: key, Body: file.buffer }

      s3.putObject(params, (err, data) => {
        if (err) {
          console.error(err)
          reject(err)
        } else {
          resolve(Object.assign({}, data, { key }))
        }
      })
    })
  })
