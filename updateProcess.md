## Update process

1. tsc -t ES5 -m commonjs iso8601-localizer.ts
2. browserify iso8601-localizer.js --standalone ISO8601Localizer > iso8601-localizer.min.js
3. uglifyjs iso8601-localizer.min.js -c -o iso8601-localizer.min.js --source-map iso8601-localizer.min.js.map
4. Update iso8601-localizer.min.js and iso8601-localizer.min.js.map at the demo folder
5. Bump bower.json version
6. Bump package.json version
7. Bump README.md version(at the bottom of the page)
8. Update the cdn link version at README.md
9. Update the cdn link version at the demo index.html
10. Don't forget to 'npm publish' after 'push --tags'


## Notes

1. `lib/interfaces.js` if created must be deleted as its empty.