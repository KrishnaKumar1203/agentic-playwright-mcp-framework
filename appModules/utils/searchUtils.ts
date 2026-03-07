/**
 * Search Utilities
 * Common search and filtering operations
 */

export class SearchUtils {
  static buildSearchQuery(filters: Record<string, any>): string {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.append(key, String(value));
      }
    });
    return params.toString();
  }

  static parseSearchResults(rawData: any[]): any[] {
    return rawData.map((item) => ({
      ...item,
      searchRank: this.calculateRelevance(item),
      highlighted: this.highlightMatches(item),
    }));
  }

  static calculateRelevance(item: any): number {
    // Mock relevance calculation
    return Math.random();
  }

  static highlightMatches(item: any): any {
    // Mock highlighting
    return { ...item, highlighted: true };
  }

  static filterByDateRange(items: any[], startDate: Date, endDate: Date): any[] {
    return items.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= endDate;
    });
  }

  static sortResults(items: any[], field: string, order: 'asc' | 'desc' = 'asc'): any[] {
    return items.sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return order === 'asc' ? comparison : -comparison;
    });
  }
}
