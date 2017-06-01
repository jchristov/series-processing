import DataStream from './data-stream';

export default class TimeSeries {
  chain = [];

  constructor(options) {
    this.options = Object.assign({
      // Default value
    }, options);
    this.dataStream = new DataStream();
  }

  getData = () => this.dataStream.getData();

  initData = (data = [], skip = false) => {
    if (skip) {
      this.dataStream.setData(data);
    } else {
      // Append one-by-one
      this.dataStream.setData(null);

      data.map(record => this.appendData(record));
    }

    return this;
  };

  appendData = (record) => {
    // TODO How about update last data?
    this.dataStream.push(record);

    for (let { func } of this.chain) {
      Object.assign(record, func(record, this.dataStream));
    }

    return this;
  };

  then = (func) => {
    if (typeof func === 'function') {
      this.chain.push({
        type: 'then',
        func,
      });

      // TODO Call func if data exists
    }

    return this;
  };

  aggregate = (func) => {
    return func(this.dataStream);
  };
}