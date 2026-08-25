---
title: 密码学讲座：数论基础与密码学总论
date: '2026-08-26 02:00:00'
tags:
- crypto
- 数论
mood: ''
cover: https://www.jiamisoft.com/blog/wp-content/uploads/2018/10/23822-1.jpg
description: 涵盖数论基础定理、对称加密、RSA 公钥加密与 DSA 数字签名四大部分。
---

## 一、现代密码学数学基础

### 1.1 素数相关定理（算术基本定理）

任一整数 $a\ (a>0)$ 都能唯一分解成以下形式：

$$

a = p\_1 \cdot p\_2 \cdot p\_3 \cdot \cdots \cdot p\_t

$$

其中 $p\_1, p\_2, p\_3, \dots, p\_t$ 是素数。

### 1.2 最大公约数（gcd）

**定义**：最大公约数是指能够整除多个整数的最大正整数。

**gcd 相关定理（裴蜀定理 / Bézout's Identity）**：

设 $a, b \in \mathbb{Z}$，且 $a, b$ 中至少有一个不等于 $0$，令 $d = \gcd(a, b)$，则存在整数 $x, y$ 使得：

$$

a \times x + b \times y = d

$$

特别地，当 $a, b$ 互素时（即 $\gcd(a, b) = 1$），则存在整数 $x, y$ 使得：

$$

a \times x + b \times y = 1

$$

### 1.3 扩展欧几里得算法求解裴蜀定理（示例）

以求解 $15x + 21y = \gcd(15, 21)$ 为例。

#### 步骤 1：通过欧几里得算法求 gcd

核心逻辑：用较大数除以较小数，替换为"除数"与"余数"的组合，直到余数为 0，此时的除数即为 GCD。

- 第 1 步：$21 = 15 \times 1 + 6$（余数 $r\_1 = 6 \neq 0$，继续）

- 第 2 步：$15 = 6 \times 2 + 3$（余数 $r\_2 = 3 \neq 0$，继续）

- 第 3 步：$6 = 3 \times 2 + 0$（余数 $r\_3 = 0$，停止）

此时除数为 $3$，因此 $\gcd(15, 21) = 3$，目标转化为求 $15x + 21y = 3$ 的一组整数解。

#### 步骤 2：反向回溯推导线性组合

核心逻辑：从"余数非 0 的最后一步"开始，将 GCD 逐步表示为前一步中"除数"和"被除数"的线性组合，最终还原为原始的 15 和 21 的组合。

**第一步：从余数非 0 的最后一步切入**

欧几里得算法中最后一个非 0 余数是 3，对应第 2 步的等式：$15 = 6 \times 2 + 3$

将等式变形，把 3 单独放在左边：

$$

3 = 15 - 6 \times 2 \quad \text{(式 1)}

$$

**第二步：替换式中的"余数 (6)"**

观察式 1 中的 6，它是第 1 步的余数，对应第 1 步的等式：$21 = 15 \times 1 + 6$

同样变形，用 21 和 15 表示 6：

$$

6 = 21 - 15 \times 1 \quad \text{(式 2)}

$$

将式 2 代入式 1，替换掉"6"：

$$

3 = 15 - (21 - 15 \times 1) \times 2

$$

**第三步：整理合并，还原为 15 和 21 的线性组合**

$$

\begin{aligned}

3 &= 15 - (21 \times 2 - 15 \times 2) \\

&= 15 - 21 \times 2 + 15 \times 2 \\

&= 15 \times (1 + 2) + 21 \times (-2) \\

&= 15 \times 3 + 21 \times (-2)

\end{aligned}

$$

**第四步：对比目标，确定 x, y**

目标等式为 $15x + 21y = 3$，与上式对比可得：

$$

x = 3, \quad y = -2

$$

### 1.4 同余相关的性质

1. $m \mid (a - b) \iff a \equiv b \pmod{m}$

2. $a \equiv b \pmod{m},\ c \equiv d \pmod{m} \implies a \pm c \equiv b \pm d \pmod{m}$

3. $a \equiv b \pmod{m},\ c \equiv d \pmod{m} \implies a \cdot c \equiv b \cdot d \pmod{m}$

4. $a \equiv b \pmod{m} \implies a \cdot c \equiv b \cdot c \pmod{m}$

