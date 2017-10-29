const DynamoDB = require(`${__dirname}/dynamodb.js`);

class RemoteSet {
  constructor({defaultValue, serial, tableName, key}) {
    this.defaultValue = defaultValue;
    this.tableName = tableName;
    this.serial = serial;
    this.key = key;

    this.items = new Map();
    this.database = new DynamoDB({});
  }

  async get(key) {
    let item = this.items.get(key);
    if (item !== undefined) {
      return item;
    }
    item = await this.getItem(key);
    if (item !== undefined && item[this.key] === key) {
      this.items.set(key, item);
      return item;
    }
    return this.defaultValue;
  }

  async forceGet(key) {
    item = await this.getItem(key);
    if (item !== undefined) {
      this.items.set(key, item);
      return item;
    }
    return this.defaultValue;
  }

  async find({key, value}) {
    const items = this.items.entries();
    let found = undefined;

    this.items.forEach((item) => {
      if (found === undefined && item[key] === value) {
        found = item;
      }
    });

    if (found === undefined) {
      const data = await this.database.scan({
        ExpressionAttributeNames: {
          '#KEY': key
        },
        ExpressionAttributeValues: {
          ':VALUE': {S: value}
        },
        FilterExpression: '#KEY = :VALUE',
        TableName: this.tableName
      });
      if (data.Items[0] !== undefined) {
        found = this.deserialize(data.Items[0]);
        this.items.set(found.minirl, found);
      }
    }

    if (found === undefined) {
      throw 'Item not found';
    }
    return found;
  }

  put(key, item) {
    this.items.set(key, item);
    this.database.putItem({
      Item: this.serialize(item),
      TableName: this.tableName
    }).then(() => {}).catch((err) => {throw err});
  }

  getItem(key) {
    return this.database.getItem({
      Key: {[this.key]: {'S': key}},
      TableName: this.tableName
    }).then((data) => {
      return this.deserialize(data.Item);
    }).catch((err) => {throw err});
  }

  deserialize(serializedItem) {
    let item = {};

    // Make more generalized
    for (let key in serializedItem) {
      for (let type in serializedItem[key]) {
        switch(type) {
          case 'N':
            item[key] = new Number(serializedItem[key][type]);
            break;
          case 'S':
            item[key] = serializedItem[key][type]
            break;
        }
      }
    }

    return item;
  }

  serialize(item) {
    let serializedItem = {};

    // Make more generalized
    for (let key in item) {
      const serial = this.serial[key];
      if (serial !== undefined && (item[key] !== undefined || serial[1] !== undefined)) {
        serializedItem[key] = {[serial[0]]: item[key] !== undefined ? String(item[key]) : String(serial[1])};
      }
    }

    return serializedItem;
  }
}

module.exports = RemoteSet;