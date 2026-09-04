// api/index.ts
// Vercel 自动发现：api/index.ts → 暴露为 /api（以及 /api/index），并通过 rewrites 把所有请求转过来
import app from "../src/server";

export default app;