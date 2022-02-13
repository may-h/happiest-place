import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Image} from '../../entity/Image.entity';
import {Repository} from "typeorm";
import {createImageDto} from "./dto/create-image.dto";

@Injectable()
export class ImageService {

    constructor(
        @InjectRepository(Image)
        private imageRepository: Repository<Image>
    ) {}

    create(data: createImageDto) {
        const image = this.imageRepository.create(data);
        return this.imageRepository.save(image);
    }

    findAll() {
        return this.imageRepository.find();
    }

    findById(id) {
        return this.imageRepository.findOne({id});
    }
}