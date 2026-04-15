# 获取最新 WordPress 源码（中国本地化，适合二次开发）

这个仓库提供了一个脚本，默认会拉取 **简体中文（`zh_CN`）** 的最新稳定版 WordPress 源码，并做完整性校验。

## 一键获取（默认中国本地化）

```bash
chmod +x fetch-latest-wordpress.sh
./fetch-latest-wordpress.sh
```

默认会把源码下载并解压到：

- `wordpress-src/wordpress`

## 自定义下载目录

```bash
./fetch-latest-wordpress.sh /your/path
```

## 自定义语言（可选）

脚本默认 locale 为 `zh_CN`，你也可以传第二个参数改为其他语言，例如英文：

```bash
./fetch-latest-wordpress.sh /your/path en_US
```

## 脚本做了什么

1. 读取 WordPress 官方版本接口（`api.wordpress.org`）获取指定 locale 的最新稳定版与下载地址。
2. 下载对应版本压缩包（可能是 `.zip` 或 `.tar.gz`）。
3. 下载官方 `.md5` 文件并校验完整性。
4. 自动解压后输出源码目录（`wordpress`）。

## 官方获取来源

- 官方版本 API：`https://api.wordpress.org/core/version-check/1.7/`
- 官方下载域名：`https://downloads.wordpress.org/`
- 官方项目站点：`https://wordpress.org/`

