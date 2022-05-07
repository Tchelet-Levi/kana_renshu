class QueueNode {
  value: any;
  next: QueueNode | null;
  constructor(value: any) {
    this.value = value;
    this.next = null;
  }
}

export class Queue {
  tail: QueueNode | null;
  head: QueueNode | null;
  size: number;

  constructor() {
    this.tail = null;
    this.head = null;
    this.size = 0;
  }

  enqueue(value: any) {
    const newNode = new QueueNode(value);

    if (this.size === 0) {
      this.tail = newNode;
      this.head = newNode;
    } else {
      // Set the next variable for tail as the newNode
      this.tail.next = newNode;
      // Update tail to be tail.next (or just newNode)
      this.tail = newNode;
    }

    this.size++;
    return this.size;
  }

  dequeue() {
    if (this.size === 0) return null;

    const removedNode = this.tail;
    this.head = this.head.next;

    return removedNode;
  }
}