5. $a \cdot c \equiv b \cdot c \pmod{m},\ \gcd(c, m) = 1 \implies a \equiv b \pmod{m}$

6. $a \equiv b \pmod{m},\ n \in \mathbb{N} \implies a^n \equiv b^n \pmod{m}$

### 1.5 逆元相关的性质

#### 加法模逆元

**定义**：设 $a, b, n \in \mathbb{Z}$ 且 $n \neq 0$，若 $a + b \equiv 0 \pmod{n}$，则称 $a$ 是 $b$ 的加法模 $n$ 逆元，$b$ 也是 $a$ 的加法模 $n$ 逆元。

#### 乘法模逆元

**定义**：设 $a, b, n \in \mathbb{Z}$ 且 $a \times b \equiv 1 \pmod{n}$，则称 $a$ 是 $b$ 的乘法模 $n$ 逆元，记作 $b^{-1}$（即 $a \equiv b^{-1} \pmod{n}$）。

## 二、三大数论定理

### 2.1 费马小定理（Fermat's Little Theorem）

#### 定义

若 $p$ 是一个素数，且整数 $a$ 不是 $p$ 的倍数（$\gcd(a, p) = 1$），则：

$$

a^{p-1} \equiv 1 \pmod{p}

$$

或者，对于任意整数 $a$ 和素数 $p$，都有：

$$

a^p \equiv a \pmod{p}

$$

#### 证明一：圆盘染色（组合证明）

考虑 $p$ 个圆盘围成一圈，每个圆盘有 $a$ 种颜色可选。

- 总染色方案数为 $a^p$。

- 其中\*\*单色染色\*\*（所有圆盘同色）有 $a$ 种。

- **至少两种颜色**的染色方案有 $a^p - a$ 种。

对于至少两种颜色的染色，由于 $p$ 是素数，将圆盘循环旋转后，每种染色方案恰好对应 $p$ 个不同的旋转（"同款"），因此这些方案可以按 $p$ 个一组划分。

故 $p \mid (a^p - a)$，即 $a^p \equiv a \pmod{p}$。

#### 证明二：群论方法（以 p=7 为例）

设 $p$ 是素数，$a$ 与 $p$ 互素。

考虑集合 $\{1, 2, 3, 4, 5, 6\}$（即模 7 的非零剩余类），将每个元素乘以 $a$：

$$

a, 2a, 3a, 4a, 5a, 6a

$$

**证明这些数模 7 后仍是 $\{1, 2, 3, 4, 5, 6\}$ 的一个排列**：

假设存在 $i \neq j$ 使得 $ia \equiv ja \pmod{7}$，则 $(i-j)a \equiv 0 \pmod{7}$。由于 $\gcd(a, 7) = 1$，故 $i-j \equiv 0 \pmod{7}$，即 $i = j$，矛盾。

因此 $\{a, 2a, \dots, 6a\}$ 模 7 后构成 $\{1, 2, \dots, 6\}$ 的完全剩余系。

将两组数分别相乘：

$$

(1 \cdot 2 \cdot 3 \cdot 4 \cdot 5 \cdot 6) \cdot a^6 \equiv (1 \cdot 2 \cdot 3 \cdot 4 \cdot 5 \cdot 6) \pmod{7}

$$

两边约去 $1 \cdot 2 \cdot \cdots \cdot 6$（与 7 互素），得：

$$

a^6 \equiv 1 \pmod{7}

$$

推广到一般素数 $p$，即 $a^{p-1} \equiv 1 \pmod{p}$，进而 $a^p \equiv a \pmod{p}$。

### 2.2 欧拉定理与欧拉函数

#### 欧拉函数（Euler's Function）

**定义**：小于等于 $n$ 的正整数中与 $n$ 互素（$\gcd(x, n) = 1$）的数的个数，记作 $\varphi(n)$。

**公式**：

$$

\varphi(n) = n \prod\_{p \mid n} \left(1 - \frac{1}{p}\right)

$$

其中 $p$ 取遍 $n$ 的所有不同素因子。

**性质**：

- 若 $p$ 为素数，则 $\varphi(p) = p - 1$

- 若 $p$ 为素数，则 $\varphi(p^k) = p^k - p^{k-1}$

- 若 $\gcd(a, b) = 1$，则 $\varphi(ab) = \varphi(a) \cdot \varphi(b)$（积性）

