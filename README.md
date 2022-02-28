Recruitment Coding Assignment
=============================

This is coding assignment used in the recruitment process at ARTBANX. It involves processing artist and artwork datasets.

General Instructions
--------------------

* You have roughly 72 hours (3 days) to complete this challenge. We give you this amount of time so that you can fit it in with the rest of
  your life. We think that it's possible to build a good solution in about two evenings. This estimate assumes you will not re-implement
  what we have provided.
* Write your solution in a language that best shows your skills for the role you have applied for, preferably in JavaScript, Typescript, Java, or Kotlin. If you are more comfortable in some other language, check with
  us first.
* Deliver a GitHub fork and PR of our repository that contains a runnable solution including only source code, test code, build scripts and
  instructions. Please no IDE or build artefacts.
* Solutions can be server-side, client-side, or a combination of both.
* Only use dependencies if you can defend what value they bring to the problem at hand.
* Tell us about any problems you had or assumptions you had to make to get the job done.
* A working solution is better than a pretty solution

### What is Provided

* Copies of the `Artist.json` and `Artwork.json` files from [MoMa Collection](https://github.com/MuseumofModernArt/collection)
* Some code that you may but don't have to use:
	* life-cycle scripts (in `./db/package.json`) to start/stop/load the database
	* A `./db/load.js` to load the data into the provided database
	* A Java starter client (in `./java-client`) that connects to the provided database.
	* A Kotlin starter client (in `./kotlin-client`) that connects to the provided database.
	* A JavaScript starter client (in `./js-client`) that connects to the provided database.
	* A TypeScript starter client (in `./ts-client`) that connects to the provided database.

#### To use the provided database, and JS/TS clients

* node >17
* access to the internet

#### To use the provided kotlin & java clients

* Java 17
* gradle 7
* Kotlin 1.4
* access to the internet

Choose One of Three Tasks
-------------------------
Below are three assignments. Implement **ONLY ONE** of them that best represents your skills and the role you have applied for. They can all be implemented as a pure backend or a pure frontend solution.

You are not required to use the PouchDB database we provide if you are more comfortable with another approach/technology. But be careful
about spending too much time just re-implementing something we are providing.

### 1. The Search

Create a simple application (_web_ OR _command-line_ based) that will run a search through one or both of the data sets. It does not need to
provide full search functionality. You probably will not have time. Pick a few important search aspects and provide good support and
user-feedback when using it.

### 2. The Visualization

Create two data visualizations (Chart, graph, etc.) based on the provided data sets. Ideally these two visualizations should be
complimentary and tell a story. If you extract supporting data into static files rather than fetch the data during execution, provide the
script and/or method used to create that supporting data.

Take a look here if you need inspiration: https://fivethirtyeight.com/features/a-nerds-guide-to-the-2229-paintings-at-moma/

### 3. The Data Grid

Access data from one or both files to produce a table with sorting, filtering, and paging. This table should provide a good user experience
and be responsive. If you have time, combine the two data sets into a master/detail view that allows navigating between the list of artists
and the list of their artworks.


How We Evaluate
---------------

Remember that even if you could solve most of the problems above with third party libraries and a few lines of code we are asking you to
demonstrate your programming skills. This does not mean that you should build everything from scratch and write 1000s of lines of code. Here
are some pointers on what we will pay attention to.

* We want to see how you approach software programming... not just assembling libraries and frameworks
* We want to see how you solve problems.
* Performance: Considering the amount of time allotted we will not be critical of performance issues. That said there should not be any
  rudimentary issues either. If your solution works best with a sub-set of the data than make sure to provide scripts and instructions to
  set things up correctly.
* Some important things we will look at:
	* Are we able to build and run the solution easily and quickly?
	* Are there any bugs?
	* How appropriate and complete is the solution compared to the task you chose.
	* User experience (Where/When it applies)
	* Code organisation, style, attention to readability, etc.
	* Demonstrate that you understand the technologies you used.
	* Idiomatic approach to the chosen language, libraries, frameworks, etc.
	* Any supporting documentation, tests, and scripts
* If you decide to not use the db or any of stubbed out clients be careful about where your efforts go.
* We will likely use this coding assignment as a discussion piece in later parts of the interview process.

Accessing the Data
------------------

The database we have set you up with is an instance of [PouchDB](https://pouchdb.com/). It's a Javascript implementation
of [Apache CouchDB](https://couchdb.apache.org/). So any CouchDb client should be able to connect to it.

### Running the Server

To help you get going we have provided a light-weight approach to serving the data over HTTP. You will first need to install the
dependencies.

```shell
cd db
npm ci
```

You only need to run this once.

Now we can start the system:

```shell
npm start
```

If you are on Windows do the following:

```shell
# in first command window
npm run start-db-inline
# in second command window
npm run deploy-data
```

Running `start` will unpack the zip file, start the server, and load the data. Note that there are ~15k artists and ~130k artworks getting
loaded by default. It will also open the admin UI for PouchDB. There you can browse/search the data and find links to documentation. For
more details on accessing the data see the section below on PouchDb.

You can limit the amount of data loaded. For example running the command below (after having run `start`) will load the first 300 artists
and only the artworks by those artists.

```shell
npm run load-data -- --max-artists=300
```

You can run this command without restarting the database process. But note that `load-data` will remove and replace any data in
the `artists` and `artworks`
with a fresh copy of the source data.

Use the following command to stop and remove the database:

```shell
npm run destroy
```

On Windows first stop the running server with `ctrl-c` then run:

```shell
npm run clean
```

This will stop the server and delete ALL temporary files (unpacked json files, database files).

If you only want to stop the database then use the following command:

```shell
npm run stop
```

On Windows just use `ctrl-c` in the command window where the server is running

When you are ready to restart the database you can do just that with:

```shell
npm run start-db
```

On Windows:

```shell
npm run start-db-inline
```

### Client Access

Although you don't really need a client here are some links.

* [Nano (JavaScript)](https://github.com/apache/couchdb-nano)
* [pycouchdb (Python)](https://pycouchdb.readthedocs.io/en/latest/)
* [IBM Cloudant (Java)](https://github.com/cloudant/java-cloudant) (Cloudant's API is a commercial offering from IBM with a compatible api).
  Cloudant also manages a set of clients which are all being re-written at the
  moment: https://blog.cloudant.com/2021/06/30/Cloudant-SDK-Transition.html#summary-of-sdk-changes

### Using JSON over HTTP

The CouchDB api for querying the store is based on a JSON-over-HTTP protocol. It is very well documented and easy to use without a custom
client. A good HTTP library may be all you really need. Note that the query language is a close relative of the MongoDB query language.
Although there are other ways to query in PouchDB, this is probably the easiest approach.

* [PouchDB documentation](https://pouchdb.com/guides/mango-queries.html)
* [CouchDB documentation](https://docs.couchdb.org/en/stable/api/database/find.html)

Furthermore, when using this approach everything is testable from the command line with tools such as curl. So below are some examples.

Let's start by accessing a document by id:

```shell
curl -H "Accept: application/json" \
http://localhost:5984/artists/1
```

We need to create POSTs to execute queries:

```shell
curl -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-d '{"selector": {"DisplayName": {"$eq": "Pablo Picasso"}}}' \
http://localhost:5984/artists/_find
```

Queries can get very complex and specific. Take a look at the documentation to find out everything that is supported:

```shell
curl -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-d '{ "selector": { "$and": [ {"Title": {"$regex": ".*Peace.*"}}, {"Date": {"$in": ["1955", "1956"]}}, {"ConstituentID": {"$elemMatch": {"$eq": 4609}}} ] } }' \
http://localhost:5984/artworks/_find
```

Here is the JSON document from above:

```json
{
	"selector": {
		"$and": [
			{"Title": {"$regex": ".*Peace.*"}},
			{"Date": {"$in": ["1955", "1956"]}},
			{"ConstituentID": {"$elemMatch": {"$eq": 4609}}}
		]
	}
}
```

Using the demo clients
-----------------------

The simple kotlin and JavaScript client are provided. Start the database before running these clients.

The Kotlin client:

```shell
cd kotlin-client
gradle app:run
gradle test

```

The Java client:

```shell
cd java-client
gradle app:run
gradle test

```

The JavaScript client:

```shell
cd js-client
npm ci
npm start

```

The TypeScript client:

```shell
cd ts-client
npm ci
npm start

```

You can also take a look at `load.js` for more sample usage of the nano JS client. It's the little piece of code that creates a database and
loads the artist and artwork datasets.
