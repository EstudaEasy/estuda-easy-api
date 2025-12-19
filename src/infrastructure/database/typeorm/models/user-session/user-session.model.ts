import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { IUserSession } from '@domain/entities/user-session/interface';

import { UserModel } from '../user/user.model';

@Entity({ name: 'user_sessions' })
export class UserSessionModel implements IUserSession {
  @PrimaryColumn({ name: 'jti', type: 'varchar' })
  jti: string;

  @Column({ name: 'user_id', type: 'int' })
  @Index('ix_user_sessions_user_id')
  userId: number;

  @ManyToOne(() => UserModel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', foreignKeyConstraintName: 'fk_user_sessions_user_id' })
  user?: UserModel;

  @Column({ name: 'ip_address', type: 'inet' })
  ipAddress: string;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
