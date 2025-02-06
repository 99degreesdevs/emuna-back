import { ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsBooleanString, IsIn, IsNumber, IsOptional, IsPositive, IsUUID } from "class-validator";
import { PageOptionsDto } from "src/common/pagination";
import { ClassTransactionStatus } from "../interfaces/statusClassTransaction.enum";
 
export class SearchClassScheduleTransactionDto extends PartialType(PageOptionsDto) {
  
  @ApiPropertyOptional({ 
    description: 'Filter by the unique credit ID associated with the transaction.',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsOptional()
  @IsUUID(4, { message: 'creditId must be a valid UUID v4.' })
  readonly creditId?: string;


  @ApiPropertyOptional({ 
    description: 'Filter by the ID of the class.',
    example: 101 
  })
  @IsOptional()
  @IsNumber({}, { message: 'classId must be a number.' })
  @IsPositive({ message: 'classId must be a positive number.' })
  @Type(() => Number)
  readonly classId?: number;

  @ApiPropertyOptional({ 
    description: 'Indicates whether the transaction is active or not.',
    example: true 
  }) 
  @IsOptional()
  @IsBooleanString({ message: 'isActive must be a boolean value.' })  

  readonly isActive?: string;

  @ApiPropertyOptional({ 
    description: 'Filter transactions by their status.',
    enum: ClassTransactionStatus,
    example: ClassTransactionStatus.COMPLETED 
  })
  @IsOptional()
  @IsIn(Object.values(ClassTransactionStatus), { message: `status must be either ${Object.values(ClassTransactionStatus).join(', ')}.` })
  readonly status?: string;

  @ApiPropertyOptional({ 
    description: 'Filter by transaction ID.',
    minimum: 1,
    default: 1,
    example: 123
  })
  @IsOptional()
  @IsNumber({}, { message: 'transactionId must be a number.' })
  @IsPositive({ message: 'transactionId must be a positive number.' })
  @Type(() => Number)
  readonly transactionId?: number;

  @ApiPropertyOptional({ 
    description: 'Filter by the unique user ID associated with the transaction.',
    example: '550e8400-e29b-41d4-a716-446655440000' 
  })
  @IsOptional()
  @IsUUID(4, { message: 'userId must be a valid UUID v4.' })
  readonly userId?: string;
}
