import { AdminDashboardProvider } from '@/lib/queries/dashboard';
import { withServerData } from '@/lib/store/with-server-data';
import { useCases } from '@/use-cases';


export default withServerData(useCases.dashboard.getAdminDashboardData, AdminDashboardProvider)