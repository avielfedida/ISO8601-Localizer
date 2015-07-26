## Update process

1. Update ISO8601-Localizer.ts
2. browserify iso8601-localizer.js --standalone ISO8601Localizer > iso8601-localizer.min.js
3. uglifyjs iso8601-localizer.min.js -c -o iso8601-localizer.min.js --source-map iso8601-localizer.min.js.map
4. Bump bower.json version
5. Bump package.json version
6. Bump README.md version
7. Update the cdn link version at README.md
