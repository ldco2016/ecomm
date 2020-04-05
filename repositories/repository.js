const fs = require("fs");
const crypto = require("crypto");

module.exports = class Repository {
  constructor(filename) {
    if (!filename) {
      throw new Error("Creating a repository requires a filename");
    }

    this.filename = filename;
    try {
      fs.accessSync(this.filename);
    } catch (error) {
      fs.writeFileSync(this.filename, "[]");
    }
  }

  async create(attrs) {
    attrs.id = this.randomId();

    const records = await this.getAll();
    records.push(attrs);
    await this.writeAll(records);
  }

  async getAll() {
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: "utf8"
      })
    );
  }

  async writeAll(records) {
    // write the updated 'records' array back to this.filename
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2)
    );
  }

  randomId() {
    return crypto.randomBytes(4).toString("hex");
  }

  async getOne(id) {
    const records = await this.getAll();
    return records.find(record => record.id === id);
  }

  async delete(id) {
    const records = await this.getAll();
    const filteredRecords = records.filter(record => record.id !== id);
    await this.writeAll(filteredRecords);
  }

  async update(id, attrs) {
    const records = await this.getAll();
    const record = records.find(record => record.id === id);

    if (!record) {
      throw new Error(`Record with id ${id} not found`);
    }
    // record === { email: "test@test.com" }
    // attrs === { password: 'mypassword' }
    // so attrs is copied over to record object to result in { email: "test@test.com", password: 'mypassword' }
    Object.assign(record, attrs);
    // take array of records and write it back to JSON file
    await this.writeAll(records);
  }

  async getOneBy(filters) {
    const records = await this.getAll();
    // iterate through the collection of records - for/of loop because iterating through array
    for (let record of records) {
      let found = true;
      // iterate through all key/value pairs of the filters object - for/in because iterating through object
      for (let key in filters) {
        // receive every key inside the object and can look at the value inside of object with filters[key]
        // it means email or password at filters is the same as email password on record
        if (record[key] !== filters[key]) {
          // if email and password between filters and record do not match then...
          found = false;
        }
      }
      // record was found because filters object key/value pairs and record are same
      if (found) {
        return record;
      }
    }
  }
};
