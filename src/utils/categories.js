export const CATEGORIES = [
  { value: 'server', label: 'Server' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'user_account', label: 'User Account' },
  { value: 'database', label: 'Database' },
  { value: 'api_key', label: 'API Key' },
  { value: 'other', label: 'Other' },
];

export function formatCategory(value) {
  return CATEGORIES.find((c) => c.value === value)?.label || value;
}
