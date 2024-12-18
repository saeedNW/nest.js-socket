import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app/app.module";
import { UnprocessableEntityPipe } from "./common/pipe/unprocessable-entity.pipe";
import * as cookieParser from "cookie-parser";
import { HttpExceptionFilter } from "./common/Filters/exception.filter";
import { ResponseTransformerInterceptor } from "./common/interceptor/response-transformer.interceptor";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	/** Config CORS policy */
	app.enableCors({
		origin: "http://127.0.0.1:5500", //? VSCode live server address
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	});

	/** Register public folder as static files directory */
	app.useStaticAssets("public");

	/** initialize custom exception filter */
	app.useGlobalFilters(new HttpExceptionFilter());

	/** initialize custom validation pipe */
	app.useGlobalPipes(new UnprocessableEntityPipe());

	/** initialize custom response interceptor */
	app.useGlobalInterceptors(new ResponseTransformerInterceptor());

	/** Initialize cookie parser */
	app.use(cookieParser(process.env.COOKIE_SECRET));

	await app.listen(process.env.PORT ?? 3000, () =>
		console.log("Running on http://localhost:3000")
	);
}
bootstrap();
