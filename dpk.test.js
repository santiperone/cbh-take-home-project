const { deterministicPartitionKey } = require('./dpk');
const { createHash } = require('node:crypto');
jest.mock('node:crypto');
const mockUpdateHash = jest.fn(() => ({digest: () => 'someHash'}))

describe('deterministicPartitionKey', () => {
  beforeEach(() => {
    createHash.mockReturnValue({update: mockUpdateHash})
    mockUpdateHash.mockClear();
  })
  it('returns the literal "0" when given no input', () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe('0');
  });
  it("returns the partition key if it exists", () => {
    const event = { partitionKey: "foo" };
    const result = deterministicPartitionKey(event);
    expect(result).toEqual("foo");
  });
  it("hashes the provided partition key if it exceeds max partition length", () => {
    const event = { partitionKey: "foo".repeat(100) };
    const result = deterministicPartitionKey(event);
    expect(mockUpdateHash).toHaveBeenCalledTimes(1);
    expect(result).toBe('someHash');
  });
  it("returns the hashed JSON stringified event if no partition key", () => {
    const event = { foo: "bar" };
    const result = deterministicPartitionKey(event);
    expect(mockUpdateHash).toHaveBeenCalledTimes(1);
    expect(result).toBe('someHash');
  });
});
