import $ from "@david/dax";
import { logger } from "../../common/logger.ts";

const option = await $.prompt("Enter option");

logger.info(`Updating example: ${option}`);

const pb = $.progress("Updating example...");
await $.sleep(1000);
pb.finish();

logger.success(`Updated example: ${option}`);
