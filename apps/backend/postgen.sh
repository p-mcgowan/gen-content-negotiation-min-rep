cd "$(cd $(dirname $0) && pwd)"

cat >src/http/interfaces/NodegenRequest.ts <<'REQ'
import type { Request } from 'express';
export type NodegenRequest = Request & { defaultContentType?: string; };
export default NodegenRequest;
REQ

rm -f \
 changelog.generate-it.json \
 docker-compose.yml \
 docker-entrypoint.sh \
 Dockerfile \
 global.d.ts \
 jest.config.js \
 jest.setup.js \
 openapi-nodegen-api-file.yml \
 pm2.dev.config.js \
 pm2.prod.config.js

sed -i "s/whitelist.indexOf(origin)/whitelist.indexOf(origin || '')/g" src/http/nodegen/middleware/corsMiddleware.ts
