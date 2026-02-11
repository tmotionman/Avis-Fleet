import React, { createContext, useState, useEffect, useContext } from 'react'
import { notificationsApi } from '../lib/d1Client'



const NotificationContext = createContext()

export const useNotifications = () => useContext(NotificationContext)

export const NotificationProvider = ({ children, vehicles = [], clients = [], assignments = [], currentUser }) => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  
  // States for read and dismissed notifications
  const [readIds, setReadIds] = useState([])
  const [dismissedIds, setDismissedIds] = useState([])
  const [isLoadingStates, setIsLoadingStates] = useState(false)

  // Fetch states from D1 when user changes
  useEffect(() => {
    const fetchStates = async () => {
      const userId = currentUser?.id || currentUser?.email
      if (!userId) {
        setReadIds([])
        setDismissedIds([])
        return
      }

      setIsLoadingStates(true)
      try {
        const states = await notificationsApi.getStates(userId)
        
        // Handle migration from localStorage
        const localRead = JSON.parse(localStorage.getItem('avis_notification_read_ids') || '[]')
        const localDismissed = JSON.parse(localStorage.getItem('avis_notification_dismissed_ids') || '[]')
        
        if (states.length === 0 && (localRead.length > 0 || localDismissed.length > 0)) {
          console.log('Migrating notification states from localStorage to D1...')
          const allLocalIds = [...new Set([...localRead, ...localDismissed])]
          
          await Promise.all(allLocalIds.map(id => {
            const isRead = localRead.includes(id)
            const isDismissed = localDismissed.includes(id)
            return notificationsApi.updateState(userId, id, isRead, isDismissed)
          }))
          
          const newStates = await notificationsApi.getStates(userId)
          setReadIds(newStates.filter(s => s.isRead).map(s => s.notificationId))
          setDismissedIds(newStates.filter(s => s.isDismissed).map(s => s.notificationId))
          
          localStorage.removeItem('avis_notification_read_ids')
          localStorage.removeItem('avis_notification_dismissed_ids')
        } else {
          setReadIds(states.filter(s => s.isRead).map(s => s.notificationId))
          setDismissedIds(states.filter(s => s.isDismissed).map(s => s.notificationId))
        }
      } catch (error) {
        console.error('Error fetching notification states:', error)
      } finally {
        setIsLoadingStates(false)
      }
    }

    fetchStates()
  }, [currentUser?.id, currentUser?.email])

  // Generate notifications based on current data
  useEffect(() => {
    const generate = () => {
      const newNotifs = []
      const now = new Date()
      const threeDaysFromNow = new Date()
      threeDaysFromNow.setDate(now.getDate() + 3)
      
      // 1. Vehicles needing maintenance (> 80,000 km)
      const vehiclesNeedingMaintenance = vehicles.filter(v => v.mileage && v.mileage > 80000)
      if (vehiclesNeedingMaintenance.length > 0) {
        newNotifs.push({
          id: 'alert-maintenance-due', 
          message: `${vehiclesNeedingMaintenance.length} vehicle(s) due for maintenance (> 80,000 km)`,
          priority: 'high',
          type: 'maintenance',
          date: new Date().toISOString(),
          data: vehiclesNeedingMaintenance
        })
      }

      // 2. Overdue Vehicles
      const activeAssignments = assignments.filter(a => a.status === 'Active')
      const overdueAssignments = activeAssignments.filter(a => new Date(a.endDate) < now)
      if (overdueAssignments.length > 0) {
        newNotifs.push({
          id: 'alert-overdue-vehicles',
          message: `${overdueAssignments.length} vehicle(s) are OVERDUE for return`,
          priority: 'high',
          type: 'overdue',
          date: new Date().toISOString(),
          data: overdueAssignments.map(oa => ({
            ...oa,
            registrationNo: oa.vehicleInfo?.split('(')[1]?.replace(')', '') || oa.vehicleId,
            name: oa.clientName
          }))
        })
      }

      // 3. Vehicles Due Soon (within 3 days)
      const dueSoonAssignments = activeAssignments.filter(a => {
        const endDate = new Date(a.endDate)
        return endDate >= now && endDate <= threeDaysFromNow
      })
      if (dueSoonAssignments.length > 0) {
        newNotifs.push({
          id: 'alert-due-soon',
          message: `${dueSoonAssignments.length} vehicle(s) due for return within 3 days`,
          priority: 'medium',
          type: 'due-soon',
          date: new Date().toISOString(),
          data: dueSoonAssignments.map(da => ({
            ...da,
            registrationNo: da.vehicleInfo?.split('(')[1]?.replace(')', '') || da.vehicleId,
            name: da.clientName
          }))
        })
      }

      // 4. Vehicles In Service
      const vehiclesInService = vehicles.filter(v => v.status === 'In Service')
      if (vehiclesInService.length > 0) {
        newNotifs.push({
          id: 'alert-vehicles-in-service',
          message: `${vehiclesInService.length} vehicle(s) currently in service`,
          priority: 'medium',
          type: 'status',
          date: new Date().toISOString(),
          data: vehiclesInService
        })
      }

      // 5. Unassigned Vehicles
      const unassignedVehicles = vehicles.filter(v => !v.assignedTo || v.assignedTo === 'Unassigned')
      if (unassignedVehicles.length > 0) {
        newNotifs.push({
          id: 'alert-unassigned-vehicles',
          message: `${unassignedVehicles.length} vehicle(s) available for assignment`,
          priority: 'medium',
          type: 'available',
          date: new Date().toISOString(),
          data: unassignedVehicles
        })
      }

      // 6. Client count info (Low priority)
      if (clients.length > 10) {
        newNotifs.push({
          id: 'info-client-milestone',
          message: `You have ${clients.length} clients in the system`,
          priority: 'low',
          type: 'info',
          date: new Date().toISOString(),
          count: clients.length
        })
      }

      // 7. Fleet Summary
      if (newNotifs.length === 0) {
         newNotifs.push({
          id: 'info-fleet-summary',
          message: `Fleet Summary: ${vehicles.length} vehicles, ${clients.length} clients`,
          priority: 'low',
          type: 'info',
          date: new Date().toISOString()
        })
      }

      // Filter out dismissed notifications
      const activeNotifs = newNotifs.filter(n => !dismissedIds.includes(n.id))
      
      setNotifications(activeNotifs)
    }

    generate()
  }, [dismissedIds, vehicles, clients, assignments]) // Re-run when data changes

  // Calculate unread count
  useEffect(() => {
    const count = notifications.filter(n => !readIds.includes(n.id)).length
    setUnreadCount(count)
    
    // Update document title? (Optional)
    // if (count > 0) document.title = `(${count}) Avis Fleet`
    // else document.title = 'Avis Fleet'
  }, [notifications, readIds])


  // Actions
  const markAsRead = async (id) => {
    if (!readIds.includes(id)) {
      setReadIds(prev => [...prev, id])
      const userId = currentUser?.id || currentUser?.email
      if (userId) {
        try {
          await notificationsApi.updateState(userId, id, true, dismissedIds.includes(id))
        } catch (error) {
          console.error('Error updating notification read state:', error)
        }
      }
    }
  }

  const markAllAsRead = async () => {
    const allIds = notifications.map(n => n.id)
    const newReadIds = [...new Set([...readIds, ...allIds])]
    setReadIds(newReadIds)
    const userId = currentUser?.id || currentUser?.email
    if (userId) {
      try {
        await Promise.all(allIds.map(id => 
          notificationsApi.updateState(userId, id, true, dismissedIds.includes(id))
        ))
      } catch (error) {
        console.error('Error marking all notifications as read:', error)
      }
    }
  }

  const dismissNotification = async (id) => {
    if (!dismissedIds.includes(id)) {
      setDismissedIds(prev => [...prev, id])
      const userId = currentUser?.id || currentUser?.email
      if (userId) {
        try {
          await notificationsApi.updateState(userId, id, true, true)
          if (!readIds.includes(id)) {
            setReadIds(prev => [...prev, id])
          }
        } catch (error) {
          console.error('Error dismissing notification:', error)
        }
      }
    }
  }

  const clearAll = async () => {
     const allIds = notifications.map(n => n.id)
     setDismissedIds(prev => [...new Set([...dismissedIds, ...allIds])])
     const userId = currentUser?.id || currentUser?.email
     if (userId) {
       try {
         await Promise.all(allIds.map(id => 
           notificationsApi.updateState(userId, id, true, true)
         ))
         setReadIds(prev => [...new Set([...prev, ...allIds])])
       } catch (error) {
         console.error('Error clearing all notifications:', error)
       }
     }
  }

  const value = {
    notifications,
    unreadCount,
    readIds,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAll,
    isLoadingStates
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}
