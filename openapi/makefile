create:
	npm install -g @typespec/compiler
	npx init
generate:
	find -maxdepth 1 -name '*.tsp' | xargs -IX npx tsp compile X --output-dir=../out
%:
	@echo "no target $*"