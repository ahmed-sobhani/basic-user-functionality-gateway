import { ApiProperty } from '@nestjs/swagger';

export class IDResponse {
  @ApiProperty()
  id: number;
}

export class OTPResponse {
  @ApiProperty()
  lockedUntil: Date;

  @ApiProperty()
  hashCode: string;

  @ApiProperty()
  expiredAt: Date;
}
