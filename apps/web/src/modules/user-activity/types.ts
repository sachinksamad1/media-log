export interface UserActivity {
  id: string
  userId: string
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'COMPLETE'
  resourceType: string
  resourceId: string
  resourceTitle?: string
  details?: string
  createdAt: string
}
