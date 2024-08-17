import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  id: number;


  @IsString()
  @IsOptional()
  content?: string;

  @IsNotEmpty()
  @IsString()
  uid: string;

  @IsArray()
  @IsOptional()
  imageUrls?: string[];



}