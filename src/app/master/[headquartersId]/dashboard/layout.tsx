import { MasterDashboardProvider } from '@/lib/queries/dashboard';
import { withServerData } from '@/lib/store/with-server-data';
import { getMasterDashboardDataAction } from '@/lib/actions/dashboard';

export default withServerData(getMasterDashboardDataAction, MasterDashboardProvider)