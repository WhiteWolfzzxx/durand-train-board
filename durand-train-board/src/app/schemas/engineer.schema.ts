import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EngineerSchema {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  firstName: string;

  @Column('text')
  lastName: string;

  @Column({
    type: 'blob',
    nullable: true
  })
  image1: Uint8Array | null;

  @Column({
    type: 'blob',
    nullable: true
  })
  image2: Blob | null;

  @Column({
    type: 'blob',
    nullable: true
  })
  image3: Blob | null;

  constructor(init?: Partial<EngineerSchema>) {
    Object.assign(this, init);
  }
}
