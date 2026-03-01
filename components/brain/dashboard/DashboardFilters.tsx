'use client';

import * as React from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export type NoteTypeFilter = 'note' | 'link' | 'insight' | '';
export type SortOption = 'created_at_desc' | 'created_at_asc';

export interface DashboardFiltersProps {
  query: string;
  onQueryChange: (value: string) => void;
  tag: string;
  onTagChange: (value: string) => void;
  type: NoteTypeFilter;
  onTypeChange: (value: NoteTypeFilter) => void;
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
  disabled?: boolean;
}

export function DashboardFilters({
  query,
  onQueryChange,
  tag,
  onTagChange,
  type,
  onTypeChange,
  sort,
  onSortChange,
  disabled = false,
}: DashboardFiltersProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="sm:col-span-2">
        <label htmlFor="dashboard-search" className="sr-only">
          Search
        </label>
        <Input
          id="dashboard-search"
          type="search"
          placeholder="Search title, content, summary…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          disabled={disabled}
        />
      </div>
      <div>
        <label htmlFor="dashboard-tag" className="sr-only">
          Filter by tag
        </label>
        <Input
          id="dashboard-tag"
          placeholder="Tag"
          value={tag}
          onChange={(e) => onTagChange(e.target.value)}
          disabled={disabled}
        />
      </div>
      <div>
        <label htmlFor="dashboard-type" className="sr-only">
          Type
        </label>
        <Select
          id="dashboard-type"
          value={type}
          onChange={(e) => onTypeChange((e.target.value || '') as NoteTypeFilter)}
          disabled={disabled}
        >
          <option value="">All types</option>
          <option value="note">Note</option>
          <option value="link">Link</option>
          <option value="insight">Insight</option>
        </Select>
      </div>
      <div className="sm:col-span-2 lg:col-span-1">
        <label htmlFor="dashboard-sort" className="sr-only">
          Sort
        </label>
        <Select
          id="dashboard-sort"
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          disabled={disabled}
        >
          <option value="created_at_desc">Newest first</option>
          <option value="created_at_asc">Oldest first</option>
        </Select>
      </div>
    </div>
  );
}
