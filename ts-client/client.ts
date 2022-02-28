import nano from 'nano'

const host = 'http://localhost:5984'
const db = 'artists'

const couch = nano(host)
const artists = couch.db.use<Artist>(db)

type Artist = {
	ConstituentID: Number,
	DisplayName: String,
	ArtistBio: String,
	Nationality: String,
	Gender: String,
	BeginDat: Number,
	EndDate: Number,
	Wiki_QID: String,
	ULAN: String
}

artists
	.get('4609')
	.then((artist: nano.DocumentGetResponse & Artist) => {
		console.log('\nLookup artist with ID 4609:')
		console.log(artist.DisplayName)
	})

artists
	.find({
					selector: {
						DisplayName: {
							$regex: '.*Pablo.*',
						},
					},
				})
	.then((artists: nano.MangoResponse<Artist>) => {
		console.log('\nAll artists named Pablo:')
		artists.docs.forEach((doc: Artist & { _id: string; _rev: string }) => console.log(doc.DisplayName))
	})
