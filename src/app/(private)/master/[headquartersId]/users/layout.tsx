
import { getHeadquartersUsersAction } from '@/lib/actions/headquarters-users';
import { UserHeadquartersProvider } from '@/lib/queries/user-headquarters';
import { withServerData } from '@/lib/store/with-server-data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Users',
  description: 'Manage members of this headquarters',
};

export default withServerData(getHeadquartersUsersAction, UserHeadquartersProvider)
