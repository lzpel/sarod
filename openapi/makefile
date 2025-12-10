generate: tspconfig
	npx tsp info >/dev/null || $(MAKE) install
	find -maxdepth 1 -name '*.tsp' | xargs -IX npx tsp compile X
install: tspconfig
	npm install @typespec/compiler @typespec/http @typespec/openapi3
	npm pkg set scripts.tsp="tsp"
tspconfig:
	echo "$${tspconfig}" > ./tspconfig.yaml
%:
	@echo "no target $*"
define tspconfig
emit:
  - "@typespec/openapi3"
options:
  "@typespec/openapi3":
    emitter-output-dir: "{cwd}/../out" # "{output-dir}/schema"
    file-type: "json"
    openapi-versions:
      - 3.1.0
endef
export