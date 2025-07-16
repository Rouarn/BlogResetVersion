/** The common type namespace */
declare namespace CommonType {
  /**
   * The option type
   *
   * @property value: The option value
   * @property label: The option label
   */
  type Option<K = string, M = string> = { value: K; label: M }

  type YesOrNo = 'Y' | 'N'
}
