---
title: VGG16 PyTorch 复现：CIFAR-10 分类
date: '2026-08-28 13:38:00'
tags:
- 科研
- 深度学习
mood: ''
cover: https://img.cdn1.vip/i/6a91244f3bd84_1787896911.webp
description: 使用 PyTorch 从零搭建 VGG16，并在 CIFAR-10 上完成完整的训练与测试流程。
---

本文使用 PyTorch 从零搭建 VGG16，并在 CIFAR-10 上跑通完整的 CNN 训练流程。

整体过程：

```text
读取数据
→ VGG16 前向传播
→ 计算 Loss
→ 反向传播
→ 更新参数
→ 测试准确率
```

## 一、完整代码

```python
import time

import torch
import torch.nn as nn
import torch.optim as optim
import torchvision
import torchvision.transforms as transforms

from torch.utils.data import DataLoader
import matplotlib.pyplot as plt


BATCH_SIZE = 64          # 每个 batch 的图片数量
LEARNING_RATE = 0.001    # 学习率
NUM_EPOCHS = 10          # 完整训练集学习次数


device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)  # 自动选择 GPU 或 CPU

print("使用设备：", device)


transform = transforms.Compose([
    transforms.ToTensor(),  # 图片转为 Tensor，像素值变为 0~1
    transforms.Normalize(
        (0.485, 0.456, 0.406),
        (0.229, 0.224, 0.225)
    )  # 标准化 RGB 三个通道
])


train_dataset = torchvision.datasets.CIFAR10(
    root="./data",
    train=True,
    download=True,
    transform=transform
)  # 训练集

test_dataset = torchvision.datasets.CIFAR10(
    root="./data",
    train=False,
    download=True,
    transform=transform
)  # 测试集


train_loader = DataLoader(
    train_dataset,
    batch_size=BATCH_SIZE,
    shuffle=True
)  # 训练时打乱数据顺序

test_loader = DataLoader(
    test_dataset,
    batch_size=BATCH_SIZE,
    shuffle=False
)  # 测试时不需要打乱


VGG16_CONFIG = [
    64, 64, "M",
    128, 128, "M",
    256, 256, 256, "M",
    512, 512, 512, "M",
    512, 512, 512, "M"
]  # 数字表示卷积输出通道数，"M" 表示最大池化层


class VGG16(nn.Module):
    """VGG16：卷积部分负责提取特征，全连接部分负责分类。"""

    def __init__(self, num_classes=10):
        super().__init__()

        self.features = self._make_layers(VGG16_CONFIG)

        self.classifier = nn.Sequential(
            nn.Linear(512, 512),
            nn.ReLU(inplace=True),
            nn.Dropout(0.5),

            nn.Linear(512, 512),
            nn.ReLU(inplace=True),
            nn.Dropout(0.5),

            nn.Linear(512, num_classes)
        )

    def _make_layers(self, config):
        """根据 VGG16_CONFIG 自动生成 Conv、ReLU 和 MaxPool。"""

        layers = []
        in_channels = 3  # RGB 图片有 3 个输入通道

        for value in config:

            if value == "M":
                layers.append(
                    nn.MaxPool2d(
                        kernel_size=2,
                        stride=2
                    )
                )  # 最大池化

            else:
                layers.append(
                    nn.Conv2d(
                        in_channels,
                        value,
                        kernel_size=3,
                        padding=1
                    )
                )  # 3×3 卷积

                layers.append(
                    nn.ReLU(inplace=True)
                )  # 加入非线性

                in_channels = value  # 当前输出通道 = 下一层输入通道

        return nn.Sequential(*layers)

    def forward(self, x):
        """定义一次前向传播的数据流。"""

        x = self.features(x)                  # 卷积网络提取特征
        x = torch.flatten(x, start_dim=1)    # 展平成一维特征向量
        x = self.classifier(x)               # 全连接层完成分类

        return x


model = VGG16(num_classes=10).to(device)  # 创建模型并移动到 GPU / CPU


criterion = nn.CrossEntropyLoss()  # 多分类交叉熵损失函数

optimizer = optim.Adam(
    model.parameters(),
    lr=LEARNING_RATE
)  # Adam 根据梯度更新模型参数


def evaluate_model(model, data_loader):
    """在测试集上计算平均 Loss 和准确率。"""

    model.eval()  # 切换到评估模式

    loss_sum = 0.0
    correct = 0
    total = 0

    with torch.inference_mode():  # 测试时不需要计算梯度

        for inputs, labels in data_loader:

            inputs = inputs.to(device)
            labels = labels.to(device)

            outputs = model(inputs)               # 前向传播
            loss = criterion(outputs, labels)     # 计算损失

            loss_sum += loss.item() * labels.size(0)

            predicted = outputs.argmax(dim=1)     # 取得分最高的类别

            correct += (
                predicted == labels
            ).sum().item()

            total += labels.size(0)

    avg_loss = loss_sum / total
    accuracy = 100.0 * correct / total

    return avg_loss, accuracy


history = {
    "loss": [],
    "accuracy": [],
    "val_loss": [],
    "val_accuracy": []
}  # 保存每个 epoch 的训练和测试结果


for epoch in range(NUM_EPOCHS):

    model.train()  # 每个 epoch 开始前重新切回训练模式

    start_time = time.time()

    loss_sum = 0.0
    correct = 0
    total = 0

    for inputs, labels in train_loader:

        inputs = inputs.to(device)
        labels = labels.to(device)

        optimizer.zero_grad()                 # 1. 清空旧梯度
        outputs = model(inputs)               # 2. 前向传播
        loss = criterion(outputs, labels)     # 3. 计算损失
        loss.backward()                       # 4. 反向传播计算梯度
        optimizer.step()                      # 5. 根据梯度更新参数

        loss_sum += loss.item() * labels.size(0)

        predicted = outputs.argmax(dim=1)

        correct += (
            predicted == labels
        ).sum().item()

        total += labels.size(0)

    train_loss = loss_sum / total
    train_accuracy = 100.0 * correct / total

    val_loss, val_accuracy = evaluate_model(
        model,
        test_loader
    )  # 每个 epoch 结束后在测试集上评估

    history["loss"].append(train_loss)
    history["accuracy"].append(train_accuracy)
    history["val_loss"].append(val_loss)
    history["val_accuracy"].append(val_accuracy)

    print(
        f"Epoch [{epoch + 1}/{NUM_EPOCHS}] | "
        f"{time.time() - start_time:.2f}s | "
        f"Train Loss: {train_loss:.4f} | "
        f"Train Acc: {train_accuracy:.2f}% | "
        f"Test Loss: {val_loss:.4f} | "
        f"Test Acc: {val_accuracy:.2f}%"
    )


plt.figure(figsize=(12, 5))  # 绘制训练与测试曲线

plt.subplot(1, 2, 1)
plt.plot(history["accuracy"], label="Train")
plt.plot(history["val_accuracy"], label="Test")
plt.xlabel("Epoch")
plt.ylabel("Accuracy (%)")
plt.title("Accuracy")
plt.legend()

plt.subplot(1, 2, 2)
plt.plot(history["loss"], label="Train")
plt.plot(history["val_loss"], label="Test")
plt.xlabel("Epoch")
plt.ylabel("Loss")
plt.title("Loss")
plt.legend()

plt.tight_layout()
plt.show()
```

