/** 通用类型命名空间 */
declare namespace CommonType {
  /**
   * 选项类型
   *
   * @property value: 选项值
   * @property label: 选项标签
   */
  type Option<K = string, M = string> = { value: K; label: M }

  type YesOrNo = 'Y' | 'N'
}
