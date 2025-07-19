import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import { globalIgnores } from 'eslint/config'
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort'
import pluginVue from 'eslint-plugin-vue'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  skipFormatting,

  {
    plugins: {
      'simple-import-sort': eslintPluginSimpleImportSort,
    },
  },
  {
    /**
     * "off" 或 0    ==>  关闭规则
     * "warn" 或 1   ==>  打开的规则作为警告（不影响代码执行）
     * "error" 或 2  ==>  规则作为一个错误（代码不能执行，界面报错）
     */
    rules: {
      // 要求组件名使用多单词（防止与 HTML 原生标签冲突），但允许例外（如 index、App 等）
      'vue/multi-word-component-names': [
        'warn',
        {
          ignores: ['index', 'App', 'Register', '[id]', '[url]'],
        },
      ],
      // 强制模板中的组件名使用 PascalCase（大驼峰）命名，除了以 icon- 开头的
      'vue/component-name-in-template-casing': [
        'error',
        'PascalCase',
        {
          registeredComponentsOnly: false,
          ignores: ['/^icon-/'],
        },
      ],
      // 强制 HTML 模板中的属性使用中划线命名 设置为 'always' 表示必须使用中划线
      'vue/attribute-hyphenation': [
        'warn',
        'always',
        {
          ignore: [],
        },
      ],
      // 强制事件监听器使用中划线命名 autofix: true 允许自动修复
      'vue/v-on-event-hyphenation': [
        'warn',
        'always',
        {
          autofix: true,
          ignore: [],
        },
      ],
      // 强制在脚本部分使用驼峰命名
      'vue/prop-name-casing': ['warn', 'camelCase'],
      // 禁止未使用的变量，但允许以 _ 开头的变量
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      // 强制类型导入必须使用 import type 语法
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
          fixStyle: 'separate-type-imports',
        },
      ],

      // 强制 import 排序
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            [
              `^vue$`,
              `^vue-router$`,
              `^naive-ui$`,
              `.*\\.vue$`,
              `.*/assets/.*`,
              `^@/assets$`,
              `.*/plugins/.*`,
              `^@/plugins$`,
              `.*/router/.*`,
              `^@/router$`,
              `^@/service$`,
              `^@/service/.*`,
              `.*/stores/.*`,
              `^@/stores$`,
              `.*/utils/.*`,
              `^@/utils$`,
              `^`,
              `^type `,
            ],
          ],
        },
      ],

      // eslint (http://eslint.cn/docs/rules)
      'no-var': 'error', // 要求使用 let 或 const 而不是 var
      'no-multiple-empty-lines': ['error', { max: 1 }], // 不允许多个空行
      'prefer-const': 'error', // 使用 let 关键字声明但在初始分配后从未重新分配的变量，要求使用 const
      'no-use-before-define': 'error', // 禁止在 函数/类/变量 定义之前使用它们

      // typeScript (https://typescript-eslint.io/rules)
      '@typescript-eslint/no-empty-function': 'error', // 禁止空函数
      '@typescript-eslint/prefer-ts-expect-error': 'error', // 禁止使用 @ts-ignore
      '@typescript-eslint/ban-ts-comment': 'error', // 禁止 @ts-<directive> 使用注释或要求在指令后进行描述
      '@typescript-eslint/no-inferrable-types': 'off', // 可以轻松推断的显式类型可能会增加不必要的冗长
      '@typescript-eslint/no-namespace': 'off', // 禁止使用自定义 TypeScript 模块和命名空间
      '@typescript-eslint/no-explicit-any': 'error', // 禁止使用 any 类型
      '@typescript-eslint/ban-types': 'off', // 禁止使用特定类型
      '@typescript-eslint/no-var-requires': 'off', // 允许使用 require() 函数导入模块
      '@typescript-eslint/no-non-null-assertion': 'off', // 不允许使用后缀运算符的非空断言(!)

      // vue (https://eslint.vuejs.org/rules)
      'vue/v-slot-style': 'error', // 强制执行 v-slot 指令样式
      'vue/no-mutating-props': 'error', // 不允许改变组件 prop
      'vue/custom-event-name-casing': 'error', // 为自定义事件名称强制使用特定大小写
      'vue/html-closing-bracket-newline': 'error', // 在标签的右括号之前要求或禁止换行
      'vue/attributes-order': 'off', // vue api使用顺序，强制执行属性顺序
      'vue/no-v-html': 'error', // 禁止使用 v-html
      'vue/require-default-prop': 'off', // 此规则要求为每个 prop 为必填时，必须提供默认值
      'vue/no-setup-props-destructure': 'off', // 禁止解构 props 传递给 setup
    },
  },
)
