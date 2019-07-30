const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var sequenceSchema = new Schema({
  key: String,
  value: Number
});

//sequenceSchema.statics.setId 
module.exports = mongoose.model('sequence', sequenceSchema);

module.exports.setId = async function (instance) {
  let seq = await this.findOneAndUpdate(
    { key: `${instance.constructor.modelName}_id` },
    { $inc: { value: 1 } }
  );
  instance.id = seq.value;
}