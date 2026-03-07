import { Agent } from '@agents/agents-core';

export interface DOMElement {
  selector: string;
  tag: string;
  text: string;
  attributes: Record<string, string>;
}

export interface DOMDiff {
  type: 'added' | 'removed' | 'modified';
  element: DOMElement;
  oldValue?: string;
  newValue?: string;
  severity: 'critical' | 'major' | 'minor';
}

export interface DomAnalysisOutput {
  timestamp: Date;
  diffs: DOMDiff[];
  breakingChanges: number;
  warnings: string[];
}

/**
 * DOM Change Detection and Analysis
 * 
 * Detects changes in DOM structure between two states
 * Identifies breaking changes and selector updates needed
 * Feeds into self-healing agent
 * 
 * Input: Old DOM, New DOM
 * Process: Compare DOM structures
 * Output: Diff report with change recommendations
 */
export class DomAnalyzerAgent extends Agent {
  constructor() {
    super('agent-dom-analyzer', '1.0.0');
  }

  async execute(input: any): Promise<any> {
    console.log(`[${this.name}] Analyzing DOM changes...`);
    
    const oldDom = input.oldDom || {};
    const newDom = input.newDom || {};

    try {
      const diffs = this.analyzeDifferences(oldDom, newDom);
      const breakingChanges = diffs.filter(d => d.severity === 'critical').length;
      const warnings = this.generateWarnings(diffs);

      const output: DomAnalysisOutput = {
        timestamp: new Date(),
        diffs,
        breakingChanges,
        warnings,
      };

      console.log(`[${this.name}] Found ${diffs.length} DOM changes (${breakingChanges} critical)`);
      
      return {
        id: this.id,
        result: output,
        status: 'success',
        timestamp: new Date(),
      };
    } catch (error) {
      console.error(`[${this.name}] Failed to analyze DOM:`, error);
      
      return {
        id: this.id,
        result: { timestamp: new Date(), diffs: [], breakingChanges: 0, warnings: [] },
        status: 'failure',
        error: error as Error,
        timestamp: new Date(),
      };
    }
  }

  private analyzeDifferences(oldDom: any, newDom: any): DOMDiff[] {
    const diffs: DOMDiff[] = [];

    // Check for removed elements
    if (oldDom.elements) {
      oldDom.elements.forEach((oldElement: DOMElement) => {
        const found = newDom.elements?.find((el: DOMElement) => this.isSameElement(el, oldElement));
        
        if (!found) {
          diffs.push({
            type: 'removed',
            element: oldElement,
            severity: 'critical',
          });
        }
      });
    }

    // Check for added or modified elements
    if (newDom.elements) {
      newDom.elements.forEach((newElement: DOMElement) => {
        const oldElement = oldDom.elements?.find((el: DOMElement) => 
          el.selector === newElement.selector
        );
        
        if (!oldElement) {
          diffs.push({
            type: 'added',
            element: newElement,
            severity: 'minor',
          });
        } else if (this.hasChanges(oldElement, newElement)) {
          diffs.push({
            type: 'modified',
            element: newElement,
            oldValue: JSON.stringify(oldElement),
            newValue: JSON.stringify(newElement),
            severity: this.getSeverity(oldElement, newElement),
          });
        }
      });
    }

    return diffs;
  }

  private isSameElement(el1: DOMElement, el2: DOMElement): boolean {
    return el1.selector === el2.selector || 
           (el1.tag === el2.tag && el1.text === el2.text);
  }

  private hasChanges(oldElement: DOMElement, newElement: DOMElement): boolean {
    return oldElement.tag !== newElement.tag ||
           oldElement.text !== newElement.text ||
           JSON.stringify(oldElement.attributes) !== JSON.stringify(newElement.attributes);
  }

  private getSeverity(oldElement: DOMElement, newElement: DOMElement): 'critical' | 'major' | 'minor' {
    // Breaking change: selector changed
    if (oldElement.selector !== newElement.selector) {
      return 'critical';
    }
    
    // Major change: tag or critical attribute changed
    if (oldElement.tag !== newElement.tag) {
      return 'major';
    }
    
    // Minor change: text or non-critical attributes changed
    return 'minor';
  }

  private generateWarnings(diffs: DOMDiff[]): string[] {
    const warnings: string[] = [];

    diffs.forEach(diff => {
      if (diff.severity === 'critical') {
        warnings.push(
          `CRITICAL: ${diff.element.selector} was ${diff.type}`
        );
      } else if (diff.severity === 'major') {
        warnings.push(
          `WARNING: ${diff.element.tag} element changed structure`
        );
      }
    });

    return warnings;
  }
}
