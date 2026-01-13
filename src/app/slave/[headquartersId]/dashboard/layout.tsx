import { SlaveDashboardProvider } from '@/lib/queries/dashboard';
import { withServerData } from '@/lib/store/with-server-data';
import { getSlaveDashboardDataAction } from '@/lib/actions/dashboard';

export default withServerData(getSlaveDashboardDataAction, SlaveDashboardProvider);