"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryStorageService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_redis_1 = require("nestjs-redis");
const redis_keys_enum_1 = require("../../common/enums/redis-keys.enum");
let InMemoryStorageService = class InMemoryStorageService {
    constructor(redisService) {
        this.redisService = redisService;
        this.ioClient = this.redisService.getClient();
    }
    async addNamespaceToHash(namespace) {
        await this.ioClient.hset(redis_keys_enum_1.RedisKeys.namespaces, namespace, 0);
    }
    async isNamespaceInHash(namespace) {
        const isExist = await this.ioClient.hexists(redis_keys_enum_1.RedisKeys.namespaces, namespace);
        console.log('isExist:', isExist);
        return !!isExist;
    }
    async addUserToHash(userData) {
        const key = this._generateKeyByPattern(userData.namespace, userData.name);
        await this.ioClient.hset(key, userData.name, JSON.stringify(userData.sheetsValues));
    }
    async configureUserIndexes(user) {
        const permittedIndex = await this.getPermittedIndexInNamespace(user.namespace);
        const indexes = {
            firstRangeIndex: permittedIndex,
            lastColumnIndex: 2,
        };
        user.sheetsValues = indexes;
        await this.increasePermittedIndex(user);
        await this.addUserToHash(user);
        return indexes;
    }
    async incrementUsersLastColumnIndex(user) {
        user.sheetsValues.lastColumnIndex += 1;
        await this.addUserToHash(user);
    }
    async isUserExists(user) {
        const key = this._generateKeyByPattern(user.namespace, user.name);
        const isKeyExist = await this.ioClient.exists(key);
        if (isKeyExist == 0) {
            return false;
        }
        return true;
    }
    async getUserIndexes(user) {
        const key = this._generateKeyByPattern(user.namespace, user.name);
        const data = await this.ioClient.hget(key, user.name);
        const parsedData = JSON.parse(data);
        return parsedData;
    }
    async increasePermittedIndex(user) {
        const permittedIndex = await this.getPermittedIndexInNamespace(user.namespace);
        const increasedPermittedIndex = permittedIndex + 7;
        await this.setPermittedIndexInNamespace(user.namespace, increasedPermittedIndex);
    }
    async setPermittedIndexInNamespace(namespace, index) {
        await this.ioClient.hset(redis_keys_enum_1.RedisKeys.namespaces, namespace, index);
    }
    async getPermittedIndexInNamespace(namespace) {
        const index = await this.ioClient.hget(redis_keys_enum_1.RedisKeys.namespaces, namespace);
        return +index;
    }
    _generateKeyByPattern(value1, value2) {
        return `${value1}:${value2}`;
    }
};
InMemoryStorageService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [nestjs_redis_1.RedisService])
], InMemoryStorageService);
exports.InMemoryStorageService = InMemoryStorageService;
//# sourceMappingURL=in-memory-storage.service.js.map