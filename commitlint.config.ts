/**
 * Commitlint 配置文件
 * 基于 Conventional Commits 规范
 * @see https://commitlint.js.org/
 * @see https://www.conventionalcommits.org/
 */

/** @type {import('@commitlint/types').UserConfig} */
export default {
  // 继承推荐的配置
  extends: ['@commitlint/config-conventional'],

  // 自定义规则
  rules: {
    // 类型枚举
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复bug
        'docs', // 文档更新
        'style', // 代码格式（不影响代码运行的变动）
        'refactor', // 重构（既不是新增功能，也不是修改bug的代码变动）
        'perf', // 性能优化
        'test', // 增加测试
        'chore', // 构建过程或辅助工具的变动
        'ci', // CI配置文件和脚本的变动
        'build', // 影响构建系统或外部依赖的更改
        'revert', // 回滚之前的提交
      ],
    ],
    // 主题不能为空
    'subject-empty': [2, 'never'],
    // 主题最大长度
    'subject-max-length': [2, 'always', 72],
    // 主题最小长度
    'subject-min-length': [2, 'always', 4],
    // 主题格式（不以大写字母开头，不以句号结尾）
    'subject-case': [2, 'always', 'lower-case'],
    // 主题不以句号结尾
    'subject-full-stop': [2, 'never', '.'],
    // 类型不能为空
    'type-empty': [2, 'never'],
    // 类型格式
    'type-case': [2, 'always', 'lower-case'],
    // 头部最大长度
    'header-max-length': [2, 'always', 100],
    // 正文前需要空行
    'body-leading-blank': [1, 'always'],
    // 脚注前需要空行
    'footer-leading-blank': [1, 'always'],
  },

  // 提示信息
  prompt: {
    messages: {
      type: '选择你要提交的类型:',
      scope: '选择一个提交范围（可选）:',
      customScope: '请输入自定义的提交范围:',
      subject: '填写简短精炼的变更描述:',
      body: '填写更加详细的变更描述（可选）。使用 "|" 换行:',
      breaking: '列举非兼容性重大的变更（可选）。使用 "|" 换行:',
      footerPrefixesSelect: '选择关联issue前缀（可选）:',
      customFooterPrefix: '输入自定义issue前缀:',
      footer: '列举关联issue（可选）例如: #31, #I3244:',
      generatingByAI: '正在通过 AI 生成你的提交简短描述...',
      generatedSelectByAI: '选择一个 AI 生成的简短描述:',
      confirmCommit: '是否提交或修改commit?',
    },
    types: [
      { value: 'feat', name: 'feat:     ✨ 新增功能', emoji: ':sparkles:' },
      { value: 'fix', name: 'fix:      🐛 修复缺陷', emoji: ':bug:' },
      { value: 'docs', name: 'docs:     📝 文档变更', emoji: ':memo:' },
      { value: 'style', name: 'style:    💄 代码格式（不影响功能，例如空格、分号等格式修正）', emoji: ':lipstick:' },
      { value: 'refactor', name: 'refactor: ♻️  代码重构（不包括 bug 修复、功能新增）', emoji: ':recycle:' },
      { value: 'perf', name: 'perf:     ⚡️ 性能优化', emoji: ':zap:' },
      { value: 'test', name: 'test:     ✅ 添加疏漏测试或已有测试改动', emoji: ':white_check_mark:' },
      { value: 'build', name: 'build:    📦️ 构建流程、外部依赖变更（如升级 npm 包、修改 vite 配置等）', emoji: ':package:' },
      { value: 'ci', name: 'ci:       🎡 修改 CI 配置、脚本', emoji: ':ferris_wheel:' },
      { value: 'chore', name: 'chore:    🔨 对构建过程或辅助工具和库的更改（不影响源文件、测试用例）', emoji: ':hammer:' },
      { value: 'revert', name: 'revert:   ⏪️ 回滚 commit', emoji: ':rewind:' },
    ],
    useEmoji: false,
    emojiAlign: 'center',
    useAI: false,
    aiNumber: 1,
    themeColorCode: '',
    scopes: [],
    allowCustomScopes: true,
    allowEmptyScopes: true,
    customScopesAlign: 'bottom',
    customScopesAlias: 'custom',
    emptyScopesAlias: 'empty',
    upperCaseSubject: false,
    markBreakingChangeMode: false,
    allowBreakingChanges: ['feat', 'fix'],
    breaklineNumber: 100,
    breaklineChar: '|',
    skipQuestions: [],
    issuePrefixes: [{ value: 'closed', name: 'closed:   ISSUES has been processed' }],
    customIssuePrefixAlign: 'top',
    emptyIssuePrefixAlias: 'skip',
    customIssuePrefixAlias: 'custom',
    allowCustomIssuePrefix: true,
    allowEmptyIssuePrefix: true,
    confirmColorize: true,
    maxHeaderLength: Infinity,
    maxSubjectLength: Infinity,
    minSubjectLength: 0,
    scopeOverrides: undefined,
    defaultBody: '',
    defaultIssues: '',
    defaultScope: '',
    defaultSubject: '',
  },
}
