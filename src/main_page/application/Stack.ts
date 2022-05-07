class StackNode {
  value: any;
  next: StackNode | null;
  constructor(value: any) {
    this.value = value;
    this.next = null;
  }
}

export class Stack {
  head: StackNode | null;
  size: number;

  constructor() {
    this.head = null;
    this.size = 0;
  }

  push(value: any) {
    const newNode = new StackNode(value);

    if (this.size === 0) {
      this.head = newNode;
      this.head.next = newNode;
    } else {
      this.head.next = this.head;
      this.head = newNode;
    }

    this.size++;
    return this.size;
  }

  pop() {
    const removedNode = this.head;
    this.head = this.head.next;

    return removedNode;
  }
}
