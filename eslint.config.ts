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
    },
  },
)
