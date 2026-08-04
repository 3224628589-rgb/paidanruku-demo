# 三步工作台演示动画

这是历史演示素材，用于呈现“拍单、验货、核准”三步之间的切换。当前产品首屏已经升级为**入库任务列表**，动画不包含任务入口页、右侧 Figma 进度组件或最新 PC 三列工作台，因此不得作为当前页面的视觉还原依据。

## 使用

```bash
cd remotion
npm install
npm run studio
```

渲染：

```bash
npm run render
```

输出：`remotion/out/three-tab-switch.mp4`

## Composition

- id: `ThreeTabSwitch`
- 时长：5 秒
- 帧率：30fps
- 尺寸：`1920 x 1080`

更新动画前，先对齐根目录 `README.md`、`docs/product/workflow-and-states.md` 与 `docs/design/pc-ui-spec.md` 的当前 PC 逻辑。