## 二、代码整体结构

整份代码可以分成五部分：

```text
Dataset / DataLoader
        ↓
VGG16 网络
        ↓
Loss + Optimizer
        ↓
训练
        ↓
测试
```

`Dataset` 保存数据集，`DataLoader` 负责按 batch 将图片送入模型。

## 三、VGG16 网络

核心配置：

```python
VGG16_CONFIG = [
    64, 64, "M",
    128, 128, "M",
    256, 256, 256, "M",
    512, 512, 512, "M",
    512, 512, 512, "M"
]
```

其中：

```text
数字：卷积层输出通道数
"M"：MaxPool 最大池化层
```

每一组对应的网络结构为：

```text
第 1 组：
Conv 3→64
ReLU
Conv 64→64
ReLU
MaxPool

第 2 组：
Conv 64→128
ReLU
Conv 128→128
ReLU
MaxPool

第 3 组：
Conv 128→256
ReLU
Conv 256→256
ReLU
Conv 256→256
ReLU
MaxPool

第 4 组：
Conv 256→512
ReLU
Conv 512→512
ReLU
Conv 512→512
ReLU
MaxPool

第 5 组：
Conv 512→512
ReLU
Conv 512→512
ReLU
Conv 512→512
ReLU
MaxPool
```

这里的：

```python
nn.Conv2d(
    in_channels,
    value,
    kernel_size=3,
    padding=1
)
```

表示创建一个卷积层。

例如：

```python
nn.Conv2d(3, 64, kernel_size=3, padding=1)
```

表示：

```text
输入通道数：3
输出通道数：64
卷积核大小：3×3
padding：1
```

也就是输入一张 RGB 图片后，生成 64 张不同的特征图。

