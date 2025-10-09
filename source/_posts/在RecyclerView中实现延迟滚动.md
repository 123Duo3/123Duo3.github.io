---
title: 在 RecyclerView 中实现延迟滚动
cover: cover.png
date: 2024-05-06 08:27:57
collaborators:
    - AkaneTan
tags:
    - Android
    - 编程
    - 动画
categories:
    - 研究
---

在[上一篇](https://juejin.cn/post/7363932520952512512)中，我们了解了如何使用 LinearSmoothScroller 让 RecyclerView 实现更平滑的滚动。本篇我们更进一步，通过一些特殊的方法来实现更细腻的延迟滚动。

<!-- more -->

由于 RecyclerView 的限制，我们无法真正实现延迟滚动。但是，我们可以让元素在 ViewHolder 固定的大小范围之内上下移动，即操纵 translationY，来实现近似延迟滚动的效果。那么这个移动范围何时加、加多少，即是本篇所要着重讨论的内容了。

不过首先，我们先来看一下我们常用的滚动动画曲线⸺贝塞尔曲线。

## 1. 贝塞尔曲线简介

在 PathInterpolator 中，我们使用的是一种特殊的三次贝塞尔曲线。其中，**P**<sub>0</sub> 固定在点 (0, 0) ，**P**<sub>3</sub> 则固定在点 (1, 1) ，而 **P**<sub>1</sub> 与 **P**<sub>2</sub> 的坐标则就是 `PathInterpolator(controlX1, controlY1, controlX2, controlY2)` 中的四个参数。

我们也知道，贝塞尔曲线的方程为：

![Bézier(n,t) = \sum_{i=0}^n \binom{n}{i} \cdot \mathbf{P}_i \cdot (1-t)^{n-i} \cdot t^i, t \in [0,1]](formula_1.svg)

那么，在上述的情况下，贝塞尔曲线可以被简化为：

![\mathbf{B}(t) = 3t(1-t)^2\mathbf{P}_1 + 3t^2(1-t) \mathbf{P}_2+t^3, t \in [0,1]](formula_2.svg)
譬如，在 [Accord](https://github.com/FoedusProgramme/AccordLegacy/) 中，歌词滚动使用的曲线是 `PathInterpolator(0.4f, 0.2f, 0f, 1f)`，那么其方程为：

![\left\{\begin{array}{**lr**}x = 3t(1-t)^2\cdot 0.4 + t^3 \\y = 3t(1-t)^2\cdot 0.2 + 3t^2(1-t) + t^3\end{array}\right.& , t \in [0,1]](formula_3.svg)

其在 *t* ∈ [0, 1] 时的图像如下：

![曲线(0.4, 0.2, 0, 1)的图像.png](graph_1.svg)

## 2. 差值计算

由于原函数图像只在 *x* ∈ [0, 1]​ 中，我们定义： 

![\left\{ \begin{array}{**lr**} y = 0, & x \in (-\infin, 0) \\ y = 1, & x \in (1, +\infin) \end{array} \right.](formula_4.svg)

在页面滚动中，式 (3) 中的 *x* 为时间，*y* 为位移。延迟滚动即是在 *x* 上偏移，让时间错开。在 Accord 中，偏移的时间是总位移时长的 0.1 倍，即令 *x* = *x* + 0.1​，可得：

![\left\{ \begin{array}{**lr**} x = 3t(1-t)^2\cdot 0.4 + t^3 + 0.1 \\ y = 3t(1-t)^2\cdot 0.2 + 3t^2(1-t) + t^3 \end{array} \right. & , t \in [0,1]](formula_5.svg)

用式 (3) 减去式 (5)，即可得到我们所需的移动范围随时间变化的方程。其图像如下：

![两条曲线差值的图像](graph_2.svg)

但是仅仅得出方程我们是无法加以利用的。

## 3. 贝塞尔曲线拟合 

要利用上得出的差值方程，我们需要将函数图像在其导数 *f*'(*x*) = 0，即在其极值点两侧分别用三次贝塞尔曲线拟合，并记录极值点在函数中所在的位置。

由于只有两个控制点并且无法控制权重，我们使用了比较简单的方法进行了大致的拟合。

其中，向下移动时的函数为 `PathInterpolator(0.96f, 0.43f, 0.72f, 1f)`，图像如下：

![距离增加时的函数图像](graph_3.svg)

向上移动的则为 `PathInterpolator(0.17f, 0f, -0.15f, 1f)`，如下图所示：

![距离减少时的函数图像](graph_4.svg)

接着，按照单调递增区间和单调递减区间在总时长中所占的比例来定义向下、向上时所需要的时间，选取一个合适的最大距离，就可以近似地模拟出延迟滚动的效果了。

## 结尾

如果你想要一个现有的示例代码，[可以到这里看看](https://github.com/FoedusProgramme/AccordLegacy/blob/fb5df5ff20c96eb782b6a7aec25d10ffe3c4c73a/app/src/main/java/org/akanework/gramophone/ui/components/FullBottomSheet.kt#L1138)，喜欢的话可以点个 Star。

如果你对如何使用 LinearSmoothScroller 让 RecyclerView 实现更平滑的滚动感兴趣，欢迎看看这篇文章的[上一篇](https://juejin.cn/post/7363932520952512512)，没有数学公式。