#### 欧拉定理（Euler's Theorem）

**定义**：费马小定理的推广，将适用范围从素数模 $p$ 扩展到了任意正整数模 $n$。

若整数 $a$ 与正整数 $n$ 互素（即 $\gcd(a, n) = 1$），则有：

$$

a^{\varphi(n)} \equiv 1 \pmod{n}

$$

#### 欧拉函数积性证明

证明 $\varphi(mn) = \varphi(m)\varphi(n)$，其中 $\gcd(m,n)=1$。

**第 1 步：按余数对 $[1, mn]$ 分类**

将区间 $[1, mn]$ 中的数，按除以 $m$ 的余数分为 $m$ 类，每类包含 $n$ 个数：

- 余数为 0：$m, 2m, 3m, \dots, nm$

- 余数为 1：$1, m+1, 2m+1, \dots, (n-1)m+1$

- 余数为 2：$2, m+2, 2m+2, \dots, (n-1)m+2$

- ...

- 余数为 $k\ (1 \le k \le m-1)$：$k, m+k, 2m+k, \dots, (n-1)m+k$

**第 2 步：筛选与 m 互质的余数类**

对任意一个余数类（余数为 $k$），类中任意数可表示为 $x = tm + k\ (t = 0, 1, \dots, n-1)$。

根据互质性质：$\gcd(tm + k, m) = \gcd(k, m)$（辗转相除法的推论）。

因此，只有当 $\gcd(k, m) = 1$ 时，该类中所有数才与 $m$ 互质。

满足 $\gcd(k, m) = 1$ 的 $k$ 共有 $\varphi(m)$ 个，因此共有 $\varphi(m)$ 个"与 $m$ 互质的余数类"。

**第 3 步：统计单个合格类中与 n 互质的数**

取任意一个"与 $m$ 互质的余数类"（余数为 $k$，$\gcd(k, m) = 1$），类中数为 $k, m+k, 2m+k, \dots, (n-1)m+k$，共 $n$ 个。

**证明这些数除以 $n$ 的余数互不相同（构成模 $n$ 的完全剩余系）**：

假设存在 $t\_1 \neq t\_2\ (0 \le t\_1, t\_2 \le n-1)$，使得 $t\_1m + k \equiv t\_2m + k \pmod{n}$。

化简得 $(t\_1 - t\_2)m \equiv 0 \pmod{n}$。因 $\gcd(m, n) = 1$，故 $t\_1 - t\_2 \equiv 0 \pmod{n}$，即 $t\_1 = t\_2$，矛盾。

因此该类数是模 $n$ 的完全剩余系，其中与 $n$ 互质的数共有 $\varphi(n)$ 个。

**第 4 步：总计数与结论**

- 共有 $\varphi(m)$ 个"与 $m$ 互质的余数类"，每个类中与 $n$ 互质的数有 $\varphi(n)$ 个。

- 因 $\gcd(m, n) = 1$，$\gcd(x, mn) = 1$ 等价于 $\gcd(x, m) = 1$ 且 $\gcd(x, n) = 1$。

因此，区间 $[1, mn]$ 中与 $mn$ 互质的数的总数为 $\varphi(m) \times \varphi(n)$，即：

$$

\varphi(mn) = \varphi(m) \cdot \varphi(n)

$$

### 2.3 中国剩余定理（Chinese Remainder Theorem, CRT）

#### 定义与内容

关于一元线性同余方程组有解以及解的计算。

假设整数 $m\_1, m\_2, \dots, m\_r$ 两两互素，则对于任意整数 $a\_1, a\_2, \dots, a\_r$，以下同余方程组有唯一解：

$$

\begin{cases}

x \equiv a\_1 \pmod{m\_1} \\

x \equiv a\_2 \pmod{m\_2} \\

\quad \vdots \\

x \equiv a\_r \pmod{m\_r}

\end{cases}

$$

#### 求解公式

令：

$$

M = \prod\_{i=1}^{r} m\_i = m\_1 m\_2 \cdots m\_r

$$

$$

M\_i = \frac{M}{m\_i}

$$

令 $M\_i^{-1}$ 为 $M\_i$ 模 $m\_i$ 的乘法逆元（即 $M\_i \cdot M\_i^{-1} \equiv 1 \pmod{m\_i}$）。

