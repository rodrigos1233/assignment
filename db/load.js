import * as fs from 'fs'
import nano    from 'nano'

const maxArtists = process.argv.find(elem => elem.indexOf('--max-artists=') > -1)?.split('=')[1] || -1

const dbHost = 'http://localhost:5984'
const artistDb = 'artists'
const artworksDb = 'artworks'
const loadedArtists = []

/**
 * Artist data configuration
 * @type {{docIdKey : string, path : string, filterFn : ((function(*, *) : (boolean))|*), chunkSize : number, name : string}}
 */
const artists = {
	name: artistDb,
	path: './Artists.json',
	docIdKey: 'ConstituentID',
	chunkSize: 5_000,
	/* load artists up to amount passed on cli (--max-artists) */
	filterFn: (element, index) => {
		if (maxArtists < 0 || index <= maxArtists) {
			loadedArtists.push(element.ConstituentID)
			return true
		}
		return false
	}
}

/**
 * Artwork data configuration
 * @type {{docIdKey : string, path : string, filterFn : (function(*) : boolean), chunkSize : number, name : string}}
 */
const artworks = {
	name: artworksDb,
	path: './Artworks.json',
	docIdKey: 'ObjectID',
	chunkSize: 5_000,
	/* only load artworks for artists that have been loaded */
	filterFn: (element) => loadedArtists.includes(element.ConstituentID[0])
}

/*
 * Load Data
 */
const couch = nano(dbHost)
const start = Date.now()
couch.db
	.destroy(artistDb)
	.then(() => {
		couch.db
			.destroy(artworksDb)
			.then(() => {
				return couch.db
					.create(artistDb)
					.then(() => couch.db.create(artworksDb))
			})
			.then(() => console.log('artistsName and artworksName created'))
			.then(() => bulkLoad(artists))
			.then(() => bulkLoad(artworks))
			.catch(e => console.log('error:' + e))
			.finally(() => console.log(`time: ${Date.now() - start}`))
	})

/**
 * Bulk load json array file in chunks
 * @param name {String} database name
 * @param file {String} path to file
 * @param docIdKey {String} property to use as `_doc` identifier
 * @param chunkSize {Number} split file content into bulk loading chunks of this size
 * @param filterFn {Function} filtering function to exclude content. No filtering if undefined
 * @returns {Promise<unknown>} Promise that completes when all data (after filtering) has been loaded
 */
function bulkLoad({ name, path: file, docIdKey, chunkSize, filterFn }) {
	return new Promise((resolve, reject) => {
			fs.readFile(file, 'utf-8', async function (err, fileContents) {
				if (err) throw reject(err)
				let list = JSON.parse(fileContents).filter(filterFn)
				list.forEach(artist => artist._id = `${artist[docIdKey]}`)

				let total = list.length

				let chunks = chunkArray(list, chunkSize)

				let db = couch.db.use(name)

				let subtotal = 0

				const all = []

				for (let index = 0; index < chunks.length; index++) {
					let chunk = chunks[index]
					subtotal = subtotal + chunk.length
					if (chunk.length > 0) {

						let message =
							`${name.padEnd(8)} [ chunk: ${`${(index + 1)}/${chunks.length}`.padStart(5)} | ${`${subtotal}/${total}`.padStart(13)}]`

						all.push(db
							.bulk({ docs: chunk })
							.then(() => console.log(message)))
					}
				}

				Promise
					.all(all)
					.then(() => {resolve()})
					.catch(reasons => {
						console.log(reasons)
						reject()
					})
			})
		}
	)
}

/**
 * Returns an array with arrays of the given size.
 *
 * @param myArray {Array} array to split
 * @param chunk_size {Number} Size of every group
 */
function chunkArray(myArray, chunk_size) {
	let index
	const arrayLength = myArray.length
	const tempArray = []

	for (index = 0; index < arrayLength; index += chunk_size) {
		const myChunk = myArray.slice(index, index + chunk_size)
		// Do something if you want with the group
		tempArray.push(myChunk)
	}

	return tempArray
}
