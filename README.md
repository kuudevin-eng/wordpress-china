# 获取并直接改造 WordPress 源码（中国本地化）

这个仓库提供的脚本会下载最新稳定版 WordPress，并在 `zh_CN` 场景下**直接对源码做中国本地化改造**（写入 MU 插件）。

## 一键获取并本地化（默认 `zh_CN`）

```bash
chmod +x fetch-latest-wordpress.sh
./fetch-latest-wordpress.sh
```

默认输出目录：

- `wordpress-src/wordpress`

## 自定义目录 / 语言

```bash
# 自定义目录（仍是 zh_CN）
./fetch-latest-wordpress.sh /your/path

# 自定义目录 + 英文包（不会注入中国本地化插件）
./fetch-latest-wordpress.sh /your/path en_US
```

## 脚本会做哪些事

1. 从 WordPress 官方 API 获取指定 locale 的最新稳定版信息。
2. 下载官方压缩包和 `.md5` 校验文件并校验完整性。
3. 自动解压 `.zip` / `.tar.gz`。
4. 若 locale 为 `zh_CN`，自动在源码中写入：
   - `wp-content/mu-plugins/cn-localization-defaults.php`
   - 强制默认语言为 `zh_CN`
   - 默认时区设置为 `Asia/Shanghai`（以及 `gmt_offset=8`）

## 官方来源

- 版本 API：`https://api.wordpress.org/core/version-check/1.7/`
- 下载域名：`https://downloads.wordpress.org/`
- 项目站点：`https://wordpress.org/`

