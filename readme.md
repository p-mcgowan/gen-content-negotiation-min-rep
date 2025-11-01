# content negitiation test rig

Tests for feature branch https://github.com/acr-lfr/generate-it-typescript-server/pull/259

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

testing different branches and specs:
- `npm run gen-feat-oas3` will generate an openapi 3 spec off the feature branch
- `npm run gen-feat-oas2` will gen oas2 spec from feature branch
- `npm run gen-main-oas3` will gen oas3 from main
- `npm run gen-main-oas2` will gen oas2 from main

In theory, the tests should pass for both oas3 and oas2 off a feature branch, however there are issues in generate-it, unrealted to the feature branch, preventing those from working.
