# Algolia 搜索配置指南

## 🚀 快速开始

### 1. 注册Algolia账户
访问 [https://www.algolia.com/](https://www.algolia.com/) 注册免费账户

### 2. 创建应用
- 登录后创建新应用
- 选择适合的区域（推荐选择离用户最近的区域）

### 3. 获取API密钥
在应用设置中找到以下信息：
- **Application ID**: 应用ID
- **Search-Only API Key**: 搜索API密钥（公开）
- **Admin API Key**: 管理API密钥（私有）

### 4. 创建环境变量
在项目根目录创建 `.env.local` 文件：

```bash
# Algolia 配置
NEXT_PUBLIC_ALGOLIA_APP_ID=your-app-id
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=your-search-key
ALGOLIA_ADMIN_KEY=your-admin-key
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=weekly-issues
```

**注意**: 
- `NEXT_PUBLIC_` 前缀的变量可以在前端使用
- `ALGOLIA_ADMIN_KEY` 只在后端使用，不要暴露给前端

## 📊 索引数据

### 1. 启动开发服务器
```bash
pnpm dev
```

### 2. 索引期刊数据
使用以下命令将期刊数据索引到Algolia：

```bash
# 使用curl命令（需要管理员密钥）
curl -X POST http://localhost:3000/api/algolia/index \
  -H "Authorization: Bearer your-admin-key" \
  -H "Content-Type: application/json"
```

或者使用Postman等工具：
- **URL**: `POST http://localhost:3000/api/algolia/index`
- **Headers**: 
  - `Authorization: Bearer your-admin-key`
  - `Content-Type: application/json`

### 3. 验证索引
检查索引是否成功：
```bash
curl http://localhost:3000/api/algolia/index
```

## 🔍 搜索功能

### 1. 前端搜索
搜索弹窗组件现在使用Algolia进行搜索，提供：
- 更快的搜索速度
- 更好的搜索结果相关性
- 支持模糊搜索和拼写纠错
- 搜索结果高亮

### 2. 搜索API
- **端点**: `/api/algolia/search`
- **方法**: GET
- **参数**: 
  - `q`: 搜索查询
  - `page`: 页码（可选）
  - `filters`: 过滤条件（可选）

### 3. 示例请求
```bash
curl "http://localhost:3000/api/algolia/search?q=JavaScript&page=0"
```

## ⚙️ 高级配置

### 1. 索引设置
在 `lib/algolia.ts` 中可以配置：
- 可搜索属性
- 分面属性
- 排名规则
- 高亮标签

### 2. 搜索配置
- 每页结果数量
- 返回的属性
- 高亮设置
- 分页配置

### 3. 过滤和分面
支持按标签、年份、月份等属性进行过滤：
```bash
# 按标签过滤
curl "http://localhost:3000/api/algolia/search?q=JavaScript&filters=tags:React"

# 按年份过滤
curl "http://localhost:3000/api/algolia/search?q=AI&filters=year:2024"
```

## 🐛 故障排除

### 1. 常见问题

**搜索无结果**
- 检查索引是否成功创建
- 验证搜索查询是否正确
- 查看控制台错误信息

**索引失败**
- 确认管理员密钥正确
- 检查网络连接
- 查看服务器日志

**API密钥错误**
- 确认环境变量设置正确
- 重启开发服务器
- 检查密钥权限

### 2. 调试方法

**检查索引状态**
```bash
curl http://localhost:3000/api/algolia/index
```

**查看搜索日志**
在浏览器控制台查看搜索请求和响应

**验证环境变量**
```bash
# 在开发服务器中检查
echo $NEXT_PUBLIC_ALGOLIA_APP_ID
```

## 📈 性能优化

### 1. 搜索优化
- 使用适当的 `hitsPerPage` 值
- 实现搜索结果缓存
- 优化搜索查询

### 2. 索引优化
- 定期更新索引数据
- 使用批量索引操作
- 监控索引大小和性能

### 3. 用户体验
- 实现搜索建议
- 添加搜索历史
- 支持热门搜索

## 🔒 安全考虑

### 1. API密钥管理
- 永远不要在前端暴露管理密钥
- 使用环境变量管理敏感信息
- 定期轮换API密钥

### 2. 访问控制
- 限制索引API的访问权限
- 实现适当的身份验证
- 监控API使用情况

### 3. 数据隐私
- 确保索引的数据不包含敏感信息
- 遵守数据保护法规
- 实现数据删除功能

## 🎯 下一步

配置完成后，您可以：
1. 测试搜索功能
2. 自定义搜索界面
3. 添加高级过滤功能
4. 实现搜索分析
5. 优化搜索性能

如有问题，请查看Algolia官方文档或联系技术支持。
