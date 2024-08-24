import {Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles} from '@nestjs/common';
import { StorageService } from './storage.service';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';
import {FilesInterceptor} from "@nestjs/platform-express";

@Controller('storage')
export class StorageController {
    constructor(private readonly storageService: StorageService) {
    }
    @Post("upload")
    @UseInterceptors(FilesInterceptor('imageUrl') )
    async uploadFiles(
        @UploadedFiles() files: Express.Multer.File[],
        @Body("folderName") folderName: string,
    ): Promise<{ urls: string[] }> {
        console.log(files);
        console.log(folderName);
        try {
            const urls = await this.storageService.uploadFilesToFirebase(files, folderName);
            console.log(urls);
            return { urls };
        } catch (error) {
            throw error;
        }
    }

    @Post("upload/cover")
    @UseInterceptors(FilesInterceptor('imageUrl') )
    async uploadFilesCover(
      @UploadedFiles() files: Express.Multer.File[],
      @Body("folderName") folderName: string,
    ): Promise<{ urls: string[] }> {
        console.log(files);
        console.log(folderName);
        try {
            const urls = await this.storageService.uploadFilesToFirebase(files, folderName);
            console.log(urls);
            return { urls };
        } catch (error) {
            throw error;
        }
    }
}