`ReLU`：

```python
nn.ReLU(inplace=True)
```

负责加入非线性。

`MaxPool`：

```python
nn.MaxPool2d(
    kernel_size=2,
    stride=2
)
```

负责压缩特征图，并保留局部区域中较明显的特征。

VGG16 一共有：

```text
13 个卷积层
+
3 个全连接层
=
16 个有参数的层
```

因此称为 VGG16。

## 四、_make_layers() 在做什么

```python
def _make_layers(self, config):
```

这个函数的作用就是：

> 根据 `VGG16_CONFIG` 自动创建整个卷积网络。

核心逻辑：

```python
for value in config:
```

逐个读取配置。

如果读取到：

```python
"M"
```

就创建：

```python
nn.MaxPool2d(...)
```

如果读取到：

```python
64
128
256
512
```

就创建：

```python
Conv2d
+
ReLU
```

并通过：

```python
in_channels = value
```

让当前卷积层的输出通道数成为下一层的输入通道数。

例如：

```text
Conv 3→64
```

结束以后：

```python
in_channels = 64
```

所以下一层就可以继续：

```text
Conv 64→64
```

## 五、forward() 在做什么

```python
def forward(self, x):

    x = self.features(x)

    x = torch.flatten(
        x,
        start_dim=1
    )

    x = self.classifier(x)

    return x
```

对应：

```text
图片
↓
卷积网络提取特征
↓
Flatten 展平
↓
全连接层分类
↓
10 个类别分数
```

`self.features(x)` 调用前面创建好的 VGG16 卷积部分。

`torch.flatten()` 将卷积得到的多维特征图展开成一维向量，方便送入全连接层。

`self.classifier(x)` 将特征综合起来，最终输出 10 个类别分数。

## 六、Loss 和优化器

损失函数：

```python
criterion = nn.CrossEntropyLoss()
```

`CrossEntropyLoss` 用于多分类任务。

训练时：

```python
loss = criterion(
    outputs,
    labels
)
```

就是比较：

```text
模型预测 outputs
和
真实答案 labels
```

得到当前预测误差 `loss`。

优化器：

```python
optimizer = optim.Adam(
    model.parameters(),
    lr=LEARNING_RATE
)
```

Adam 根据反向传播得到的梯度修改模型参数。

可以简单理解为：

```text
loss.backward()
→ 算出参数应该怎么改

optimizer.step()
→ 真正修改参数
```

## 七、训练最核心的五步

训练循环中真正需要重点掌握的是：

```python
optimizer.zero_grad()

outputs = model(inputs)

loss = criterion(outputs, labels)

loss.backward()

optimizer.step()
```

分别表示：

```text
1. 清空旧梯度
2. 前向传播
3. 计算 Loss
4. 反向传播计算梯度
5. 更新模型参数
```

这是 PyTorch 神经网络训练最核心的流程。

## 八、train() 和 eval()

训练开始时：

```python
model.train()
```

测试时：

```python
model.eval()
```

模型中存在：

```python
nn.Dropout(0.5)
```

Dropout 在训练时会随机关闭部分神经元，而测试时必须停止这种随机行为。

因此每个 epoch 开始前都要重新：

```python
model.train()
```

因为测试函数执行：

```python
model.eval()
```

之后，模型不会自动切回训练模式。

## 九、测试为什么不需要梯度

测试代码：

```python
with torch.inference_mode():
```

测试阶段只需要：

```text
输入
↓
前向传播
↓
得到预测
```

不需要执行反向传播，因此不需要保存梯度计算图，可以减少显存占用和计算量。

## 十、准确率怎么计算

```python
predicted = outputs.argmax(dim=1)
```

表示从模型输出的 10 个类别分数中，找到最大的那个作为预测结果。

然后：

```python
(predicted == labels).sum()
```

统计预测正确的图片数量。

准确率为：

$$
Accuracy
=
\frac{正确预测数量}{总样本数量}
\times 100\%
$$

## 十一、总结

VGG16 的前向过程：

```text
图片
↓
Conv 提取特征
↓
ReLU 加入非线性
↓
Pool 压缩特征
↓
Flatten
↓
全连接层
↓
输出 10 类分数
```

整个训练过程最核心的是：

```python
optimizer.zero_grad()
outputs = model(inputs)
loss = criterion(outputs, labels)
loss.backward()
optimizer.step()
```

理解 `VGG16_CONFIG → _make_layers() → forward()` 这一条模型构建流程，再理解 `forward → loss → backward → step` 这一条训练流程，就基本掌握了这份代码。
