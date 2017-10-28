const DynamoDB = require('/dynamodb.js');

class RemoteSet {
  constructor({defaultValue}) {
    this.defaultValue = defaultValue;
    this.items = new Map();
    this.database = new DynamoDB();
  }

  get(key) {
    const item = this.items.get(key);
    if (item !== undefined) {
      return item;
    }
    return this.defaultValue;
  }

  put(key, item, dynamoItem) {
    const currentItem = this.items.get(key);
    if (currentItem !== item) {
      this.items.set(key, item);
      this.database.putItem(dynamoItem);
    }
  }
}

module.exports = RemoteSet;