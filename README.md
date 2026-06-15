# 画幅裁切工具

纯前端图片 / 视频画幅裁切工具。图片直接用 Canvas 导出，视频用 FFmpeg.wasm 在浏览器本地处理，素材不会上传服务器。

## 本地预览

Windows 上可以直接双击 `启动工具.bat`，它会打开正确的 `http://localhost:4173`。

Mac 上可以用终端运行：

```bash
chmod +x ./启动工具.command
./启动工具.command
```

如果压缩包保留了可执行权限，也可以直接双击 `启动工具.command`。

```bash
npm run dev
```

不要直接双击 `index.html` 测试视频导出，因为 FFmpeg.wasm 多线程需要跨域隔离响应头，本地服务器已经自动加好。

## 部署

直接部署本目录即可。项目已包含 Netlify 的 `_headers` / `netlify.toml` 和 Vercel 的 `vercel.json`，核心要求是所有页面返回：

```text
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Resource-Policy: same-origin
```

页面中 `crossOriginIsolated === true` 时，视频导出才会启用。

## V1 限制

- 视频导入仅支持 MP4。
- 视频输出固定为 MP4，H.264 CRF 20 + veryfast preset，音频使用 `copy` 尽量保留原音频。
- 默认参数偏向高质量和合理文件大小；不再使用 `ultrafast`，因为它会明显放大输出体积。
- 默认使用 FFmpeg.wasm 多线程引擎；如果编码长时间停在开头，会自动切换到单线程兼容模式重试。
- 批量视频会逐个导出，不并行处理。
- 浏览器内 FFmpeg 受内存限制影响，不建议处理超长或 4K 视频。
- Mac 用户建议使用 Chrome 打开部署后的网页；不要直接双击 `index.html`。
