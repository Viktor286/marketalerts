import { ITicketData } from './data-vendors/tradingview';

export interface IRule {
  target: Extract<keyof ITicketData, string>;
  operator: 'greater-or-less' | 'greater' | 'less';
  value: ITicketData[keyof ITicketData];
}

export default class RulesManager {
  static applyRuleCondition(rule: IRule, kvp: Partial<ITicketData>): boolean {
    switch (rule.operator) {
      case 'greater-or-less':
        return (
          kvp[rule.target] >
          Math.abs(
            typeof rule.value === 'string'
              ? parseFloat(rule.value)
              : rule.value,
          )
        );
    }
  }

  static createRule(
    target: IRule['target'],
    operator: IRule['operator'],
    value: IRule['value'],
  ): IRule {
    return {
      target,
      operator,
      value,
    };
  }

  static createRuleToTicketId(
    { target, operator, value }: IRule,
    { ticket }: Partial<ITicketData>,
  ): string {
    return `${ticket} ${target} ${operator} ${value}`;
  }
}
