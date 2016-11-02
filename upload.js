const AWS = require('aws-sdk')
const uuid = require('uuid')

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const BUCKET_NAME = 'pioluk-final-project-images-original'

module.exports = file =>
  new Promise((resolve, reject) => {
    s3.createBucket({ Bucket: BUCKET_NAME }, () => {
      const key = uuid.v4() + '.jpg'
      const params = { Bucket: BUCKET_NAME, Key: key, Body: file.buffer }

      s3.putObject(params, (err, data) => {
        console.log(data)

        if (err) {
          console.error(err)
          reject(err)
        } else {
          resolve(Object.assign({}, data, { key }))
        }
      })
    })
  })