方程组在模 $M$ 下的唯一解为：

$$

x \equiv \sum\_{i=1}^{r} a\_i M\_i M\_i^{-1} \pmod{M}

$$

#### 例题：除五剩二，除四剩三，除三剩零

即求解：

$$

\begin{cases}

a \equiv 2 \pmod{5} \\

a \equiv 3 \pmod{4} \\

a \equiv 0 \pmod{3}

\end{cases}

$$

**步骤**：

1. $M = 5 \times 4 \times 3 = 60$

2. $M\_1 = 60/5 = 12$，求 $12$ 模 $5$ 的逆元：$12 \equiv 2 \pmod{5}$，$2 \times 3 = 6 \equiv 1 \pmod{5}$，故 $M\_1^{-1} = 3$，对应项 $36 \times 2$

3. $M\_2 = 60/4 = 15$，求 $15$ 模 $4$ 的逆元：$15 \equiv 3 \pmod{4}$，$3 \times 3 = 9 \equiv 1 \pmod{4}$，故 $M\_2^{-1} = 3$，对应项 $45 \times 3$

4. $M\_3 = 60/3 = 20$，求 $20$ 模 $3$ 的逆元：$20 \equiv 2 \pmod{3}$，$2 \times 2 = 4 \equiv 1 \pmod{3}$，故 $M\_3^{-1} = 2$，对应项 $40 \times 0$

$$

\begin{aligned}

a &= 36 \times 2 + 45 \times 3 + 40 \times 0 \\

&= 72 + 135 + 0 \\

&= 207

\end{aligned}

$$

$$

\begin{aligned}

207 &\equiv 207 - 3 \times 60 \\

&= 207 - 180 \\

&= 27 \pmod{60}

\end{aligned}

$$

**验证**：

- $27 \mod 5 = 2$ ✓

- $27 \mod 4 = 3$ ✓

- $27 \mod 3 = 0$ ✓

故最小正整数解为 $a = 27$，通解为 $a = 27 + 60k\ (k \in \mathbb{Z})$。

## 三、对称加密

### 3.1 流密码（Stream Cipher）

流密码可以分成以下流程：

- **密钥派生**：使用伪随机生成器（PRG）由密钥生成长密钥流

- **流式处理**：将密钥流和明文流进行处理（譬如异或）

**PRG 具备如下特征**：

- 长周期

- 高线性复杂度，不易被数学推导来预测（LCG 是反例）

- 统计性能良好，不易被统计预测信息

- 足够的"混乱"、"扩散"，是其"随机性"的体现

**流密码具备如下特征**：

- 明文长度无明确要求

- 加密解密的操作是对称的，关键在于恢复密钥流

### 3.2 伪随机数生成器（PRNG）

本节课的 PRNG 特指使用不安全的 `random` 库函数引入的随机数。

- 这类 `random` 随机数的原理是\*\*梅森旋转（MT19937）\*\*

- 连续获取 $624 \times 32 = 19,\!968$ 字节的连续随机生成数据即可恢复随机数生成器状态

**攻击示例（Python / randcrack）**：

```python

import random

from randcrack import RandCrack

rc = RandCrack()

for i in range(624):

rc.submit(random.getrandbits(64)) # 提交 624 个 64 位数

print(random.getrandbits(64)) # 利用 random 库获取一个 64 位的随机数

print(rc.predict\_getrandbits(64)) # 利用 randcrack 预测的随机数

```

### 3.3 线性同余生成器（LCG）

递推生成式：

$$

X\_{n+1} \equiv aX\_n + c \pmod{n}

$$

其具备很强的线性相关性，故容易被数学推导来破解，往往只需要几组连续的输出 $X\_i$ 即可。

### 3.4 反馈移位寄存器（FSR）

结构：由 $n$ 个寄存器 $a\_{n-1}, a\_{n-2}, \dots, a\_0$ 组成，输出序列 $\underline{a} = a\_0 a\_1 a\_2 \cdots$，反馈函数为 $F(x\_1, x\_2, \dots, x\_n)$。

- 新生成的信息与当前的状态相关

- 即：

$$

a\_n = F(a\_0, a\_1, a\_2, \dots, a\_{n-2}, a\_{n-1})

$$

