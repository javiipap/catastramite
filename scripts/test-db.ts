import { db } from '../src/lib/db';
import type {
  Headquarters,
  Procedure,
  Request as AppRequest,
} from '../src/lib/types';

async function test() {
  console.log('Running DB Test...');

  const timestamp = Date.now();
  const userId = `user-${timestamp}`;
  const hqId = `hq-${timestamp}`;
  const procId = `proc-${timestamp}`;
  const reqId = `req-${timestamp}`;

  // 1. Create Headquarters
  console.log('Creating HQ...');
  const hq: Headquarters = {
    headquartersId: hqId,
    name: `Test HQ ${timestamp}`,
    description: 'A test headquarters',
    createdAt: new Date(),
  };
  await db.createHeadquarters(hq, userId);
  console.log(`HQ created: ${hq.headquartersId}`);

  // 2. Verify HQ Fetch
  const fetchedHq = await db.getHeadquartersById(hqId);
  if (fetchedHq?.name !== hq.name) throw new Error('HQ fetch mismatch');
  console.log('HQ fetch verified');

  // 3. Create Procedure
  console.log('Creating Procedure...');
  const proc: Procedure = {
    id: procId,
    headquartersId: hqId,
    name: 'Test Procedure',
    description: 'Test Desc',
    fields: [],
    createdAt: new Date(),
    createdBy: userId,
  };
  await db.createProcedure(proc);
  console.log('Procedure created');

  // 4. Create Request
  console.log('Creating Request...');
  const req: AppRequest = {
    id: reqId,
    headquartersId: hqId,
    procedureId: procId,
    procedureName: proc.name,
    applicantId: userId,
    applicantName: 'Test Applicant',
    status: 'pending',
    data: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await db.createRequest(req);
  console.log('Request created');

  // 5. Verify Request Fetch
  const requests = await db.getRequests(hqId);
  if (!requests.find((r) => r.id === reqId))
    throw new Error('Request not found in HQ');
  console.log('Request fetch verified');

  console.log('All tests passed!');
}

test().catch(console.error);
