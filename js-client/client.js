import nano from 'nano'

const host = 'http://localhost:5984'
const db = 'artists'

const couch = nano(host)
const artists = couch.db.use(db)

artists.get('4609').then(doc => {
  console.log('\nLookup artist with ID 4609:')
  console.log(doc.DisplayName)
})

artists.find({
  selector: {
    DisplayName: {
      $regex: '.*Pablo.*'
    }
  }
}).then(response => {
  console.log('\nAll artists named Pablo:')
  response.docs.forEach(doc => console.log(doc.DisplayName))
})
