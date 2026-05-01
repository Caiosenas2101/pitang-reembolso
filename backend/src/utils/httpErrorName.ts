export function httpErrorName(statusCode: number) {
  const names: Record<number, string> = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    500: "Internal Server Error"
  };

  return names[statusCode] ?? "Error";
}
