import { customAlphabet } from 'nanoid';

export class Nanoid {
  static generate(size: number = 21, alphabet: string = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'): string {
    const nanoid = customAlphabet(alphabet, size);
    return nanoid();
  }
}
