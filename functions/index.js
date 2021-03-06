const functions = require('firebase-functions');
const cors = require('cors')({ origin : true})
const fs = require('fs')
const UUID = require('uuid-v4')

const { Storage } = require("@google-cloud/storage")

const gcconfig = {
  projectId : 'my-place-app-a030b',
  keyFilename : 'my-place-app.json'
}

const gcs = new Storage(gcconfig)

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.storeImage = functions.https.onRequest((request, response) => {
  return cors(request , response, () => {
    const body = JSON.stringify(request.body)
    fs.writeFileSync("/tmp/uploaded-image.jpg", body.image, "base64" , err => {
      console.log(err)
      return response.status(500).json({ error : err})
    })
    const bucket = gcs.bucket('my-place-app-a030b.appspot.com')
    const uuid = UUID()

    return bucket.upload(
      "/tmp/uploaded-image.jpg",
      {
        uploadType : 'media',
        destination : '/place/' + uuid + '.jpg',
        metadata : {
          metadata : {
            contentType : 'image/jpeg',
            firebaseStorageDownloadTokens : uuid
          }
        }
      },
      (err , file) => {
        if(!err) {
          response.status(201).json({
            imageUrl : 
              "https://firebasestorage.googleapis.com/v0/b/" +
              bucket.name +
              "/o/" + 
              encodeURIComponent(file.name) +
              "?alt=media&token=" +
              uuid
          })
        } else {
          console.log(err)
          response.status(500).json({ error : err})
        }
      }
    )
  })
});
