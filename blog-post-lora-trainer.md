# 介绍 lora-trainer：一键搞定大模型 LoRA 微调 🦾

微调大模型这件事，对新手来说坑太多了——显存要多少？Rank 设多大？学习率怎么选？好不容易调完参数，训练脚本还得自己写。

**lora-trainer** 就是来解决这些问题的。上传你的 JSONL 数据，它帮你分析数据质量、推荐超参数、估算显存、生成可运行的训练脚本——全流程一站式搞定。

## 它能做什么

lora-trainer 把 LoRA 微调拆成了四个步骤，每一步都有对应的工具：

### 📊 数据分析

拖入 JSONL 文件，自动识别格式（instruction-output / messages / conversations），统计长度分布，估算 Token 数，检查空回复、重复数据等质量问题。

```
总样本数: 2340
数据格式: instruction-output
P95 Token 估算: 149  →  建议 max_seq_length ≥ 149
```

### ⚙️ 超参数推荐

根据你的数据量、模型大小、任务类型、可用显存，智能推荐 Rank、Alpha、学习率、Epochs、Batch Size 等全部超参数。

比如 2340 条对话数据 + Qwen2-7B + 24GB 显存：

| 参数 | 推荐值 | 理由 |
|------|--------|------|
| Rank (r) | 8 | 中等数据集，r=8 平衡学习与泛化 |
| 学习率 | 2e-4 | 标准 rank，标准学习率 |
| Epochs | 3 | 中等数据集，3 轮 |

内置 40+ 模型的规格数据库，覆盖 Qwen2、LLaMA 3、Mistral、DeepSeek、ChatGLM 等 12 个系列。

### 💾 显存估算

选好模型和参数，精确估算训练需要的 GPU 显存——模型权重、激活值、优化器状态、额外开销，每一项都算得清清楚楚。

```
QLoRA 4-bit · qwen2-7b · seq=2048 · bs=4 · r=8

预估总显存: 4.63 GB — ✅ 轻松运行
```

### 🚀 一键生成脚本

确认参数后，一键生成完整的训练脚本（QLoRA + Flash Attention 2 + NEFTune），外加推理脚本和评估脚本，打包下载 ZIP。

生成的是可直接运行的 Python 代码，修改两行路径就能开始训练：

```python
MODEL_NAME = "Qwen/Qwen2-7B"   # 改成你的模型路径
DATA_PATH = "./my_data.jsonl"   # 改成你的数据路径
```

## 技术栈

整个项目包含三个形态：

- **CLI 工具** — `pip install lora-trainer`，命令行直接用
- **Claude Code 插件** — 在 Claude Code 里输入 `/lora:cook` 即可触发
- **Web 界面** — 纯前端页面，浏览器打开就能用

核心推荐算法基于 LoRA 论文和社区实践经验，所有计算逻辑（Token 估算、显存计算、参数推荐）全部开源，不依赖任何外部 API。

## 快速开始

**命令行：**

```bash
pip install lora-trainer
lora-trainer cook --data my_data.jsonl --model qwen2-7b --task chat
```

**Web 在线使用：**

不需要安装任何东西，打开浏览器上传数据就能用。

**Claude Code：**

```bash
npx skills add LuVisage/lora-skills
# 然后在对话中输入 /lora:cook
```

## 链接

| 渠道 | 地址 |
|------|------|
| 🛠️ **GitHub** | [github.com/LuVisage/lora-skills](https://github.com/LuVisage/lora-skills) |
| 🇨🇳 **SkillHub** | [skillhub.cn/skills/lora-trainer](https://skillhub.cn/skills/lora-trainer) |
| 🤗 **Hugging Face** | [hf.co/spaces/lushanzhenmian/lora-trainer](https://huggingface.co/spaces/lushanzhenmian/lora-trainer) |

## 后续计划

- 支持更多模型系列（Gemma 3、LLaMA 4 等）
- 训练监控面板（实时 Loss 曲线、Gradient Norm）
- 多 GPU 配置支持（DDP / DeepSpeed）
- 一键导出 Ollama / vLLM 格式

## 关于我

一名专注于 AI 应用开发的工程师。这个工具最初是我自己在做 LoRA 微调时的内部脚本，每次都要手动调参、写脚本实在太烦了，于是把它做成了一个完整的工具。

"不要让参数配置成为微调的门槛。"

欢迎在 GitHub 上提 Issue 或 PR，也欢迎在评论区交流微调心得！
