# CalinMeters 询盘统计核查 — 2026-10-11

> 历史审计：本文件记录 10 月 11 日环境中的发现与限制。10 月 12 日已在现有仓库继续执行，增加维度逐项查询验证、完整周导出和本地 Node 兼容修正；最新配置与发布证据见 [本周记录](weekly/2026-10-12.md)。以下“未登录/未推送”是当时状态，不代表当前交付。

## 结论与范围

已核对主分支 `041e54cb2cde0c80caf03522b5a1e8f135317859`、[Issue #32](https://github.com/hygentlemen/calinmeters-website/issues/32)、[10 月 7 日周报](weekly/2026-10-05.md)、英文/法语表单、GA4 组件、Worker/Resend 和日报采集/格式化代码。10 月 7 日后 PR #34–36 分别涉及索引记录、图片、导航，没有修改上述询盘/分析逻辑。GA4 界面本次停在登录页；没有读取或修改实际的自定义定义、关键事件、数据流或过滤器。

已取得 GitHub 自动任务内授权 GA4 读取生成的聚合数据，未提取 Google 凭据或客户信息。本变更提供代码修复和本地验证，生产是否生效应以 PR 合并及 Pages 部署记录为准。GA4 配置不能由代码提交代替。没有重复 10 月 11 日已经完成的 11 个法语 URL 索引申请，没有改变页面设计、字段要求、目录内容或索引设置。

交付状态：GitHub 连接在创建代码对象时返回 `403 Resource not accessible by integration`；因此本次没有推送分支、创建修复 PR 或部署。提供可应用到上述主分支版本的完整补丁及说明，等待具备仓库代码写权限的连接或维护者应用。GA4 管理界面另需可访问该属性的登录会话；仓库写权限不等于 GA4 管理权限。

## 最新数据及能用的指标

来源：[Daily Analytics Report 38116720555](https://github.com/hygentlemen/calinmeters-website/actions/runs/38116720555)，2026-10-11 06:02 UTC（14:02 北京时间）生成，artifact `11693444394` 中的 `daily-analytics-2026-10-10.raw.json`。GA4/GSC 源均为 available；下面只使用 GA4。日期窗口来自该 artifact，GA4 统计日按属性时区解释；旧报表未保存属性时区，不能仅凭任务运行时区认定属性也使用北京时间。

| 指标 | 30 天：9 月 11 日–10 月 10 日 | 90 天：7 月 13 日–10 月 10 日 |
| --- | ---: | ---: |
| 法语活跃用户 | 1 | 21 |
| 法语会话 / 互动会话 | 1 / 1 | 25 / 14 |
| 法语自然搜索落地会话 | 未返回行 | 2（电表、水表品类页各 1） |
| `fr_quote_start` | 未返回行 | 1 |
| `fr_quote_submit` | 未返回行 | 未返回行 |
| 成功、失败、有效询盘 | 未知 | 未知 |
| 英文 `contact_form_start` / `contact_form_submit` | 4 / 5 | 5 / 23 |

10 月 10 日英文开始/提交各 2 次，仍不能判断这 2 次提交是否成功。

- **可用于描述已观测行为：** 上表返回的事件/流量计数；法语 90 天互动率 `14/25=56%`。这是互动指标，不是询盘转化率。
- **仅可作为事件密度：** `1/25=0.04` 次开始事件/法语会话，即每 100 次会话 4 次开始事件。不能标成“4% 的访客转化”，因为开始事件按组件挂载去重，报告没有完整的同会话漏斗。
- **仍不可计算：** 提交成功率、成功询盘会话转化率、邮件送达率、有效询盘数/率、重复率、垃圾率。不能用“无返回行”把这些指标填成 0%，也不能把 5/4 或 23/5 当英文转化率。
- 英文 `contact_form_start` 是 9 月 8 日 PR #25 才加入的，90 天开始/提交还存在历史覆盖不一致。重复尝试、客户端丢失、拦截/同意状态也可能影响前端事件；这些因素没有本次实测数据，不能用作历史归因结论。
- 上述是报表快照中可复算的观测值；旧采集器没有保留 GA4 阈值/抽样等质量元数据，不能证明涵盖所有实际客户。10 月 10 日数据在提取时尚新，后续可修订。

## 实际事件含义与确认的缺陷

`GoogleAnalytics.tsx` 在配置测量 ID 后通过 gtag 发送事件；`trackEvent` 在 gtag 尚不可用时直接返回，所以代码调用不是 Google 实际收到事件的证明。生产 ID 来自 Pages 的已有配置，本次未更改。

| 事件/参数 | 原实现实际触发条件 | 本次修复及解释 |
| --- | --- | --- |
| `fr_quote_start` | 表单首次获得焦点，每次组件挂载最多一次 | 保留焦点口径；提交或原生校验失败时也确保记录一次，补齐无先前焦点的路径。不是开始输入、独立客户或唯一会话 |
| `fr_quote_submit: success` | `response.ok && body.ok` | 只有正向 API 回执才记成功，并排除本次 payload 的诱捕字段非空情况；保留原来静默反垃圾的用户反馈 |
| `validation_error` | 法语收到 HTTP 400 / invalid_payload；英文手动校验分支原来不报事件 | 补齐浏览器原生必填/邮箱校验，多个无效字段合并为一次；补齐英文手动校验。校验拦截不发 HTTP 请求 |
| `challenge_error` | 法语本地没有 token，或返回 turnstile_failed / turnstile_unavailable | 补齐英文同等分类；无 token 不发 HTTP 请求。独立的 widget error 回调本身只是 UI 状态，不计提交 |
| `rate_limited` | HTTP 429 或 rate_limited | 保留 |
| `server_error` | 其他响应错误、网络异常或 15 秒超时 | 保留历史枚举；该值不能证明一定是服务器故障，也不能确定超时前服务端是否已经受理 |
| 法语产品/买家参数 | product_category=固定选项；product_id=URL 预选的目录 ID；buyer_type=固定选项，空值为 not_selected | 保留原有受控字段，不加入姓名、邮箱、公司、电话、国家自由文本或需求内容 |

法语表单在首页，产品 CTA 导向带目录预选值的首页表单。开始事件中的买家类型常为 `not_selected`，提交时才有用户最终选择；不能把两步按同一 buyer_type 简单相除。当前 `source_path_group` 看的是表单所在路径，通常是 home，不能将它解释成原产品来源页。

**报表的确定缺陷：** 原采集器一次要求 `result/product_category/product_id/buyer_type` 四个自定义维度，任一不可用就只取 eventName。因此 `controlledDimensionsAvailable=false` 只说明组合查询降级，既不能证明四项全未注册，也不能证明 result 本身不可用。新实现每轮只读一次 Data API metadata，分别保存 available/missing；即使买家或产品维度缺失，也保留可用的 result 分类。元数据请求失败单列 unknown，不伪装成缺少定义。非维度权限/服务错误不会被吞成配置问题。

同时修复受控事件查询最多 100 行且未分页的问题；分页保留阈值、抽样、other 行损失、截断、空结果原因和属性时区，数据受限时不宣称完整成功总数。分页有 10,000 行安全上限，达到上限且仍有未取数据时明确标为不完整。这是修复潜在漏计，不声称当前微小样本已经发生截断。

**反垃圾假成功：** Worker 对诱捕字段非空返回 `{ok:true}`，但根本不发邮件。原前端会因此发出 success；本次在客户端抑制这类 success，不改变 Worker 的防护或回应。旧 success 不能回溯净化，且客户端统计始终不能代替可信的服务端/收件记录。

**验证码重挂载问题：** 实际 Next.js 14 Script 模块只在首次加载触发 onLoad，已缓存脚本重新挂载需用 onReady。原表单使用 onLoad，离开再返回可能无法初始化 Turnstile。本地真实组件与 Next Script 的回归测试复现了该失败；两种语言改为 onReady 后通过。未进行生产客户会话回放，不能把这一缺陷断言为历史无提交的原因。

## GA4 管理员需要完成的配置

1. 在与生产 gtag 测量 ID 对应的 CalinMeters Web 数据流/属性下操作，同时核对报表使用的数字 property ID。不要新建第二个跟踪标签。
2. 进入 **管理 → 数据显示 → 自定义定义 → 创建自定义维度**。先检查已有定义，避免重复；以下四项均选 **事件（Event）作用域**，事件参数逐字匹配：

| 显示名称（可自定） | 事件参数 | 作用域 | Data API 名称 |
| --- | --- | --- | --- |
| Inquiry result | `result` | Event | `customEvent:result` |
| Inquiry product category | `product_category` | Event | `customEvent:product_category` |
| Inquiry product ID | `product_id` | Event | `customEvent:product_id` |
| Inquiry buyer type | `buyer_type` | Event | `customEvent:buyer_type` |

`result` 优先。只需注册实际缺少的定义；本次无法确认哪几项已注册或其创建时间。事件本身的 eventCount 无需这四个维度才能收集；注册失败不会直接解释事件名无记录。

3. 使用实时报告/DebugView 验证收到 `fr_quote_start`、`fr_quote_submit` 及枚举参数。先在隔离的测试属性或受控调试环境验收；真实邮件发送需要另行安排，不能用生产假询盘污染收件箱和有效客户统计。本次测试只拦截本地 fetch/gtag/Turnstile，未向 Google 或收件人发送数据。
4. 自定义定义创建且后续事件送达后，通常等待 **24–48 小时**再看处理后的报表；记录准确创建/部署时间。设置检查日不等于设置已完成。若 10 月 12 日才配置，10 月 13–14 日检查新数据，不能要求 12 日立即有分类结果。正常延迟不会自动修复一直未注册的维度。
5. 在“探索 → 自由形式”导入事件名称、result、产品类别、产品 ID、买家类型，指标选事件数。过滤 eventName=`fr_quote_submit`，分别看 success 和四种错误；单列 `(not set)`/未知，不分摊给成功或失败。先按结果检查，再增加产品/买家维度，避免低样本组合造成误读。
6. 检查现有关键事件配置，不应将包含失败的原始 `fr_quote_submit` 或自动增强衡量 `form_submit` 直接当作成功询盘。若需 GA4 关键事件，在部署排除假成功的修复后，创建派生事件 `fr_quote_success`，匹配 **event_name equals fr_quote_submit AND result equals success**，复制受控参数，再把新事件标记为关键事件。保留原事件；计数时不可把新旧事件相加。新规则不补历史，也不等同于 qualified lead。
7. 修复合并并部署、GA4 定义就绪后，用已有日报工作流进行 `notify=false` 的单次核查，检查 raw report 中各维度状态、quality、分类行与日期。复核未来同一成熟窗口，不能凭明天自动任务成功就断言数据完整。本次未触发会发送飞书通知的任务，也未新增自动化。

定义注册不能承诺补回之前的分类结果。只有之前已配置并保留的原始事件导出才可能另行分析历史参数；本次没有访问或假定存在 BigQuery 导出。

## 不公开客户信息的有效询盘统计

技术链路须分开：浏览器记录成功 → 邮件服务受理 → 收件系统确认 → 人工核验有效客户。现有 Worker 在 Resend 接受请求后返回成功，没有收件人 inbox 证明，也没有询盘质量标记。仅检查 OPTIONS/HTTP 连通不能证明邮件送达。本次环境对生产首页的直接 HTTP 读取返回 403，没有据此认定网站故障，亦未提交生产表单。

在已授权的私有邮箱/CRM 内去重和判定，每条非测试收件只归入一个状态：`qualified`、`unqualified`、`duplicate`、`spam`、`unreviewed`；内部测试另列并排除。有效的标准是确认真实买家、需求与 CalinMeters 业务相关且可继续跟进，由负责人核验，不能由有无公司字段自动判定。语言从受控入口/sourcePage 的法语路径识别，不能用国籍或文字猜测。

向报表/公开仓库只输出 **统计周期、入口语言、受控产品类别及五类计数**。不传姓名、邮箱、电话、公司名、消息、IP、token、完整查询字符串、个人邮箱哈希或单条收件标识；去重关联留在私有系统。新增客户个人资料不是这套统计的前提。公共细分小样本可合并，避免对个体的间接识别。当前未取得上述私有汇总，不能编造为零。

| 指标 | 准确口径 | 当前状态 |
| --- | --- | --- |
| 技术结果成功占比 | success 事件 / 全部已完整分类的提交结果事件（包含客户端失败）；同时显示未知数，存在缺失时不报完整成功率 | GA4 结果分类未知，暂不可用 |
| 表单完成会话率 | 同会话内先 start 后 success 的会话 / start 会话，使用封闭同会话漏斗；不能拿 eventCount 代替 | 现有聚合报告没有这种去重/顺序信息 |
| 法语访问成功转化率 | 同一法语访问会话群中发生 success 的会话 / 该群会话；自然搜索版本须分子分母都限定同一自然搜索落地会话群 | 需正确关键事件及会话分段，当前未知 |
| 有效询盘数 | 私有去重核验后的 qualified 数 Q | 未知 |
| 有效率 | Q / (Q + unqualified)，排除重复、垃圾和未审 | 未知 |
| 垃圾率 | spam / (qualified + unqualified + duplicate + spam)，明确为已审样本 | 未知 |
| 审核覆盖率 | 上述四类已审总数 / 五类非测试收件总数（含 unreviewed） | 未知 |

所有分母为零时写“不可计算”。不能将客户通过 WhatsApp/email 点击后的实际沟通数量从前端点击事件反推；其有效商机仍由私有业务记录核验。

## 验证与交付边界

- `npm run test:report`：32 项通过，覆盖部分维度可用、元数据读取失败、分页、阈值限制及权限错误。
- `npm run test:inquiry-events`：真实英文/法语组件共 18 组情境，包含原生校验、多字段去重、再次校验、缓存脚本重挂载、验证码、成功、诱捕、限流、服务及网络异常；断言分析事件不含测试个人字段/token。
- TypeScript、i18n 检查、生产 build/export、SEO 导出检查通过；27 页面/27 sitemap URL/11 语言对不变。没有布局/样式改动。
- 当前受限环境中 tsx CLI 的 IPC 监听不可用，i18n 用等效 `node --import tsx scripts/verify-i18n.ts` 执行；新增测试用 Node import loader，无需额外监听或提权。
- 已把表单回归测试加入原有 Pages 构建门槛。GA4 注册、实时接收、邮件实际送达、质量汇总及生产发布仍需各自的真实验收证据。

官方参考：[事件级维度](https://support.google.com/analytics/answer/14239696?hl=en)、[数据延迟](https://support.google.com/analytics/answer/11198161?hl=en)、[派生事件及历史限制](https://support.google.com/analytics/answer/10085872?hl=en)、[Data API metadata](https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/getMetadata)、[响应质量字段](https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/ResponseMetaData)、[Next.js 14 Script onReady](https://nextjs.org/docs/14/app/api-reference/components/script#onready)。
