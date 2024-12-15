import $ from "@david/dax";
import { logger } from "../../common/logger.ts";

const option = await $.prompt("Enter option");

logger.info(`Creating example: ${option}`);

const pb = $.progress("Creating example...");
await $.sleep(1000);
pb.finish();

logger.success(`Created example: ${option}`);
