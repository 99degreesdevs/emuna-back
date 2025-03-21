import { Inject, Injectable } from "@nestjs/common";
import { CreateClassScheduleCatDto } from "./dto/create-class-schedule-cat.dto";
import { UpdateClassScheduleCatDto } from "./dto/update-class-schedule-cat.dto";
import { ClassScheduleCat } from "./entities";

@Injectable()
export class ClassScheduleCatService {
  constructor(
    @Inject("CLASS_SCHEDULE_CAT_REPOSITORY")
    private readonly classScheduleCategoryRepository: typeof ClassScheduleCat
  ) {}
  create(createClassScheduleCatDto: CreateClassScheduleCatDto) {
    return this.classScheduleCategoryRepository.create(
      createClassScheduleCatDto
    );
  }

  findAll() {
    return this.classScheduleCategoryRepository.findAll();
  }

  update(id: number, updateClassScheduleCatDto: UpdateClassScheduleCatDto) {
    return this.classScheduleCategoryRepository.update(
      updateClassScheduleCatDto,
      { where: { id } }
    );
  }

  remove(id: number) {
    return this.classScheduleCategoryRepository.update(
      { isActive: false },
      { where: { id } }
    );
  }
}
