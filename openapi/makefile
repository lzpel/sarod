create:
	npm install -g @typespec/compiler
	npx init
generate:
	npx tsp || npm install -g @typespec/compiler
	npm install
	find -maxdepth 1 -name '*.tsp' | xargs -IX npx tsp compile X --output-dir=../out
%:
	@echo "no target $*"