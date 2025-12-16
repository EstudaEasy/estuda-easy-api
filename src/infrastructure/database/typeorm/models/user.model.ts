import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { IUser } from '@domain/entities/user/user.interface';

@Entity({ name: 'users' })
export class UserModel implements IUser {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({
    name: 'name',
    type: 'varchar'
  })
  name: string;

  @Column({
    name: 'email',
    type: 'varchar',
    unique: true
  })
  email: string;

  @Column({
    name: 'password',
    type: 'varchar'
  })
  password: string;

  @Column({
    name: 'phone_number',
    type: 'varchar',
    nullable: true
  })
  phoneNumber?: string;

  @Column({
    name: 'photo_url',
    type: 'varchar',
    nullable: true
  })
  photoUrl?: string;

  @Column({
    name: 'birthdate',
    type: 'date',
    nullable: true
  })
  birthdate?: Date;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz'
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz'
  })
  updatedAt: Date;
}
