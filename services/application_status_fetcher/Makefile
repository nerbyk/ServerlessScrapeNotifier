package: 
	rm -rf node_mudles
	rm -rf dist 
	rm -rf builds 
	pnpm install
	./node_modules/.bin/esbuild src/app.ts --bundle --outfile=dist/app.js --platform="node"
