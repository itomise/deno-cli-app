import $ from "@david/dax";

export const logger = {
  debug: (...messages: string[]) => {
    $.logLight(...messages);
  },
  info: (...messages: string[]) => {
    $.log(...messages);
  },
  warn: (...messages: string[]) => {
    $.logWarn("⚠️", ...messages);
  },
  error: (...messages: string[]) => {
    $.logError("❌", ...messages);
  },
  success: (...messages: string[]) => {
    $.logStep("✅", ...messages);
  },
};
