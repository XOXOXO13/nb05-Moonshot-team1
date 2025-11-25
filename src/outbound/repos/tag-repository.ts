import { NewTagEntity, PersistTagEntity, TagEntity } from "../../domain/entites/tag/tag-entity";
import { ITagRepository } from "../../domain/ports/repositories/I-tag-repository";
import { TagMapper } from "../mappers/tag-mapper";
import { BasePrismaClient } from "./base-repository";

export class TagRepository implements ITagRepository {
    private _prisma;

    constructor(prisma: BasePrismaClient) {
        this._prisma = prisma;
    }

    async findOrCreate(tags: NewTagEntity[]): Promise<PersistTagEntity[]> {
        // 태그 생성 
        const tagDatas = TagMapper.toCreateData(tags);
        await this._prisma.tag.createMany({
            data: tagDatas,
            skipDuplicates: true
        })

        // 태그 조회
        const names = tagDatas.map(t => t.name);
        const records = await this._prisma.tag.findMany({
            where: { name: { in: names } }
        });

        return TagMapper.toPersistEntites(records);
    }
}

