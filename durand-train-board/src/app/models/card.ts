export class Card {
  id: number;
  route: string;
  engineerName: string;
  engineerId: number;
  roadNumbers: string[];
  image: Uint8Array | null;
  imageOption: string;

  constructor(init?: Partial<Card>) {
    Object.assign(this, init);
  }
}
