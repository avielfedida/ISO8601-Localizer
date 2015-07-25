## Update process

1. Update ISO8601-Localizer.ts
2. browserify ISO8601-Localizer.js --standalone ISO8601Localizer > ISO8601-Localizer.min.js
3. uglifyjs ISO8601-Localizer.min.js -c -o ISO8601-Localizer.min.js --source-map ISO8601-Localizer.min.js.map
4. Bump bower.json version
5. Bump package.json version
6. Bump README.md version