### 3.5 线性反馈移位寄存器（LFSR）

$F$ 是线性函数，即：

$$

a\_n = \sum\_{i=0}^{n-1} c\_i a\_i

$$

可以考虑使用 **Berlekamp-Massey 算法**来破解 LFSR，需要连续 $2n$ 组输出，即：

$$

\begin{cases}

S\_1 = (a\_1, \dots, a\_n) \\

\quad \vdots \\

S\_n = (a\_n, \dots, a\_{2n})

\end{cases}

$$

即可构造出一个满秩方程组求解系数 $c\_i$。

## 四、RSA 公钥加密

### 4.1 密钥生成

Alice 执行以下步骤：

1. 选取两个大素数 $p, q$，计算它们的积 $n = p \times q$

2. 选取一个数 $e$，一般保证它是一个素数，常用 $65537$

3. 计算 $n$ 的欧拉函数 $\varphi(n) = (p-1) \times (q-1)$

4. 计算 $e$ 对 $\varphi$ 的模逆元 $d$，即：

$$

ed \equiv 1 \pmod{\varphi}

$$

### 4.2 加密过程

选取要加密的信息 $m$，保证 $m \le n$，计算：

$$

c \equiv m^e \pmod{n}

$$

加密完成：

- **公钥**为 $(e, n)$

- **私钥**为 $(d, n)$

- **密文**为 $c$

Alice 只需提前将私钥给 Bob 保密即可，公钥与密文可以公开给网络。

### 4.3 解密过程

Bob 对于已有的密文 $c$，计算：

$$

c^d \equiv m \pmod{n}

$$

即可恢复明文。

### 4.4 正确性证明

由 $ed \equiv 1 \pmod{\varphi}$，可得：

$$

ed = 1 + k\varphi

$$

那么：

$$

\begin{aligned}

c^d &\equiv m^{ed} \\

&\equiv m^{1+k\varphi} \\

&\equiv m \times (m^\varphi)^k \pmod{n}

\end{aligned}

$$

由欧拉定理，因为 $n$ 是两个大素数的积，故 $\gcd(m, n) = 1$，那么：

$$

m^\varphi \equiv 1 \pmod{n}

$$

所以：

$$

\begin{aligned}

m^{ed} &\equiv m \times (m^\varphi)^k \\

&\equiv m \pmod{n}

\end{aligned}

$$

证毕。

### 4.5 安全性分析

攻击者 $X$ 只有公钥 $(e, n)$，它的目标是从：

$$

c \equiv m^e \pmod{n}

$$

中恢复出 $m$。如果他想避免在模 $n$ 域下对 $c$ 开 $e$ 次方根，就得计算欧拉函数 $\varphi(n)$。

但是由于 $n$ 分解的困难性，他无法计算 $\varphi(n)$，也就保证了 RSA 系统的安全性。

### 4.6 常见漏洞

#### 分解 n 相关漏洞

常见的有如下类别：

- **$p, q$ 信息泄露**

- $p$ 高低位泄露，或者相关运算代数式泄露

- **两对公钥 $n\_1, n\_2$ 不互素**

- 用不同的公钥进行加密，但选取不当导致能直接通过 $\gcd$ 分解 $n$

- **$p-1, p+1$ 光滑**

- 可能会被 Pollard's p-1 或者 Williams's p+1 算法分解

**关于"光滑数"的补充说明**：

在数论中，一个数被称为"光滑的"，如果它的所有素因子都小于某个给定的界限。这个概念在分解大整数时尤为重要，因为某些分解算法在处理具有特定素因子结构的大整数时特别有效。

例如，Pollard's p-1 算法和 Williams's p+1 算法就是利用这种光滑性来分解大整数的。假设我们有一个大整数 $n$，它可以被分解为两个素数 $p$ 和 $q$ 的乘积。如果 $p-1$ 是光滑的，即 $p-1$ 的所有素因子都很小，那么就可以使用 Pollard's p-1 算法来尝试分解 $n$。类似地，如果 $p+1$ 是光滑的，那么可以使用 Williams's p+1 算法。

这些算法通过利用 $p-1$ 或 $p+1$ 的光滑性，可以有效地找到 $n$ 的因子，从而分解 $n$。这是因为这些算法通过数学运算（如幂运算和欧几里得算法）来探测 $n$ 的因子，而这些运算在处理光滑数时效率更高。

