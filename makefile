MAKE_RECURSIVE_DIRS := openapi frontend api proxy awscdk
OUT_FRONTEND_DIR := api/out
SECRET_DIR_AGE := secret secret.age
define MAKE_RECURSIVE
if [ -n "$${MAKE_RECURSIVE_PARALLEL}" ]; then
	trap 'kill 0' EXIT INT TERM
	time printf '%s\n' $(MAKE_RECURSIVE_DIRS) | xargs -P0 -IX sh -c '$(MAKE) -C X $@ || exit 255'
	wait
else
	time printf '%s\n' $(MAKE_RECURSIVE_DIRS) | xargs -IX sh -c '$(MAKE) -C X $@ || exit 255'
fi
endef
export
generate: unrage# 前処理を行います。開発・本番問わず実行前に叩いてください
	bash -c "$${MAKE_RECURSIVE}"
run: # 開発用のサーバー起動コマンド フォアグラウンド実行されます Ctrl+Cで止まります
	MAKE_RECURSIVE_PARALLEL=1 bash -c "$${MAKE_RECURSIVE}"
deploy: # 本番用のサーバー起動コマンド バックグラウンド実行されます
	bash -c "$${MAKE_RECURSIVE}"
rage: # 暗号化
	tmp=$$(mktemp) && tar czvf $${tmp} -C $(firstword $(SECRET_DIR_AGE)) . && rage -p -o $(lastword $(SECRET_DIR_AGE)) $${tmp}
unrage: # 復号化
	type rage || cargo install rage
	ls $(firstword $(SECRET_DIR_AGE)) || ( mkdir -p $(firstword $(SECRET_DIR_AGE)) ; rage -d -o - $(lastword $(SECRET_DIR_AGE)) | tar xzv -C $(firstword $(SECRET_DIR_AGE)) )