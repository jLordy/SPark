import React from 'react'
import LayoutWithSidebar from '../components/LayoutWithSidebar'
import ApprovalManagement from '../components/ApprovalManagement'

function AdminPage() {
  return (
    <LayoutWithSidebar>
        <ApprovalManagement/>
    </LayoutWithSidebar>
  )
}

export default AdminPage