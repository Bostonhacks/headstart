# The 2017 Bostonhacks Site

<!---
### Todos (Nico)
* Create a proper errorHandler function
* Make sure progressContainer's divs dont wrap
* Change all the "../../" references for js and css to root directory references
* Change "message" to "errorMessage" in all the views where messages are realy just errors
* Sort out DevOps situation (Make server logs go to file we can tail)
-->

### Process for installing and running

* Clone git, and type `npm install`
* Install MongoDB (if not already installed): [https://docs.mongodb.com/manual/administration/install-community/](https://docs.mongodb.com/manual/administration/install-community/)
  * Create directory `/data/db`. Note directory for following step. Other directory names may be used, but `/data/db` is the default for mongo.
  * Change permissions for `/data/db` to read/write for user which will run mongo. Example: ```sudo chown -R `id -u` /data/db``` on Mac.
  * Run mongo with `mongod`. 
* Duplicate SAMPLE-.env file, and rename to `.env`. See SAMPLE file for details on fields
* Run with `node server.js`

In order to utilize My.MLH and Sendgrid, reach out to Nico for the required environment variables!

### Before Contributing
Please ensure that any PRs pass the [Standard](https://github.com/feross/standard) linter
