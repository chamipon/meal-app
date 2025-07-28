export function createLogger(prefix: string, showTimestamp = true) {
	return {
		log: (...args: any[]) => console.log(formatPrefix("log"), ...args),
		info: (...args: any[]) => console.info(formatPrefix("info"), ...args),
		warn: (...args: any[]) => console.warn(formatPrefix("warn"), ...args),
		error: (...args: any[]) => console.error(formatPrefix("error"), ...args),
		success: (...args: any[]) => console.log(formatPrefix("success"), ...args),
	};

	function formatPrefix(level: LogLevel): string {
		const icons: Record<LogLevel, string> = {
			log: "💬",
			info: "ℹ️",
			warn: "⚠️",
			error: "❌",
			success: "✅",
		};

		const timestamp = showTimestamp ? `[${new Date().toISOString()}] ` : "";
		const caller = getTrueCallerFunctionName();
		const icon = icons[level] || "";
		return `${timestamp}[${prefix}]${caller ? ` [${caller}] ${icon} ` : ""}`;
	}

	function getTrueCallerFunctionName(): string | null {
		const err = new Error();
		const stack = err.stack?.split("\n") || [];

		for (let i = 2; i < stack.length; i++) {
			const line = stack[i].trim();

			if (
				line.includes("logger.") ||
				line.includes("createLogger") ||
				line.includes("formatPrefix") ||
				line.includes("getTrueCallerFunctionName")
			) {
				continue;
			}

			const match = line.match(/at\s+(.*?)\s+\(/);
			if (match && match[1]) {
				return cleanFunctionName(match[1]);
			}

			const fallbackMatch = line.match(/at\s+(.*)/);
			if (fallbackMatch && fallbackMatch[1]) {
				return cleanFunctionName(fallbackMatch[1]);
			}
		}

		return null;
	}

	function cleanFunctionName(name: string): string {
		return name.replace(/^(Object\.|Function\.|.*\.)/, "");
	}
}

type LogLevel = "log" | "info" | "warn" | "error" | "success";
