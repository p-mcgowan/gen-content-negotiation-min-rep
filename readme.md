# content negitiation test rig


to test:
```bash
cd apps/backend
npm run build
npm test
```

in [content-negotiation.spec.ts](./apps/backend/test/content-negotiation.spec.ts), there are 4 tests:
- first is produces html
- second is produces json
- third and forth are both testing multiple produces

Both 3 and 4 fail in different ways - either on the main branch, feature branch, oas2 or oas3. Basically it doesn't work no matter what.


to gen the oas3 one off the content negotiation branch: `npm run gen`.  
to gen the oas2 one off the content negotiation branch: `npm run gen2`.  

to gen either off the main branch, paste one of these:
```bash
cd apps/backend

# oas3
node -r ./no-update.js node_modules/.bin/generate-it --dont-run-comparison-tool -yt https://github.com/acrontum/generate-it-typescript-server ../../spec/release/backend.json

# oas2 / swag
node -r ./no-update.js node_modules/.bin/generate-it --dont-run-comparison-tool -yt https://github.com/acrontum/generate-it-typescript-server ../../spec/release/backend-oa2.json
```
