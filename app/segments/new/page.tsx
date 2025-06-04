'use client';

import { ProtectedRoute } from '@/components/protected-route';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api, { endpoints } from '@/lib/api';
import { Plus, X } from 'lucide-react';
import { format } from 'date-fns';

interface Rule {
  field: string;
  operator: string;
  value: string | number;
}

interface RuleGroup {
  operator: 'AND' | 'OR';
  rules: (Rule | RuleGroup)[];
}

export default function NewSegmentPage() {
  const [name, setName] = useState('');
  const [ruleGroups, setRuleGroups] = useState<RuleGroup[]>([
    { operator: 'AND', rules: [] },
  ]);
  const [audienceSize, setAudienceSize] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  // State for AI Rule Generation
  const [nlQuery, setNlQuery] = useState('');
  const [generatingRules, setGeneratingRules] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const fieldOptions = [
    { value: 'totalSpend', label: 'Total Spend' },
    { value: 'visitCount', label: 'Visit Count' },
    { value: 'lastPurchase', label: 'Last Purchase' },
  ];

  const operatorOptions = [
    { value: 'gt', label: 'Greater Than' },
    { value: 'lt', label: 'Less Than' },
    { value: 'eq', label: 'Equals' },
    { value: 'neq', label: 'Not Equals' },
  ];

  // Helper function to find a rule or group by path
  const findRuleOrGroup = (path: number[]) => {
    let current: any = { rules: ruleGroups }; // Start with a dummy object containing the top-level rules array
    for (let i = 0; i < path.length; i++) {
      if (!current.rules || current.rules.length <= path[i]) return null;
      current = current.rules[path[i]];
    }
    return current;
  };

  // Helper function to update state immutably by path
  const updateStateByPath = (path: number[], updater: (item: any) => void) => {
    setRuleGroups((prev) => {
      const newGroups = JSON.parse(JSON.stringify(prev)); // Deep clone to ensure immutability
      let current: any = { rules: newGroups };
      for (let i = 0; i < path.length; i++) {
        if (!current.rules || current.rules.length <= path[i]) return prev; // Path not found, return original state
        if (i === path.length - 1) {
          updater(current.rules[path[i]]);
        } else {
          current = current.rules[path[i]];
        }
      }
      return newGroups;
    });
  };

  // Helper function to remove an item by path
  const removeItemByPath = (path: number[]) => {
    setRuleGroups((prev) => {
      const newGroups = JSON.parse(JSON.stringify(prev)); // Deep clone
      if (path.length === 0) return prev; // Cannot remove top-level array itself

      let current: any = { rules: newGroups };
      for (let i = 0; i < path.length - 1; i++) {
        if (!current.rules || current.rules.length <= path[i]) return prev;
        current = current.rules[path[i]];
      }

      const lastIndex = path[path.length - 1];
      if (!current.rules || current.rules.length <= lastIndex) return prev;

      current.rules.splice(lastIndex, 1);
      return newGroups;
    });
  };

  const addRule = (path: number[]) => {
    const newRule: Rule = {
      field: fieldOptions[0].value,
      operator: operatorOptions[0].value,
      value: '',
    };
    updateStateByPath(path, (group: RuleGroup) => {
      if (group.rules) {
        group.rules.push(newRule);
      }
    });
  };

  const removeRule = (path: number[]) => {
    removeItemByPath(path);
  };

  const updateRule = (
    path: number[],
    field: keyof Rule,
    value: string
  ) => {
    updateStateByPath(path, (rule: Rule) => {
      rule[field] = value;
    });
  };

  const toggleGroupOperator = (path: number[]) => {
    updateStateByPath(path, (group: RuleGroup) => {
      group.operator = group.operator === 'AND' ? 'OR' : 'AND';
    });
  };

  const addRuleGroup = (path: number[] | null = null) => {
    const newRuleGroup: RuleGroup = { operator: 'AND', rules: [] };
    if (path === null) {
      // Add top-level group
      setRuleGroups((prev) => [...prev, newRuleGroup]);
    } else {
      // Add nested group
      updateStateByPath(path, (group: RuleGroup) => {
        if (group.rules) {
          group.rules.push(newRuleGroup);
        }
      });
    }
  };

  const removeRuleGroup = (path: number[]) => {
    removeItemByPath(path);
  };

  // Recursive rendering function
  const renderRuleItem = (item: Rule | RuleGroup, path: number[]) => {
    if (Array.isArray((item as any).rules)) {
      // This is a RuleGroup
      const group = item as RuleGroup;
      const nestingLevel = path.length;
      const paddingLeftClass = `pl-${nestingLevel * 4}`; // Add padding based on nesting level

      return (
        <div
          key={path.join('-')}
          className={`rounded-lg border border-dashed border-gray-300 dark:border-gray-600 p-4 space-y-4 ${paddingLeftClass} ${nestingLevel > 0 ? 'bg-gray-50 dark:bg-gray-700' : ''}`} // Add padding class and background color for nested groups
        >
          <div className="flex items-center justify-between mb-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => toggleGroupOperator(path)}
            >
              {group.operator}
            </Button>
            {/* Only allow removing nested groups, not the initial top-level group */}
            {path.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeRuleGroup(path)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="space-y-4">
            {group.rules.map((subItem, subIndex) => renderRuleItem(subItem, [...path, subIndex]))}
          </div>
          <div className="flex space-x-2 mt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addRule(path)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addRuleGroup(path)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Rule Group
            </Button>
          </div>
        </div>
      );
    } else {
      // This is a Rule
      const rule = item as Rule;
      return (
        <div key={path.join('-')} className="flex items-center space-x-4">
          <select
            value={rule.field}
            onChange={(e) => updateRule(path, 'field', e.target.value)}
            className="rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            {fieldOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={rule.operator}
            onChange={(e) => updateRule(path, 'operator', e.target.value)}
            className="rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            {operatorOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {rule.field === 'lastPurchase' ? (
            // Use native input for date with styling
            <input
              type="date"
              value={typeof rule.value === 'string' && rule.value ? format(new Date(rule.value), 'yyyy-MM-dd') : ''}
              onChange={(e) => updateRule(path, 'value', e.target.value)}
              className="flex-1 rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
          ) : (
            <Input
              type={rule.field === 'totalSpend' || rule.field === 'visitCount' ? 'number' : 'text'}
              value={typeof rule.value === 'string' || typeof rule.value === 'number' ? String(rule.value) : ''}
              onChange={(e) => updateRule(path, 'value', e.target.value)}
              className="flex-1"
            />
          )}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeRule(path)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      );
    }
  };

  const previewAudience = async () => {
    setLoading(true);
    try {
      const response = await api.post(endpoints.segments.preview, {
        rules: ruleGroups,
      });
      setAudienceSize(response.data.audienceSize);
    } catch (error) {
      console.error('Failed to preview audience:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Send the first rule group as the root rules object
      const segmentRules = ruleGroups.length > 0 ? ruleGroups[0] : { operator: 'AND', rules: [] };

      await api.post(endpoints.segments.create, {
        name,
        rules: segmentRules,
      });
      router.push('/campaigns'); // Redirect to campaign history page
    } catch (error) {
      console.error('Failed to create segment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerateRules = async () => {
    setGeneratingRules(true);
    setAiError(null);
    try {
      const response = await api.post(endpoints.segments.generateRules, {
        query: nlQuery,
      });
      // Wrap the received rules object in an array before setting state
      setRuleGroups([response.data.rules]);
    } catch (error) {
      console.error('Failed to generate rules:', error);
      setAiError('Failed to generate rules. Please try again later.');
    } finally {
      setGeneratingRules(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
              Create New Segment
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Segment Name
                    </label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>

                  {/* Natural Language Rule Generation Section */}
                  <div className="space-y-2">
                    <label
                      htmlFor="nl-query"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Describe your segment (Optional AI assistance)
                    </label>
                    <Textarea
                      id="nl-query"
                      value={nlQuery}
                      onChange={(e) => setNlQuery(e.target.value)}
                      rows={2}
                      className="mt-1"
                      placeholder="e.g., Customers who spent more than 5000 and haven't purchased in 6 months"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGenerateRules}
                      disabled={generatingRules || !nlQuery.trim()}
                    >
                      {generatingRules ? 'Generating...' : 'Generate Rules from Description'}
                    </Button>
                    {aiError && (
                       <p className="text-sm text-red-600 dark:text-red-400">{aiError}</p>
                    )}
                  </div>

                  {/* Manual Rule Builder Section */}
                  <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                     <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Or build your rules manually:</p>
                    {/* Render rule groups using the recursive function */}
                    <div className="space-y-4">
                      {ruleGroups.map((group, groupIndex) => (
                        <div
                          key={groupIndex}
                          className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => toggleGroupOperator([groupIndex])}
                            >
                              {group.operator}
                            </Button>
                            {ruleGroups.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeRuleGroup([groupIndex])}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <div className="space-y-4">
                            {group.rules.map((item, itemIndex) =>
                              renderRuleItem(item, [groupIndex, itemIndex])
                            )}
                          </div>
                          <div className="flex space-x-2 mt-4">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addRule([groupIndex])}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Rule
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addRuleGroup([groupIndex])}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Rule Group
                            </Button>
                          </div>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => addRuleGroup()}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Rule Group
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={previewAudience}
                      disabled={loading}
                    >
                      {loading ? 'Previewing...' : 'Preview Audience'}
                    </Button>
                    {audienceSize !== null && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Estimated audience size: {audienceSize} customers
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/segments')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Creating...' : 'Create Segment'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 