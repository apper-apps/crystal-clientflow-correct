import { getAllClients } from './clientService';
import { getAllProjects } from './projectService';
import { getAllTasks } from './taskService';
import { getAllInvoices } from './invoiceService';

export const getDashboardData = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const [clients, projects, tasks, invoices] = await Promise.all([
      getAllClients(),
      getAllProjects(),
      getAllTasks(),
      getAllInvoices()
    ]);

    const summary = {
      totalClients: clients.length,
      activeProjects: projects.filter(p => p.status === 'active').length,
      pendingTasks: tasks.filter(t => t.status !== 'done').length,
      monthlyRevenue: invoices
        .filter(i => i.status === 'paid')
        .reduce((sum, i) => sum + (i.amount || 0), 0),
      completedTasks: tasks.filter(t => t.status === 'done').length,
      overdueItems: tasks.filter(t => 
        new Date(t.dueDate) < new Date() && t.status !== 'done'
      ).length
    };

    const recentActivity = [
      {
        id: 1,
        type: "project",
        title: "Recent project activity",
        client: "System Generated",
        time: "Just now",
        icon: "CheckCircle2"
      },
      {
        id: 2,
        type: "task",
        title: "Task management update",
        client: "System Generated",
        time: "5 minutes ago",
        icon: "Plus"
      },
      {
        id: 3,
        type: "client",
        title: "Client data synchronized",
        client: "System Generated",
        time: "10 minutes ago",
        icon: "UserPlus"
      }
    ];

    const quickStats = {
      projectsThisWeek: projects.filter(p => {
        const startDate = new Date(p.startDate);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return startDate >= weekAgo;
      }).length,
      tasksCompleted: tasks.filter(t => t.status === 'done').length,
      hoursTracked: 168, // Mock data
      invoicesSent: invoices.filter(i => i.status === 'sent').length
    };

    return {
      summary,
      recentActivity,
      quickStats
    };
  } catch (error) {
    console.error("Error getting dashboard data:", error);
    throw error;
  }
};