const { createHash } = require('node:crypto');

const hash = (string) => createHash("sha3-512").update(string).digest("hex");

exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;

  if (!event) return TRIVIAL_PARTITION_KEY;

  let candidate = event?.partitionKey || hash(JSON.stringify(event));

  if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
    candidate = hash(candidate);
  }
  
  return candidate;
};