**举例**：假设我们要分解 $n = 3233$。通过试除法，我们知道 $n$ 可以被 17 整除，因此 $n = 17 \times 191$。现在我们检查 $17-1=16$ 是否光滑。16 的素因子是 2，这意味着 16 是光滑的。因此，我们可以尝试使用 Pollard's p-1 算法来分解。

总之，当面对大整数分解问题时，检查 $p-1$ 或 $p+1$ 是否光滑可以为选择有效的分解算法提供重要线索。

#### 私钥 d 泄露相关漏洞

常见的有如下类别：

- **$d\_p, d\_q$ 信息泄露**

- 可以通过构造同余方程用 CRT 来解出私钥 $d$ 进而解密

- **$d$ 过小**

- 当 $d < \frac{1}{3} N^{\frac{1}{4}}$ 的时候，可以通过对 $\frac{e}{N}$ 连分数展开来求出 $d$（\*\*Wiener's Attack\*\*）

#### 低加密指数相关攻击公式

在特定攻击场景下（如低加密指数 $e=3$ 的相关攻击），很可能有：

$$

n = \gcd(c\_2 - c\_1^2,\ c\_3 - c\_1^3)

$$

## 五、DSA 数字签名算法

### 5.1 概述

与 RSA 有些许差异，DSA 更多的是用于信息的签名，即说明这段明文是可信的，你能用已有的公钥与签名来验证。

譬如交通中的车辆距离、在线支付的金额信息，对它们加密不是那么重要，关键在于防止它们被攻击者篡改。

DSA 就是 ElGamal 签名算法的一个常用变种。

### 5.2 参数信息

- **公钥**：$(p, q, g, y)$

- **私钥**：$x$

其中 $y \equiv g^x \pmod{q}$。

### 5.3 签名过程

Alice 对明文 $m$ 进行签名：

1. 随机生成一个密钥 $k \in (0, q)$

2. 计算 $r \equiv (g^k \bmod p) \bmod q$

3. 计算 $s \equiv (H(m) + xr)k^{-1} \pmod{q}$

Alice 对明文 $m$ 的签名结果是 $(r, s)$，她将把 $m, (r, s)$ 发给 Bob，私钥 $x$ 自己留着。

### 5.4 验签过程

核心思路就是保证这里的 $m$ 与 $H(m)$ 能够对上，而且能够排除随机选择的 $k$ 的干扰。我们尝试去消去 $k$。

**由 $s$ 计算式，不难得到**：

$$

k \equiv (H(m) + xr)s^{-1} \pmod{q} \tag{1}

$$

假设我们是 Bob，我们手头有 $m, (r, s), (p, q, g, y)$，通过 (1) 式我们已经算出了可能的 $k$，下一步如果这个 $k$ 的确是签名时候生成的 $k$，那它就得满足：

$$

r \equiv (g^k \bmod p) \bmod q \tag{2}

$$

很自然的，把 (1) 代入 (2)，算出来的 $r\_0$ 和 $r$ 如果一致，那就说明参数都没受到影响，明文也就是可信的了。

接下来分析 Bob 如何通过手头已有的数据计算，确实能得到 $r$：

即求：

$$

\left(g^{(H(m)+xr)s^{-1}} \bmod p\right) \bmod q

$$

分开一下，即求：

$$

\left(g^{(H(m))s^{-1}} \times g^{xrs^{-1}} \bmod p\right) \bmod q

$$

其中 $g^{(H(m))s^{-1}}$ 中参数都是 Bob 已知的，很好计算。而 Bob 并不知道 $x$，如何计算 $g^{xrs^{-1}}$ 呢？

注意到有 $y \equiv g^x \pmod{q}$，那么：

$$

g^{xrs^{-1}} \equiv (g^x)^{rs^{-1}} \equiv y^{rs^{-1}}

$$

我们只需提前计算好：

$$

u\_1 \equiv g^{(H(m))s^{-1}} \pmod{q}

$$

$$

u\_2 \equiv y^{rs^{-1}} \pmod{q}

$$

然后比对是否有：

$$

r \equiv (u\_1 \times u\_2 \bmod p) \bmod q

$$

若等式成立，则签名验证通过，明文可信。

  
‍  
‍