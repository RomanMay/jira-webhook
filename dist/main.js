"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const shared_module_1 = require("./modules/shared/shared.module");
const config_service_1 = require("./modules/shared/config.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.select(shared_module_1.SharedModule).get(config_service_1.ConfigService);
    app.enableCors();
    await app.listen(process.env.PORT || configService.get('app.port'));
}
bootstrap();
//# sourceMappingURL=main.js.map