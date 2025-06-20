# 文学炼金术士 - Literary Alchemist

欢迎使用文学炼金术士，这是一款由 AI 驱动的写作增强工具，旨在帮助您转换、提炼和完善您的文本。

## 功能特性

本应用程序提供了多种 AI 驱动的工具来辅助写作者：

*   **风格转换**: 将您的文本改写成鲁迅、宫崎骏、莎士比亚或爱伦坡等著名作家的风格。
*   **结构指导**: 为您的写作提供关于如何改进流程、连贯性和整体结构的建议。
*   **节奏调整**: 获取文本的调整版本，改善其节奏和步调，并提供关于停顿和强调的具体建议。
*   **文本去 AI 化**: 使 AI 生成的文本听起来更自然、更像人类书写，去除 AI 生成的明显痕迹。
*   **多语言支持**: 用户界面支持英文和简体中文。AI 工具在处理文本时，其输出语言会与输入文本的语言保持一致。

## 技术栈

本项目采用现代 Web 开发技术栈构建：

*   **Next.js**: 一个用于构建服务器端渲染和静态 Web 应用的 React 框架。
*   **React**: 一个用于构建用户界面的 JavaScript 库。
*   **TypeScript**: JavaScript 的一个类型化超集，可编译为纯 JavaScript。
*   **Genkit (by Firebase)**: 一个用于构建 AI 驱动应用的开源框架，此处用于与大语言模型 (LLM) 交互。
*   **ShadCN UI**: 一个基于 Radix UI 和 Tailwind CSS 构建的可复用 UI 组件集合。
*   **Tailwind CSS**: 一个实用程序优先的 CSS 框架，用于快速构建自定义设计。

## 开始使用

要在本地启动应用程序：

1.  **克隆仓库。**
2.  **安装依赖**:
    ```bash
    npm install
    ```
3.  **设置环境变量**:
    在项目根目录下创建一个 `.env` 文件。您可能需要为 AI 模型提供商添加 API 密钥（例如，用于 Gemini 的 Google AI Studio）。
    ```
    GOOGLE_API_KEY=YOUR_API_KEY_HERE
    ```
4.  **运行 Genkit 开发服务器** (用于 AI 流程):
    ```bash
    npm run genkit:dev
    ```
    或者，要监视 AI 流程中的更改：
    ```bash
    npm run genkit:watch
    ```
5.  **运行 Next.js 开发服务器** (在单独的终端中):
    ```bash
    npm run dev
    ```
    这通常会在 `http://localhost:9002` 上启动应用程序。

主要的应用逻辑可以在 `src/app/page.tsx` 和 `src/components/literary-alchemist-client.tsx` 中找到。AI 流程位于 `src/ai/flows/`。

## 项目结构

*   `src/app/`: 包含 Next.js 页面和布局组件。
*   `src/components/`: 包含可复用的 React 组件，包括来自 ShadCN 的 UI 组件。
*   `src/ai/`: 包含 Genkit 配置和 AI 流程定义。
    *   `src/ai/flows/`: 每种工具的特定 AI 处理逻辑。
*   `src/contexts/`: React 上下文提供程序 (例如，用于语言管理)。
*   `src/hooks/`: 自定义 React 钩子。
*   `src/lib/`: 实用功能函数。
*   `src/locales/`: 用于国际化 (i18n) 的 JSON 文件。
*   `public/`: 静态资源。

## 许可证

本项目采用 [MIT 许可证](LICENSE)。
