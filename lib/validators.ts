import { Issue, TimeIndex, ValidationError, ValidationResult } from '@/types'

export class DataValidator {
  /**
   * 验证期刊数据完整性
   */
  static validateIssue(issue: Issue): ValidationResult {
    const errors: ValidationError[] = []

    // 必填字段检查
    if (!issue.title || issue.title.trim() === '') {
      errors.push({
        field: 'title',
        message: '期刊标题不能为空',
        code: 'REQUIRED_FIELD'
      })
    }

    if (!issue.content || issue.content.trim() === '') {
      errors.push({
        field: 'content',
        message: '期刊内容不能为空',
        code: 'REQUIRED_FIELD'
      })
    }

    if (!issue.filePath || issue.filePath.trim() === '') {
      errors.push({
        field: 'filePath',
        message: '文件路径不能为空',
        code: 'REQUIRED_FIELD'
      })
    }

    // 数值范围验证
    if (issue.year < 2000 || issue.year > 2100) {
      errors.push({
        field: 'year',
        message: '年份必须在2000-2100之间',
        code: 'INVALID_RANGE'
      })
    }

    if (issue.month < 1 || issue.month > 12) {
      errors.push({
        field: 'month',
        message: '月份必须在1-12之间',
        code: 'INVALID_RANGE'
      })
    }

    if (issue.issueNumber < 1) {
      errors.push({
        field: 'issueNumber',
        message: '期数必须大于0',
        code: 'INVALID_RANGE'
      })
    }

    // 日期格式验证
    if (!this.isValidDate(issue.publishDate)) {
      errors.push({
        field: 'publishDate',
        message: '发布日期格式无效',
        code: 'INVALID_DATE'
      })
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * 验证时间索引数据有效性
   */
  static validateTimeIndex(timeIndex: TimeIndex): ValidationResult {
    const errors: ValidationError[] = []

    // 年份验证
    if (timeIndex.year < 2000 || timeIndex.year > 2100) {
      errors.push({
        field: 'year',
        message: '年份必须在2000-2100之间',
        code: 'INVALID_RANGE'
      })
    }

    // 月份验证
    if (!timeIndex.months || timeIndex.months.length === 0) {
      errors.push({
        field: 'months',
        message: '月份列表不能为空',
        code: 'REQUIRED_FIELD'
      })
    }

    // 验证每个月份的数据
    timeIndex.months.forEach((month, index) => {
      if (month.monthNumber < 1 || month.monthNumber > 12) {
        errors.push({
          field: `months[${index}].monthNumber`,
          message: `月份数字必须在1-12之间，当前值：${month.monthNumber}`,
          code: 'INVALID_RANGE'
        })
      }

      if (!month.issues || month.issues.length === 0) {
        errors.push({
          field: `months[${index}].issues`,
          message: '期数列表不能为空',
          code: 'REQUIRED_FIELD'
        })
      }

      // 验证期数数据
      month.issues.forEach((issue, issueIndex) => {
        if (issue.number < 1) {
          errors.push({
            field: `months[${index}].issues[${issueIndex}].number`,
            message: `期数必须大于0，当前值：${issue.number}`,
            code: 'INVALID_RANGE'
          })
        }

        if (!issue.title || issue.title.trim() === '') {
          errors.push({
            field: `months[${index}].issues[${issueIndex}].title`,
            message: '期数标题不能为空',
            code: 'REQUIRED_FIELD'
          })
        }

        if (!issue.filePath || issue.filePath.trim() === '') {
          errors.push({
            field: `months[${index}].issues[${issueIndex}].filePath`,
            message: '期数文件路径不能为空',
            code: 'REQUIRED_FIELD'
          })
        }
      })
    })

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * 日期格式验证
   */
  static isValidDate(date: any): boolean {
    if (!date) return false
    if (date instanceof Date) return !isNaN(date.getTime())
    if (typeof date === 'string') {
      const parsed = new Date(date)
      return !isNaN(parsed.getTime())
    }
    return false
  }
}
