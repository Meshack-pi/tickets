class Node {
  constructor(key, value) {
    this.key   = key;
    this.value = value;
    this.next  = null;
  }
}

class HashTable {
  constructor(size = 53) {
    this.table = new Array(size).fill(null);
    this.size  = size;
    this.count = 0;
  }

  _hash(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash * 31 + key.charCodeAt(i)) % this.size;
    }
    return hash;
  }

  insert(bookingId, bookingDetails) {
    const index = this._hash(bookingId);
    if (!this.table[index]) {
      this.table[index] = new Node(bookingId, bookingDetails);
      this.count++;
      return;
    }
    let current = this.table[index];
    while (current) {
      if (current.key === bookingId) { current.value = bookingDetails; return; }
      if (!current.next) break;
      current = current.next;
    }
    current.next = new Node(bookingId, bookingDetails);
    this.count++;
  }

  lookup(bookingId) {
    let current = this.table[this._hash(bookingId)];
    while (current) {
      if (current.key === bookingId) return current.value;
      current = current.next;
    }
    return null;
  }

  delete(bookingId) {
    const index = this._hash(bookingId);
    let current = this.table[index];
    if (!current) return null;
    if (current.key === bookingId) {
      this.table[index] = current.next;
      this.count--;
      return current.value;
    }
    while (current.next) {
      if (current.next.key === bookingId) {
        const deleted = current.next.value;
        current.next  = current.next.next;
        this.count--;
        return deleted;
      }
      current = current.next;
    }
    return null;
  }

  update(bookingId, newDetails) {
    let current = this.table[this._hash(bookingId)];
    while (current) {
      if (current.key === bookingId) {
        current.value = { ...current.value, ...newDetails };
        return current.value;
      }
      current = current.next;
    }
    return null;
  }

  getAll() {
    const result = {};
    for (let i = 0; i < this.size; i++) {
      let current = this.table[i];
      while (current) { result[current.key] = current.value; current = current.next; }
    }
    return result;
  }

  displayStats() {
    let usedSlots = 0, maxChain = 0, collisions = 0;
    for (let i = 0; i < this.size; i++) {
      if (!this.table[i]) continue;
      usedSlots++;
      let len = 0, node = this.table[i];
      while (node) { len++; node = node.next; }
      if (len > 1) collisions += len - 1;
      if (len > maxChain) maxChain = len;
    }
    console.log(`Table: ${this.size} slots | Entries: ${this.count} | Used: ${usedSlots} | Collisions: ${collisions} | Max chain: ${maxChain}`);
  }
}

module.exports = HashTable;

if (require.main === module) {
  const ht = new HashTable();
  ht.insert('BK001', { name: 'Alice', event: 'Nairobi Fight Nights', seat: 'A1-1', price: 1500 });
  ht.insert('BK002', { name: 'Bob',   event: 'Blankets & Wine',      seat: 'B1-2', price: 3500 });
  ht.insert('BK003', { name: 'Carol', event: 'Sol Fest',             seat: 'A2-3', price: 3526 });

  console.log(ht.lookup('BK002'));
  console.log(ht.update('BK001', { seat: 'A1-3' }));
  console.log(ht.delete('BK003'), ht.lookup('BK003'));
  console.log(ht.getAll());
  ht.displayStats();
}
